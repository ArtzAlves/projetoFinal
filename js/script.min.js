/**
 * Vendrâmico Website - JavaScript Interactivity
 * Implementa navegação responsiva, animações, formulários e persistência de dados
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 80,
    debounceDelay: 100,
    storageKeys: {
        contactForm: 'vendramico_contact_form',
        userPreferences: 'vendramico_preferences'
    }
};

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce function para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll para elementos
    smoothScrollTo(element, offset = CONFIG.scrollOffset) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Salvar dados no localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    // Carregar dados do localStorage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    },

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Animar contador
    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (range * progress));
            
            element.textContent = current + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
};

// ===== NAVEGAÇÃO E HEADER =====
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScroll();
        this.setupActiveSection();
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.mobileToggle?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });

        // Sticky header on scroll
        window.addEventListener('scroll', Utils.debounce(() => {
            this.handleScroll();
        }, CONFIG.debounceDelay));

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.mobileToggle?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add sticky class to header
        if (scrollY > 50) {
            this.header?.classList.add('sticky');
        } else {
            this.header?.classList.remove('sticky');
        }
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    Utils.smoothScrollTo(targetElement);
                }
            });
        });
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNavLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== ANIMAÇÕES E SCROLL REVEAL =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in-up, .fade-in');
        this.counters = document.querySelectorAll('.stat-card__number');
        this.hasAnimatedCounters = false;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimation();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupCounterAnimation() {
        const statsSection = document.querySelector('.hero-section__stats');
        
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimatedCounters) {
                    this.animateCounters();
                    this.hasAnimatedCounters = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const text = counter.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/\d/g, '');
            
            counter.dataset.suffix = suffix;
            Utils.animateCounter(counter, 0, number, 2000);
        });
    }
}

// ===== FORMULÁRIO DE CONTATO =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.successMessage = document.getElementById('form-success');
        this.submitButton = this.form?.querySelector('.contact-form__submit-button');
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.loadSavedData();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Save form data on input
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', Utils.debounce(() => {
                this.saveFormData();
            }, 500));
        });

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);
        
        try {
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const formData = this.getFormData();
            this.saveSubmissionData(formData);
            this.showSuccessMessage();
            this.clearForm();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value && !Utils.isValidEmail(value)) {
            errorMessage = 'Digite um e-mail válido';
            isValid = false;
        }
        // Minimum length validation
        else if (field.type === 'text' && value && value.length < 2) {
            errorMessage = 'Mínimo de 2 caracteres';
            isValid = false;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitButton.textContent = 'Enviando...';
            this.submitButton.disabled = true;
            this.form.classList.add('loading');
        } else {
            this.submitButton.textContent = 'Enviar Mensagem';
            this.submitButton.disabled = false;
            this.form.classList.remove('loading');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.timestamp = new Date().toISOString();
        return data;
    }

    saveFormData() {
        const data = this.getFormData();
        delete data.timestamp; // Don't save timestamp for draft
        Utils.saveToStorage(CONFIG.storageKeys.contactForm, data);
    }

    loadSavedData() {
        const savedData = Utils.loadFromStorage(CONFIG.storageKeys.contactForm);
        
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field && savedData[key]) {
                    field.value = savedData[key];
                }
            });
        }
    }

    saveSubmissionData(data) {
        const submissions = Utils.loadFromStorage('vendramico_submissions') || [];
        submissions.push(data);
        Utils.saveToStorage('vendramico_submissions', submissions);
    }

    showSuccessMessage() {
        this.form.style.display = 'none';
        this.successMessage.classList.remove('hidden');
        
        // Clear saved form data
        localStorage.removeItem(CONFIG.storageKeys.contactForm);
    }

    showErrorMessage(message) {
        // Create or update error message
        let errorDiv = this.form.querySelector('.form-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            this.form.insertBefore(errorDiv, this.submitButton);
        }
        
        errorDiv.innerHTML = `<p style="color: #ff4444; text-align: center; margin: 1rem 0;">${message}</p>`;
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    clearForm() {
        this.form.reset();
        this.form.querySelectorAll('.error').forEach(field => {
            this.clearFieldError(field);
        });
    }
}

// ===== BOTÃO VOLTAR AO TOPO =====
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Show/hide button on scroll
        window.addEventListener('scroll', Utils.debounce(() => {
            this.toggleVisibility();
        }, CONFIG.debounceDelay));

        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    toggleVisibility() {
        const scrollY = window.scrollY;
        
        if (scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ===== EFEITOS VISUAIS AVANÇADOS =====
class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupParallaxEffect();
        this.setupTypingEffect();
    }

    setupHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupParallaxEffect() {
        const heroSection = document.querySelector('.hero-section');
        
        if (!heroSection) return;

        window.addEventListener('scroll', Utils.debounce(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroSection.style.transform = `translateY(${parallax}px)`;
        }, 10));
    }

    setupTypingEffect() {
        const titleHighlight = document.querySelector('.hero-section__title-highlight');
        
        if (!titleHighlight) return;

        const text = titleHighlight.textContent;
        titleHighlight.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleHighlight.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// ===== PERFORMANCE E ACESSIBILIDADE =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for mobile menu
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        
        mobileToggle?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileToggle.click();
            }
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu?.classList.contains('active')) {
                    mobileToggle?.click();
                }
            }
        });
    }

    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('nav-menu');
        const focusableElements = navMenu?.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        
        if (!focusableElements) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }
}

// ===== INICIALIZAÇÃO =====
class VendramicoApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.navigation = new Navigation();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.contactForm = new ContactForm();
            this.components.backToTop = new BackToTop();
            this.components.visualEffects = new VisualEffects();
            this.components.accessibility = new AccessibilityEnhancements();
            
            console.log('Vendrâmico website initialized successfully');
            
            // Add initial animations
            this.addInitialAnimations();
            
        } catch (error) {
            console.error('Error initializing Vendrâmico website:', error);
        }
    }

    addInitialAnimations() {
        // Add fade-in-up class to elements that should animate
        const elementsToAnimate = [
            '.hero-section__content > *',
            '.section-title',
            '.section-subtitle',
            '.product-card',
            '.step-card',
            '.benefit-card',
            '.contact-form',
            '.contact-info'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.classList.add('fade-in-up');
                element.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
}

// ===== CSS ADICIONAL PARA ERROS E ESTADOS =====
const additionalStyles = `
    .field-error {
        color: #ff4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-input.error,
    .form-textarea.error {
        border-color: #ff4444;
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
    }
    
    .form-error-message {
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid #ff4444;
        border-radius: var(--border-radius-md);
        padding: var(--spacing-sm);
        margin: var(--spacing-sm) 0;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .fade-in-up,
        .fade-in {
            opacity: 1 !important;
            transform: none !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const app = new VendramicoApp();

