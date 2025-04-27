// 定义加密货币市场各板块的统一配色方案
const colorScheme = {
    layer1: {
        bgColor: '#FF9B21',  // 橙色，代表公链的基础性和活力
        nodeColor: '#FFB74D',
        glowColor: 'rgba(255, 155, 33, 0.5)'
    },
    defi: {
        bgColor: '#2196F3',  // 蓝色，代表DeFi的专业性和可靠性
        nodeColor: '#64B5F6',
        glowColor: 'rgba(33, 150, 243, 0.5)'
    },
    gamefi: {
        bgColor: '#9C27B0',  // 紫色，代表GameFi的创意和娱乐性
        nodeColor: '#BA68C8',
        glowColor: 'rgba(156, 39, 176, 0.5)'
    },
    meme: {
        bgColor: '#E91E63',  // 粉色，代表MEME币的趣味性和社交属性
        nodeColor: '#F06292',
        glowColor: 'rgba(233, 30, 99, 0.5)'
    },
    infra: {
        bgColor: '#4CAF50',  // 绿色，代表基建的稳定性和支持性
        nodeColor: '#81C784',
        glowColor: 'rgba(76, 175, 80, 0.5)'
    },
    ai: {
        bgColor: '#00BCD4',  // 青色，代表AI的科技感和创新性
        nodeColor: '#4DD0E1',
        glowColor: 'rgba(0, 188, 212, 0.5)'
    }
};

// 更新图例的颜色
document.addEventListener('DOMContentLoaded', () => {
    const legend = document.querySelector('.legend');
    if (legend) {
        const legendItems = legend.querySelectorAll('.flex.items-center');
        const sectors = [
            { color: colorScheme.layer1.bgColor, name: '公链' },
            { color: colorScheme.defi.bgColor, name: 'DeFi' },
            { color: colorScheme.gamefi.bgColor, name: 'GameFi' },
            { color: colorScheme.meme.bgColor, name: 'MEME币' },
            { color: colorScheme.infra.bgColor, name: '基建' },
            { color: colorScheme.ai.bgColor, name: 'AI' }
        ];

        legendItems.forEach((item, index) => {
            if (sectors[index]) {
                const colorSpan = item.querySelector('span:first-child');
                const textSpan = item.querySelector('span:last-child');
                colorSpan.style.backgroundColor = sectors[index].color;
                textSpan.textContent = sectors[index].name;
            }
        });
    }
});
