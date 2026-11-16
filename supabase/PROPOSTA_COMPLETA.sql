-- PARA REVISAO. NAO EXECUTADO. Somente no novo projeto Uai Bora 2.0.
begin;
-- Apply once to the new Uai Bora Supabase project. No service-role key is used by the app.

create table public.uaibora_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 80),
  category text not null check (category in ('Ao ar livre', 'Cultura', 'Gastronomia', 'Passeio')),
  location text not null check (char_length(trim(location)) between 3 and 120),
  description text not null check (char_length(trim(description)) between 15 and 1000),
  created_at timestamptz not null default now()
);
create index uaibora_suggestions_created on public.uaibora_suggestions(created_at desc);
create index uaibora_suggestions_owner on public.uaibora_suggestions(user_id);
alter table public.uaibora_suggestions enable row level security;
revoke all on public.uaibora_suggestions from anon, authenticated;
grant select on public.uaibora_suggestions to anon, authenticated;
grant insert, delete on public.uaibora_suggestions to authenticated;
create policy "Visitors can read shared suggestions" on public.uaibora_suggestions for select to anon, authenticated using (true);
create policy "Users can create their own suggestions" on public.uaibora_suggestions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Only authors can delete their suggestions" on public.uaibora_suggestions for delete to authenticated using ((select auth.uid()) = user_id);

create table public.uaibora_favorites (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  item_id text not null check (char_length(item_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
alter table public.uaibora_favorites enable row level security;
revoke all on public.uaibora_favorites from anon, authenticated;
grant select, insert, delete on public.uaibora_favorites to authenticated;
create policy "Users read only their favorites" on public.uaibora_favorites for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users save only their favorites" on public.uaibora_favorites for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users remove only their favorites" on public.uaibora_favorites for delete to authenticated using ((select auth.uid()) = user_id);


-- PROPOSTA: NAO EXECUTADO. Revisar e autorizar antes de aplicar ao projeto novo.
-- Requer a revisao/aplicacao separada de 202611160001_community.sql para sugestoes/favoritos.

create table public.uaibora_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 120),
  category text not null check (char_length(trim(category)) between 2 and 60),
  location text not null check (char_length(trim(location)) between 3 and 240),
  description text not null check (char_length(trim(description)) between 15 and 5000),
  image_path text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null))
);
create table public.uaibora_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  place_id uuid references public.uaibora_places(id) on delete set null,
  title text not null check (char_length(trim(title)) between 3 and 120),
  category text not null check (char_length(trim(category)) between 2 and 60),
  location text not null check (char_length(trim(location)) between 3 and 240),
  description text not null check (char_length(trim(description)) between 15 and 5000),
  image_path text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);
create index uaibora_places_published on public.uaibora_places(title) where published;
create index uaibora_events_published on public.uaibora_events(starts_at) where published;
create index uaibora_events_place on public.uaibora_events(place_id);
alter table public.uaibora_places enable row level security;
alter table public.uaibora_events enable row level security;
revoke all on public.uaibora_places, public.uaibora_events from anon, authenticated;
grant select on public.uaibora_places, public.uaibora_events to anon, authenticated;
create policy "Read published places" on public.uaibora_places for select to anon, authenticated using (published or user_id = (select auth.uid()));
create policy "Read published events" on public.uaibora_events for select to anon, authenticated using (published or user_id = (select auth.uid()));
grant insert (user_id,title,category,location,description,image_path,latitude,longitude) on public.uaibora_places to authenticated;
grant insert (user_id,place_id,title,category,location,description,image_path,starts_at,ends_at) on public.uaibora_events to authenticated;
create policy "Create own place draft" on public.uaibora_places for insert to authenticated with check (user_id = (select auth.uid()) and not published);
create policy "Create own event draft" on public.uaibora_events for insert to authenticated with check (user_id = (select auth.uid()) and not published);
-- Publicacao via painel confiavel; cadastro publico nao ganha permissao para publicar/editar.

commit;
