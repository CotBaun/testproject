// DOM Elements
const chatButton = document.querySelector('.chat-button');
const chatModal = document.getElementById('chatModal');
const chatClose = document.querySelector('.chat-modal__close');
const chatOverlay = document.querySelector('.chat-modal__overlay');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const menuToggle = document.querySelector('.header__menu-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const heroCTA = document.querySelector('.hero__cta');

// Chat responses
const chatResponses = [
    "Это интересный вопрос! Здесь будет интеграция с реальным ИИ-агентом.",
    "Я могу рассказать о типах нейросетей, их применении и перспективах развития.",
    "Нейросети - это захватывающая область! Что конкретно вас интересует?",
    "Отличный вопрос о машинном обучении! Скоро здесь будет полноценный ИИ-ассистент.",
    "Искусственный интеллект развивается очень быстро. Хотите узнать больше о конкретных применениях?",
    "Это важная тема в области ИИ. Когда будет подключен настоящий ассистент, он сможет дать более подробный ответ."
];

// Chat functionality
function openChat() {
    chatModal.classList.add('active');
    chatInput.focus();
}

function closeChat() {
    chatModal.classList.remove('active');
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'chat-message__content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';
    
    // Simulate typing delay
    chatSend.disabled = true;
    setTimeout(() => {
        // Add bot response
        const randomResponse = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        addMessage(randomResponse, false);
        chatSend.disabled = false;
    }, 1000);
}

// Event listeners for chat
chatButton.addEventListener('click', openChat);
chatClose.addEventListener('click', closeChat);
chatOverlay.addEventListener('click', closeChat);
chatSend.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Hero CTA button functionality
heroCTA.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const offsetTop = aboutSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
});

// Mobile menu toggle
let mobileMenuOpen = false;

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    const nav = document.querySelector('.header__nav');
    const spans = menuToggle.querySelectorAll('span');
    
    if (mobileMenuOpen) {
        nav.style.display = 'block';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'var(--color-surface)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        nav.style.padding = '20px';
        nav.style.zIndex = '1000';
        
        const navList = nav.querySelector('.nav__list');
        navList.style.flexDirection = 'column';
        navList.style.gap = '15px';
        
        // Animate hamburger to X
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        nav.style.display = 'none';
        
        // Reset hamburger
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenuOpen) {
            toggleMobileMenu();
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !e.target.closest('.header__nav') && !e.target.closest('.header__menu-toggle')) {
        toggleMobileMenu();
    }
});

// Scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animations to cards and sections
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
        .stat-card,
        .type-card,
        .application-card,
        .learning-card,
        .timeline__item,
        .business-stat
    `);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}

// Add scroll event listener with throttling
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

function updateScrollEffects() {
    handleScroll();
    ticking = false;
}

window.addEventListener('scroll', requestTick);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .type-card, .application-card, .learning-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    // Close chat with Escape key
    if (e.key === 'Escape' && chatModal.classList.contains('active')) {
        closeChat();
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu();
    }
});

// Add focus trap for chat modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to chat modal
trapFocus(chatModal);

// Add loading animation for chat messages
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message chat-message--bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const content = document.createElement('div');
    content.className = 'chat-message__content';
    content.innerHTML = '<span>•</span><span>•</span><span>•</span>';
    
    typingDiv.appendChild(content);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add CSS for typing animation
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .chat-message__content span {
            animation: typing 1.4s infinite;
            opacity: 0.4;
        }
        .typing-indicator .chat-message__content span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator .chat-message__content span:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing {
            0%, 60%, 100% { opacity: 0.4; }
            30% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Update sendMessage function to include typing indicator
const originalSendMessage = sendMessage;
sendMessage = function() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate typing delay
    chatSend.disabled = true;
    setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add bot response
        const randomResponse = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        addMessage(randomResponse, false);
        chatSend.disabled = false;
    }, 1500);
};

// Add some easter eggs for specific questions
const easterEggResponses = {
    'привет': 'Привет! Рад познакомиться! Меня зовут ИИ-ассистент NeuralHub. Чем могу помочь?',
    'как дела': 'У меня все отлично! Обрабатываю данные и отвечаю на вопросы. А как у вас дела?',
    'что такое нейросеть': 'Нейросеть - это вычислительная система, вдохновленная работой человеческого мозга. Она состоит из искусственных нейронов, которые обрабатывают информацию и учатся на данных.',
    'gpt': 'GPT - это тип трансформерной архитектуры, которая отлично справляется с задачами обработки естественного языка. Это основа для многих современных языковых моделей!',
    'будущее ии': 'Будущее ИИ очень перспективно! Ожидается развитие AGI к 2025 году, мультимодальных систем к 2026-2027, и интеграция с квантовыми вычислениями к 2030.'
};

// Enhanced sendMessage with easter eggs
sendMessage = function() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate typing delay
    chatSend.disabled = true;
    setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Check for easter eggs
        const lowerMessage = message.toLowerCase();
        let response = null;
        
        for (const [key, value] of Object.entries(easterEggResponses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }
        
        // Use easter egg response or random response
        if (!response) {
            response = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        }
        
        addMessage(response, false);
        chatSend.disabled = false;
    }, 1500);
};

// Add some CSS for enhanced animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .header {
        transition: transform 0.3s ease;
    }
    
    .nav__link {
        position: relative;
        overflow: hidden;
    }
    
    .nav__link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .nav__link:hover::before {
        left: 100%;
    }
    
    .chat-button {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
        50% { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4); }
        100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
    }
    
    .hero__cta {
        position: relative;
        overflow: hidden;
    }
    
    .hero__cta::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .hero__cta:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(additionalStyles);

console.log('NeuralHub сайт загружен успешно! 🚀');