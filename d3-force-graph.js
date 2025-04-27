const celestialNodes = new CelestialNodes();

class D3ForceGraph {
    constructor(container, sectorsData, companiesData) {
        this.container = container;
        this.sectorsData = sectorsData;
        this.companiesData = companiesData;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.simulation = null;
        this.svg = null;
        this.nodes = [];
        this.links = [];
        this.selectedNode = null;
        this.glowPoints = []; // 存储所有光点
        this.highlightedSector = null; // 添加高亮赛道的状态
        
        // Create nodes and links from data
        this.createNodesAndLinks();
        
        // Responsive handling
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    createNodesAndLinks() {
        // Create sector nodes
        this.sectorsData.forEach(sector => {
            this.nodes.push({
                id: sector.id,
                name: sector.name,
                type: 'sector',
                desc: sector.desc,
                radius: 20 + (sector.importance * 2),
                sectorId: sector.id
            });
        });
        
        // Create company nodes
        this.companiesData.forEach(company => {
            this.nodes.push({
                id: company.id,
                name: company.name,
                code: company.code,
                type: 'company',
                desc: company.desc,
                sectorId: company.sectorId,
                subsector: company.subsector,
                radius: 6 + (company.marketCap / 30),
                website: company.website
            });
        });
        
        // Create links from sectors to companies
        this.companiesData.forEach(company => {
            this.links.push({
                source: company.sectorId,
                target: company.id,
                strength: 0.5,
                type: 'sector-company'
            });
        });
        
        // Add sector relationships
        if (typeof sectorRelationships !== 'undefined') {
            sectorRelationships.forEach(rel => {
                this.links.push({
                    source: rel.source,
                    target: rel.target,
                    strength: rel.strength,
                    desc: rel.desc,
                    type: 'sector-sector'
                });
            });
        }
        
        // Add company relationships
        if (typeof companyRelationships !== 'undefined') {
            companyRelationships.forEach(rel => {
                this.links.push({
                    source: rel.source,
                    target: rel.target,
                    strength: rel.strength,
                    desc: rel.desc,
                    type: 'company-company'
                });
            });
        }
    }
    
    init() {
        // Create SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(d3.zoom().on("zoom", (event) => {
                this.svg.select("g").attr("transform", event.transform);
            }));
            
        const g = this.svg.append("g");
        
        // Add definitions for glow filter
        const defs = this.svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", "2")
            .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
        
        // Create links
        this.linkElements = g.append('g')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke-width', d => d.strength * 3)
            .attr('class', d => `link link-${d.type}`)
            .on('mouseover', (event, d) => {
                if (d.desc) {
                    const tooltip = document.getElementById('tooltip');
                    tooltip.querySelector('.company-name').textContent = d.desc;
                    tooltip.querySelector('.stock-code').textContent = '';
                    tooltip.querySelector('.sector-tag').textContent = '';
                    tooltip.querySelector('.company-desc').textContent = '';
                    
                    tooltip.style.left = `${event.pageX}px`;
                    tooltip.style.top = `${event.pageY - 70}px`;
                    tooltip.classList.remove('hidden');
                }
                
                d3.select(event.target).classed('highlighted', true);
            })
            .on('mouseout', (event) => {
                const tooltip = document.getElementById('tooltip');
                tooltip.classList.add('hidden');
                
                d3.select(event.target).classed('highlighted', false);
            });
        
        // Create glow points for each link
        this.glowPoints = g.append('g')
            .selectAll('circle')
            .data(this.links)
            .enter()
            .append('circle')
            .attr('r', 2)
            .attr('fill', 'white')
            .attr('filter', 'url(#glow)')
            .style('opacity', 0.8)
            .each((d, i, nodes) => {
                // 为每个光点添加一个随机偏移量，使动画错开
                d.offset = Math.random();
                // 存储光点引用
                d.glowPoint = nodes[i];
            });

        // Start glow point animation
        this.animateGlowPoints();
        
        // Create nodes
        this.nodeElements = g.append('g')
            .selectAll('g')  // 修改为g元素以便添加图标
            .data(this.nodes)
            .enter()
            .append('g')  // 使用g元素包裹
            .attr('class', d => `node node-${d.sectorId} cursor-pointer`)
            .call(d3.drag()
                .on('start', this.dragstarted.bind(this))
                .on('drag', this.dragged.bind(this))
                .on('end', this.dragended.bind(this))
            )
            .on('click', (event, d) => {
                event.stopPropagation();
                this.selectNode(d);
                
                // 如果是公司节点且有官网链接，则在新标签页打开
                if (d.type === 'company' && d.website) {
                    window.open(d.website, '_blank');
                }
            })
            .on('mouseover', (event, d) => {
                if (d.type === 'company') {
                    const tooltip = document.getElementById('tooltip');
                    tooltip.querySelector('.company-name').textContent = d.name;
                    tooltip.querySelector('.stock-code').textContent = d.code;
                    
                    const sectorTag = tooltip.querySelector('.sector-tag');
                    sectorTag.textContent = d.subsector;
                    sectorTag.style.backgroundColor = `${colorScheme[d.sectorId].bgColor}`;
                    
                    tooltip.querySelector('.company-desc').textContent = d.desc;
                    
                    // 添加官网链接提示
                    if (d.website) {
                        tooltip.querySelector('.company-desc').innerHTML += '<br><span class="text-blue-400 mt-1 block">点击访问官网 →</span>';
                    }
                    
                    tooltip.style.left = `${event.pageX}px`;
                    tooltip.style.top = `${event.pageY - 70}px`;
                    tooltip.classList.remove('hidden');
                }
            })
            .on('mouseout', () => {
                const tooltip = document.getElementById('tooltip');
                tooltip.classList.add('hidden');
            });
            
        // 为节点添加圆形背景或SVG图标
        this.nodeElements.append('circle')
            .attr('r', d => d.radius)
            .attr('class', d => {
                // 如果节点名称是比特币/以太坊/Solana/Trump相关，不添加类以便后面用图标替换
                if (d.name && (d.name.includes('比特币') || d.name.includes('BTC') || d.name.includes('Bitcoin'))) {
                    return 'node-circle d-none';
                } else if (d.name && (d.name.includes('以太坊') || d.name.includes('ETH') || d.name.includes('Ethereum'))) {
                    return 'node-circle d-none';
                } else if (d.name && (d.name.includes('Solana') || d.name.includes('SOL'))) {
                    return 'node-circle d-none';
                } else if (d.id === 'trump') {
                    return 'node-circle d-none';
                } else {
                    return 'node-circle';
                }
            });
            
        // 为比特币/以太坊/Solana/Trump节点添加SVG图标
        this.nodeElements.each(function(d) {
            if (d.name && (d.name.includes('比特币') || d.name.includes('BTC') || d.name.includes('Bitcoin'))) {
                d3.select(this)
                    .append('image')
                    .attr('xlink:href', 'btc.svg')
                    .attr('width', d.radius * 2)
                    .attr('height', d.radius * 2)
                    .attr('x', -d.radius)
                    .attr('y', -d.radius);
            } else if (d.name && (d.name.includes('以太坊') || d.name.includes('ETH') || d.name.includes('Ethereum'))) {
                d3.select(this)
                    .append('image')
                    .attr('xlink:href', 'Ethereum logo.svg')
                    .attr('width', d.radius * 2)
                    .attr('height', d.radius * 2)
                    .attr('x', -d.radius)
                    .attr('y', -d.radius);
            } else if (d.name && (d.name.includes('Solana') || d.name.includes('SOL'))) {
                d3.select(this)
                    .append('image')
                    .attr('xlink:href', 'solana-sol-logo.svg')
                    .attr('width', d.radius * 2)
                    .attr('height', d.radius * 2)
                    .attr('x', -d.radius)
                    .attr('y', -d.radius);
            } else if (d.id === 'trump') {
                d3.select(this)
                    .append('image')
                    .attr('xlink:href', 'Trump.svg')
                    .attr('width', d.radius * 6)
                    .attr('height', d.radius * 6)
                    .attr('x', -d.radius * 3)
                    .attr('y', -d.radius * 3);
            }
        });
        
        // Add labels for sectors
        this.sectorLabels = g.append('g')
            .selectAll('text')
            .data(this.nodes.filter(node => node.type === 'sector'))
            .enter()
            .append('text')
            .text(d => d.name)
            .attr('class', 'node-label font-bold text-lg')
            .attr('dy', 4);
        
        // Add labels for companies
        this.companyLabels = g.append('g')
            .selectAll('text')
            .data(this.nodes.filter(node => node.type === 'company'))
            .enter()
            .append('text')
            .text(d => d.name)
            .attr('class', 'node-label')
            .attr('dy', d => -d.radius - 4);
        
        // Initialize force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => 100 + (1 - d.strength) * 200)
            )
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 10))
            .on('tick', this.ticked.bind(this));
        
        // Add click handler to deselect
        this.svg.on('click', () => {
            this.deselectNode();
        });
    }
    
    animateGlowPoints() {
        // 控制光点移动速度的参数，值越小移动越慢
        const speed = 0.0005;
        
        const animate = () => {
            this.glowPoints.each((d) => {
                const link = d3.select(d.glowPoint);
                const source = d.source;
                const target = d.target;
                
                // 计算当前动画进度（0-1之间循环）
                const t = (Date.now() * speed + d.offset) % 1;
                
                // 计算光点在线段上的位置
                const x = source.x + (target.x - source.x) * t;
                const y = source.y + (target.y - source.y) * t;
                
                link
                    .attr('cx', x)
                    .attr('cy', y)
                    .style('opacity', 0.8 * Math.sin(t * Math.PI)); // 使光点在移动过程中有淡入淡出效果
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    ticked() {
        // Update link positions
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
            
        // Update glow points positions
        this.glowPoints.each(function(d) {
            const t = d3.select(this).attr('t') || Math.random();
            const xDiff = d.target.x - d.source.x;
            const yDiff = d.target.y - d.source.y;
            const x = d.source.x + (xDiff * t);
            const y = d.source.y + (yDiff * t);
            d3.select(this).attr('cx', x).attr('cy', y);
        });
        
        // Update node positions
        this.nodeElements
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
        
        // Update label positions
        this.sectorLabels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
            
        this.companyLabels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    handleResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Update SVG dimensions
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        // Update simulation
        this.simulation
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .restart();
    }
    
    selectNode(node) {
        // Deselect previously selected node
        if (this.selectedNode) {
            d3.select(`.node-${this.selectedNode.id}`).classed('selected', false);
        }
        
        // Select new node
        this.selectedNode = node;
        d3.select(`.node-${node.id}`).classed('selected', true);

        // 处理赛道高亮
        if (node.type === 'sector') {
            this.highlightSector(node.id);
        } else {
            this.highlightSector(node.sectorId);
        }
        
        // Update selected content
        const selectedContent = document.getElementById('selected-content');
        
        let html = '';
        if (node.type === 'sector') {
            html = `
                <div class="info-card">
                    <h3 class="text-white font-bold mb-2">${node.name}赛道</h3>
                    <p class="mb-3">${node.desc}</p>
                </div>
                <h4 class="font-bold mb-2">核心公司:</h4>
                <div class="grid grid-cols-2 gap-2">
                    ${this.companiesData.filter(c => c.sectorId === node.id)
                        .map(c => `
                            <div class="info-card">
                                <div class="font-bold">${c.name}</div>
                                <div class="text-gray-400">${c.code}</div>
                            </div>
                        `).join('')}
                </div>
            `;
        } else {
            // Find sector
            const sector = this.sectorsData.find(s => s.id === node.sectorId);
            
            html = `
                <div class="info-card">
                    <h3 class="text-white font-bold mb-2">${node.name}</h3>
                    <div class="flex items-center mb-3">
                        <span class="font-geist-mono mr-2">${node.code}</span>
                        <span class="px-2 py-0.5 text-xs rounded" style="background-color: ${colorScheme[node.sectorId].bgColor}">
                            ${node.subsector}
                        </span>
                    </div>
                    <p class="mb-3">${node.desc}</p>
                    <p class="text-xs"><span class="font-bold">所属赛道:</span> ${sector.name}</p>
                </div>
                
                <h4 class="font-bold mt-4 mb-2">核心关系:</h4>
                <div class="space-y-2">
                    ${this.getRelationships(node.id).map(rel => `
                        <div class="info-card">
                            <div class="flex items-center justify-between">
                                <span>${this.getNodeById(rel.source).name} → ${this.getNodeById(rel.target).name}</span>
                                <span class="bg-gray-700 px-1.5 rounded">${Math.round(rel.strength * 10)}</span>
                            </div>
                            <p class="text-gray-400 mt-1">${rel.desc || '行业关联'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        selectedContent.innerHTML = html;
    }
    
    deselectNode() {
        if (this.selectedNode) {
            d3.select(`.node-${this.selectedNode.id}`).classed('selected', false);
            this.selectedNode = null;
            
            // 清除高亮效果
            this.clearHighlight();
            
            // Reset selected content
            const selectedContent = document.getElementById('selected-content');
            selectedContent.innerHTML = '<p>点击节点查看详细信息</p>';
        }
    }
    
    getRelationships(nodeId) {
        return this.links.filter(link => 
            (link.source.id === nodeId || link.target.id === nodeId) && 
            link.type !== 'sector-company' &&
            link.desc
        );
    }
    
    getNodeById(node) {
        // Handle both object reference and string ID
        const id = typeof node === 'object' ? node.id : node;
        return this.nodes.find(n => n.id === id);
    }
    
    handleSearch(term) {
        if (!term) {
            // Reset all visibilities
            this.nodeElements.style('opacity', 1);
            this.linkElements.style('opacity', 1);
            this.sectorLabels.style('opacity', 1);
            this.companyLabels.style('opacity', 1);
            return;
        }
        
        // Find matching nodes
        const matchingNodeIds = this.nodes
            .filter(node => 
                node.name.toLowerCase().includes(term) || 
                (node.code && node.code.includes(term)) ||
                (node.subsector && node.subsector.toLowerCase().includes(term))
            )
            .map(node => node.id);
        
        // Filter nodes and links
        this.nodeElements.style('opacity', d => matchingNodeIds.includes(d.id) ? 1 : 0.2);
        this.linkElements.style('opacity', d => 
            matchingNodeIds.includes(d.source.id) && matchingNodeIds.includes(d.target.id) ? 1 : 0.1
        );
        this.sectorLabels.style('opacity', d => matchingNodeIds.includes(d.id) ? 1 : 0.2);
        this.companyLabels.style('opacity', d => matchingNodeIds.includes(d.id) ? 1 : 0.2);
    }
    
    filterBySector(sectorId) {
        // Get all companies in this sector
        const companiesInSector = this.companiesData
            .filter(company => company.sectorId === sectorId)
            .map(company => company.id);
        
        // Combine with sector ID
        const relevantNodeIds = [...companiesInSector, sectorId];
        
        // Find all related nodes through links
        const relatedNodeIds = new Set(relevantNodeIds);
        
        this.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            if (relevantNodeIds.includes(sourceId)) {
                relatedNodeIds.add(targetId);
            }
            if (relevantNodeIds.includes(targetId)) {
                relatedNodeIds.add(sourceId);
            }
        });
        
        // Apply filtering
        this.nodeElements.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2);
        this.linkElements.style('opacity', d => 
            relatedNodeIds.has(d.source.id) && relatedNodeIds.has(d.target.id) ? 1 : 0.1
        );
        this.sectorLabels.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2);
        this.companyLabels.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2);
    }
    
    resetFilter() {
        this.nodeElements.style('opacity', 1);
        this.linkElements.style('opacity', 1);
        this.sectorLabels.style('opacity', 1);
        this.companyLabels.style('opacity', 1);
    }
    
    updateLinkStrength(strength) {
        this.simulation
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(d => 100 + (1 - d.strength * strength) * 200)
            )
            .alpha(0.3)
            .restart();
    }
    
    resetZoom() {
        this.svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity,
            d3.zoomTransform(this.svg.node()).invert([this.width / 2, this.height / 2])
        );
    }

    // 添加高亮赛道的方法
    highlightSector(sectorId) {
        if (this.highlightedSector === sectorId) return;
        
        this.highlightedSector = sectorId;
        
        // 获取相关的节点ID
        const relatedNodeIds = new Set();
        relatedNodeIds.add(sectorId);
        
        // 添加该赛道的所有公司
        this.nodes.forEach(node => {
            if (node.sectorId === sectorId) {
                relatedNodeIds.add(node.id);
            }
        });
        
        // 添加有直接关联的节点
        this.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            if (relatedNodeIds.has(sourceId)) {
                relatedNodeIds.add(targetId);
            }
            if (relatedNodeIds.has(targetId)) {
                relatedNodeIds.add(sourceId);
            }
        });

        // 应用高亮效果
        this.nodeElements.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2)
            .style('filter', d => relatedNodeIds.has(d.id) ? 'none' : 'grayscale(50%)');
        
        this.linkElements.style('opacity', d => {
            const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
            const targetId = typeof d.target === 'object' ? d.target.id : d.target;
            return (relatedNodeIds.has(sourceId) && relatedNodeIds.has(targetId)) ? 1 : 0.1;
        });

        // 更新标签透明度
        this.sectorLabels.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2);
        this.companyLabels.style('opacity', d => relatedNodeIds.has(d.id) ? 1 : 0.2);

        // 添加过渡动画
        this.nodeElements.transition().duration(300);
        this.linkElements.transition().duration(300);
        this.sectorLabels.transition().duration(300);
        this.companyLabels.transition().duration(300);
    }

    // 清除高亮效果的方法
    clearHighlight() {
        if (!this.highlightedSector) return;
        
        this.highlightedSector = null;
        
        // 重置所有元素的样式
        this.nodeElements.style('opacity', 1)
            .style('filter', 'none');
        this.linkElements.style('opacity', 1);
        this.sectorLabels.style('opacity', 1);
        this.companyLabels.style('opacity', 1);

        // 添加过渡动画
        this.nodeElements.transition().duration(300);
        this.linkElements.transition().duration(300);
        this.sectorLabels.transition().duration(300);
        this.companyLabels.transition().duration(300);
    }
}

function drawNodes() {
    const ctx = canvas.getContext('2d');
    const time = Date.now();

    nodes.forEach(node => {
        ctx.save();
        
        // 设置基础样式
        if (node.selected) {
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 20;
        }

        // 使用天体图片渲染节点
        celestialNodes.animateNode(ctx, node, node.x, node.y, node.radius || 5, time);
        
        // 绘制标签
        if (node.label) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '10px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
            ctx.fillText(node.label, node.x, node.y + node.radius + 10);
        }

        ctx.restore();
    });
}

function isMouseOverNode(node, mouseX, mouseY) {
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    const radius = (node.radius || 5) * 1.2; // 增加一点检测范围
    return dx * dx + dy * dy < radius * radius;
}
