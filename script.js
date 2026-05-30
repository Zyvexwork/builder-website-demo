/* ═══════════════════════════════════════════════════════════
   ARCVAULT — Ultra Premium Builder & Real Estate
   script.js — Phase 1: Core Interactions
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   DOM READY
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initMobileNav();
  initHero3D();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initActiveNavLinks();
});

/* ─────────────────────────────────────────────
   LOADER
───────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after animations complete
  const minDuration = 2800;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDuration - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');

      // Enable body scroll after loader
      document.body.style.overflow = '';

      // Dispatch event for other modules
      document.dispatchEvent(new CustomEvent('loaderDone'));
    }, remaining);
  });

  // Fallback if load event is slow
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    document.dispatchEvent(new CustomEvent('loaderDone'));
  }, 5000);

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail using RAF
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    rafId = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, [data-hover]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
  });
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  function handleScroll() {
    const currentScroll = window.scrollY;

    // Add scrolled class
    if (currentScroll > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up (for mobile feel)
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Add transition for hide/show
  navbar.style.transition = `
    background 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
  `;
}

/* ─────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────── */
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) closeNav();
    else openNav();
  });

  // Close on overlay click
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ─────────────────────────────────────────────
   HERO 3D INTERACTIONS
───────────────────────────────────────────── */
function initHero3D() {
  const heroCard    = document.getElementById('heroCard');
  const heroContent = document.getElementById('heroContent');
  const hero        = document.querySelector('.hero');

  if (!hero) return;

  let isMouseTracking = false;
  let bounds;

  // Start tracking after loader is done
  document.addEventListener('loaderDone', () => {
    isMouseTracking = true;
    bounds = hero.getBoundingClientRect();
  });

  hero.addEventListener('mousemove', (e) => {
    if (!isMouseTracking) return;

    bounds = hero.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotX = ((mouseY - centerY) / centerY) * -8;
    const rotY = ((mouseX - centerX) / centerX) * 8;

    // 3D tilt on the floating card
    if (heroCard) {
      const cardInner = heroCard.querySelector('.hero__card-inner');
      if (cardInner) {
        const cardRotX = ((mouseY - centerY) / centerY) * -6;
        const cardRotY = ((mouseX - centerX) / centerX) * 10;
        cardInner.style.transform = `rotateX(${cardRotX}deg) rotateY(${cardRotY}deg)`;
      }
    }

    // Subtle parallax on shapes
    const shapes = document.querySelectorAll('.hero__shape');
    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 0.4;
      const moveX = ((mouseX - centerX) / centerX) * depth * 10;
      const moveY = ((mouseY - centerY) / centerY) * depth * 10;
      shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotX * 0.5}deg)`;
    });

    // Parallax on orbs
    const orbs = document.querySelectorAll('.hero__orb');
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.3;
      const moveX = ((mouseX - centerX) / centerX) * depth * 15;
      const moveY = ((mouseY - centerY) / centerY) * depth * 15;
      orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    if (heroCard) {
      const cardInner = heroCard.querySelector('.hero__card-inner');
      if (cardInner) {
        cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    }

    document.querySelectorAll('.hero__shape, .hero__orb').forEach(el => {
      el.style.transform = '';
    });
  });

  // Card hover 3D effect (when mouse directly over card)
  if (heroCard) {
    const cardInner = heroCard.querySelector('.hero__card-inner');
    if (cardInner) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -12;
        const rotY = ((x - centerX) / centerX) * 14;
        cardInner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });

      heroCard.addEventListener('mouseleave', () => {
        cardInner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }
  }
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
        let delay = 0;
        if (siblings) {
          siblings.forEach((el, index) => {
            if (el === entry.target) delay = index * 0.1;
          });
        }
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   BACK TO TOP
───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   ACTIVE NAV LINKS ON SCROLL
───────────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${document.getElementById('navbar')?.offsetHeight || 80}px 0px 0px 0px`
  });

  sections.forEach(section => observer.observe(section));
}

/* ─────────────────────────────────────────────
   BUTTON RIPPLE EFFECT
───────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  // Create ripple
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    transform: scale(0);
    animation: rippleAnim 0.6s linear;
    pointer-events: none;
    width: 100px; height: 100px;
    left: ${e.clientX - btn.getBoundingClientRect().left - 50}px;
    top: ${e.clientY - btn.getBoundingClientRect().top - 50}px;
  `;

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation to document
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(4); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ─────────────────────────────────────────────
   RESIZE HANDLER
───────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Re-init observer bounds etc.
    document.dispatchEvent(new CustomEvent('windowResized'));
  }, 250);
});

/* ═══════════════════════════════════════════════════════════
   PHASE 2 — ABOUT & SERVICES INTERACTIONS
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initServiceCardTilt();
});

/* ─────────────────────────────────────────────
   ANIMATED COUNTERS
───────────────────────────────────────────── */
function initCounters() {
  const stats = document.querySelectorAll('.about__stat[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el        = entry.target;
      const target    = parseInt(el.dataset.count, 10);
      const suffix    = el.dataset.suffix || '';
      const numEl     = el.querySelector('[data-counter]');
      if (!numEl) return;

      observer.unobserve(el);
      animateCounter(numEl, target, suffix);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

function animateCounter(el, target, suffix) {
  const duration = 2000;
  const startTime = performance.now();

  // Easing: ease-out cubic
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOut(progress) * target);
    el.textContent = value + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────────
   SERVICE CARD 3D TILT
───────────────────────────────────────────── */
function initServiceCardTilt() {
  const cards = document.querySelectorAll('.service-card[data-tilt]');
  if (!cards.length) return;

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -6;
      const rotY = ((x - centerX) / centerX) * 8;

      card.style.transform = `
        perspective(800px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(8px)
        scale(1.01)
      `;

      // Move glow to follow mouse
      const glow = card.querySelector('.service-card__glow');
      if (glow) {
        glow.style.left  = (x - 100) + 'px';
        glow.style.top   = (y - 100) + 'px';
        glow.style.right = 'auto';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      // Reset glow
      const glow = card.querySelector('.service-card__glow');
      if (glow) {
        glow.style.left  = 'auto';
        glow.style.right = '-60px';
        glow.style.top   = '-60px';
      }

      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s, background 0.3s';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PHASE 3 — PROJECTS & SHOWCASE INTERACTIONS
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initProjectCard3D();
  initShowcaseParallax();
});

/* ─────────────────────────────────────────────
   PROJECT FILTER TABS
───────────────────────────────────────────── */
function initProjectFilters() {
  const filters  = document.querySelectorAll('.projects__filter');
  const cards    = document.querySelectorAll('.project-card[data-category]');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('filtered-out');
          card.classList.add('filtered-in');
          card.style.transitionDelay = `${i * 0.05}s`;
        } else {
          card.classList.add('filtered-out');
          card.classList.remove('filtered-in');
          card.style.transitionDelay = '0s';
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────
   PROJECT CARD 3D DEPTH HOVER
───────────────────────────────────────────── */
function initProjectCard3D() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const cx      = rect.width  / 2;
      const cy      = rect.height / 2;
      const rotX    = ((y - cy) / cy) * -4;
      const rotY    = ((x - cx) / cx) *  5;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(4px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease-out';
    });
  });
}

/* ─────────────────────────────────────────────
   SHOWCASE PARALLAX ON SCROLL
───────────────────────────────────────────── */
function initShowcaseParallax() {
  const items = document.querySelectorAll('.showcase__item');
  if (!items.length) return;

  function onScroll() {
    items.forEach(item => {
      const rect   = item.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const offset = (rect.top + rect.height / 2 - center) / center;
      const bg     = item.querySelector('.showcase__item-bg');
      const bldg   = item.querySelector('.showcase__building');

      if (bg) {
        bg.style.transform = `translateY(${offset * 20}px) scale(1.06)`;
      }
      if (bldg && !item.matches(':hover')) {
        bldg.style.transform = `translateX(-50%) translateY(${offset * 12}px)`;
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════
   PHASE 4 — WHY · PROCESS · TEAM INTERACTIONS
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initWhyCounter();
  initProcessTimeline();
  initTeamCardTilt();
  initWhyCardTilt();
});

/* ─────────────────────────────────────────────
   WHY SECTION — BIG COUNTER + BAR
───────────────────────────────────────────── */
function initWhyCounter() {
  const bigStat  = document.querySelector('.why__big-stat');
  const bigNum   = document.querySelector('.why__big-num');
  if (!bigStat || !bigNum) return;

  const target = parseInt(bigStat.dataset?.count || bigNum.dataset?.count || '98', 10);
  const suffix  = '%';
  let animated  = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        bigStat.classList.add('animated');
        animateCounter(bigNum, target, suffix);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(bigStat);
}

/* ─────────────────────────────────────────────
   PROCESS TIMELINE — scroll-triggered line fill
───────────────────────────────────────────── */
function initProcessTimeline() {
  const lineFill = document.getElementById('processLineFill');
  const steps    = document.querySelectorAll('.process__step');
  if (!steps.length) return;

  // Animate line fill when section enters view
  if (lineFill) {
    const lineObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lineFill.style.width = '100%';
          lineObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    lineObserver.observe(lineFill.closest('.process__track') || document.querySelector('.process'));
  }

  // Stagger step reveals
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step  = entry.target;
        const idx   = parseInt(step.dataset.step || '1', 10) - 1;
        setTimeout(() => {
          step.classList.add('visible');
        }, idx * 160);
        stepObserver.unobserve(step);
      }
    });
  }, { threshold: 0.2 });

  steps.forEach(step => stepObserver.observe(step));
}

/* ─────────────────────────────────────────────
   TEAM CARD 3D TILT
───────────────────────────────────────────── */
function initTeamCardTilt() {
  const cards = document.querySelectorAll('.team-card[data-tilt]');
  if (!cards.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease-out, border-color 0.4s, box-shadow 0.4s';
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rX   = ((y - cy) / cy) * -7;
      const rY   = ((x - cx) / cx) * 9;

      card.style.transform = `
        perspective(900px)
        rotateX(${rX}deg)
        rotateY(${rY}deg)
        translateZ(10px)
        scale(1.02)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.4s, box-shadow 0.4s';
      card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
    });
  });
}

/* ─────────────────────────────────────────────
   WHY CARD TILT
───────────────────────────────────────────── */
function initWhyCardTilt() {
  const cards = document.querySelectorAll('.why-card[data-tilt]');
  if (!cards.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out, background 0.3s';
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rX   = (((e.clientY - rect.top)  / rect.height) - 0.5) * -5;
      const rY   = (((e.clientX - rect.left) / rect.width)  - 0.5) *  6;
      card.style.transform = `perspective(700px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s';
      card.style.transform  = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   PHASE 5 — TESTIMONIALS · FAQ · CONTACT
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
  initFAQ();
  initContactForm();
  initFloatingLabels();
});

/* ─────────────────────────────────────────────
   TESTIMONIALS SLIDER
───────────────────────────────────────────── */
function initTestimonialsSlider() {
  const track    = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  if (!track) return;

  const cards    = track.querySelectorAll('.testi-card');
  const total    = cards.length;
  let   current  = 0;
  let   autoTimer;
  let   isAnimating = false;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function goTo(idx) {
    if (isAnimating || idx === current) return;
    isAnimating = true;
    current = (idx + total) % total;

    /* Slide transform */
    track.style.transform = `translateX(-${current * 100}%)`;

    /* Update dots */
    dotsWrap?.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    setTimeout(() => { isAnimating = false; }, 700);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });

  /* Auto-slide every 5 s */
  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  startAuto();

  /* Pause on hover */
  track.closest('.testimonials__slider-wrap')?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.closest('.testimonials__slider-wrap')?.addEventListener('mouseleave', startAuto);

  /* Touch / swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    const body    = item.querySelector('.faq-item__body');
    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* Close all others */
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      /* Toggle this one */
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* Open first item by default */
  items[0]?.querySelector('.faq-item__trigger')?.click();
}

/* ─────────────────────────────────────────────
   CONTACT FORM SUBMIT
───────────────────────────────────────────── */
function initContactForm() {
  const submitBtn = document.getElementById('contactSubmit');
  const successEl = document.getElementById('contactSuccess');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    /* Basic validation */
    const email = document.getElementById('email');
    const fname = document.getElementById('fname');
    if (!fname?.value.trim() || !email?.value.trim()) {
      /* Shake animation on empty fields */
      [fname, email].forEach(el => {
        if (el && !el.value.trim()) {
          el.closest('.form-field')?.classList.add('shake');
          setTimeout(() => el.closest('.form-field')?.classList.remove('shake'), 500);
        }
      });
      return;
    }

    /* Show loading state */
    const span = submitBtn.querySelector('span');
    const svg  = submitBtn.querySelector('svg');
    if (span) span.textContent = 'Sending…';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    /* Simulate API call */
    setTimeout(() => {
      if (span) span.textContent = 'Message Sent!';
      submitBtn.style.opacity = '1';
      if (successEl) {
        successEl.classList.add('show');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      /* Reset form fields */
      document.querySelectorAll('.form-input').forEach(input => { input.value = ''; });
    }, 1400);
  });
}

/* ─────────────────────────────────────────────
   FLOATING LABEL FIXES FOR SELECT
───────────────────────────────────────────── */
function initFloatingLabels() {
  /* Select elements need manual float trigger */
  document.querySelectorAll('.form-select').forEach(select => {
    select.addEventListener('change', () => {
      if (select.value) {
        select.classList.add('has-value');
      } else {
        select.classList.remove('has-value');
      }
    });
  });
}

/* Add shake keyframe */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0) }
    20%    { transform:translateX(-6px) }
    40%    { transform:translateX(6px) }
    60%    { transform:translateX(-4px) }
    80%    { transform:translateX(4px) }
  }
  .form-field.shake { animation: shake 0.45s var(--ease-in-out); }
  .form-select.has-value ~ .form-label,
  .form-select:focus   ~ .form-label {
    top: 0.4rem !important;
    font-size: 0.68rem !important;
    color: var(--clr-gold) !important;
  }
`;
document.head.appendChild(shakeStyle);

/* ═══════════════════════════════════════════════════════════
   PHASE 6 — FOOTER · PARTICLES · FINAL POLISH
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initParticles();
  initNewsletter();
  initSectionDividers();
  initGlobalHoverCursor();
  initParallaxShapes();
});

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / maxScroll) * 100) + '%';
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], rafId;

  const COUNT   = window.innerWidth < 768 ? 30 : 60;
  const GOLD    = 'rgba(201,168,76,';
  const WHITE   = 'rgba(255,255,255,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = -(Math.random() * 0.4 + 0.1);
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.gold = Math.random() > 0.6;
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 1;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const t   = this.life / this.maxLife;
      const a   = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      const clr = this.gold ? GOLD : WHITE;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = clr + (a * 0.35) + ')';
      ctx.fill();
    }
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(loop);
  }

  loop();

  window.addEventListener('resize', () => {
    resize();
    cancelAnimationFrame(rafId);
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    loop();
  }, { passive: true });

  /* Pause when tab is hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else loop();
  });
}

/* ─────────────────────────────────────────────
   NEWSLETTER FORM
───────────────────────────────────────────── */
function initNewsletter() {
  const btn   = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterInput');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.style.border = '1px solid rgba(255,80,80,0.4)';
      input.focus();
      setTimeout(() => { input.style.border = ''; }, 1500);
      return;
    }

    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.background = 'linear-gradient(135deg,#4caf50,#2e7d32)';
    input.value       = 'Thank you for subscribing!';
    input.disabled    = true;
    input.style.color = 'rgba(255,255,255,0.5)';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
}

/* ─────────────────────────────────────────────
   INSERT SECTION DIVIDERS
───────────────────────────────────────────── */
function initSectionDividers() {
  const sections = [
    document.querySelector('.about'),
    document.querySelector('.services'),
    document.querySelector('.projects'),
    document.querySelector('.showcase'),
    document.querySelector('.why'),
    document.querySelector('.process'),
    document.querySelector('.team'),
    document.querySelector('.testimonials'),
    document.querySelector('.faq'),
    document.querySelector('.contact'),
  ].filter(Boolean);

  sections.forEach(sec => {
    const div = document.createElement('div');
    div.className = 'section-divider';
    sec.parentNode.insertBefore(div, sec);
  });
}

/* ─────────────────────────────────────────────
   GLOBAL HOVER CURSOR — update for new elements
───────────────────────────────────────────── */
function initGlobalHoverCursor() {
  /* Re-attach to all interactive elements added in later phases */
  const addHover = (root) => {
    root.querySelectorAll('a, button, [data-tilt], .faq-item__trigger, .testi-dot').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };
  addHover(document);
}

/* ─────────────────────────────────────────────
   PARALLAX HERO SHAPES ON SCROLL
───────────────────────────────────────────── */
function initParallaxShapes() {
  const shapes = document.querySelectorAll('.hero__shape');
  const orbs   = document.querySelectorAll('.hero__orb');
  if (!shapes.length) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    shapes.forEach((s, i) => {
      s.style.transform = `translateY(${y * (0.08 + i * 0.03)}px)`;
    });
    orbs.forEach((o, i) => {
      o.style.transform = `translateY(${y * (0.05 + i * 0.04)}px)`;
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   FINAL: Ensure reveal observer catches late DOM
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  /* Re-run reveal on all .reveal that aren't yet visible */
  const remaining = document.querySelectorAll('.reveal:not(.visible)');
  if (!remaining.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  remaining.forEach(el => obs.observe(el));
});
