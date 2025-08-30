// ChatWing AI Landing Page JavaScript

// DOM Elements
const modal = document.getElementById('leadModal');
const ctaButtons = document.querySelectorAll('.cta-button-primary, .cta-button-small, .plan-cta');
const closeModal = document.querySelector('.close');
const leadForm = document.getElementById('leadForm');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

// State
let currentTestimonial = 0;
let testimonialInterval;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimer();
    initTestimonialCarousel();
    initModalHandlers();
    initScrollAnimations();
    initSmoothScrolling();
    initFormValidation();
    initChatAnimation();
});

// Countdown Timer
function initCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    
    // Set initial time (23:59:45)
    let hours = 23;
    let minutes = 59;
    let seconds = 45;
    
    function updateCountdown() {
        // Decrease time
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Reset to 23:59:59 when it reaches 00:00:00
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }
        
        // Format and display
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownElement.textContent = formattedTime;
    }
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Testimonial Carousel
function initTestimonialCarousel() {
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show selected testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            startAutoRotation();
        });
    });
    
    function startAutoRotation() {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }
    
    // Initialize first testimonial and start rotation
    showTestimonial(0);
    startAutoRotation();
    
    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-carousel');
    testimonialSection.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSection.addEventListener('mouseleave', () => {
        startAutoRotation();
    });
}

// Modal Handlers
function initModalHandlers() {
    // Open modal when CTA buttons are clicked
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close modal handlers
    closeModal.addEventListener('click', closeModalHandler);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
}

function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
    
    // Track modal open event
    trackEvent('modal_opened', 'engagement');
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    leadForm.reset();
    clearFormErrors();
}

// Form Validation
function initFormValidation() {
    const inputs = leadForm.querySelectorAll('input');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    leadForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (!value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    } else {
        // Specific validations
        switch (field.type) {
            case 'email':
                const emailRegex = /^[\S+@\S+\.\S+]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um email válido';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um telefone válido';
                }
                break;
                
            case 'text':
                if (field.id === 'name' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#EF4444';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.style.borderColor = '#E5E7EB';
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearFormErrors() {
    const inputs = leadForm.querySelectorAll('input');
    inputs.forEach(clearFieldError);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitButton = leadForm.querySelector('.form-submit');
    const originalText = submitButton.textContent;
    
    // Validate all fields
    const inputs = leadForm.querySelectorAll('input');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    leadForm.classList.add('loading');
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        business: document.getElementById('business').value.trim(),
        timestamp: new Date().toISOString(),
        source: 'chatwing_landing_page'
    };
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulateAPICall(formData);
        
        // Success handling
        showSuccessMessage();
        trackEvent('lead_submitted', 'conversion', formData.email);
        
        // Close modal after delay
        setTimeout(() => {
            closeModalHandler();
        }, 2000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage();
        trackEvent('form_error', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        leadForm.classList.remove('loading');
    }
}

function simulateAPICall(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                console.log('Lead submitted:', data);
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

function showSuccessMessage() {
    const modalContent = document.querySelector('.modal-content');
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h3 style="color: #10B981; margin-bottom: 1rem;">Sucesso!</h3>
            <p style="margin-bottom: 1rem;">Recebemos suas informações. Nossa equipe entrará em contato em até 24 horas.</p>
            <p style="font-size: 0.9rem; color: #6B7280;">Verifique seu email para receber o eBook gratuito sobre automação.</p>
        </div>
    `;
    modalContent.innerHTML = successHTML;
}

function showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: #FEE2E2;
        color: #DC2626;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
    `;
    errorDiv.textContent = 'Erro ao enviar formulário. Tente novamente.';
    
    const form = document.querySelector('.lead-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .problem-card,
        .feature-card,
        .testimonial-card,
        .pricing-card,
        .section-title
    `);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight +
                                  document.querySelector('.urgency-banner').offsetHeight;
                
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                trackEvent('navigation_click', 'engagement', targetId);
            }
        });
    });
}

// Chat Animation
function initChatAnimation() {
    const chatMessages = document.querySelectorAll('.chat-messages .message');
    
    // Hide all messages initially
    chatMessages.forEach((message, index) => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
    });
    
    // Animate messages one by one
    function animateMessages() {
        chatMessages.forEach((message, index) => {
            setTimeout(() => {
                message.style.transition = 'all 0.5s ease-out';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, index * 1000);
        });
    }
    
    // Start animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateMessages, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Analytics and Tracking
function trackEvent(eventName, category, label = '') {
    // Google Analytics 4 tracking (replace with your tracking ID)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: label,
            value: 1
        });
    }
    
    // Console log for development
    console.log('Event tracked:', { eventName, category, label });
    
    // Facebook Pixel tracking (if implemented)
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, { category, label });
    }
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', 'performance', Math.round(loadTime / 1000));
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if (scrollDepth >= 25 && scrollDepth < 50) {
                trackEvent('scroll_25', 'engagement');
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
                trackEvent('scroll_50', 'engagement');
            } else if (scrollDepth >= 75 && scrollDepth < 100) {
                trackEvent('scroll_75', 'engagement');
            } else if (scrollDepth >= 100) {
                trackEvent('scroll_100', 'engagement');
            }
        }
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Mobile Menu Toggle (if needed)
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', 'error', e.error.message);
});

// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('promise_rejection', 'error', e.reason);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        trackEvent,
        debounce,
        throttle
    };
}
