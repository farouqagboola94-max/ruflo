/* Za.allyErrands — Lagos Noir JS
   Wired to: Supabase Edge Function > Make.com > WhatsApp
*/
(function () {
  'use strict';

  // ── CONFIG ──
  // Replace these with your real Supabase project values.
  // In production, bake them in via your build tool / Framer env vars.
  const CONFIG = {
    // Your Supabase Edge Function URL:
    // https://YOUR_PROJECT_ID.supabase.co/functions/v1/dispatch
    dispatchUrl: window.ZA_DISPATCH_URL || 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/dispatch',
    // Public anon key (safe to expose in frontend)
    anonKey:     window.ZA_ANON_KEY    || 'YOUR_SUPABASE_ANON_KEY',
  };

  // ── Cursor glow ──
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu ──
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

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // ── Scroll-reveal ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // ── Modal open/close ──
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

  // ── Hero quote widget ──
  const quoteForm  = document.getElementById('quoteForm');
  const quoteInput = document.getElementById('quoteInput');
  const qErrand    = document.getElementById('qErrand');

  quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    if (qErrand && quoteInput.value.trim()) qErrand.value = quoteInput.value.trim();
    openModal();
  });

  // ── Full quote form ──
  const fullForm       = document.getElementById('fullQuoteForm');
  const modalSuccess   = document.getElementById('modalSuccess');
  const modalSubmitBtn = document.getElementById('modalSubmitBtn');

  fullForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name     = fullForm.querySelector('#qName').value.trim();
    const phone    = fullForm.querySelector('#qPhone').value.trim();
    const location = fullForm.querySelector('#qLocation').value.trim();
    const errand   = fullForm.querySelector('#qErrand').value.trim();

    if (!name || !phone || !location || errand.length < 5) {
      shakeForm(fullForm);
      return;
    }

    setSubmitState('loading');

    try {
      const res = await fetch(CONFIG.dispatchUrl, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${CONFIG.anonKey}`,
        },
        body: JSON.stringify({ name, phone, errand, location }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Submission failed');

      // Success — store job ID for portal
      if (data.request_id) sessionStorage.setItem('za_last_request', data.request_id);
      sessionStorage.setItem('za_phone', phone);

      fullForm.reset();
      setSubmitState('idle');
      modalSuccess.classList.add('visible');

      setTimeout(() => {
        modalSuccess.classList.remove('visible');
        closeModal();
      }, 5000);

    } catch (err) {
      console.error('[dispatch]', err);
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  });

  function setSubmitState(state) {
    const btnText = modalSubmitBtn.querySelector('.btn-text');
    modalSubmitBtn.disabled = state === 'loading';
    if (state === 'loading') btnText.textContent = 'Dispatching...';
    else if (state === 'error') btnText.textContent = 'Error — Try Again';
    else btnText.textContent = 'Send Request →';
  }

  // ── Ticker pause on hover ──
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    ticker.parentElement.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.parentElement.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

})();

// Shake animation
(function () {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-6px); }
      80%      { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(s);
  window.shakeForm = (el) => {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = 'shake 0.35s ease';
  };
})();
