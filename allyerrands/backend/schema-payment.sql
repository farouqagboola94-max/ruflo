-- ============================================================
-- Za.allyErrands — Payment Layer Migration
-- Run this AFTER schema.sql and admin-rls.sql.
-- Adds payment columns and extends the status enum.
-- ============================================================

-- Add payment columns to errand_requests
alter table errand_requests
  add column if not exists tx_ref           text unique,
  add column if not exists payment_link     text,
  add column if not exists payment_status   text not null default 'Awaiting Payment'
    check (payment_status in ('Awaiting Payment', 'Paid', 'Refunded', 'Failed')),
  add column if not exists paid_at          timestamptz,
  add column if not exists amount_ngn       integer,        -- in kobo-free NGN, e.g. 3500
  add column if not exists flw_transaction_id text;         -- Flutterwave's own txn ID

-- Extend status to include Paid
-- Drop the old constraint and recreate with Paid added
alter table errand_requests
  drop constraint if exists errand_requests_status_check;

alter table errand_requests
  add constraint errand_requests_status_check
  check (status in ('Pending', 'Paid', 'Active', 'En Route', 'Completed', 'Cancelled'));

-- Index for tx_ref lookups (called on every Flutterwave webhook)
create index if not exists idx_errand_tx_ref on errand_requests (tx_ref);

-- Index for payment_status
create index if not exists idx_errand_payment_status on errand_requests (payment_status);

-- View: paid and ready to dispatch (what the admin queue should prioritise)
create or replace view paid_queue as
  select
    id, created_at, client_name, client_phone,
    pickup_address, dropoff_address, item_description,
    amount_ngn, runner_id, paid_at
  from errand_requests
  where payment_status = 'Paid'
    and status not in ('Completed', 'Cancelled')
  order by paid_at asc;  -- oldest paid first = FIFO dispatch
