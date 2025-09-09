-- Migration: Create messages table for chat functionality
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id text references profiles(id) not null,
  receiver_id text references profiles(id) not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Optional: Index for fast chat lookup
create index if not exists idx_messages_pair on public.messages (sender_id, receiver_id, created_at);
