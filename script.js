// Particle System and Animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initParticles();
    initScrollAnimations();
    initCounterAnimations();
    initHeroAnimations();

// Particle System
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }

    // Recreate particles periodically
    setInterval(() => {
        if (particlesContainer.children.length < particleCount) {
            createParticle(particlesContainer);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 20;
    const duration = Math.random() * 10 + 15;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.step-card, .about h2, .waitlist h2, .waitlist-subtitle, .problem-card, .benefit-card, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/\D/g, ''); // Remove non-digits
        const increment = target / speed;

        if (count < target) {
            const newValue = Math.ceil(count + increment);
            // Format the number based on the target type
            if (target === 996) {
                counter.innerText = newValue;
            } else if (target === 36) {
                counter.innerText = newValue;
            } else {
                counter.innerText = newValue;
            }
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };

    // Start counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                heroObserver.unobserve(entry.target);
            }
        });
    });

    heroObserver.observe(document.querySelector('.hero'));
}

// Hero Animations
function initHeroAnimations() {
    // Add stagger animation to floating cards
    const cards = document.querySelectorAll('.card-preview');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        document.querySelector('.animated-bg').style.transform = `translateY(${rate}px)`;
        document.querySelector('.hero-visual').style.transform = `translateY(${rate * 0.3}px)`;
    });
}
});


// Helper function to get role name in Russian
function getRoleName(role) {
    const roles = {
        'student': 'Студент',
        'parent': 'Родитель',
        'company': 'Компания'
    };
    return roles[role] || role;
}

// Helper function to escape Markdown special characters
function escapeMarkdown(text) {
    if (!text) return '';
    return String(text)
        .replace(/\_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\~/g, '\\~')
        .replace(/\`/g, '\\`')
        .replace(/\>/g, '\\>')
        .replace(/\#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/\-/g, '\\-')
        .replace(/\=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/\!/g, '\\!');
}

// Smooth scroll functions
function scrollToWaitlist() {
    document.getElementById('waitlist').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToAbout() {
    document.querySelector('.about').scrollIntoView({
        behavior: 'smooth'
    });
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate step cards on scroll
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

    // Initially hide step cards
    document.querySelectorAll('.step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add floating animation to hero illustration
    const heroCards = document.querySelector('.floating-cards');
    if (heroCards) {
        heroCards.style.animation = 'float 3s ease-in-out infinite';
    }
});