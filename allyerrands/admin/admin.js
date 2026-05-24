/* Za.allyErrands — Admin Node
   Requires: Supabase service_role key (set ZA_SERVICE_KEY above).
   Keep this page private — do NOT link it from the public site.
   Access it directly: yourdomain.com/admin/
*/

(function () {
  'use strict';

  // ── CONFIG ──
  const ADMIN_PIN       = 'za2026'; // CHANGE THIS before deploying
  const SUPABASE_URL    = window.ZA_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
  const SUPABASE_KEY    = window.ZA_SERVICE_KEY  || 'YOUR_SUPABASE_ANON_KEY';

  // ── State ──
  let db, realtimeSub, allRunners = [], currentView = 'queue';

  // ── DOM ──
  const pinGate    = document.getElementById('pinGate');
  const adminDash  = document.getElementById('adminDash');
  const pinForm    = document.getElementById('pinForm');
  const pinInput   = document.getElementById('pinInput');
  const toast      = mkToast();

  // ── PIN Gate ──
  const savedAuth = sessionStorage.getItem('za_admin_auth');
  if (savedAuth === 'ok') bootAdmin();

  pinForm.addEventListener('submit', e => {
    e.preventDefault();
    if (pinInput.value === ADMIN_PIN) {
      sessionStorage.setItem('za_admin_auth', 'ok');
      bootAdmin();
    } else {
      pinInput.classList.add('error');
      pinInput.value = '';
      setTimeout(() => pinInput.classList.remove('error'), 500);
    }
  });

  document.getElementById('adminLogout').addEventListener('click', () => {
    sessionStorage.removeItem('za_admin_auth');
    if (realtimeSub) db.removeChannel(realtimeSub);
    adminDash.hidden = true;
    pinGate.style.display = 'flex';
    pinInput.value = '';
  });

  // ── Boot ──
  function bootAdmin() {
    pinGate.style.display = 'none';
    adminDash.hidden = false;

    const { createClient } = window.supabase;
    db = createClient(SUPABASE_URL, SUPABASE_KEY);

    document.getElementById('sidebarStatus').textContent = 'Connected';

    loadRunners();
    loadQueue();
    loadAll();
    loadStats();
    subscribeRealtime();
    setupNav();
    setupRunnerForm();
    setupFilterStatus();
  }

  // ── Nav ──
  function setupNav() {
    document.querySelectorAll('.sidebar__link[data-view]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const view = link.dataset.view;
        switchView(view);
        document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
        link.classList.add('sidebar__link--active');
      });
    });
  }

  function switchView(name) {
    currentView = name;
    ['queue','all','runners','stats'].forEach(v => {
      const el = document.getElementById('view' + cap(v));
      if (el) el.hidden = (v !== name);
    });
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ── Realtime subscription ──
  function subscribeRealtime() {
    realtimeSub = db
      .channel('admin_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'errand_requests' }, () => {
        loadQueue();
        loadAll();
        loadStats();
      })
      .subscribe();
  }

  // ── Load Queue (Pending + Active) ──
  async function loadQueue() {
    const { data, error } = await db
      .from('errand_requests')
      .select('*, runners(name)')
      .in('status', ['Pending', 'Active', 'En Route'])
      .order('created_at', { ascending: true });
    if (error) return showToast('Queue load error: ' + error.message, 'err');
    renderList('queueList', data);
  }

  // ── Load All ──
  async function loadAll(filterStatus = '') {
    let query = db
      .from('errand_requests')
      .select('*, runners(name)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (filterStatus) query = query.eq('status', filterStatus);
    const { data, error } = await query;
    if (error) return showToast('Load error: ' + error.message, 'err');
    renderList('allList', data);
  }

  // ── Stats ──
  async function loadStats() {
    const { data, error } = await db
      .from('errand_requests')
      .select('status, created_at');
    if (error) return;

    const today = new Date().toDateString();
    const pending   = data.filter(r => r.status === 'Pending').length;
    const active    = data.filter(r => ['Active','En Route'].includes(r.status)).length;
    const doneToday = data.filter(r => r.status === 'Completed' && new Date(r.created_at).toDateString() === today).length;
    const total     = data.length;

    document.getElementById('statPending').textContent = pending;
    document.getElementById('statActive').textContent  = active;
    document.getElementById('statDone').textContent    = doneToday;
    document.getElementById('statTotal').textContent   = total;

    // Stats view breakdown
    const completed  = data.filter(r => r.status === 'Completed').length;
    const cancelled  = data.filter(r => r.status === 'Cancelled').length;
    const statsGrid  = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';
    [
      { label: 'Total Requests',  num: total },
      { label: 'Completed',       num: completed },
      { label: 'Active Now',      num: active },
      { label: 'Pending',         num: pending },
      { label: 'Cancelled',       num: cancelled },
      { label: 'Done Today',      num: doneToday },
    ].forEach(({ label, num }) => {
      const b = document.createElement('div');
      b.className = 'stat-block';
      b.innerHTML = `<div class="stat-block__num">${num}</div><div class="stat-block__label">${label}</div>`;
      statsGrid.appendChild(b);
    });
  }

  // ── Render request list ──
  function renderList(containerId, requests) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!requests || requests.length === 0) {
      container.innerHTML = '<div class="empty-state">No requests found.</div>';
      return;
    }
    requests.forEach(r => container.appendChild(buildCard(r)));
  }

  function buildCard(r) {
    const card = document.createElement('div');
    card.className = 'req-card';
    card.dataset.id = r.id;

    const runnerOptions = allRunners
      .map(runner => `<option value="${esc(runner.id)}" ${r.runner_id === runner.id ? 'selected' : ''}>${esc(runner.name)}</option>`)
      .join('');

    card.innerHTML = `
      <div class="req-card__status">
        <div class="status-badge" data-s="${esc(r.status)}">${esc(r.status)}</div>
      </div>
      <div class="req-card__body">
        <div class="req-card__name">${esc(r.client_name)} &mdash; ${esc(r.client_phone)}</div>
        <div class="req-card__desc">${esc(r.item_description)}</div>
        <div class="req-card__meta">
          <span><strong>Pickup:</strong> ${esc(r.pickup_address)}</span>
          ${r.dropoff_address ? `<span><strong>Drop-off:</strong> ${esc(r.dropoff_address)}</span>` : ''}
          ${r.runners ? `<span><strong>Runner:</strong> ${esc(r.runners.name)}</span>` : ''}
        </div>
      </div>
      <div class="req-card__actions">
        <select class="a-status-select" data-action="status">
          ${['Pending','Active','En Route','Completed','Cancelled']
            .map(s => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select class="a-runner-select" data-action="runner">
          <option value="">Assign runner...</option>
          ${runnerOptions}
        </select>
        <div class="req-card__time">${fmtDate(r.created_at)}</div>
      </div>
    `;

    card.querySelector('[data-action="status"]').addEventListener('change', async e => {
      await updateRequest(r.id, { status: e.target.value });
    });
    card.querySelector('[data-action="runner"]').addEventListener('change', async e => {
      const runnerId = e.target.value || null;
      await updateRequest(r.id, { runner_id: runnerId });
    });

    return card;
  }

  async function updateRequest(id, fields) {
    const { error } = await db.from('errand_requests').update(fields).eq('id', id);
    if (error) showToast('Update failed: ' + error.message, 'err');
    else       showToast('Updated', 'ok');
  }

  // ── Status filter ──
  function setupFilterStatus() {
    document.getElementById('filterStatus').addEventListener('change', e => {
      loadAll(e.target.value);
    });
  }

  // ── Runners ──
  async function loadRunners() {
    const { data, error } = await db.from('runners').select('*').order('name');
    if (error) return;
    allRunners = data || [];
    renderRunners(allRunners);
  }

  function renderRunners(runners) {
    const list = document.getElementById('runnerList');
    list.innerHTML = '';
    if (!runners.length) {
      list.innerHTML = '<div class="empty-state">No runners yet. Add one below.</div>';
      return;
    }
    runners.forEach(r => {
      const card = document.createElement('div');
      card.className = 'runner-card';
      card.innerHTML = `
        <div class="runner-card__info">
          <strong>${esc(r.name)}</strong>
          <span>${esc(r.phone)} &mdash; ${esc(r.zone || 'All zones')}</span>
        </div>
        <div class="runner-card__actions">
          <span class="runner-active" data-active="${r.is_active}">${r.is_active ? 'ACTIVE' : 'OFFLINE'}</span>
          <button class="btn btn--ghost btn--sm toggle-runner" data-id="${r.id}" data-active="${r.is_active}">
            ${r.is_active ? 'Set Offline' : 'Set Active'}
          </button>
        </div>
      `;
      card.querySelector('.toggle-runner').addEventListener('click', async btn => {
        const id    = btn.target.dataset.id;
        const isAct = btn.target.dataset.active === 'true';
        const { error } = await db.from('runners').update({ is_active: !isAct }).eq('id', id);
        if (!error) { loadRunners(); showToast('Runner updated', 'ok'); }
      });
      list.appendChild(card);
    });
  }

  function setupRunnerForm() {
    const addBtn     = document.getElementById('addRunnerBtn');
    const form       = document.getElementById('runnerForm');
    const saveBtn    = document.getElementById('saveRunner');
    const cancelBtn  = document.getElementById('cancelRunner');

    addBtn.addEventListener('click',    () => { form.hidden = false; addBtn.hidden = true; });
    cancelBtn.addEventListener('click', () => { form.hidden = true;  addBtn.hidden = false; });

    saveBtn.addEventListener('click', async () => {
      const name  = document.getElementById('rName').value.trim();
      const phone = document.getElementById('rPhone').value.trim();
      const zone  = document.getElementById('rZone').value.trim();
      if (!name || !phone) { showToast('Name and phone are required', 'err'); return; }

      const { error } = await db.from('runners').insert({ name, phone, zone: zone || null });
      if (error) { showToast('Failed: ' + error.message, 'err'); return; }

      document.getElementById('rName').value  = '';
      document.getElementById('rPhone').value = '';
      document.getElementById('rZone').value  = '';
      form.hidden = true;
      addBtn.hidden = false;
      loadRunners();
      showToast('Runner added', 'ok');
    });
  }

  // ── Helpers ──
  function fmtDate(iso) {
    return new Date(iso).toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  }

  function esc(str) {
    if (str === null || str === undefined) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }

  function mkToast() {
    const el = document.createElement('div');
    el.className = 'a-toast';
    document.body.appendChild(el);
    return el;
  }

  function showToast(msg, type = 'ok') {
    toast.textContent = msg;
    toast.className   = `a-toast a-toast--${type} show`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

})();
