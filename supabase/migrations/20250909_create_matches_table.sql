-- Migration: Create matches table for Like/Pass actions

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  user_id text references profiles(id) not null,
  target_id text references profiles(id) not null,
  action text check (action in ('like', 'pass')) not null,
  created_at timestamptz not null default now()
);

-- Prevent duplicate actions (user cannot like/pass the same profile more than once)
create unique index if not exists unique_match_action on public.matches (user_id, target_id, action);
