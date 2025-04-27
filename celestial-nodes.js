class CelestialNodes {
    constructor() {
        this.celestialInfo = null;
        this.loadedImages = {
            sectors: {},
            companies: []
        };
        this.init();
    }

    async init() {
        try {
            // 加载配置文件
            const response = await fetch('assets/celestial-bodies/info.json');
            this.celestialInfo = await response.json();
            await this.preloadImages();
        } catch (error) {
            console.error('Failed to initialize celestial nodes:', error);
        }
    }

    async preloadImages() {
        const loadImage = (path) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = `assets/celestial-bodies/${path}`;
            });
        };

        // 加载赛道图片
        for (const [sector, info] of Object.entries(this.celestialInfo.sectors)) {
            this.loadedImages.sectors[sector] = [];
            for (const imageInfo of info.images) {
                try {
                    const img = await loadImage(imageInfo.path);
                    this.loadedImages.sectors[sector].push({
                        image: img,
                        name: imageInfo.name,
                        scale: imageInfo.scale
                    });
                } catch (error) {
                    console.error(`Failed to load image ${imageInfo.path}:`, error);
                }
            }
        }

        // 加载公司图片
        for (const imageInfo of this.celestialInfo.companies.images) {
            try {
                const img = await loadImage(imageInfo.path);
                this.loadedImages.companies.push({
                    image: img,
                    name: imageInfo.name,
                    scale: imageInfo.scale
                });
            } catch (error) {
                console.error(`Failed to load image ${imageInfo.path}:`, error);
            }
        }
    }

    getRandomImage(type, sector = null) {
        if (type === 'sector' && sector) {
            const images = this.loadedImages.sectors[sector];
            return images ? images[Math.floor(Math.random() * images.length)] : null;
        } else if (type === 'company') {
            return this.loadedImages.companies[Math.floor(Math.random() * this.loadedImages.companies.length)];
        }
        return null;
    }

    drawNode(ctx, node, x, y, radius) {
        if (!this.loadedImages) return;

        const type = node.isSector ? 'sector' : 'company';
        const imageInfo = this.getRandomImage(type, node.sector);
        
        if (!imageInfo) {
            // 降级为普通圆形
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        const { image, scale } = imageInfo;
        const size = radius * 2 * scale;

        // 绘制图片
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        
        // 计算绘制位置和大小
        const drawX = x - size / 2;
        const drawY = y - size / 2;
        
        // 添加发光效果
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // 绘制天体图片
        ctx.drawImage(image, drawX, drawY, size, size);
        
        // 添加光晕效果
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fill();

        // 添加项目代码文本
        if (node.code) {
            ctx.restore();
            ctx.save();
            
            // 设置文本样式
            ctx.font = `${Math.max(radius * 0.6, 12)}px 'SF Mono', monospace`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 添加文本背景
            const textWidth = ctx.measureText(node.code).width;
            const padding = 4;
            const bgWidth = textWidth + padding * 2;
            const bgHeight = radius * 0.7;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.roundRect(x - bgWidth/2, y - bgHeight/2, bgWidth, bgHeight, 4);
            ctx.fill();
            
            // 绘制文本
            ctx.fillStyle = 'white';
            ctx.fillText(node.code, x, y);
        }
        
        ctx.restore();
    }

    // 为节点添加动画效果
    animateNode(ctx, node, x, y, radius, time) {
        const pulseScale = 1 + Math.sin(time * 0.002) * 0.1;
        const rotationAngle = time * 0.001;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationAngle);
        ctx.translate(-x, -y);
        
        this.drawNode(ctx, node, x, y, radius * pulseScale);
        ctx.restore();
    }
} 