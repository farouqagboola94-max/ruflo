/* Za.allyErrands — Runner Node
   Mobile dashboard for runners to accept and update jobs.
   Status changes here propagate through Supabase → DB trigger
   → status-notify Edge Function → WhatsApp to client.
   Zero manual messaging required.
*/
(function () {
  'use strict';

  const SUPABASE_URL = window.ZA_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
  const ANON_KEY     = window.ZA_ANON_KEY     || 'YOUR_SUPABASE_ANON_KEY';

  const { createClient } = window.supabase;
  const db = createClient(SUPABASE_URL, ANON_KEY);

  // DOM refs
  const loginScreen  = document.getElementById('loginScreen');
  const runnerDash   = document.getElementById('runnerDash');
  const loginForm    = document.getElementById('loginForm');
  const loginBtn     = document.getElementById('loginBtn');
  const phoneInput   = document.getElementById('runnerPhone');
  const runnerName   = document.getElementById('runnerName');
  const runnerZone   = document.getElementById('runnerZone');
  const runnerTag    = document.getElementById('runnerActiveStatus');
  const activeToggle = document.getElementById('activeToggle');
  const logoutBtn    = document.getElementById('logoutBtn');
  const jobList      = document.getElementById('jobList');
  const toast        = mkToast();

  let runnerRecord = null;
  let realtimeSub  = null;

  // Restore session
  const savedPhone = sessionStorage.getItem('za_runner_phone');
  if (savedPhone) startSession(savedPhone);

  // Login
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const phone = phoneInput.value.trim();
    if (!phone) { phoneInput.classList.add('error'); return; }
    phoneInput.classList.remove('error');
    loginBtn.querySelector('.btn-text').textContent = 'Checking...';
    loginBtn.disabled = true;
    const ok = await startSession(phone);
    if (!ok) {
      loginBtn.querySelector('.btn-text').textContent = 'Not Found — Try Again';
      loginBtn.disabled = false;
      phoneInput.classList.add('error');
      setTimeout(() => {
        loginBtn.querySelector('.btn-text').textContent = 'Access Jobs →';
        phoneInput.classList.remove('error');
      }, 2500);
    }
  });

  logoutBtn.addEventListener('click', endSession);

  // Active/offline toggle
  activeToggle.addEventListener('click', async () => {
    if (!runnerRecord) return;
    const next = !runnerRecord.is_active;
    const { error } = await db
      .from('runners')
      .update({ is_active: next })
      .eq('id', runnerRecord.id);
    if (!error) {
      runnerRecord.is_active = next;
      updateToggleUI(next);
      showToast(next ? 'You are now ACTIVE' : 'You are now OFFLINE', 'ok');
    }
  });

  // Core
  async function startSession(phone) {
    const normalized = normalizePhone(phone);
    const { data, error } = await db
      .from('runners')
      .select('*')
      .eq('phone', normalized)
      .maybeSingle();

    if (error || !data) {
      // Try with original format
      const { data: data2 } = await db
        .from('runners')
        .select('*')
        .ilike('phone', `%${phone.replace(/\s/g, '').slice(-8)}%`)
        .maybeSingle();
      if (!data2) return false;
      runnerRecord = data2;
    } else {
      runnerRecord = data;
    }

    sessionStorage.setItem('za_runner_phone', phone);

    loginScreen.hidden = true;
    runnerDash.hidden  = false;

    runnerName.textContent = runnerRecord.name;
    runnerZone.textContent = runnerRecord.zone ? `• ${runnerRecord.zone}` : '';
    updateToggleUI(runnerRecord.is_active);

    loadJobs();
    subscribeJobs();
    return true;
  }

  function endSession() {
    if (realtimeSub) db.removeChannel(realtimeSub);
    sessionStorage.removeItem('za_runner_phone');
    runnerRecord = null;
    loginScreen.hidden = false;
    runnerDash.hidden  = true;
    phoneInput.value   = '';
    loginBtn.querySelector('.btn-text').textContent = 'Access Jobs →';
    loginBtn.disabled = false;
  }

  async function loadJobs() {
    const { data, error } = await db
      .from('errand_requests')
      .select('*')
      .eq('runner_id', runnerRecord.id)
      .not('status', 'in', '("Completed","Cancelled")')
      .order('paid_at', { ascending: true });

    if (error) { showToast('Failed to load jobs', 'err'); return; }
    renderJobs(data || []);
  }

  function subscribeJobs() {
    if (realtimeSub) db.removeChannel(realtimeSub);
    realtimeSub = db
      .channel('runner_jobs_' + runnerRecord.id)
      .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'errand_requests',
        filter: `runner_id=eq.${runnerRecord.id}`,
      }, loadJobs)
      .subscribe();
  }

  function renderJobs(jobs) {
    jobList.innerHTML = '';
    if (!jobs.length) {
      jobList.innerHTML = '<div class="r-empty">No active jobs. Stand by for assignment.</div>';
      return;
    }
    jobs.forEach(j => jobList.appendChild(buildJobCard(j)));
  }

  function buildJobCard(job) {
    const card = document.createElement('div');
    card.className = 'r-job';
    card.dataset.id = job.id;

    const tel = job.client_phone?.replace(/\s/g, '') || '';

    card.innerHTML = `
      <div class="r-job__header">
        <div class="r-job__status" data-s="${esc(job.status)}">${esc(job.status)}</div>
        <div class="r-job__id">${esc((job.tx_ref || job.id?.slice(0, 8)).toUpperCase())}</div>
      </div>
      <div class="r-job__body">
        <div class="r-job__item">${esc(job.item_description)}</div>
        <div class="r-job__detail">
          <span><strong>Pickup:</strong> ${esc(job.pickup_address)}</span>
          ${job.dropoff_address ? `<span><strong>Drop-off:</strong> ${esc(job.dropoff_address)}</span>` : ''}
        </div>
        <div class="r-job__client">
          Client: <a href="tel:${esc(tel)}">${esc(job.client_phone)}</a>
          &mdash; <a href="https://wa.me/${tel.replace(/^\+/, '')}" target="_blank">WhatsApp</a>
        </div>
      </div>
      <div class="r-job__actions" id="actions-${job.id}"></div>
    `;

    buildActionButtons(card, job);
    return card;
  }

  function buildActionButtons(card, job) {
    const wrap = card.querySelector(`#actions-${job.id}`);
    wrap.innerHTML = '';

    const transitions = {
      'Paid':     [{ label: 'Accept Job',   next: 'Active',    cls: '' }],
      'Active':   [{ label: 'En Route',     next: 'En Route',  cls: '' }],
      'En Route': [{ label: 'Mark Complete',next: 'Completed', cls: 'r-action-btn--green' }],
    };

    const buttons = transitions[job.status] || [];
    if (!buttons.length) {
      wrap.innerHTML = `<div style="padding:10px 0;font-size:.75rem;color:var(--gray-600);text-align:center;">No actions available</div>`;
      return;
    }

    buttons.forEach(({ label, next, cls }) => {
      const btn = document.createElement('button');
      btn.className = `r-action-btn ${cls}`;
      btn.textContent = label;
      btn.addEventListener('click', () => updateJobStatus(job.id, next, btn));
      wrap.appendChild(btn);
    });
  }

  async function updateJobStatus(jobId, newStatus, btn) {
    btn.disabled = true;
    btn.textContent = 'Updating...';

    const updates = { status: newStatus };
    if (newStatus === 'Completed') updates.completed_at = new Date().toISOString();

    const { error } = await db
      .from('errand_requests')
      .update(updates)
      .eq('id', jobId);

    if (error) {
      showToast('Update failed: ' + error.message, 'err');
      btn.disabled = false;
      btn.textContent = 'Retry';
    } else {
      showToast(`Status → ${newStatus}`, 'ok');
      // Card will re-render via realtime subscription
    }
  }

  // UI helpers
  function updateToggleUI(isActive) {
    activeToggle.textContent      = isActive ? 'ACTIVE' : 'OFFLINE';
    activeToggle.dataset.active   = isActive;
    runnerTag.textContent         = isActive ? 'ACTIVE' : 'OFFLINE';
    runnerTag.dataset.active      = isActive;
  }

  function normalizePhone(p) {
    return p.trim().replace(/\s/g, '').replace(/^0/, '+234');
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
  }

  function mkToast() {
    const el = document.createElement('div');
    el.className = 'r-toast';
    document.body.appendChild(el);
    return el;
  }

  function showToast(msg, type = 'ok') {
    toast.textContent = msg;
    toast.className   = `r-toast r-toast--${type} show`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
  }

})();
