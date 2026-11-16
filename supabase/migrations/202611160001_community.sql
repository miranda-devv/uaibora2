-- Apply once to the new Uai Bora Supabase project. No service-role key is used by the app.
begin;

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

commit;
