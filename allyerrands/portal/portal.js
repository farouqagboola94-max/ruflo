/* Za.allyErrands — Client Portal
   Real-time errand tracking via Supabase.

   HOW IT WORKS:
   1. User enters their phone number.
   2. We set a Postgres config var (app.client_phone) and
      query only rows matching that phone (enforced by RLS).
   3. We subscribe to realtime changes — status updates
      appear instantly without a page refresh.
*/

(function () {
  'use strict';

  // ── CONFIG ── Replace with your real values.
  const SUPABASE_URL      = window.ZA_SUPABASE_URL  || 'https://YOUR_PROJECT_ID.supabase.co';
  const SUPABASE_ANON_KEY = window.ZA_ANON_KEY      || 'YOUR_SUPABASE_ANON_KEY';

  const { createClient } = window.supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ── DOM refs ──
  const loginScreen  = document.getElementById('loginScreen');
  const dashboard    = document.getElementById('dashboard');
  const loginForm    = document.getElementById('loginForm');
  const loginBtn     = document.getElementById('loginBtn');
  const loginPhone   = document.getElementById('loginPhone');
  const dashGreeting = document.getElementById('dashGreeting');
  const dashPhone    = document.getElementById('dashPhone');
  const activeRuns   = document.getElementById('activeRuns');
  const completedRuns = document.getElementById('completedRuns');
  const activeEmpty  = document.getElementById('activeEmpty');
  const completedEmpty = document.getElementById('completedEmpty');
  const logoutBtn    = document.getElementById('logoutBtn');
  const toast        = createToast();

  let currentPhone = '';
  let realtimeSub  = null;

  // ── Restore session ──
  const savedPhone = sessionStorage.getItem('za_phone');
  if (savedPhone) startSession(savedPhone);

  // ── Login ──
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const phone = loginPhone.value.trim();
    if (!phone || phone.length < 7) {
      loginPhone.style.borderColor = '#ef4444';
      return;
    }
    loginPhone.style.borderColor = '';
    loginBtn.querySelector('.btn-text').textContent = 'Loading...';
    loginBtn.disabled = true;
    await startSession(phone);
    loginBtn.querySelector('.btn-text').textContent = 'Access My Runs →';
    loginBtn.disabled = false;
  });

  logoutBtn.addEventListener('click', endSession);

  // ── Core session logic ──
  async function startSession(phone) {
    currentPhone = normalizePhone(phone);
    sessionStorage.setItem('za_phone', currentPhone);

    const requests = await fetchRequests(currentPhone);

    loginScreen.hidden = true;
    dashboard.hidden   = false;
    dashGreeting.textContent = 'Your Runs';
    dashPhone.textContent    = currentPhone;

    renderAll(requests);
    subscribeRealtime(currentPhone);
  }

  function endSession() {
    if (realtimeSub) db.removeChannel(realtimeSub);
    sessionStorage.removeItem('za_phone');
    currentPhone = '';
    loginScreen.hidden = false;
    dashboard.hidden   = true;
    loginPhone.value   = '';
  }

  // ── Fetch from Supabase ──
  async function fetchRequests(phone) {
    const { data, error } = await db
      .from('errand_requests')
      .select('id, created_at, item_description, pickup_address, dropoff_address, status, estimated_mins')
      .eq('client_phone', phone)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) { showToast('Could not load runs: ' + error.message); return []; }
    return data || [];
  }

  // ── Realtime subscription ──
  function subscribeRealtime(phone) {
    if (realtimeSub) db.removeChannel(realtimeSub);

    realtimeSub = db
      .channel('errand_updates')
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'errand_requests',
          filter: `client_phone=eq.${phone}`,
        },
        async () => {
          // Re-fetch on any change to keep list accurate
          const requests = await fetchRequests(phone);
          renderAll(requests);
        }
      )
      .subscribe();
  }

  // ── Render ──
  function renderAll(requests) {
    const active    = requests.filter(r => ['Pending','Active','En Route'].includes(r.status));
    const completed = requests.filter(r => ['Completed','Cancelled'].includes(r.status));

    renderList(activeRuns,    active,    activeEmpty);
    renderList(completedRuns, completed, completedEmpty);
  }

  function renderList(container, items, emptyEl) {
    // Remove existing run cards (keep the empty placeholder)
    container.querySelectorAll('.run-card').forEach(c => c.remove());

    if (items.length === 0) {
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';

    items.forEach(r => {
      const card = document.createElement('div');
      card.className = 'run-card';
      card.innerHTML = `
        <div class="run-status" data-status="${esc(r.status)}">${esc(r.status)}</div>
        <div class="run-info">
          <strong>${esc(r.item_description)}</strong>
          <span>${esc(r.pickup_address)}${r.dropoff_address ? ' &rarr; ' + esc(r.dropoff_address) : ''}</span>
        </div>
        <div class="run-date">${formatDate(r.created_at)}</div>
      `;
      container.appendChild(card);
    });
  }

  // ── Helpers ──
  function normalizePhone(p) {
    return p.replace(/\s/g, '').replace(/^0/, '+234');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function createToast() {
    const el = document.createElement('div');
    el.className = 'p-toast';
    document.body.appendChild(el);
    return el;
  }

  function showToast(msg, duration = 4000) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

})();
