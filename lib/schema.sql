-- ÉTAPE 1 : Créer la table
create table public.reservations (
  id               uuid primary key default gen_random_uuid(),
  client_name      text not null,
  client_email     text not null,
  client_phone     text not null,
  client_address   text not null,
  service_ids      text[] not null default '{}',
  total_price      numeric(8, 2) not null,
  appointment_date date not null,
  appointment_time time not null,
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

-- ÉTAPE 2 : Activer RLS
alter table public.reservations enable row level security;

-- ÉTAPE 3 : Politique INSERT anonyme (formulaire public)
create policy "allow_anon_insert"
  on public.reservations
  for insert
  to anon
  with check (true);

-- ÉTAPE 4 : Politique SELECT réservée aux utilisateurs authentifiés (futur admin)
create policy "allow_auth_select"
  on public.reservations
  for select
  to authenticated
  using (true);

-- ÉTAPE 5 : Politique UPDATE réservée aux utilisateurs authentifiés (futur admin)
create policy "allow_auth_update"
  on public.reservations
  for update
  to authenticated
  using (true)
  with check (true);
