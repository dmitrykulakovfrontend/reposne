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
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    const positionNumber = document.getElementById('positionNumber');

    // Role selection handling
    const roleButtons = document.querySelectorAll('.btn-role');
    const roleRadios = document.querySelectorAll('input[name="role"]');
    
    // Function to update visual state
    function updateRoleButtons() {
        roleButtons.forEach(btn => btn.classList.remove('active'));
        roleRadios.forEach(radio => {
            if (radio.checked) {
                const role = radio.value;
                const button = document.querySelector(`.btn-role[data-role="${role}"]`);
                if (button) {
                    button.classList.add('active');
                }
            }
        });
    }
    
    // Update visual state when radio changes
    roleRadios.forEach(radio => {
        radio.addEventListener('change', updateRoleButtons);
        
        // Also handle click on the label (which contains the radio)
        const button = radio.closest('.btn-role');
        if (button) {
            button.addEventListener('click', function(e) {
                // Let the default label behavior work, then update visual state
                setTimeout(() => {
                    updateRoleButtons();
                }, 0);
            });
        }
    });

    // Human check handling
    const humanCheckbox = document.getElementById('human');
    const humanCheck = document.querySelector('.human-check');
    
    if (humanCheckbox && humanCheck) {
        // Update visual state based on checkbox state
        function updateCheckboxVisual() {
            if (humanCheckbox.checked) {
                humanCheck.classList.add('checked');
            } else {
                humanCheck.classList.remove('checked');
            }
        }
        
        // Handle checkbox change to update visual state
        humanCheckbox.addEventListener('change', updateCheckboxVisual);
        
        // Handle click on label
        humanCheck.addEventListener('click', function(e) {
            // Since checkbox is inside label, clicking label will toggle checkbox automatically
            // But we need to update visual state after a small delay to let the change event fire
            setTimeout(() => {
                updateCheckboxVisual();
            }, 10);
        });
        
        // Initial visual state update
        updateCheckboxVisual();
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoader = submitButton.querySelector('.btn-loader');
        
        // Validate role selection
        const role = formData.get('role');
        if (!role) {
            alert('Пожалуйста, выберите вашу роль (Студент, Родитель или Компания)');
            return;
        }

        // Validate required fields
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const humanCheckbox = document.getElementById('human');
        const isHumanChecked = humanCheckbox ? humanCheckbox.checked : false;

        if (!name || name.length < 2) {
            alert('Пожалуйста, укажите ваше имя (минимум 2 символа)');
            return;
        }

        if (!email || !email.includes('@')) {
            alert('Пожалуйста, укажите корректный email');
            return;
        }

        // Check human checkbox
        if (!isHumanChecked) {
            alert('Пожалуйста, подтвердите, что вы не робот');
            return;
        }

        const data = {
            name: name,
            email: email,
            role: role,
            description: formData.get('description')?.trim() || 'Не указано',
            honeypot: formData.get('website')?.trim() || '',
            human: isHumanChecked,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            url: window.location.href
        };

        // Simple bot detection
        const isBot = detectBot(data);

        if (isBot) {
            alert('Проверка на бота не пройдена. Пожалуйста, попробуйте еще раз.');
            return;
        }

        // Simulate position in waitlist (in real app, this would come from backend)
        const position = Math.floor(Math.random() * 100) + 1;
        positionNumber.textContent = `#${position}`;

        // Show loading state
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        // Send data to your notification system
        try {
            await sendNotification(data);
            console.log('✅ Уведомление отправлено успешно');
            
            // Hide form and show success
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('❌ Ошибка отправки уведомления:', error);
            alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или напишите нам напрямую в Telegram.');
            
            // Reset button state
            submitButton.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
});

// Simple bot detection
function detectBot(data) {
    // Honeypot: если поле заполнено, отклоняем
    if (data.honeypot) return true;
    // Требуем установленный чекбокс «я не робот»
    if (!data.human) return true;
    // Больше никаких «строгих» эвристик на клиенте, чтобы избежать ложных срабатываний
    return false;
}

// Send notification (replace with your actual notification system)
async function sendNotification(data) {
    console.log('📝 Отправка уведомления:', data);

    // Configuration - замените на ваши реальные значения!
    // Для получения токена: найдите @BotFather в Telegram, создайте бота командой /newbot
    // Для получения chat_id: найдите @userinfobot в Telegram или используйте /getUpdates API
    const CONFIG = {
        telegram: {
            enabled: false, // Установите true когда добавите токен
            token: 'YOUR_BOT_TOKEN', // Замените на токен вашего бота от @BotFather
            chatId: 'YOUR_CHAT_ID' // Замените на ваш chat_id (число или @username для каналов)
        },
        email: {
            enabled: false,
            serviceUrl: 'YOUR_EMAIL_SERVICE_URL'
        }
    };

    const results = [];

    // Send to Telegram
    if (CONFIG.telegram.enabled) {
        try {
            const telegramResult = await sendToTelegram(data, CONFIG.telegram);
            results.push({ service: 'telegram', success: true, result: telegramResult });
        } catch (error) {
            results.push({ service: 'telegram', success: false, error: error.message });
        }
    }

    // Send to Email
    if (CONFIG.email.enabled) {
        try {
            const emailResult = await sendToEmail(data, CONFIG.email);
            results.push({ service: 'email', success: true, result: emailResult });
        } catch (error) {
            results.push({ service: 'email', success: false, error: error.message });
        }
    }

    // Log results
    console.log('📊 Результаты отправки:', results);

    // If no services are enabled, just log to console
    if (!CONFIG.telegram.enabled && !CONFIG.email.enabled) {
        console.log('ℹ️ Для продакшена настройте Telegram или Email уведомления');
    }

    return results;
}

// Send to Telegram Bot
async function sendToTelegram(data, config) {
    const message = `
🔔 *Новая регистрация в списке ожидания Mama HR!*

👤 *Имя:* ${escapeMarkdown(data.name)}
📧 *Email:* ${escapeMarkdown(data.email)}
🎭 *Роль:* ${getRoleName(data.role)}
📝 *Ожидания:* ${escapeMarkdown(data.description)}
⏰ *Время:* ${new Date(data.timestamp).toLocaleString('ru-RU')}

#MamaHR #Waitlist
    `;

    const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: config.chatId,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        })
    });

    if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
    }

    return await response.json();
}

// Send to Email (example implementation)
async function sendToEmail(data, config) {
    // This is a placeholder - implement with your email service
    const emailData = {
        to: 'admin@mamahr.com', // Your admin email
        subject: 'Новая регистрация в списке ожидания Mama HR',
        html: `
            <h2>Новая регистрация!</h2>
            <p><strong>Имя:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Роль:</strong> ${getRoleName(data.role)}</p>
            <p><strong>Время:</strong> ${new Date(data.timestamp).toLocaleString('ru-RU')}</p>
        `
    };

    const response = await fetch(config.serviceUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        throw new Error(`Email service error: ${response.status}`);
    }

    return await response.json();
}

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

// Add form validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email';
        }
    } else if (field.name === 'name') {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Имя должно содержать минимум 2 символа';
        }
    } else if (field.name === 'description') {
        if (value.length > 500) {
            isValid = false;
            errorMessage = 'Описание не должно превышать 500 символов';
        }
    }

    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        field.classList.remove('error');
        hideFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #EF4444;
            font-size: 0.8rem;
            margin-top: 4px;
            font-weight: 600;
        `;
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}
