/* Za.allyErrands — Payment Success Page JS
   Reads tx_ref and request id from URL params,
   then queries Supabase to confirm payment status.
*/
(function () {
  'use strict';

  const SUPABASE_URL = window.ZA_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
  const ANON_KEY     = window.ZA_ANON_KEY     || 'YOUR_SUPABASE_ANON_KEY';

  const params  = new URLSearchParams(window.location.search);
  const txRef   = params.get('tx_ref');
  const reqId   = params.get('id');

  const stateLoading   = document.getElementById('stateLoading');
  const stateSuccess   = document.getElementById('stateSuccess');
  const stateDuplicate = document.getElementById('stateDuplicate');
  const stateError     = document.getElementById('stateError');
  const jobDetail      = document.getElementById('jobDetail');

  function show(el) {
    [stateLoading, stateSuccess, stateDuplicate, stateError].forEach(s => s.hidden = true);
    el.hidden = false;
  }

  async function verify() {
    if (!txRef && !reqId) { show(stateError); return; }

    const { createClient } = window.supabase;
    const db = createClient(SUPABASE_URL, ANON_KEY);

    // Poll Supabase up to 8 times (FLW webhook may take a few seconds)
    for (let attempt = 0; attempt < 8; attempt++) {
      const query = db.from('errand_requests').select(
        'id, status, payment_status, item_description, pickup_address, amount_ngn, client_name, paid_at'
      );
      if (txRef) query.eq('tx_ref', txRef);
      else       query.eq('id', reqId);

      const { data, error } = await query.maybeSingle();

      if (error) { console.error(error); show(stateError); return; }

      if (data) {
        if (data.payment_status === 'Paid') {
          jobDetail.innerHTML = `
            <strong>Client:</strong> ${esc(data.client_name)}<br/>
            <strong>Job:</strong> ${esc(data.item_description)}<br/>
            <strong>Pickup:</strong> ${esc(data.pickup_address)}<br/>
            <strong>Amount paid:</strong> ₦${Number(data.amount_ngn).toLocaleString()}<br/>
            <strong>Ref:</strong> ${esc(txRef || data.id)}
          `;
          // Store phone for portal access
          sessionStorage.setItem('za_last_request', data.id);
          show(stateSuccess);
          return;
        }
        if (data.status === 'Completed') { show(stateDuplicate); return; }
      }

      // Not confirmed yet — wait and retry
      if (attempt < 7) await sleep(2000);
    }

    // After 8 attempts, check one final time for any non-pending state
    show(stateError);
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  verify();
})();
