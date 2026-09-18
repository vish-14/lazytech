-- 1. UTM LINKS -------------------------------------------------------------
create table if not exists public.utm_links (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  short_code text unique not null,
  name text not null,
  destination text not null,
  product_type text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_by uuid references auth.users(id) on delete set null,
  is_active boolean not null default true
);

create index if not exists utm_links_short_code_idx on public.utm_links(short_code);
create index if not exists utm_links_created_at_idx on public.utm_links(created_at);

grant all on public.utm_links to service_role;
alter table public.utm_links enable row level security;
-- Admin only via service_role / RLS for now.

-- 2. TRACKING EVENTS -----------------------------------------------------
create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  session_id text not null,
  utm_link_id uuid references public.utm_links(id) on delete set null,
  event_type text not null, -- CLICK, PAGE_VIEW, CHECKOUT_STARTED
  product_type text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  device_type text,
  browser text,
  operating_system text,
  country text,
  region text,
  metadata jsonb
);

create index if not exists tracking_events_visitor_idx on public.tracking_events(visitor_id);
create index if not exists tracking_events_session_idx on public.tracking_events(session_id);
create index if not exists tracking_events_event_type_idx on public.tracking_events(event_type);
create index if not exists tracking_events_utm_link_idx on public.tracking_events(utm_link_id);
create index if not exists tracking_events_created_at_idx on public.tracking_events(created_at);

grant insert on public.tracking_events to anon, authenticated;
grant all on public.tracking_events to service_role;

alter table public.tracking_events enable row level security;

-- Public can insert tracking events, but cannot read them.
drop policy if exists "anyone can insert tracking events" on public.tracking_events;
create policy "anyone can insert tracking events" on public.tracking_events
  for insert to anon, authenticated with check (true);

-- 3. MODIFY PAYMENTS TABLE -----------------------------------------------
alter table public.payments add column if not exists visitor_id text;
alter table public.payments add column if not exists session_id text;
alter table public.payments add column if not exists utm_link_id uuid references public.utm_links(id) on delete set null;

-- First Touch Attribution
alter table public.payments add column if not exists first_touch_utm_source text;
alter table public.payments add column if not exists first_touch_utm_medium text;
alter table public.payments add column if not exists first_touch_utm_campaign text;
alter table public.payments add column if not exists first_touch_utm_content text;
alter table public.payments add column if not exists first_touch_utm_term text;

-- Last Touch Attribution
alter table public.payments add column if not exists last_touch_utm_source text;
alter table public.payments add column if not exists last_touch_utm_medium text;
alter table public.payments add column if not exists last_touch_utm_campaign text;
alter table public.payments add column if not exists last_touch_utm_content text;
alter table public.payments add column if not exists last_touch_utm_term text;

-- Add indexes for fast analytics filtering
create index if not exists payments_created_at_idx on public.payments(created_at);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_visitor_id_idx on public.payments(visitor_id);
create index if not exists payments_utm_link_id_idx on public.payments(utm_link_id);
create index if not exists payments_first_touch_source_idx on public.payments(first_touch_utm_source);
create index if not exists payments_last_touch_source_idx on public.payments(last_touch_utm_source);

-- Add product_type for easier filtering (it is currently inside notes jsonb)
alter table public.payments add column if not exists product_type text;
create index if not exists payments_product_type_idx on public.payments(product_type);

-- Backfill product_type from notes if missing
update public.payments 
set product_type = notes->>'productType' 
where product_type is null and notes ? 'productType';
