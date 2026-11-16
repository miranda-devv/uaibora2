"use client";
import { useEffect, useState } from "react";
import type { CatalogKind } from "@/lib/catalog-validation";
type Entry = {id:string; title:string; category:string; published:boolean;moderation_status?:string};
type Group = {title:string; kind:CatalogKind; data:Entry[]; error:string};
export function MyEntries({onNew}: {onNew:(kind:CatalogKind)=>void}) {
  const [groups,setGroups] = useState<Group[]>([]);
  const [busy,setBusy] = useState(true);
  const [reload,setReload] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setBusy(true);
    Promise.all(([['Lugares','places','lugares'],['Eventos','events','eventos']] as const).map(async ([title,kind,path]) => {
      try {
        const response = await fetch('/api/' + path + '?meus=1', {signal:abort.signal,cache:'no-store',credentials:'same-origin'});
        const payload = await response.json();
        return {title,kind,data:response.ok ? payload.data as Entry[] : [],error:response.ok ? '' : payload.error || 'Não foi possível carregar.'};
      } catch { return {title,kind,data:[],error:'Não conseguimos carregar seus cadastros agora.'}; }
    })).then(result => {if(!abort.signal.aborted) {setGroups(result);setBusy(false);}});
    return () => abort.abort();
  },[reload]);
  return <div className="form-stack"><p>Seus lugares e eventos enviados. Os envios aparecem no catálogo público depois da aprovação.</p>
    {busy ? <p role="status">Buscando seus cadastros…</p> : groups.map(group => <section key={group.kind}>
      <h3>{group.title}</h3>
      {group.error ? <p className="form-error" role="alert">{group.error}</p> : group.data.length ? <ul className="inline-list">{group.data.map(item => <li key={item.id}><span><strong>{item.title}</strong><br/>{item.category} · {item.published ? 'Publicado' : item.moderation_status==='rejected' ? 'Não aprovado' : 'Em análise'}</span></li>)}</ul> : <p>Você ainda não cadastrou {group.title.toLowerCase()}.</p>}
      <button className="secondary-button" onClick={()=>onNew(group.kind)}>Cadastrar {group.kind==='places'?'lugar':'evento'}</button>
    </section>)}
    <button className="text-link" disabled={busy} onClick={()=>setReload(value=>value+1)}>Atualizar meus cadastros</button>
  </div>;
}
