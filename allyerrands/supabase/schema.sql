-- Za.allyErrands Enhanced Backend Schema
-- Supabase PostgreSQL — production-ready with RLS, indexes, triggers

-- ─────────────────────────────────────────────
EXTENSIONS
─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "postgis";  -- geo queries

-- ─────────────────────────────────────────────
ENUMS
─────────────────────────────────────────────
create type dispatch_status as enum (
  'pending', 'accepted', 'picked_up', 'in_transit',
  'delivered', 'failed', 'cancelled', 'refunded'
);

create type payment_status as enum (
  'pending', 'authorised', 'captured', 'failed', 'refunded', 'partial_refund'
);

create type payment_method as enum (
  'card', 'bank_transfer', 'ussd', 'wallet', 'flutterwave'
);

create type runner_status as enum (
  'available', 'busy', 'offline', 'suspended', 'pending_verification'
);

create type business_tier as enum ('starter', 'growth', 'enterprise');

create type webhook_event as enum (
  'dispatch.created', 'dispatch.accepted', 'dispatch.picked_up',
  'dispatch.delivered', 'dispatch.failed', 'dispatch.cancelled',
  'payment.captured', 'payment.failed', 'runner.assigned'
);

-- ─────────────────────────────────────────────
ZONES
─────────────────────────────────────────────
create table zones (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null unique,
  slug         text not null unique,
  state        text not null default 'Lagos',
  country      text not null default 'NG',
  center_lat   numeric(9,6),
  center_lng   numeric(9,6),
  radius_km    numeric(5,2) default 5.0,
  base_fee     integer not null default 150000,  -- kobo
  per_km_fee   integer not null default 50000,   -- kobo
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index idx_zones_slug on zones(slug);
create index idx_zones_active on zones(is_active) where is_active = true;

-- Seed Lagos zones
insert into zones (name, slug, center_lat, center_lng, radius_km, base_fee) values
  ('Victoria Island', 'vi',        6.4281, 3.4219, 4.0,  150000),
  ('Lekki Phase 1',  'lekki-1',   6.4478, 3.4672, 5.0,  150000),
  ('Ikeja',          'ikeja',     6.6018, 3.3515, 6.0,  150000),
  ('Surulere',       'surulere',  6.5059, 3.3582, 4.5,  150000),
  ('Ikoyi',          'ikoyi',     6.4500, 3.4333, 3.5,  150000),
  ('Ajah',           'ajah',      6.4698, 3.5644, 5.5,  200000),
  ('Alausa',         'alausa',    6.5792, 3.3531, 3.0,  150000),
  ('Yaba',           'yaba',      6.5085, 3.3794, 4.0,  120000),
  ('Maryland',       'maryland',  6.5608, 3.3597, 3.5,  150000),
  ('Ojodu Berger',   'berger',    6.6316, 3.3518, 4.0,  180000),
  ('Apapa',          'apapa',     6.4483, 3.3596, 5.0,  200000),
  ('Festac',         'festac',    6.4667, 3.2833, 5.0,  200000);

-- ─────────────────────────────────────────────
CUSTOMERS
─────────────────────────────────────────────
create table customers (
  id                uuid primary key default uuid_generate_v4(),
  auth_user_id      uuid unique references auth.users(id) on delete set null,
  full_name         text not null,
  phone             text not null unique,
  email             text unique,
  whatsapp          text,
  avatar_url        text,
  zone_id           uuid references zones(id),
  address_line      text,
  wallet_balance    integer not null default 0,  -- kobo
  total_dispatches  integer not null default 0,
  total_spent       integer not null default 0,  -- kobo
  referral_code     text unique default upper(substring(md5(random()::text) for 8)),
  referred_by       uuid references customers(id),
  is_verified       boolean not null default false,
  is_blocked        boolean not null default false,
  metadata          jsonb not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_customers_phone on customers(phone);
create index idx_customers_email on customers(email);
create index idx_customers_zone on customers(zone_id);
create index idx_customers_referral on customers(referral_code);

-- ─────────────────────────────────────────────
BUSINESSES
─────────────────────────────────────────────
create table businesses (
  id                 uuid primary key default uuid_generate_v4(),
  owner_id           uuid not null references customers(id),
  name               text not null,
  slug               text not null unique,
  logo_url           text,
  industry           text,
  tier               business_tier not null default 'starter',
  monthly_quota      integer not null default 50,
  used_quota         integer not null default 0,
  api_key            text unique default 'biz_' || replace(uuid_generate_v4()::text, '-', ''),
  webhook_url        text,
  webhook_secret     text default encode(gen_random_bytes(32), 'hex'),
  sla_minutes        integer not null default 120,
  runner_pool_size   integer not null default 3,
  billing_email      text,
  flutterwave_ref    text,
  is_active          boolean not null default true,
  metadata           jsonb not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_businesses_owner on businesses(owner_id);
create index idx_businesses_api_key on businesses(api_key);
create index idx_businesses_active on businesses(is_active) where is_active = true;

-- ─────────────────────────────────────────────
RUNNERS
─────────────────────────────────────────────
create table runners (
  id                  uuid primary key default uuid_generate_v4(),
  auth_user_id        uuid unique references auth.users(id) on delete set null,
  full_name           text not null,
  phone               text not null unique,
  email               text,
  avatar_url          text,
  nin                 text unique,
  bvn_verified        boolean not null default false,
  vehicle_type        text check (vehicle_type in ('foot','bicycle','motorcycle','car')),
  plate_number        text,
  home_zone_id        uuid references zones(id),
  current_lat         numeric(9,6),
  current_lng         numeric(9,6),
  last_location_at    timestamptz,
  status              runner_status not null default 'pending_verification',
  rating              numeric(3,2) default 5.00,
  total_deliveries    integer not null default 0,
  total_earnings      integer not null default 0,  -- kobo
  acceptance_rate     numeric(5,2) default 100.00,
  is_background_check boolean not null default false,
  metadata            jsonb not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_runners_status on runners(status);
create index idx_runners_zone on runners(home_zone_id);
create index idx_runners_location on runners(current_lat, current_lng)
  where status = 'available';

-- ─────────────────────────────────────────────
DISPATCHES
─────────────────────────────────────────────
create table dispatches (
  id                  uuid primary key default uuid_generate_v4(),
  reference           text not null unique default 'DSP-' || upper(substring(md5(random()::text) for 8)),
  customer_id         uuid not null references customers(id),
  business_id         uuid references businesses(id),
  runner_id           uuid references runners(id),
  pickup_zone_id      uuid references zones(id),
  dropoff_zone_id     uuid references zones(id),

  pickup_address      text not null,
  pickup_lat          numeric(9,6),
  pickup_lng          numeric(9,6),
  pickup_contact      text,
  pickup_phone        text,
  dropoff_address     text not null,
  dropoff_lat         numeric(9,6),
  dropoff_lng         numeric(9,6),
  dropoff_contact     text,
  dropoff_phone       text,

  description         text not null,
  item_count          integer not null default 1,
  estimated_weight_kg numeric(6,2),
  is_fragile          boolean not null default false,
  requires_signature  boolean not null default false,
  special_instructions text,

  status              dispatch_status not null default 'pending',
  priority            smallint not null default 1 check (priority between 1 and 3),
  scheduled_at        timestamptz,
  accepted_at         timestamptz,
  picked_up_at        timestamptz,
  delivered_at        timestamptz,
  failed_at           timestamptz,
  cancelled_at        timestamptz,
  eta_minutes         integer,
  distance_km         numeric(6,2),

  base_fee            integer not null default 0,
  distance_fee        integer not null default 0,
  surge_multiplier    numeric(4,2) not null default 1.00,
  total_fee           integer not null default 0,
  runner_payout       integer not null default 0,
  platform_cut        integer not null default 0,

  pickup_photo_url    text,
  dropoff_photo_url   text,
  signature_url       text,
  cancellation_reason text,
  failure_reason      text,

  metadata            jsonb not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_dispatches_customer on dispatches(customer_id);
create index idx_dispatches_runner on dispatches(runner_id);
create index idx_dispatches_business on dispatches(business_id);
create index idx_dispatches_status on dispatches(status);
create index idx_dispatches_reference on dispatches(reference);
create index idx_dispatches_created on dispatches(created_at desc);
create index idx_dispatches_status_created on dispatches(status, created_at desc);

-- ─────────────────────────────────────────────
PAYMENTS
─────────────────────────────────────────────
create table payments (
  id                  uuid primary key default uuid_generate_v4(),
  dispatch_id         uuid not null references dispatches(id),
  customer_id         uuid not null references customers(id),
  flutterwave_ref     text unique,
  flutterwave_tx_id   text,
  amount              integer not null,
  currency            text not null default 'NGN',
  method              payment_method not null default 'card',
  status              payment_status not null default 'pending',
  authorised_at       timestamptz,
  captured_at         timestamptz,
  failed_at           timestamptz,
  refunded_at         timestamptz,
  refund_amount       integer default 0,
  failure_reason      text,
  gateway_response    jsonb default '{}',
  metadata            jsonb not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_payments_dispatch on payments(dispatch_id);
create index idx_payments_customer on payments(customer_id);
create index idx_payments_status on payments(status);
create index idx_payments_flw_ref on payments(flutterwave_ref);

-- ─────────────────────────────────────────────
RATINGS
─────────────────────────────────────────────
create table ratings (
  id           uuid primary key default uuid_generate_v4(),
  dispatch_id  uuid not null unique references dispatches(id),
  customer_id  uuid not null references customers(id),
  runner_id    uuid not null references runners(id),
  score        smallint not null check (score between 1 and 5),
  comment      text,
  tags         text[] default '{}',
  is_public    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index idx_ratings_runner on ratings(runner_id);
create index idx_ratings_customer on ratings(customer_id);
create index idx_ratings_score on ratings(score);

-- ─────────────────────────────────────────────
WEBHOOK DELIVERIES
─────────────────────────────────────────────
create table webhook_deliveries (
  id             uuid primary key default uuid_generate_v4(),
  business_id    uuid not null references businesses(id),
  dispatch_id    uuid references dispatches(id),
  event          webhook_event not null,
  payload        jsonb not null,
  endpoint_url   text not null,
  http_status    integer,
  response_body  text,
  attempt        smallint not null default 1,
  delivered_at   timestamptz,
  failed_at      timestamptz,
  next_retry_at  timestamptz,
  created_at     timestamptz not null default now()
);

create index idx_webhooks_business on webhook_deliveries(business_id);
create index idx_webhooks_dispatch on webhook_deliveries(dispatch_id);
create index idx_webhooks_retry on webhook_deliveries(next_retry_at)
  where delivered_at is null and failed_at is null;

-- ─────────────────────────────────────────────
DISPATCH EVENTS (audit trail)
─────────────────────────────────────────────
create table dispatch_events (
  id           uuid primary key default uuid_generate_v4(),
  dispatch_id  uuid not null references dispatches(id),
  actor_type   text not null check (actor_type in ('system','customer','runner','business','admin')),
  actor_id     uuid,
  event_type   text not null,
  old_status   dispatch_status,
  new_status   dispatch_status,
  note         text,
  lat          numeric(9,6),
  lng          numeric(9,6),
  metadata     jsonb default '{}',
  created_at   timestamptz not null default now()
);

create index idx_events_dispatch on dispatch_events(dispatch_id);
create index idx_events_created on dispatch_events(created_at desc);

-- ─────────────────────────────────────────────
RUNNER EARNINGS
─────────────────────────────────────────────
create table runner_earnings (
  id           uuid primary key default uuid_generate_v4(),
  runner_id    uuid not null references runners(id),
  dispatch_id  uuid not null unique references dispatches(id),
  gross        integer not null,
  platform_fee integer not null,
  net          integer not null,
  is_paid_out  boolean not null default false,
  paid_out_at  timestamptz,
  bank_ref     text,
  created_at   timestamptz not null default now()
);

create index idx_earnings_runner on runner_earnings(runner_id);
create index idx_earnings_payout on runner_earnings(is_paid_out, runner_id)
  where is_paid_out = false;

-- ─────────────────────────────────────────────
TRIGGERS
─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_customers_updated
  before update on customers
  for each row execute function set_updated_at();

create trigger trg_businesses_updated
  before update on businesses
  for each row execute function set_updated_at();

create trigger trg_runners_updated
  before update on runners
  for each row execute function set_updated_at();

create trigger trg_dispatches_updated
  before update on dispatches
  for each row execute function set_updated_at();

create trigger trg_payments_updated
  before update on payments
  for each row execute function set_updated_at();

create or replace function log_dispatch_status_change()
returns trigger language plpgsql as $$
begin
  if old.status is distinct from new.status then
    insert into dispatch_events
      (dispatch_id, actor_type, event_type, old_status, new_status)
    values
      (new.id, 'system', 'status_change', old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger trg_dispatch_status_log
  after update on dispatches
  for each row execute function log_dispatch_status_change();

create or replace function refresh_runner_rating()
returns trigger language plpgsql as $$
begin
  update runners
  set rating = (
    select round(avg(score)::numeric, 2)
    from ratings
    where runner_id = new.runner_id
  )
  where id = new.runner_id;
  return new;
end;
$$;

create trigger trg_refresh_runner_rating
  after insert on ratings
  for each row execute function refresh_runner_rating();

create or replace function update_customer_stats()
returns trigger language plpgsql as $$
begin
  if new.status = 'delivered' and old.status != 'delivered' then
    update customers
    set
      total_dispatches = total_dispatches + 1,
      total_spent      = total_spent + new.total_fee
    where id = new.customer_id;
    update runners
    set total_deliveries = total_deliveries + 1
    where id = new.runner_id;
  end if;
  return new;
end;
$$;

create trigger trg_customer_stats
  after update on dispatches
  for each row execute function update_customer_stats();

-- ─────────────────────────────────────────────
ROW LEVEL SECURITY
─────────────────────────────────────────────
alter table customers        enable row level security;
alter table businesses       enable row level security;
alter table runners          enable row level security;
alter table dispatches       enable row level security;
alter table payments         enable row level security;
alter table ratings          enable row level security;
alter table dispatch_events  enable row level security;
alter table runner_earnings  enable row level security;

create policy "customers_own_row" on customers
  for all using (auth.uid() = auth_user_id);

create policy "runners_own_row" on runners
  for all using (auth.uid() = auth_user_id);

create policy "runners_public_read" on runners
  for select using (status = 'available');

create policy "dispatches_customer" on dispatches
  for all using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy "dispatches_runner" on dispatches
  for select using (
    runner_id in (select id from runners where auth_user_id = auth.uid())
  );

create policy "dispatches_runner_update" on dispatches
  for update using (
    runner_id in (select id from runners where auth_user_id = auth.uid())
  );

create policy "payments_customer" on payments
  for select using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy "ratings_customer_write" on ratings
  for insert with check (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy "ratings_public_read" on ratings
  for select using (is_public = true);

create policy "businesses_owner" on businesses
  for all using (
    owner_id in (select id from customers where auth_user_id = auth.uid())
  );

create policy "earnings_runner" on runner_earnings
  for select using (
    runner_id in (select id from runners where auth_user_id = auth.uid())
  );

create policy "events_participant" on dispatch_events
  for select using (
    dispatch_id in (
      select d.id from dispatches d
      left join customers c on c.id = d.customer_id
      left join runners r on r.id = d.runner_id
      where c.auth_user_id = auth.uid() or r.auth_user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
VIEWS
─────────────────────────────────────────────
create or replace view v_active_dispatches as
select
  d.id, d.reference, d.status,
  d.pickup_address, d.dropoff_address,
  d.total_fee, d.eta_minutes, d.created_at,
  c.full_name as customer_name, c.phone as customer_phone,
  r.full_name as runner_name, r.phone as runner_phone,
  r.current_lat, r.current_lng,
  pz.name as pickup_zone, dz.name as dropoff_zone
from dispatches d
left join customers c on c.id = d.customer_id
left join runners r   on r.id = d.runner_id
left join zones pz    on pz.id = d.pickup_zone_id
left join zones dz    on dz.id = d.dropoff_zone_id
where d.status not in ('delivered','failed','cancelled','refunded');

create or replace view v_daily_revenue as
select
  date_trunc('day', created_at) as day,
  count(*)           as dispatch_count,
  sum(total_fee)     as gross_revenue,
  sum(platform_cut)  as net_revenue,
  sum(runner_payout) as runner_payouts,
  avg(total_fee)     as avg_order_value
from dispatches
where status = 'delivered'
group by 1 order by 1 desc;

create or replace view v_runner_leaderboard as
select
  r.id, r.full_name, r.rating,
  r.total_deliveries, r.total_earnings, r.acceptance_rate,
  r.vehicle_type, z.name as home_zone
from runners r
left join zones z on z.id = r.home_zone_id
where r.status != 'suspended'
order by r.total_deliveries desc, r.rating desc;

-- ─────────────────────────────────────────────
FUNCTIONS
─────────────────────────────────────────────
create or replace function calculate_dispatch_fee(
  p_pickup_zone_id   uuid,
  p_dropoff_zone_id  uuid,
  p_distance_km      numeric default null,
  p_priority         smallint default 1
) returns table (base_fee integer, distance_fee integer, surge numeric, total integer)
language plpgsql as $$
declare
  v_zone      zones%rowtype;
  v_base      integer;
  v_dist_fee  integer;
  v_surge     numeric := 1.00;
  v_dist      numeric;
begin
  select * into v_zone from zones where id = p_pickup_zone_id;
  v_base := coalesce(v_zone.base_fee, 150000);
  v_dist := coalesce(p_distance_km, 5.0);
  v_dist_fee := (v_dist * coalesce(v_zone.per_km_fee, 50000))::integer;
  if p_pickup_zone_id != p_dropoff_zone_id then
    v_dist_fee := (v_dist_fee * 1.15)::integer;
  end if;
  if p_priority = 2 then v_surge := 1.25;
  elsif p_priority = 3 then v_surge := 1.60;
  end if;
  return query select v_base, v_dist_fee, v_surge, ((v_base + v_dist_fee) * v_surge)::integer;
end;
$$;

create or replace function find_nearest_runners(
  p_lat       numeric,
  p_lng       numeric,
  p_limit     integer default 5,
  p_radius_km numeric default 10.0
) returns table (runner_id uuid, full_name text, rating numeric, distance_km numeric)
language sql as $$
  select
    r.id, r.full_name, r.rating,
    round((6371 * acos(
      cos(radians(p_lat)) * cos(radians(r.current_lat)) *
      cos(radians(r.current_lng) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(r.current_lat))
    ))::numeric, 2) as distance_km
  from runners r
  where r.status = 'available'
    and r.current_lat is not null
    and r.current_lng is not null
  order by distance_km asc
  limit p_limit;
$$;

create or replace function check_business_quota(p_business_id uuid)
returns boolean language sql as $$
  select used_quota < monthly_quota
  from businesses
  where id = p_business_id and is_active = true;
$$;