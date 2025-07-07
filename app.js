/* app.js – optimized */
(() => {
  /* ---------- DOM КЭШ ---------- */
  const $ = (sel, all = false) =>
    all ? document.querySelectorAll(sel) : document.querySelector(sel);

  const DOM = {
    chatBtn:      $('.chat-button'),
    chatModal:    $('#chatModal'),
    chatClose:    $('.chat-modal__close'),
    chatOverlay:  $('.chat-modal__overlay'),
    chatInput:    $('#chatInput'),
    chatSend:     $('#chatSend'),
    chatMessages: $('#chatMessages'),
    menuToggle:   $('.header__menu-toggle'),
    nav:          $('.header__nav'),
    navLinks:     $('.nav__link', true),
    heroCTA:      $('.hero__cta'),
    header:       $('.header')
  };

  /* ---------- CHAT ---------- */
  const BOT_RESPONSES = [
    'Это интересный вопрос! Здесь будет интеграция с реальным ИИ-агентом.',
    'Я могу рассказать о типах нейросетей, их применении и перспективах.',
    'Нейросети — захватывающая область! Что именно вас интересует?',
    'Отличный вопрос о машинном обучении! Скоро будет полноценный ассистент.',
    'Искусственный интеллект растёт быстро. Хотите узнать о применениях?',
    'Когда подключится настоящий ассистент, ответы станут ещё полнее.'
  ];

  const EASTER_EGGS = {
    привет: 'Привет! Рад познакомиться! Чем могу помочь?',
    'как дела': 'У меня всё отлично! А у вас?',
    'что такое нейросеть':
      'Нейросеть — вычислительная система, вдохновлённая мозгом.',
    gpt:
      'GPT — трансформерная архитектура, лежащая в основе языковых моделей.',
    'будущее ии':
      'Будущее ИИ перспективно! AGI к 2025-му, мультимодальность к 2027-му.'
  };

  const Chat = (() => {
    const open = () => {
      DOM.chatModal.classList.add('active');
      DOM.chatInput.focus();
      trapFocus(DOM.chatModal);
    };

    const close = () => DOM.chatModal.classList.remove('active');

    const addMessage = (text, fromUser = false) => {
      const wrap = document.createElement('div');
      wrap.className = `chat-message ${
        fromUser ? 'chat-message--user' : 'chat-message--bot'
      }`;
      wrap.innerHTML = `<div class="chat-message__content">${text}</div>`;
      DOM.chatMessages.append(wrap);
      DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
    };

    const typingIndicator = {
      show() {
        const html = `
          <div id="typing" class="chat-message chat-message--bot">
            <div class="chat-message__content"><span>•</span><span>•</span><span>•</span></div>
          </div>`;
        DOM.chatMessages.insertAdjacentHTML('beforeend', html);
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
      },
      hide() {
        $('#typing')?.remove();
      }
    };

    const reply = msg => {
      const key = Object.keys(EASTER_EGGS).find(k => msg.includes(k));
      return key ? EASTER_EGGS[key] : BOT_RESPONSES[Math.random() * BOT_RESPONSES.length | 0];
    };

    const sendMessage = () => {
      const text = DOM.chatInput.value.trim();
      if (!text) return;

      addMessage(text, true);
      DOM.chatInput.value = '';
      DOM.chatSend.disabled = true;
      typingIndicator.show();

      setTimeout(() => {
        typingIndicator.hide();
        addMessage(reply(text.toLowerCase()));
        DOM.chatSend.disabled = false;
      }, 1500);
    };

    /* events */
    DOM.chatBtn.addEventListener('click', open);
    [DOM.chatClose, DOM.chatOverlay].forEach(el => el.addEventListener('click', close));
    DOM.chatSend.addEventListener('click', sendMessage);
    DOM.chatInput.addEventListener('keydown', e => e.key === 'Enter' && sendMessage());
    document.addEventListener('keydown', e => e.key === 'Escape' && close());

    return { open, close };
  })();

  /* ---------- NAVIGATION ---------- */
  const Navigation = (() => {
    const smoothScroll = targetID => {
      const el = $(targetID);
      if (!el) return;
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    };

    DOM.navLinks.forEach(link =>
      link.addEventListener('click', e => {
        e.preventDefault();
        smoothScroll(link.getAttribute('href'));
        MobileMenu.close(); // на мобиле закрыть меню
      })
    );

    DOM.heroCTA?.addEventListener('click', () => smoothScroll('#about'));
  })();

  /* ---------- HEADER HIDE ON SCROLL ---------- */
  const Header = (() => {
    let last = 0;
    const onScroll = () => {
      const cur = window.pageYOffset;
      DOM.header.style.transform =
        cur > last && cur > 100 ? 'translateY(-100%)' : 'translateY(0)';
      last = cur;
    };
    window.addEventListener('scroll', () => requestAnimationFrame(onScroll));
  })();

  /* ---------- MOBILE MENU ---------- */
  const MobileMenu = (() => {
    let open = false;
    const spans = $('span', true, DOM.menuToggle);

    const toggleIcon = () => {
      spans[0].style.transform = open ? 'rotate(45deg) translate(6px,6px)' : '';
      spans[1].style.opacity = open ? '0' : '1';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(6px,-6px)' : '';
    };

    const toggle = () => {
      open = !open;
      DOM.nav.classList.toggle('nav--open', open);
      toggleIcon();
    };

    const close = () => open && toggle();

    DOM.menuToggle.addEventListener('click', toggle);
    window.addEventListener('resize', () => window.innerWidth > 768 && close());
    document.addEventListener('click', e => {
      if (open && !e.target.closest('.header__nav, .header__menu-toggle')) close();
    });

    return { close };
  })();

  /* ---------- SCROLL ANIMATIONS ---------- */
  const ScrollAnimations = (() => {
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(
          e =>
            e.isIntersecting &&
            e.target.classList.add('in-view') &&
            observer.unobserve(e.target)
        ),
      options
    );

    const init = () =>
      [
        '.stat-card',
        '.type-card',
        '.application-card',
        '.learning-card',
        '.timeline__item',
        '.business-stat'
      ]
        .join(',')
        .split(',')
        .forEach(sel =>
          $(sel, true).forEach(el => {
            el.classList.add('pre-view');
            observer.observe(el);
          })
        );

    document.addEventListener('DOMContentLoaded', init);
  })();

  /* ---------- ACCESSIBILITY: FOCUS TRAP ---------- */
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0],
      last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    });
  }

  /* ---------- LOG ---------- */
  console.log('NeuralHub загружен успешно 🚀');
})();
