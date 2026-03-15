/* ============================================================
   Dentica - Ağız ve Diş Sağlığı Kliniği
   main.js — Interactions, Animations, Form Validation
   ============================================================ */

'use strict';

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── DOM Ready ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initTabs();
  initFaq();
  initForm();
  initScrollTop();
  initCountUp();
  initActiveNavLink();
  duplicateTestimonials();
  initTypewriter();
});

/* ── Sticky Header ───────────────────────────────────────────── */
function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ── Mobile Menu ─────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  $$('a', mobileNav).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on backdrop click
  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Scroll Reveal (IntersectionObserver) ────────────────────── */
function initScrollReveal() {
  const elements = $$('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── Tab Switcher (Treatments section) ───────────────────────── */
function initTabs() {
  const tabBtns = $$('.tab-btn');
  const tabPanels = $$('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = $(`#tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── FAQ Accordion ───────────────────────────────────────────── */
function initFaq() {
  $$('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.contains('open');

      // close all in same panel
      const panel = q.closest('.tab-panel') || q.closest('#treatments');
      if (panel) {
        $$('.faq-q', panel).forEach(other => {
          other.classList.remove('open');
          const a = other.nextElementSibling;
          if (a) a.classList.remove('open');
        });
      }

      if (!isOpen) {
        q.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });
}

/* ── Form Validation ─────────────────────────────────────────── */
function initForm() {
  const form = $('#appointmentForm');
  if (!form) return;

  const rules = {
    name:    { required: true, minLength: 3,  label: 'Ad Soyad' },
    phone:   { required: true, pattern: /^(\+90|0)?[0-9]{10}$/, label: 'Telefon' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'E-posta' },
    date:    { required: true, label: 'Tarih' },
    service: { required: true, label: 'Hizmet' },
    message: { required: false }
  };

  // Real-time validation on blur
  Object.keys(rules).forEach(fieldName => {
    const field = form.elements[fieldName];
    if (!field) return;
    field.addEventListener('blur', () => validateField(field, rules[fieldName]));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field, rules[fieldName]);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(fieldName => {
      const field = form.elements[fieldName];
      if (!field) return;
      if (!validateField(field, rules[fieldName])) valid = false;
    });

    if (!valid) {
      // scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    submitForm(form);
  });

  // Set min date for date input
  const dateInput = form.elements['date'];
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
}

function validateField(field, rule) {
  if (!rule) return true;
  const value = field.value.trim();
  let errorMsg = '';

  if (rule.required && !value) {
    errorMsg = `${rule.label || 'Bu alan'} zorunludur.`;
  } else if (value && rule.minLength && value.length < rule.minLength) {
    errorMsg = `En az ${rule.minLength} karakter giriniz.`;
  } else if (value && rule.pattern && !rule.pattern.test(value)) {
    if (field.name === 'phone') errorMsg = 'Geçerli bir telefon numarası giriniz. (Örn: 0532 xxx xx xx)';
    else if (field.name === 'email') errorMsg = 'Geçerli bir e-posta adresi giriniz.';
    else errorMsg = 'Geçersiz format.';
  }

  const errEl = document.getElementById(`${field.name}-error`);
  if (errorMsg) {
    field.classList.add('error');
    field.classList.remove('valid');
    if (errEl) { errEl.textContent = errorMsg; errEl.classList.add('show'); }
    return false;
  } else {
    field.classList.remove('error');
    if (value) field.classList.add('valid');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
    return true;
  }
}

function submitForm(form) {
  const btn = form.querySelector('[type="submit"]');
  const originalText = btn.innerHTML;

  // loading state
  btn.innerHTML = '<span style="display:inline-flex;gap:.5rem;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0"/></svg> Gönderiliyor...</span>';
  btn.disabled = true;

  // Add spin keyframes dynamically
  if (!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  // simulate async call
  setTimeout(() => {
    const formContent = form.querySelector('.form-fields');
    const successMsg = $('#formSuccess');

    if (formContent) formContent.style.display = 'none';
    if (successMsg) successMsg.classList.add('show');

    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1800);
}

/* ── Scroll To Top ───────────────────────────────────────────── */
function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Count Up Animation (Stats) ──────────────────────────────── */
function initCountUp() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Active Nav Link on Scroll ───────────────────────────────── */
function initActiveNavLink() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ── Duplicate Testimonials for infinite scroll ──────────────── */
function duplicateTestimonials() {
  const track = $('#testimonialsTrack');
  if (!track) return;

  // Clone all cards for seamless loop
  const cards = $$('.testimonial-card', track);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* ── Smooth scroll for anchor links ─────────────────────────── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();

  const headerHeight = $('#header')?.offsetHeight || 70;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

  window.scrollTo({ top, behavior: 'smooth' });
});

/* ── Typewriter — "Yeniden" ──────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('yeniden-type');
  if (!el) return;

  const word    = 'Yeniden';
  const typeMs  = 100;   // ms per character while typing
  const eraseMs = 60;    // ms per character while erasing
  const pauseAfterType  = 1800; // pause when fully written
  const pauseAfterErase = 400;  // pause when fully erased

  let pos = 0;
  let typing = true;

  function tick() {
    if (typing) {
      pos++;
      el.textContent = word.slice(0, pos);
      if (pos === word.length) {
        typing = false;
        setTimeout(tick, pauseAfterType);
      } else {
        setTimeout(tick, typeMs);
      }
    } else {
      pos--;
      el.textContent = word.slice(0, pos);
      if (pos === 0) {
        typing = true;
        setTimeout(tick, pauseAfterErase);
      } else {
        setTimeout(tick, eraseMs);
      }
    }
  }

  // Start after a short delay so page load feels natural
  setTimeout(tick, 600);
}
