-- Lugares editoriais e eventos DEMONSTRATIVOS para apresentação local.
begin;
alter table public.uaibora_places alter column user_id drop not null;
alter table public.uaibora_events alter column user_id drop not null;
alter table public.uaibora_events add column is_demo boolean not null default false;
create or replace function public.uaibora_admin_create(p_token text,p_kind text,p_data jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare record_id uuid;
begin
 if p_token is null or not exists(select 1 from uaibora_private.admin_bridge where singleton and token_hash=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex')) then raise exception 'unauthorized' using errcode='42501'; end if;
 if p_kind='places' then
  insert into public.uaibora_places(title,category,location,description,image_path,published,moderation_status,reviewed_at)
  values(p_data->>'title',p_data->>'category',p_data->>'location',p_data->>'description',p_data->>'image_path',true,'approved',now()) returning id into record_id;
 elsif p_kind='events' then
  insert into public.uaibora_events(title,category,location,description,image_path,place_id,starts_at,ends_at,is_demo,published,moderation_status,reviewed_at)
  values(p_data->>'title',p_data->>'category',p_data->>'location',p_data->>'description',p_data->>'image_path',nullif(p_data->>'place_id','')::uuid,(p_data->>'starts_at')::timestamptz,nullif(p_data->>'ends_at','')::timestamptz,coalesce((p_data->>'is_demo')::boolean,false),true,'approved',now()) returning id into record_id;
 else raise exception 'invalid kind'; end if;
 return jsonb_build_object('id',record_id);
end $$;
revoke all on function public.uaibora_admin_create(text,text,jsonb) from public;
grant execute on function public.uaibora_admin_create(text,text,jsonb) to anon,authenticated;
insert into public.uaibora_places(id,title,category,location,description,image_path,published,moderation_status)
values
('b0000000-0000-4000-8000-000000000001','Igrejinha da Pampulha','Cultura','Igreja São Francisco de Assis, Pampulha, Belo Horizonte','Arquitetura, arte e uma vista que é a cara de BH. Descubra o entorno da Lagoa da Pampulha e confira as condições de visitação nos canais oficiais.','/images/pampulha.jpg',true,'approved'),
('b0000000-0000-4000-8000-000000000002','Praça da Liberdade','Ao ar livre','Praça da Liberdade, Funcionários, Belo Horizonte','Jardins, encontros e cultura no coração de BH. Explore a praça e os espaços culturais da região; confira os horários de cada espaço antes de sair.','/images/liberdade.jpg',true,'approved');
insert into public.uaibora_events(id,place_id,title,category,location,description,image_path,starts_at,is_demo,published,moderation_status)
values
('e0000000-0000-4000-8000-000000000001','b0000000-0000-4000-8000-000000000001','Som no horizonte','Show','Pampulha · BH','EVENTO FICTÍCIO para apresentação do Uai Bora. Nome, data e associação ao local são exemplos; não existe programação confirmada nem ingressos.','/images/show.jpg','2026-12-20T19:00:00-03:00',true,true,'approved'),
('e0000000-0000-4000-8000-000000000002','b0000000-0000-4000-8000-000000000002','Encontro das Gerais','Festival','Praça da Liberdade · BH','EVENTO FICTÍCIO para demonstrar a plataforma. Não representa evento confirmado na Praça da Liberdade.','/images/festival.jpg','2026-12-12T16:00:00-03:00',true,true,'approved'),
('e0000000-0000-4000-8000-000000000003','b0000000-0000-4000-8000-000000000002','Bora de sabores','Gastronomia','Praça da Liberdade · BH','EVENTO FICTÍCIO para demonstração. A gastronomia inspira este exemplo; não há oferta, venda ou evento confirmado.','/images/gastronomia.jpg','2026-12-05T12:00:00-03:00',true,true,'approved');
commit;
