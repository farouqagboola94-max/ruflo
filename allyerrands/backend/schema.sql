-- ============================================================
-- Za.allyErrands — Supabase Database Schema
-- Paste this into your Supabase SQL Editor and run it once.
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── RUNNERS table ──
-- The people who execute the errands.
create table if not exists runners (
  id         uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  name       text not null,
  phone      text not null unique,
  zone       text,           -- e.g. 'Lagos Island', 'VI', 'Lekki'
  is_active  boolean default true not null
);

-- ── ERRAND REQUESTS table ──
-- Every job submitted through the website lands here.
create table if not exists errand_requests (
  id               uuid default uuid_generate_v4() primary key,
  created_at       timestamptz default now() not null,
  completed_at     timestamptz,

  -- Client details
  client_name      text not null,
  client_phone     text not null,

  -- Job details
  pickup_address   text not null,
  dropoff_address  text,
  item_description text not null,

  -- Dispatch
  status           text not null default 'Pending'
                   check (status in ('Pending', 'Active', 'En Route', 'Completed', 'Cancelled')),
  runner_id        uuid references runners(id) on delete set null,
  estimated_mins   integer,
  notes            text
);

-- ── ROW LEVEL SECURITY ──
alter table errand_requests enable row level security;
alter table runners         enable row level security;

-- Anyone (anon) can INSERT a new request from the website
create policy "public_insert_requests"
  on errand_requests for insert
  to anon
  with check (true);

-- Clients can SELECT their own requests by matching phone number
-- The portal sets this via a custom Postgres config parameter.
create policy "client_select_own"
  on errand_requests for select
  to anon
  using (client_phone = current_setting('app.client_phone', true));

-- Service role (Edge Function, Make.com) gets full access
create policy "service_role_all"
  on errand_requests for all
  to service_role
  using (true)
  with check (true);

create policy "service_role_runners"
  on runners for all
  to service_role
  using (true)
  with check (true);

-- ── REALTIME ──
-- Enable live status updates in the client portal.
alter publication supabase_realtime add table errand_requests;

-- ── INDEX for fast phone-based lookups ──
create index idx_errand_requests_phone  on errand_requests (client_phone);
create index idx_errand_requests_status on errand_requests (status);
create index idx_errand_requests_created on errand_requests (created_at desc);
