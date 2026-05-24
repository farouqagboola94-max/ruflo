/* Za.allyErrands — Lagos Noir JS
   Wired to: Supabase Edge Function > Make.com > WhatsApp
*/
(function () {
  'use strict';

  const CONFIG = {
    dispatchUrl: window.ZA_DISPATCH_URL || 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/dispatch',
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

  // ── Live activity feed ──
  const FEED_MESSAGES = [
    "🏍 Runner dispatched — Chioma's grocery run, Lekki Phase 1 · just now",
    "✅ Delivered — Emeka's pharmacy pickup, Victoria Island · 3 mins ago",
    "🏍 En route — Tunde's package drop, Ikeja GRA · 5 mins ago",
    "✅ Delivered — Adaeze's Shoprite run, Surulere · 8 mins ago",
    "🏍 Runner dispatched — Femi's restaurant pickup, Ikoyi · just now",
    "✅ Delivered — Kemi's dry cleaning, Lekki Phase 2 · 12 mins ago",
    "🏍 En route — Chukwu's pharmacy pickup, Yaba · 2 mins ago",
    "✅ Delivered — Sola's grocery run, Ajah · 15 mins ago",
    "🏍 Runner dispatched — Ngozi's errand, Oniru Estate · just now",
    "✅ Delivered — Dele's document pickup, VI · 6 mins ago",
    "🏍 En route — Bola's package, Lekki Expressway · 4 mins ago",
    "✅ Delivered — Tobi's Slot run, Ikeja · 18 mins ago",
  ];
  const feedText = document.getElementById('liveFeedText');
  if (feedText) {
    let feedIdx = 0;
    setInterval(() => {
      feedText.classList.add('fade');
      setTimeout(() => {
        feedIdx = (feedIdx + 1) % FEED_MESSAGES.length;
        feedText.textContent = FEED_MESSAGES[feedIdx];
        feedText.classList.remove('fade');
      }, 380);
    }, 4500);
  }

  // ── Animated counters ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    const duration = 1800;
    const start = performance.now();
    const startVal = Math.max(0, target - Math.round(target * 0.15));
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current >= 1000 ? current.toLocaleString() : current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-num[data-target]').forEach(el => counterObs.observe(el));

  // ── Share count ──
  const shareCountEl = document.getElementById('shareCount');
  if (shareCountEl) {
    const stored = parseInt(localStorage.getItem('za_share_count') || '0', 10);
    shareCountEl.textContent = (1247 + stored).toLocaleString();
  }

  // ── Copy link button ──
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const copyLinkText = document.getElementById('copyLinkText');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('https://za-allyerrands.netlify.app');
        copyLinkText.textContent = 'Copied! ✓';
        copyLinkBtn.style.borderColor = 'var(--green)';
        copyLinkBtn.style.color = 'var(--green)';
        setTimeout(() => {
          copyLinkText.textContent = 'Copy Link';
          copyLinkBtn.style.borderColor = '';
          copyLinkBtn.style.color = '';
        }, 2500);
      } catch {
        copyLinkText.textContent = 'Failed — try again';
      }
    });
  }

  // ── WhatsApp share — bump count ──
  const waBtn = document.getElementById('waShareBtn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const cur = parseInt(localStorage.getItem('za_share_count') || '0', 10);
      localStorage.setItem('za_share_count', cur + 1);
      if (shareCountEl) shareCountEl.textContent = (1247 + cur + 1).toLocaleString();
    });
  }

  // ── Mobile sticky CTA ──
  const mobileCta = document.getElementById('mobileCta');
  if (mobileCta) {
    let ctaVisible = false;
    const heroSection = document.getElementById('drop');
    const showCtaObs = new IntersectionObserver(([entry]) => {
      const shouldShow = !entry.isIntersecting;
      if (shouldShow !== ctaVisible) {
        ctaVisible = shouldShow;
        mobileCta.classList.toggle('visible', ctaVisible);
        mobileCta.setAttribute('aria-hidden', !ctaVisible);
      }
    }, { threshold: 0.1 });
    if (heroSection) showCtaObs.observe(heroSection);
  }

})();

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

// ── Promo banner countdown ──
(function () {
  const banner = document.getElementById('promoBanner');
  const timerEl = document.getElementById('promoTimer');
  const closeBtn = document.getElementById('promoBannerClose');
  if (!banner || !timerEl) return;

  if (sessionStorage.getItem('za_promo_dismissed')) {
    banner.classList.add('hidden');
    return;
  }

  const KEY = 'za_promo_expiry';
  const DURATION = 24 * 3600 * 1000;
  let expiry = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (!expiry || expiry < Date.now()) {
    expiry = Date.now() + DURATION;
    localStorage.setItem(KEY, expiry);
  }

  function tick() {
    const rem = Math.max(0, expiry - Date.now());
    if (rem === 0) { banner.classList.add('hidden'); return; }
    const h = String(Math.floor(rem / 3600000)).padStart(2, '0');
    const m = String(Math.floor((rem % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((rem % 60000) / 1000)).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);

  closeBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    sessionStorage.setItem('za_promo_dismissed', '1');
  });
})();

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Price estimator ──
(function () {
  const priceEl = document.getElementById('estPrice');
  const priceBox = document.getElementById('estPriceBox');
  if (!priceEl) return;

  let base = 1500;
  let mult = 1.0;

  function update() {
    const total = Math.round(base * mult / 100) * 100;
    priceEl.textContent = total.toLocaleString();
    priceBox.classList.add('pop');
    setTimeout(() => priceBox.classList.remove('pop'), 280);
  }

  function bindPills(groupId, prop) {
    document.getElementById(groupId)?.querySelectorAll('.est-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.getElementById(groupId).querySelectorAll('.est-pill')
          .forEach(p => p.classList.remove('est-pill--active'));
        pill.classList.add('est-pill--active');
        if (prop === 'base') base = parseInt(pill.dataset.base, 10);
        else mult = parseFloat(pill.dataset.mult);
        update();
      });
    });
  }

  bindPills('estType', 'base');
  bindPills('estZone', 'mult');
})();
