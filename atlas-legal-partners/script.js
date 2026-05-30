const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealEls.forEach((el) => revealObs.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const end = Number(node.getAttribute('data-count') || 0);
    let current = 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      current = Math.floor(end * (1 - Math.pow(1 - t, 3)));
      node.textContent = String(current) + '+';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    obs.unobserve(node);
  });
}, { threshold: 0.3 });

counters.forEach((node) => counterObs.observe(node));

const parallaxTarget = document.querySelector('[data-parallax]');
if (parallaxTarget && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    if (window.innerWidth < 900) return;
    const rect = parallaxTarget.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.04;
    parallaxTarget.style.transform = `translateY(${Math.max(-8, Math.min(14, offset - 8))}px)`;
  }, { passive: true });
}
