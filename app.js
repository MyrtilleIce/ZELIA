// Application JavaScript pour ZELIA

document.addEventListener('DOMContentLoaded', function() {
    console.log('ZELIA website loaded');
    
    // Initialisation des fonctionnalités
    initMobileNavigation();
    initSmoothScrolling();
    initContactForm();
    initHeaderScroll();
    initAnimations();
});

// Navigation mobile
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling pour les liens d'ancrage
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Gestion du formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const formFields = {
                nom: contactForm.querySelector('input[type="text"]').value.trim(),
                email: contactForm.querySelector('input[type="email"]').value.trim(),
                entreprise: contactForm.querySelectorAll('input[type="text"]')[1].value.trim(),
                message: contactForm.querySelector('textarea').value.trim()
            };
            
            // Validation simple
            if (!formFields.nom || !formFields.email || !formFields.entreprise || !formFields.message) {
                showMessage('Veuillez remplir tous les champs requis.', 'error');
                return;
            }
            
            if (!isValidEmail(formFields.email)) {
                showMessage('Veuillez saisir une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'envoi (dans un vrai projet, ici on ferait un appel API)
            showLoadingState(contactForm, true);
            
            // Simuler un délai d'envoi
            setTimeout(() => {
                showLoadingState(contactForm, false);
                showMessage('Merci pour votre message ! Nous vous recontacterons dans les plus brefs délais.', 'success');
                contactForm.reset();
                
                // Analytics ou tracking (si nécessaire)
                trackFormSubmission(formFields);
            }, 2000);
        });
    }
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Affichage des messages de succès/erreur
function showMessage(message, type) {
    // Supprimer les anciens messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Ajouter le message après le formulaire
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
        
        // Scroll vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// État de chargement du formulaire
function showLoadingState(form, loading) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (loading) {
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
    } else {
        submitButton.textContent = 'Envoyer le message';
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
}

// Tracking de soumission de formulaire (pour analytics)
function trackFormSubmission(formData) {
    // Ici on pourrait intégrer Google Analytics, Mixpanel, etc.
    console.log('Form submitted:', {
        event: 'contact_form_submission',
        company: formData.entreprise,
        timestamp: new Date().toISOString()
    });
    
    // Exemple avec Google Analytics (si configuré)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            'event_category': 'Contact',
            'event_label': 'Contact Form'
        });
    }
}

// Effets au scroll du header
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Ajouter une classe quand on scroll
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Animations au scroll
function initAnimations() {
    // Observer pour les animations d'apparition
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.benefit-card, .service-card, .testimonial-card, .methodology-step');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Gestion des liens externes (Calendly)
document.querySelectorAll('a[href*="calendly.com"]').forEach(link => {
    link.addEventListener('click', function() {
        // Analytics pour les clics Calendly
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_click', {
                'event_category': 'CTA',
                'event_label': this.textContent.trim()
            });
        }
        
        console.log('Calendly link clicked:', this.textContent.trim());
    });
});

// Gestion de la navigation active
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let current = '';
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Initialiser la navigation active au scroll
window.addEventListener('scroll', updateActiveNavigation);

// Fonctions utilitaires
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Performance: utiliser debounce pour les événements de scroll
const debouncedScroll = debounce(function() {
    updateActiveNavigation();
    // Autres fonctions de scroll si nécessaire
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Gestion du redimensionnement de fenêtre
window.addEventListener('resize', debounce(function() {
    // Fermer le menu mobile si ouvert lors du redimensionnement
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768) {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
}, 250));

// Accessibilité: gestion du clavier
document.addEventListener('keydown', function(e) {
    // Échapper pour fermer le menu mobile
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle?.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }
});

// Préchargement des images importantes
function preloadImages() {
    const importantImages = [
        'https://pplx-res.cloudinary.com/image/upload/v1755139862/pplx_project_search_images/1f1848eee36fe0cd9cfff34d8395622070fee7eb.png',
        'https://pplx-res.cloudinary.com/image/upload/v1756538296/pplx_project_search_images/efd14261534f544699aff103834c312c157990d3.png'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Précharger les images au chargement de la page
window.addEventListener('load', preloadImages);

// Log pour le développement
console.log('ZELIA - Expert en Automatisation de Processus Métier');
console.log('Site web développé avec les meilleures pratiques web modernes');

// Export des fonctions si nécessaire (pour les tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showMessage,
        trackFormSubmission
    };
}