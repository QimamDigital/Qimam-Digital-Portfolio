/**
 * Noura Skin Clinic — script.js  v2.0
 * 3D Floating Object Luxury Style
 * Design by Qimam Digital
 *
 * Features:
 * - Custom glow cursor with hover state
 * - Hero 3D orb mouse-tracking (parallax tilt)
 * - 3D card tilt on mouse (perspective transform)
 * - Scroll-triggered IntersectionObserver reveals
 * - Header scroll behavior
 * - Mobile menu
 * - Smooth anchor scrolling
 * - Floating shape independent oscillation
 * - Active nav tracking
 * - No GSAP, no Three.js — pure CSS + lightweight JS
 */

'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function debounce(fn, delay = 80) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ── Reduced Motion ────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.innerWidth <= 768;
const isTouch = () => window.matchMedia('(hover: none)').matches;

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  if (isTouch()) return;

  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Ring follows with smooth lag
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover state
  const hoverTargets = 'a, button, [data-tilt], .treatment-card, .result-card, .testimonial-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   HEADER SCROLL BEHAVIOR
   ============================================================ */
(function initHeader() {
  const header = $('#site-header');
  if (!header) return;

  let ticking = false;

  function update() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const toggle  = $('#navToggle');
  const menu    = $('#mobileMenu');
  const mLinks  = $$('.mobile-link');
  if (!toggle || !menu) return;

  function open() {
    toggle.classList.add('open');
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => toggle.classList.contains('open') ? close() : open());
  mLinks.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
  window.addEventListener('resize', debounce(() => { if (window.innerWidth > 768) close(); }, 200));
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const els = $$('.reveal, .reveal-scale');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -64px 0px', threshold: 0.08 });

  els.forEach(el => io.observe(el));
})();

/* ============================================================
   HERO ENTRANCE ANIMATIONS
   ============================================================ */
(function initHeroEntrance() {
  const eyebrow = $('#heroEyebrow');
  const headline = $('.hero-headline');
  const divider = $('#heroDivider');
  const sub = $('#heroSub');
  const actions = $('#heroActions');

  // Stagger these into visible state
  function trigger(el, delay = 0) {
    if (!el) return;
    setTimeout(() => el.classList.add('visible'), delay);
  }

  trigger(eyebrow,  200);
  trigger(headline, 380);
  trigger(divider,  580);
  trigger(sub,      680);
  trigger(actions,  820);
})();

/* ============================================================
   HERO ORB — MOUSE PARALLAX
   ============================================================ */
(function initOrbParallax() {
  if (prefersReducedMotion || isMobile()) return;

  const orbWrap = $('#heroOrbWrap');
  if (!orbWrap) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId;
  let isActive = false;

  const heroSection = $('.hero');

  document.addEventListener('mousemove', (e) => {
    if (!isActive) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Normalize to -1 / +1
    const nx = (e.clientX / vw - 0.5) * 2;
    const ny = (e.clientY / vh - 0.5) * 2;

    targetX = nx * 14;   // max 14deg rotation
    targetY = -ny * 10;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;

    orbWrap.style.transform =
      `rotateY(${currentX}deg) rotateX(${currentY}deg)`;

    rafId = requestAnimationFrame(animate);
  }

  // Only run when hero is in view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isActive = true;
        if (!rafId) animate();
      } else {
        isActive = false;
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, { threshold: 0.1 });

  if (heroSection) io.observe(heroSection);
})();

/* ============================================================
   3D CARD TILT
   ============================================================ */
(function initCardTilt() {
  if (prefersReducedMotion || isMobile()) return;

  const cards = $$('[data-tilt]');
  if (!cards.length) return;

  const TILT_MAX = 7;  // max degrees
  const GLARE    = true;

  cards.forEach(card => {
    let glareEl;

    if (GLARE) {
      glareEl = document.createElement('div');
      glareEl.style.cssText = `
        position: absolute; inset: 0; border-radius: inherit;
        pointer-events: none; z-index: 10; opacity: 0;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18) 0%, transparent 70%);
        transition: opacity 0.4s ease;
      `;
      card.style.position = 'relative';
      card.appendChild(glareEl);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotX = -y * TILT_MAX;
      const rotY =  x * TILT_MAX;

      card.style.transform =
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      card.style.transition = 'transform 0.1s ease';

      if (glareEl) {
        const gx = (x + 0.5) * 100;
        const gy = (y + 0.5) * 100;
        glareEl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 65%)`;
        glareEl.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease';

      if (glareEl) {
        glareEl.style.opacity = '0';
      }
    });
  });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const headerH = $('#site-header')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   ACTIVE NAV TRACKING
   ============================================================ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-links a');
  if (!sections.length || !links.length) return;

  function update() {
    const y = window.scrollY + 120;
    let current = '';

    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });

    links.forEach(link => {
      const href = link.getAttribute('href');
      link.removeAttribute('aria-current');
      if (href === `#${current}`) link.setAttribute('aria-current', 'page');
    });
  }

  window.addEventListener('scroll', debounce(update, 60), { passive: true });
  update();
})();

/* ============================================================
   FLOATING ELEMENTS — Independent Wave Motion
   ============================================================ */
(function initFloaters() {
  if (prefersReducedMotion) return;

  // Independently animate particles (in addition to CSS animation — for mouse response)
  const particles = $$('.hero-particle');

  let rafId;
  let t = 0;

  const heroSection = $('.hero');
  let heroVisible = false;

  const io = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !rafId) tick();
    else if (!heroVisible && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0.05 });

  if (heroSection) io.observe(heroSection);

  function tick() {
    t += 0.008;

    particles.forEach((p, i) => {
      const x = Math.sin(t + i * 1.4) * 8;
      const y = Math.cos(t + i * 1.1) * 10;
      p.style.transform = `translate(${x}px, ${y}px)`;
    });

    rafId = requestAnimationFrame(tick);
  }
})();

/* ============================================================
   SECTION SCROLL PARALLAX
   ============================================================ */
(function initParallax() {
  if (prefersReducedMotion || isMobile()) return;

  const layers = [
    { selector: '.about::before', speed: 0.15 },
    { selector: '.treatments::after', speed: -0.12 },
    { selector: '.specialist::after', speed: 0.1 },
  ];

  // Simpler approach: parallax on section background halos via CSS var
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;

    // Orb scene gentle vertical parallax
    const orbScene = $('#heroOrb');
    if (orbScene) {
      const shift = scrollY * 0.18;
      orbScene.style.transform = `translateY(${shift}px) translateY(-50%)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ============================================================
   LAZY IMAGE FADE-IN
   ============================================================ */
(function initLazyImages() {
  const imgs = $$('img[loading="lazy"]');
  imgs.forEach(img => {
    img.style.transition = 'opacity 0.6s ease';
    img.style.opacity = img.complete ? '1' : '0';

    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => {
      img.style.opacity = '0.2';
      img.alt += ' (unavailable)';
    });
  });
})();

/* ============================================================
   FOOTER STAGGER
   ============================================================ */
(function initFooter() {
  const footer = $('.site-footer');
  if (!footer) return;

  const cols = $$('.footer-brand, .footer-col', footer);

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cols.forEach((col, i) => {
        col.style.opacity = '0';
        col.style.transform = 'translateY(22px)';
        col.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`;
        requestAnimationFrame(() => {
          col.style.opacity = '1';
          col.style.transform = 'translateY(0)';
        });
      });
      io.disconnect();
    }
  }, { threshold: 0.2 });

  io.observe(footer);
})();

/* ============================================================
   INIT LOG
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c✦ Noura Skin Clinic', 'font-family:Georgia,serif; font-size:22px; color:#7D9A8A; font-style:italic;');
  console.log('%c3D Luxury Style · Portfolio prototype by Qimam Digital', 'color:#C8A96A; font-size:11px; letter-spacing:2px;');
});
