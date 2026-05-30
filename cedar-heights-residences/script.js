const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuBtn = document.querySelector('[data-menu-btn]');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  });
});

const revealItems = document.querySelectorAll('.reveal');
if (!prefersReduced && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('show'));
}

const countEls = document.querySelectorAll('[data-count]');
if (countEls.length) {
  const animateCount = (el) => {
    const max = Number(el.dataset.count || 0);
    if (!max) return;
    const hasPlus = max >= 24;
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.round(max * (1 - Math.pow(1 - p, 3)));
      el.textContent = `${val}${hasPlus ? '+' : ''}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });
    countEls.forEach((el) => counterObserver.observe(el));
  } else {
    countEls.forEach((el) => { el.textContent = `${el.dataset.count}+`; });
  }
}

const parallaxMedia = document.querySelector('[data-parallax] img');
if (parallaxMedia && !prefersReduced && window.innerWidth > 900) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.04;
    parallaxMedia.style.transform = `scale(1.05) translateY(${Math.min(y, 24)}px)`;
  }, { passive: true });
}
