"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { FairResponse } from '@/lib/feira-validation';
import fair from '@/data/feira-tecnica.json';

export function FairAdmin() {
  const [rows, setRows] = useState<FairResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [tests, setTests] = useState(false);
  async function load(page: number, includeTests = tests) {
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/admin/feira-tecnica?offset=' + page + (includeTests ? '&tests=1' : ''), {cache: 'no-store'});
      const p = await r.json(); if (!r.ok) throw Error(p.error);
      setRows(p.data); setTotal(p.total); setOffset(page);
    } catch (cause) {setError(cause instanceof Error ? cause.message : 'Não foi possível carregar.');}
    finally {setBusy(false);}
  }
  useEffect(() => {void load(0);}, []);
  function download() {
    const cell = (value: string) => '"' + (/^[=+\-@\t\r]/.test(value) ? "'" : '') + value.replaceAll('"', '""') + '"';
    const csv = [['Nome', 'Lugar gratuito', 'Por que gostou', 'Lugar pago', 'Por que gostou', 'Enviado em'], ...rows.map(r => [r.name, r.free_place, r.free_reason, r.paid_place, r.paid_reason, r.created_at])].map(line => line.map(cell).join(';')).join('\r\n');
    const href = URL.createObjectURL(new Blob(['\ufeff' + csv], {type: 'text/csv;charset=utf-8'}));
    const a = document.createElement('a'); a.href = href; a.download = 'uai-bora-feira-respostas-pagina-' + (offset / 100 + 1) + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  const visible = rows.filter(r => [r.name, r.free_place, r.free_reason, r.paid_place, r.paid_reason].join(' ').toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return <section className="fair-admin">
    <div className="qr-setup"><h2>Pesquisa pública · Google Forms</h2><p>As novas respostas do QR público ficam na conta Google da equipe. A lista abaixo preserva somente os envios do formulário anterior do site.</p><div className="modal-actions"><a className="primary-button" href={fair.responsesUrl} target="_blank" rel="noreferrer">Ver novas respostas ↗</a><a className="secondary-button" href={fair.sheetUrl} target="_blank" rel="noreferrer">Abrir planilha ↗</a></div></div>
    <div className="admin-command"><div><span className="eyebrow">QUEM PASSOU PELO NOSSO ESTANDE</span><h2>Feira Técnica</h2><p><strong>{total}</strong> {total === 1 ? 'participação recebida' : 'participações recebidas'} · respostas privadas da pesquisa</p></div><Link className="primary-button" href="/feira-tecnica/qr">Abrir QR code do estande ↗</Link></div>
    <div className="catalog-filters"><label>Buscar nesta página<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nome, lugar ou palavra na resposta"/></label><button className="secondary-button" disabled={busy} onClick={() => void load(offset)}>Atualizar respostas</button><button className="secondary-button" disabled={!rows.length || busy} onClick={download}>Baixar esta página em CSV</button></div>
    <label className="checkbox-label"><input type="checkbox" checked={tests} onChange={e => {setTests(e.target.checked); void load(0, e.target.checked);}}/>Incluir respostas de teste da equipe</label>
    {busy && <p role="status">Buscando as descobertas da turma…</p>}
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="fair-response-grid">{visible.map(r => <article key={r.id} className="fair-response"><header><h3>{r.name}{r.is_test && <small> · TESTE</small>}</h3><time dateTime={r.created_at}>{new Date(r.created_at).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'})}</time></header><section><span className="price-badge free">01 · Gratuito</span><h4>{r.free_place}</h4><p>{r.free_reason}</p></section><section><span className="price-badge paid">02 · Pago</span><h4>{r.paid_place}</h4><p>{r.paid_reason}</p></section></article>)}</div>
    {!busy && !error && !visible.length && <div className="empty-state"><h3>{total ? 'Nenhuma resposta nesta busca.' : 'Nenhuma participação no formulário anterior.'}</h3><p>As respostas do QR público são consultadas no Google Forms ou na planilha pelos botões acima.</p></div>}
    {total > 100 && <div className="modal-actions"><button disabled={busy || offset === 0} onClick={() => void load(Math.max(0, offset - 100))}>← Anteriores</button><span>{offset + 1}–{Math.min(offset + 100, total)} de {total}</span><button disabled={busy || offset + 100 >= total} onClick={() => void load(offset + 100)}>Próximas →</button></div>}
  </section>;
}
