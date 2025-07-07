/* app.js – optimized */
(() => {
  createChat({
  webhookUrl: 'https://cotbaun.app.n8n.cloud/webhook/39e0bc07-cc3a-4807-bedd-310f1a5d3fab/chat',
});
  /* ---------- DOM КЭШ ---------- */
  const $ = (sel, all = false) =>
    all ? document.querySelectorAll(sel) : document.querySelector(sel);

  const DOM = {

    menuToggle:   $('.header__menu-toggle'),
    nav:          $('.header__nav'),
    navLinks:     $('.nav__link', true),
    heroCTA:      $('.hero__cta'),
    header:       $('.header')
  };

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
