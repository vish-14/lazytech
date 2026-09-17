-- LazyTech · run this once in your Supabase project (SQL editor)
-- Project: https://gemzxhbyyuhekysnoizv.supabase.co

-- 1. LEADS -------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  city text,
  profile text,
  organisation text,
  goal text,
  amount integer,
  source text,
  payment_status text not null default 'pending'
);

alter table public.leads add column if not exists payment_status text not null default 'pending';

grant insert on public.leads to anon, authenticated;
grant all on public.leads to service_role;

alter table public.leads enable row level security;

drop policy if exists "anyone can apply" on public.leads;
create policy "anyone can apply" on public.leads
  for insert to anon, authenticated with check (true);

-- 2. PAYMENTS ----------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references public.leads(id) on delete set null,
  email text,
  name text,
  phone text,
  amount integer not null,          -- in paise
  currency text not null default 'INR',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  razorpay_signature text,
  status text not null default 'created', -- created | paid | failed
  notes jsonb
);

create index if not exists payments_order_id_idx on public.payments (razorpay_order_id);
create index if not exists payments_email_idx on public.payments (email);

grant all on public.payments to service_role;

alter table public.payments enable row level security;
-- No anon policies: payments are written only by the server (service role).

-- 3. WEBHOOK EVENT LOG -------------------------------------------------
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event text,
  razorpay_order_id text,
  razorpay_payment_id text,
  payload jsonb
);

grant all on public.payment_events to service_role;
alter table public.payment_events enable row level security;

-- 4. COHORTS -----------------------------------------------------------
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text unique not null,
  start_date date not null,
  capacity integer not null default 100,
  status text not null default 'open'   -- open | full | closed
);

grant all on public.cohorts to service_role;
alter table public.cohorts enable row level security;

insert into public.cohorts (name, start_date, capacity, status)
values ('Batch 01', '2026-10-11', 100, 'open')
on conflict (name) do nothing;

-- 5. MEMBERS (one row per verified paid seat) --------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  builder_number integer not null,
  name text,
  email text not null,
  phone text,
  payment_status text not null default 'paid',
  payment_id text,
  joined_date timestamptz not null default now(),
  unique (cohort_id, builder_number),
  unique (cohort_id, email)
);

create unique index if not exists members_payment_id_idx on public.members (payment_id) where payment_id is not null;

grant all on public.members to service_role;
alter table public.members enable row level security;
-- No anon policies: seat data is exposed only through seat_summary() below.

-- 6. SEAT LOGIC --------------------------------------------------------
-- Claims one seat for a verified successful payment. Idempotent per
-- payment id / email. Returns the builder number, or null when full.
create or replace function public.claim_seat(
  _email text,
  _name text,
  _phone text,
  _lead_id uuid,
  _payment_id text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _cohort public.cohorts%rowtype;
  _filled integer;
  _existing integer;
  _number integer;
begin
  select * into _cohort from public.cohorts where status = 'open' order by start_date limit 1;
  if _cohort.id is null then
    return null;
  end if;

  perform pg_advisory_xact_lock(hashtext(_cohort.id::text));

  select builder_number into _existing
  from public.members
  where cohort_id = _cohort.id
    and (payment_id = _payment_id or lower(email) = lower(_email))
  limit 1;
  if _existing is not null then
    return _existing;
  end if;

  select count(*) into _filled from public.members where cohort_id = _cohort.id;
  if _filled >= _cohort.capacity then
    update public.cohorts set status = 'full' where id = _cohort.id;
    return null;
  end if;

  insert into public.members (cohort_id, lead_id, builder_number, name, email, phone, payment_status, payment_id)
  values (_cohort.id, _lead_id, _filled + 1, _name, lower(_email), _phone, 'paid', _payment_id)
  returning builder_number into _number;

  if _filled + 1 >= _cohort.capacity then
    update public.cohorts set status = 'full' where id = _cohort.id;
  end if;

  return _number;
end;
$$;

revoke all on function public.claim_seat(text, text, text, uuid, text) from public, anon, authenticated;
grant execute on function public.claim_seat(text, text, text, uuid, text) to service_role;

-- Public, read-only seat counter (no personal data).
create or replace function public.seat_summary()
returns table (cohort_name text, start_date date, capacity integer, filled integer, status text)
language sql
stable
security definer
set search_path = public
as $$
  select c.name,
         c.start_date,
         c.capacity,
         (select count(*)::int from public.members m where m.cohort_id = c.id and m.payment_status = 'paid'),
         c.status
  from public.cohorts c
  order by c.start_date
  limit 1;
$$;

grant execute on function public.seat_summary() to anon, authenticated, service_role;
