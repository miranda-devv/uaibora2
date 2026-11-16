-- Amplia apenas as tabelas Uai Bora 2.0. Não acessa bancos antigos.
begin;
alter table public.uaibora_places add column info jsonb not null default '{}'::jsonb;
alter table public.uaibora_events add column info jsonb not null default '{}'::jsonb;
grant insert(info) on public.uaibora_places, public.uaibora_events to authenticated;
create table public.uaibora_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(char_length(display_name) between 2 and 60),
 avatar_url text not null default '' check(char_length(avatar_url)<=2048),
 bio text not null default '' check(char_length(bio)<=500)
);
alter table public.uaibora_profiles enable row level security;
grant select on public.uaibora_profiles to anon,authenticated;
grant insert,update on public.uaibora_profiles to authenticated;
create policy profiles_read on public.uaibora_profiles for select using(true);
create policy profiles_insert on public.uaibora_profiles for insert to authenticated with check(id=(select auth.uid()));
create policy profiles_update on public.uaibora_profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create table public.uaibora_reviews (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.uaibora_profiles(id) on delete cascade,
 item_id text not null check(item_id ~ '^(place|event):[a-f0-9-]{36}$'),
 rating integer not null check(rating between 1 and 5), body text not null check(char_length(body) between 10 and 1500),
 moderation_status text not null default 'pending' check(moderation_status in ('pending','approved','rejected')),
 featured boolean not null default false, created_at timestamptz not null default now(), unique(user_id,item_id)
);
alter table public.uaibora_reviews enable row level security;
grant select on public.uaibora_reviews to anon,authenticated;
grant insert(user_id,item_id,rating,body) on public.uaibora_reviews to authenticated;
grant delete on public.uaibora_reviews to authenticated;
create policy reviews_read on public.uaibora_reviews for select using(moderation_status='approved' or user_id=(select auth.uid()));
create policy reviews_insert on public.uaibora_reviews for insert to authenticated with check(user_id=(select auth.uid()) and (exists(select 1 from public.uaibora_places where 'place:'||id::text=item_id and published) or exists(select 1 from public.uaibora_events where 'event:'||id::text=item_id and published)));
create policy reviews_delete on public.uaibora_reviews for delete to authenticated using(user_id=(select auth.uid()));
create table public.uaibora_review_likes (
 user_id uuid not null references auth.users(id) on delete cascade, review_id uuid not null references public.uaibora_reviews(id) on delete cascade, primary key(user_id,review_id)
);
alter table public.uaibora_review_likes enable row level security;
grant select,insert,delete on public.uaibora_review_likes to authenticated;
create policy likes_read on public.uaibora_review_likes for select to authenticated using(user_id=(select auth.uid()));
create policy likes_insert on public.uaibora_review_likes for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.uaibora_reviews where id=review_id and moderation_status='approved'));
create policy likes_delete on public.uaibora_review_likes for delete to authenticated using(user_id=(select auth.uid()));
create or replace function public.uaibora_counts() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('favorites',coalesce((select jsonb_object_agg(item_id,n) from (select item_id,count(*) n from public.uaibora_favorites group by item_id) x),'{}'::jsonb), 'likes',coalesce((select jsonb_object_agg(review_id,n) from(select review_id,count(*) n from public.uaibora_review_likes group by review_id)x),'{}'::jsonb));
$$;
revoke all on function public.uaibora_counts() from public;
grant execute on function public.uaibora_counts() to anon,authenticated;
create or replace function public.uaibora_admin_manage(p_token text,p_action text,p_kind text default null,p_id uuid default null,p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare new_id uuid; result jsonb;
begin
 if p_token is null or not exists(select 1 from uaibora_private.admin_bridge where singleton and token_hash=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex')) then raise exception 'unauthorized' using errcode='42501'; end if;
 if p_action='list' then
  result=public.uaibora_admin(p_token,'list');
  return result || jsonb_build_object('reviews',coalesce((select jsonb_agg(to_jsonb(r) || jsonb_build_object('title',coalesce(p.display_name,'Visitante'),'description',r.body,'category',r.rating::text||' estrelas','location',r.item_id)) from public.uaibora_reviews r left join public.uaibora_profiles p on p.id=r.user_id),'[]'::jsonb),'metrics',jsonb_build_object('profiles',(select count(*) from public.uaibora_profiles),'favorites',(select count(*) from public.uaibora_favorites),'reviews',(select count(*) from public.uaibora_reviews)));
 end if;
 if p_kind='reviews' then
  if p_action in ('approve','reject') then update public.uaibora_reviews set moderation_status=case when p_action='approve' then 'approved' else 'rejected' end,featured=false where id=p_id;
  elsif p_action='feature' then update public.uaibora_reviews set featured=not featured where id=p_id and moderation_status='approved';
  else raise exception 'invalid action'; end if;
  return jsonb_build_object('ok',true);
 end if;
 if p_action='create' then
  if p_kind='events' and not exists(select 1 from public.uaibora_places where id=(p_data->>'place_id')::uuid and published) then raise exception 'Approve the place first'; end if;
  result=public.uaibora_admin_create(p_token,p_kind,p_data); new_id=(result->>'id')::uuid;
  if p_kind='places' then update public.uaibora_places set info=coalesce(p_data->'info','{}'::jsonb) where id=new_id;
  else update public.uaibora_events set info=coalesce(p_data->'info','{}'::jsonb) where id=new_id; end if;
  return result;
 end if;
 if p_action='update' then
  if p_kind='places' then update public.uaibora_places set title=p_data->>'title',category=p_data->>'category',location=p_data->>'location',description=p_data->>'description',image_path=p_data->>'image_path',info=coalesce(p_data->'info','{}'::jsonb) where id=p_id;
  elsif p_kind='events' then
   if not exists(select 1 from public.uaibora_places where id=(p_data->>'place_id')::uuid and published) then raise exception 'Approve the place first'; end if;
   update public.uaibora_events set title=p_data->>'title',category=p_data->>'category',location=p_data->>'location',description=p_data->>'description',image_path=p_data->>'image_path',info=coalesce(p_data->'info','{}'::jsonb),place_id=(p_data->>'place_id')::uuid,starts_at=(p_data->>'starts_at')::timestamptz,ends_at=nullif(p_data->>'ends_at','')::timestamptz,is_demo=coalesce((p_data->>'is_demo')::boolean,false) where id=p_id;
  else raise exception 'invalid kind'; end if;
  return jsonb_build_object('id',p_id);
 end if;
 if p_action in ('approve','reject') then
  result=public.uaibora_admin(p_token,p_action,p_kind,p_id);
  if p_kind='places' and p_action='reject' then update public.uaibora_events set published=false,moderation_status='rejected',reviewed_at=now() where place_id=p_id; end if;
  return result;
 end if;
 raise exception 'invalid action';
end $$;
revoke all on function public.uaibora_admin_manage(text,text,text,uuid,jsonb) from public;
grant execute on function public.uaibora_admin_manage(text,text,text,uuid,jsonb) to anon,authenticated;
commit;
