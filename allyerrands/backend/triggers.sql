-- ============================================================
-- Za.allyErrands — Database Webhook Trigger
--
-- This uses pg_net to call your status-notify Edge Function
-- automatically whenever a row in errand_requests is updated.
--
-- Run this in the Supabase SQL Editor AFTER:
--   1. schema.sql
--   2. schema-payment.sql
--   3. Deploying the status-notify Edge Function
--
-- Replace YOUR_PROJECT_ID and YOUR_SERVICE_ROLE_KEY below.
-- ============================================================

-- Enable pg_net extension (required for HTTP calls from SQL)
create extension if not exists pg_net;

-- Function that fires on errand_requests UPDATE
create or replace function notify_status_change()
returns trigger
language plpgsql
security definer
as $$
declare
  payload jsonb;
begin
  -- Only fire when status actually changes
  if NEW.status = OLD.status then
    return NEW;
  end if;

  payload := jsonb_build_object(
    'type',       'UPDATE',
    'table',      'errand_requests',
    'schema',     'public',
    'record',     to_jsonb(NEW),
    'old_record', to_jsonb(OLD)
  );

  -- Async HTTP POST to the Edge Function (non-blocking)
  perform net.http_post(
    url     := 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/status-notify',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    ),
    body    := payload::text
  );

  return NEW;
end;
$$;

-- Attach the trigger to the table
drop trigger if exists on_status_change on errand_requests;

create trigger on_status_change
  after update on errand_requests
  for each row
  execute function notify_status_change();

-- Verify it was created
select tgname, tgenabled
from pg_trigger
where tgrelid = 'errand_requests'::regclass;
