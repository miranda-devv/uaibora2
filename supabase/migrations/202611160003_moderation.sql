-- Administração de apresentação. Token de serviço próprio fica somente no servidor.
begin;
create schema if not exists uaibora_private;
revoke all on schema uaibora_private from public, anon, authenticated;
create table uaibora_private.admin_bridge (singleton boolean primary key default true check(singleton), token_hash text not null);
insert into uaibora_private.admin_bridge(singleton,token_hash) values(true,'6412a41d1cda60022d86495da3b73af29461d12c242618d2f7384629f2726ec9');
alter table uaibora_private.admin_bridge enable row level security;
revoke all on uaibora_private.admin_bridge from public, anon, authenticated;
alter table public.uaibora_places add column moderation_status text not null default 'pending' check(moderation_status in ('pending','approved','rejected')), add column reviewed_at timestamptz;
alter table public.uaibora_events add column moderation_status text not null default 'pending' check(moderation_status in ('pending','approved','rejected')), add column reviewed_at timestamptz;
alter table public.uaibora_suggestions add column moderation_status text not null default 'pending' check(moderation_status in ('pending','approved','rejected')), add column reviewed_at timestamptz;
update public.uaibora_places set moderation_status='approved' where published;
update public.uaibora_events set moderation_status='approved' where published;
drop policy "Visitors can read shared suggestions" on public.uaibora_suggestions;
create policy "Read approved or own suggestions" on public.uaibora_suggestions for select to anon,authenticated using(moderation_status='approved' or user_id=(select auth.uid()));
revoke insert on public.uaibora_suggestions from authenticated;
grant insert(user_id,title,category,location,description) on public.uaibora_suggestions to authenticated;

create or replace function public.uaibora_admin(p_token text,p_action text default 'list',p_kind text default null,p_id uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; affected integer;
begin
 if p_token is null or not exists(select 1 from uaibora_private.admin_bridge where singleton and token_hash=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex')) then raise exception 'unauthorized' using errcode='42501'; end if;
 if p_action='list' then
  return jsonb_build_object(
   'places',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select * from public.uaibora_places order by created_at desc limit 100) t),
   'events',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select * from public.uaibora_events order by created_at desc limit 100) t),
   'suggestions',(select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from (select * from public.uaibora_suggestions order by created_at desc limit 100) t));
 end if;
 if p_action not in ('approve','reject') or p_kind not in ('places','events','suggestions') or p_id is null then raise exception 'invalid action'; end if;
 if p_kind='places' then
  update public.uaibora_places set published=(p_action='approve'),moderation_status=case when p_action='approve' then 'approved' else 'rejected' end,reviewed_at=now() where id=p_id;
 elsif p_kind='events' then
  if p_action='approve' and exists(select 1 from public.uaibora_events e join public.uaibora_places p on p.id=e.place_id where e.id=p_id and not p.published) then raise exception 'Approve the place first'; end if;
  update public.uaibora_events set published=(p_action='approve'),moderation_status=case when p_action='approve' then 'approved' else 'rejected' end,reviewed_at=now() where id=p_id;
 else
  update public.uaibora_suggestions set moderation_status=case when p_action='approve' then 'approved' else 'rejected' end,reviewed_at=now() where id=p_id;
 end if;
 get diagnostics affected=row_count;
 if affected=0 then raise exception 'record not found'; end if;
 return jsonb_build_object('ok',true);
end $$;
revoke all on function public.uaibora_admin(text,text,text,uuid) from public;
grant execute on function public.uaibora_admin(text,text,text,uuid) to anon,authenticated;
commit;
