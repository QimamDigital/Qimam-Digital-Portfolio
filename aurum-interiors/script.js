const menuBtn = document.querySelector('[data-menu-btn]');
const menu = document.querySelector('[data-menu]');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => revealObserver.observe(item));

const heroParallax = document.querySelector('[data-parallax]');
if (heroParallax && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.12, 40);
    heroParallax.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}
