/* Za.allyErrands — Lagos Noir JS */
(function () {
  'use strict';

  /* ── Cursor glow ── */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    })
  );

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ── Scroll-reveal ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ── Modal ── */
  const modal         = document.getElementById('quoteModal');
  const modalClose    = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  /* Quote widget (hero) triggers modal */
  const quoteForm  = document.getElementById('quoteForm');
  const quoteInput = document.getElementById('quoteInput');
  const qErrand    = document.getElementById('qErrand');

  quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    if (qErrand && quoteInput.value.trim()) {
      qErrand.value = quoteInput.value.trim();
    }
    openModal();
  });

  /* Full quote form (modal) */
  const fullForm      = document.getElementById('fullQuoteForm');
  const modalSuccess  = document.getElementById('modalSuccess');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function validatePhone(v) {
    return /^[\+\d][\d\s\-]{6,}$/.test(v.trim());
  }

  fullForm.addEventListener('submit', e => {
    e.preventDefault();
    const name     = fullForm.querySelector('#qName').value.trim();
    const phone    = fullForm.querySelector('#qPhone').value.trim();
    const location = fullForm.querySelector('#qLocation').value.trim();
    const errand   = fullForm.querySelector('#qErrand').value.trim();

    if (!name || !validatePhone(phone) || !location || errand.length < 5) {
      /* Simple shake on invalid */
      fullForm.style.animation = 'none';
      void fullForm.offsetHeight;
      fullForm.style.animation = 'shake 0.35s ease';
      return;
    }

    modalSubmitBtn.disabled = true;
    modalSubmitBtn.querySelector('.btn-text').textContent = 'Sending...';

    setTimeout(() => {
      fullForm.reset();
      modalSubmitBtn.disabled = false;
      modalSubmitBtn.querySelector('.btn-text').textContent = 'Send Request →';
      modalSuccess.classList.add('visible');
      setTimeout(() => {
        modalSuccess.classList.remove('visible');
        closeModal();
      }, 4000);
    }, 1400);
  });

  /* ── Progress bar animation in mockup ── */
  /* Already driven by CSS animation */

  /* ── Ticker pause on hover ── */
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    ticker.parentElement.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.parentElement.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

})();

/* Shake keyframe injected */
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
})();
