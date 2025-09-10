alter table public.matches enable row level security;

-- Allow authenticated users to insert their own matches
create policy "Allow authenticated insert on matches" on public.matches
  for insert
  with check (user_id = auth.uid()::text);

-- Allow authenticated users to select matches where they are involved
create policy "Allow authenticated select on matches" on public.matches
  for select
  using (user_id = auth.uid()::text or target_id = auth.uid()::text);

-- Allow authenticated users to delete their own matches
create policy "Allow authenticated delete on matches" on public.matches
  for delete
  using (user_id = auth.uid()::text);