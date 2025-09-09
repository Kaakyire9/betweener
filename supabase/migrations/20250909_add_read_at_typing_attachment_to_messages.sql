-- Migration: Add read_at, typing, and attachment columns for chat features
alter table public.messages add column if not exists read_at timestamptz;
-- Typing indicator: create a new table for typing status
create table if not exists public.typing_status (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null,
  user_id uuid not null,
  is_typing boolean not null default false,
  updated_at timestamptz not null default now()
);
create index if not exists idx_typing_status_chat_user on public.typing_status (chat_id, user_id);
-- Attachments
alter table public.messages add column if not exists attachment_url text;
alter table public.messages add column if not exists attachment_type text;
