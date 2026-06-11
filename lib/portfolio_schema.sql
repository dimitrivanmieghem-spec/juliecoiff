create table public.portfolio_images (
  id         uuid primary key default gen_random_uuid(),
  file_name  text not null unique,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_images enable row level security;

create policy "portfolio_public_select"
  on public.portfolio_images
  for select
  using (true);

create policy "portfolio_auth_insert"
  on public.portfolio_images
  for insert
  to authenticated
  with check (true);

create policy "portfolio_auth_update"
  on public.portfolio_images
  for update
  to authenticated
  using (true)
  with check (true);

create policy "portfolio_auth_delete"
  on public.portfolio_images
  for delete
  to authenticated
  using (true);
