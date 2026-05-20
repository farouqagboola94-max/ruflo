-- ============================================================
-- Za.allyErrands — Admin RLS Policy Addition
-- Run this AFTER schema.sql to lock down the admin panel.
-- The admin panel uses the anon key, so we need an extra policy
-- that allows reading all rows when the correct app secret is set.
-- In production, replace this with proper Supabase Auth (email/password).
-- ============================================================

-- Allow reading all requests when admin session is active
create policy "admin_read_all"
  on errand_requests for select
  to anon
  using (
    current_setting('app.is_admin', true) = 'true'
    OR client_phone = current_setting('app.client_phone', true)
  );

-- Allow admin to update status and runner_id
create policy "admin_update"
  on errand_requests for update
  to anon
  using   (current_setting('app.is_admin', true) = 'true')
  with check (current_setting('app.is_admin', true) = 'true');

-- Allow admin to read all runners
create policy "admin_read_runners"
  on runners for select
  to anon
  using (current_setting('app.is_admin', true) = 'true');

-- Allow admin to insert / update runners
create policy "admin_write_runners"
  on runners for insert
  to anon
  with check (current_setting('app.is_admin', true) = 'true');

create policy "admin_update_runners"
  on runners for update
  to anon
  using   (current_setting('app.is_admin', true) = 'true')
  with check (current_setting('app.is_admin', true) = 'true');

-- NOTE: For a truly secure admin panel, use Supabase Auth instead:
-- 1. Create an admin user in Supabase Auth (Dashboard > Authentication > Users)
-- 2. Replace the PIN gate in admin.js with supabase.auth.signInWithPassword()
-- 3. Replace the anon key with a session-based key
-- 4. All RLS policies above can then use auth.uid() instead of app.is_admin
