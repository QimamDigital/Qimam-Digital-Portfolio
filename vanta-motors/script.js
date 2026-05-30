const revealItems = document.querySelectorAll('[data-reveal]');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const menuBtn = document.querySelector('[data-menu-btn]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuBtn && mobileNav) {
  const closeMenu = () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('is-open', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

const modelData = {
  eon: {
    title: 'Vanta Eon',
    best: 'Best for: daily executive driving',
    points: ['Range: 480 km', 'Elegant cabin architecture', 'Adaptive city-drive systems']
  },
  arc: {
    title: 'Vanta Arc',
    best: 'Best for: family and business use',
    points: ['Range: 520 km', 'Raised comfort and road presence', 'Flexible premium utility']
  },
  pulse: {
    title: 'Vanta Pulse',
    best: 'Best for: sport-focused drivers',
    points: ['Range: 430 km', 'Performance-tuned dynamics', 'Focused cockpit experience']
  }
};

const modelButtons = document.querySelectorAll('[data-model]');
const modelPanel = document.querySelector('[data-model-panel]');

modelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.model;
    const data = modelData[key];
    if (!data || !modelPanel) return;

    modelButtons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    modelPanel.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.best}</p>
      <ul>${data.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
  });
});

const countItems = document.querySelectorAll('[data-count]');
if (countItems.length && 'IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      let current = 0;
      const steps = 36;
      const increment = Math.max(1, Math.floor(target / steps));

      const tick = () => {
        current = Math.min(target, current + increment);
        el.textContent = `${current}+`;
        if (current < target) requestAnimationFrame(tick);
      };

      if (prefersReduced) {
        el.textContent = `${target}+`;
      } else {
        tick();
      }

      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  countItems.forEach((item) => countObserver.observe(item));
}

const layerCards = document.querySelectorAll('[data-layer]');
if (layerCards.length && 'IntersectionObserver' in window) {
  const layerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      layerCards.forEach((card) => card.classList.remove('is-active'));
      entry.target.classList.add('is-active');
    });
  }, { threshold: 0.65 });

  layerCards.forEach((card) => layerObserver.observe(card));
}
