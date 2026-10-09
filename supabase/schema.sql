-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  phone text,
  email text,
  amount_kwd numeric(8,3) not null,
  status text not null default 'pending', -- pending | paid | failed
  gateway text not null default 'test',
  gateway_ref text,
  game text not null default 'khalid'
);
create table if not exists codes (
  code text primary key,
  created_at timestamptz default now(),
  order_id uuid references orders(id),
  game text not null default 'khalid',
  expires_at timestamptz not null,
  max_uses int not null default 1,
  uses int not null default 0,
  note text
);
create table if not exists plays (
  id bigserial primary key,
  code text references codes(code),
  started_at timestamptz default now(),
  device text
);
create index if not exists codes_expires on codes(expires_at);

-- v2: promo codes + discount tracking (run this block if the tables above already exist)
create table if not exists promos (
  code text primary key,
  created_at timestamptz default now(),
  percent int not null default 0,        -- e.g. 20 = 20% off
  amount_kwd numeric(8,3) not null default 0, -- fixed discount, used if percent = 0
  max_uses int not null default 100,
  uses int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  note text
);
alter table orders add column if not exists promo text;
alter table orders add column if not exists discount_kwd numeric(8,3) not null default 0;
alter table promos enable row level security;
