-- Pesquisa privada do estande. Não altera dados ou tabelas antigas.
begin;
create table uaibora_private.feira_responses (
 id uuid primary key,
 name text not null check(char_length(name) between 2 and 80),
 free_place text not null check(char_length(free_place) between 2 and 160),
 free_reason text not null check(char_length(free_reason) between 10 and 1200),
 paid_place text not null check(char_length(paid_place) between 2 and 160),
 paid_reason text not null check(char_length(paid_reason) between 10 and 1200),
 consent boolean not null check(consent),
 is_test boolean not null default false,
 created_at timestamptz not null default now()
);
alter table uaibora_private.feira_responses enable row level security;
revoke all on uaibora_private.feira_responses from public,anon,authenticated;
create or replace function public.uaibora_feira(p_token text,p_action text,p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare page_offset integer;
begin
 if p_token is null or not exists(select 1 from uaibora_private.admin_bridge where singleton and token_hash=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex')) then raise exception 'unauthorized' using errcode='42501'; end if;
 if p_action='submit' then
  insert into uaibora_private.feira_responses(id,name,free_place,free_reason,paid_place,paid_reason,consent,is_test)
  values((p_data->>'id')::uuid,p_data->>'name',p_data->>'free_place',p_data->>'free_reason',p_data->>'paid_place',p_data->>'paid_reason',coalesce((p_data->>'consent')::boolean,false),coalesce((p_data->>'is_test')::boolean,false))
  on conflict(id) do nothing;
  return jsonb_build_object('saved',true);
 elsif p_action='list' then
  page_offset=greatest(0,least(coalesce((p_data->>'offset')::integer,0),1000000));
  return jsonb_build_object('total',(select count(*) from uaibora_private.feira_responses where not is_test or coalesce((p_data->>'include_tests')::boolean,false)),'data',coalesce((select jsonb_agg(to_jsonb(r)) from(select * from uaibora_private.feira_responses where not is_test or coalesce((p_data->>'include_tests')::boolean,false) order by created_at desc,id limit 100 offset page_offset) r),'[]'::jsonb));
 else raise exception 'invalid action'; end if;
end $$;
revoke all on function public.uaibora_feira(text,text,jsonb) from public;
grant execute on function public.uaibora_feira(text,text,jsonb) to anon,authenticated;
commit;
