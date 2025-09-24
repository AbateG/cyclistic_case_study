// Theme Toggle and UI Functions
let currentTheme = localStorage.getItem('theme') || 'light';
let themeToggleBtn = null;

function initTheme() {
    // Check for saved theme, otherwise use system preference
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        // Detect system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = prefersDark ? 'dark' : 'light';
    }
    currentTheme = savedTheme;

    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Create theme toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
        createThemeToggle();
    }

    // Update button state
    updateThemeToggleButton();

function createThemeToggle() {
    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'theme-toggle-container';
    toggleContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.style.cssText = `
        background: var(--primary-500);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    toggleBtn.addEventListener('click', toggleTheme);
    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.style.boxShadow = 'var(--shadow-xl)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.boxShadow = 'var(--shadow-lg)';
    });

    toggleContainer.appendChild(toggleBtn);
    document.body.appendChild(toggleContainer);
    themeToggleBtn = toggleBtn;
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggleButton();

    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);

    // Update charts if Plotly is loaded
    if (typeof Plotly !== 'undefined') {
        updateChartThemes();
    }
}

function updateThemeToggleButton() {
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        themeToggleBtn.title = `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`;
    }
}

function updateChartThemes() {
    // Update all Plotly charts to match current theme
    const charts = document.querySelectorAll('[class*="chart"], [id*="chart"]');
    charts.forEach(chart => {
        if (chart._fullLayout) {
            const isDark = currentTheme === 'dark';
            const bgColor = isDark ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.9)';
            const textColor = isDark ? '#ffffff' : '#2c3e50';
            const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const nodeLineColor = isDark ? 'var(--neutral-400)' : '#000000';

            try {
                // Update standard chart properties
                const updateObj = {
                    'paper_bgcolor': bgColor,
                    'plot_bgcolor': bgColor,
                    'font.color': textColor,
                    'xaxis.gridcolor': gridColor,
                    'yaxis.gridcolor': gridColor,
                    'xaxis.linecolor': gridColor,
                    'yaxis.linecolor': gridColor,
                    'xaxis.tickcolor': textColor,
                    'yaxis.tickcolor': textColor,
                    'xaxis.tickfont.color': textColor,
                    'yaxis.tickfont.color': textColor
                };

                // Special handling for Sankey diagrams
                if (chart.data && chart.data.some(d => d.type === 'sankey')) {
                    updateObj['node.line.color'] = nodeLineColor;
                }

                Plotly.relayout(chart, updateObj);
            } catch (e) {
                console.log('Chart theme update skipped:', e.message);
            }
        }
    });
}

// Scroll animations and effects
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .card, .metric-card, .chart-container').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Loading states management
function showLoading(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        element.classList.add('loading');
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('loading');
    }
}

// Error handling
function showError(elementId, message, retryCallback = null) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <p class="error-message">${message}</p>
                ${retryCallback ? '<button class="retry-btn" onclick="retryCallback()">Retry</button>' : ''}
            </div>
        `;
        element.classList.add('error');
    }
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('error');
    }
}

// Mobile responsiveness helpers
function initMobileOptimizations() {
    // Handle mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        const toggleMenu = () => {
            navMenu.classList.toggle('mobile-open');
            const isOpen = navMenu.classList.contains('mobile-open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        mobileMenuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Handle touch events for charts
    if ('ontouchstart' in window) {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.addEventListener('touchstart', (e) => {
                // Prevent default touch behaviors that might interfere with charts
                e.preventDefault();
            }, { passive: false });
        });
    }

    // Adjust chart sizes for mobile
    function adjustChartsForMobile() {
        if (window.innerWidth < 768) {
            document.querySelectorAll('.chart-container').forEach(container => {
                container.style.height = '300px';
            });
        } else {
            document.querySelectorAll('.chart-container').forEach(container => {
                container.style.height = '400px';
            });
        }
    }

    window.addEventListener('resize', adjustChartsForMobile);
    adjustChartsForMobile();
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor chart loading times
    const chartLoadTimes = new Map();

    // Override Plotly.newPlot to track performance
    const originalNewPlot = Plotly.newPlot;
    Plotly.newPlot = function(...args) {
        const startTime = performance.now();
        const result = originalNewPlot.apply(this, args);
        const endTime = performance.now();

        const chartId = args[0];
        chartLoadTimes.set(chartId, endTime - startTime);

        console.log(`Chart ${chartId} loaded in ${endTime - startTime}ms`);

        return result;
    };

    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime}ms`);

        // Report slow loading charts
        chartLoadTimes.forEach((time, chartId) => {
            if (time > 1000) { // More than 1 second
                console.warn(`Slow chart: ${chartId} took ${time}ms to load`);
            }
        });
    });
}

// Initialize all UI functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileOptimizations();

    // Initialize performance monitoring if in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        initPerformanceMonitoring();
    }
});

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor chart loading times
    const chartLoadTimes = new Map();

    // Override Plotly.newPlot to track performance
    const originalNewPlot = Plotly.newPlot;
    Plotly.newPlot = function(...args) {
        const startTime = performance.now();
        const result = originalNewPlot.apply(this, args);
        const endTime = performance.now();

        const chartId = args[0];
        chartLoadTimes.set(chartId, endTime - startTime);

        console.log(`Chart ${chartId} loaded in ${endTime - startTime}ms`);

        return result;
    };

    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime}ms`);

        // Report slow loading charts
        chartLoadTimes.forEach((time, chartId) => {
            if (time > 1000) { // More than 1 second
                console.warn(`Slow chart: ${chartId} took ${time}ms to load`);
            }
        });
    });
}

// Initialize all UI functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileOptimizations();

    // Initialize performance monitoring if in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        initPerformanceMonitoring();
    }
});