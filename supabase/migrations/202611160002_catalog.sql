-- PROPOSTA: NAO EXECUTADO. Revisar e autorizar antes de aplicar ao projeto novo.
-- Requer a revisao/aplicacao separada de 202611160001_community.sql para sugestoes/favoritos.
begin;
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
