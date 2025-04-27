class Star {
    constructor(canvas, ctx, speed) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.speed = speed;
        // 为每个星星随机分配一个颜色
        this.colors = [
            { r: 255, g: 255, b: 255 },  // 白色
            { r: 135, g: 206, b: 235 },  // 天蓝色
            { r: 255, g: 223, b: 186 },  // 暖黄色
            { r: 255, g: 182, b: 193 },  // 粉色
            { r: 176, g: 224, b: 230 },  // 粉蓝色
            { r: 221, g: 160, b: 221 },  // 梅红色
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        // 随机大小倍数
        this.sizeFactor = 0.8 + Math.random() * 0.4;
        // 随机闪烁速度
        this.twinkleSpeed = 0.03 + Math.random() * 0.05;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.z = Math.random() * this.canvas.width;
        this.origX = this.x;
        this.origY = this.y;
    }

    update() {
        this.z = this.z - this.speed;
        if (this.z <= 0) {
            this.reset();
        }

        this.x = this.origX - (this.z * (this.origX - this.canvas.width/2)/this.canvas.width);
        this.y = this.origY - (this.z * (this.origY - this.canvas.height/2)/this.canvas.height);
        
        // 更新闪烁效果
        this.twinklePhase += this.twinkleSpeed;
        if (this.twinklePhase > Math.PI * 2) {
            this.twinklePhase = 0;
        }
    }

    draw() {
        const radius = Math.max(0.1, 2 * this.sizeFactor * (1 - this.z/this.canvas.width));
        let baseOpacity = Math.min(1, 1 - this.z/this.canvas.width);
        
        // 添加闪烁效果
        const twinkle = (Math.sin(this.twinklePhase) + 1) * 0.5;
        baseOpacity *= 0.5 + twinkle * 0.5;
        
        // 绘制发光效果
        const gradient = this.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, radius * 2
        );
        
        const { r, g, b } = this.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseOpacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(this.x, this.y, radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制星星核心
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
        this.ctx.arc(this.x, this.y, radius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class Starfield {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.isActive = true;
        this.resize();
        
        // 增加星星数量
        for (let i = 0; i < 500; i++) {
            this.stars.push(new Star(this.canvas, this.ctx, 1 + Math.random() * 3));
        }

        // 添加到页面
        this.canvas.id = 'starfield';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
        
        // 从localStorage读取状态
        const savedState = localStorage.getItem('starfield-active');
        if (savedState !== null) {
            this.isActive = savedState === 'true';
            this.updateVisibility();
        }
        
        // 开始动画
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        // 使用半透明黑色来创造拖尾效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制星星
        this.stars.forEach(star => {
            star.update();
            star.draw();
        });

        // 继续动画循环
        requestAnimationFrame(() => this.animate());
    }

    toggle() {
        this.isActive = !this.isActive;
        localStorage.setItem('starfield-active', this.isActive);
        this.updateVisibility();
    }

    updateVisibility() {
        this.canvas.style.opacity = this.isActive ? '0.8' : '0';
    }
}

// 当页面加载完成后初始化星空效果
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否是深色模式
    const isDarkMode = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme !== 'light';
    };

    let starfield = null;

    // 初始化星空
    if (isDarkMode()) {
        starfield = new Starfield();
    }

    // 添加开关按钮事件监听
    const toggleBtn = document.getElementById('starfield-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (starfield) {
                starfield.toggle();
                toggleBtn.classList.toggle('active');
            }
        });

        // 初始化按钮状态
        const savedState = localStorage.getItem('starfield-active');
        if (savedState === 'false') {
            toggleBtn.classList.remove('active');
        } else {
            toggleBtn.classList.add('active');
        }
    }

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                if (isDarkMode()) {
                    if (!starfield) {
                        starfield = new Starfield();
                        // 恢复保存的状态
                        const savedState = localStorage.getItem('starfield-active');
                        if (savedState === 'false') {
                            starfield.toggle();
                        }
                    }
                    document.getElementById('starfield').style.display = 'block';
                    toggleBtn.style.display = 'flex';
                } else {
                    if (document.getElementById('starfield')) {
                        document.getElementById('starfield').style.display = 'none';
                    }
                    toggleBtn.style.display = 'none';
                }
            }
        });
    });

    // 初始化按钮显示状态
    if (!isDarkMode() && toggleBtn) {
        toggleBtn.style.display = 'none';
    }

    observer.observe(document.documentElement, {
        attributes: true
    });
}); 