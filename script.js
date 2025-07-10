// Translations
const translations = {
    en: {
        'nav.about': 'About',
        'nav.work': 'Work',
        'nav.contact': 'Contact',
        'hero.title': 'JOSS',
        'about.title': "hi, i'm joss!",
        'about.description1': 'UX/UI web designer passionate about creating beautiful and functional digital experiences. I combine creativity with user-centered design principles to deliver exceptional results.',
        'about.description2': 'With expertise in both design and photography, I bring a unique perspective to every project, ensuring that visual storytelling and usability work hand in hand.',
        'about.download': 'Download CV',
        'skills.title': 'What am i doing and how can i help you?',
        'skills.branding': 'Branding design',
        'skills.copywriting': 'Copywriting',
        'skills.ecommerce': 'E-commerce',
        'skills.website': 'New website',
        'portfolio.title': 'Featured Work',
        'contact.title': "Let's work together",
        'contact.description': 'I constantly strive to improve my skills and the quality of my work. Ready to bring your vision to life with exceptional design.',
        'contact.button1': 'Get in touch',
        'contact.button2': 'View my work',
        'stats.projects': 'Projects Completed',
        'stats.clients': 'Happy Clients',
        'stats.experience': 'Years Experience',
        'stats.awards': 'Awards Won'
    },
    es: {
        'nav.about': 'Acerca',
        'nav.work': 'Trabajo',
        'nav.contact': 'Contacto',
        'hero.title': 'JOSS',
        'about.title': '¡Hola, soy joss!',
        'about.description1': 'Diseñador web UX/UI apasionado por crear experiencias digitales hermosas y funcionales. Combino creatividad con principios de diseño centrado en el usuario para entregar resultados excepcionales.',
        'about.description2': 'Con experiencia tanto en diseño como en fotografía, aporto una perspectiva única a cada proyecto, asegurando que la narrativa visual y la usabilidad trabajen de la mano.',
        'about.download': 'Descargar CV',
        'skills.title': '¿Qué hago y cómo puedo ayudarte?',
        'skills.branding': 'Diseño de marca',
        'skills.copywriting': 'Redacción creativa',
        'skills.ecommerce': 'Comercio electrónico',
        'skills.website': 'Sitio web nuevo',
        'portfolio.title': 'Trabajo Destacado',
        'contact.title': 'Trabajemos juntos',
        'contact.description': 'Constantemente me esfuerzo por mejorar mis habilidades y la calidad de mi trabajo. Listo para dar vida a tu visión con diseño excepcional.',
        'contact.button1': 'Ponte en contacto',
        'contact.button2': 'Ver mi trabajo',
        'stats.projects': 'Proyectos Completados',
        'stats.clients': 'Clientes Felices',
        'stats.experience': 'Años de Experiencia',
        'stats.awards': 'Premios Ganados'
    }
};

// Global variables
let currentLanguage = 'en';
let scene, camera, renderer, textMesh;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initLanguageSwitcher();
    initNavigation();
    initScrollEffects();
    initStatsAnimation();
    initThreeJS();
    initBackToTop();
    initLazyLoading();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    let progress = 0;

    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 50);
}

// Language Switcher
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            switchLanguage(lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.dataset.translate;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Stats Animation
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        animated = true;

        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            
            setTimeout(() => {
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + '+';
                }, 50);
            }, index * 200);
        });
    };

    // Trigger animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Three.js 3D Scene
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create 3D Text
    const loader = new THREE.FontLoader();
    
    // Fallback: Create a simple geometry if font loading fails
    const createFallbackGeometry = () => {
        const geometry = new THREE.BoxGeometry(2, 0.5, 0.2);
        const material = new THREE.MeshNormalMaterial();
        textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.set(0, 0, 0);
        scene.add(textMesh);
    };

    // Try to load font, fallback to simple geometry
    try {
        // Create simple 3D geometry as fallback
        createFallbackGeometry();
    } catch (error) {
        console.log('Font loading failed, using fallback geometry');
        createFallbackGeometry();
    }

    // Camera position
    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (textMesh) {
            textMesh.rotation.x += 0.005;
            textMesh.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        if (container.offsetWidth > 0) {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Portfolio item hover effects
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Social links analytics (optional)
function trackSocialClick(platform) {
    // Add your analytics tracking here
    console.log(`Social link clicked: ${platform}`);
}

// Add click tracking to social links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.classList.contains('instagram') ? 'Instagram' :
                           this.classList.contains('behance') ? 'Behance' :
                           this.classList.contains('dribbble') ? 'Dribbble' : 'Unknown';
            trackSocialClick(platform);
        });
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);