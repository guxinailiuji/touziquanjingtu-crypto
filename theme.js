// 主题切换功能
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const sunIcons = themeToggleBtn.querySelectorAll('.sun-icon');
    
    // 检查用户之前是否设置过主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    }

    // 监听系统主题变化
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const theme = e.matches ? 'dark' : 'light';
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', theme);
                updateThemeIcons(theme);
            }
        });
    }

    // 切换主题
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });

    // 更新主题图标
    function updateThemeIcons(theme) {
        if (theme === 'light') {
            moonIcon.classList.add('hidden');
            sunIcons.forEach(icon => icon.classList.remove('hidden'));
        } else {
            moonIcon.classList.remove('hidden');
            sunIcons.forEach(icon => icon.classList.add('hidden'));
        }
    }
}); 