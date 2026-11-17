"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { OfficialMascot } from './brand';

export function FeiraTecnica() {
  const id = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedName, setSavedName] = useState('');
  const [testMode, setTestMode] = useState(false);
  const submitting = useRef(false);
  useEffect(() => {setTestMode(new URLSearchParams(window.location.search).get('teste') === '1');}, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const fields = new FormData(event.currentTarget);
    id.current ||= crypto.randomUUID();
    const payload: Record<string, unknown> = {id: id.current, consent: fields.get('consent') === 'on'};
    for (const field of ['name', 'free_place', 'free_reason', 'paid_place', 'paid_reason', 'website']) payload[field] = String(fields.get(field) || '').trim();
    submitting.current = true; setBusy(true); setError('');
    try {
      const response = await fetch('/api/feira-tecnica', {method: 'POST', headers: {'Content-Type': 'application/json', ...(testMode ? {'x-uaibora-validation': '1'} : {})}, body: JSON.stringify(payload)});
      const data = await response.json();
      if (!response.ok || data.saved !== true) throw Error(data.error || 'Não conseguimos confirmar o envio. Tente novamente.');
      setSavedName(String(payload.name));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Confira sua conexão e tente novamente. Suas respostas continuam aqui.');
    } finally { submitting.current = false; setBusy(false); }
  }

  if (savedName) return <main className="fair-page fair-success">
    <Link href="/" className="text-link">← Voltar ao Uai Bora</Link>
    <section aria-labelledby="fair-thanks" role="status">
      <span className="fair-sparkles" aria-hidden="true">✦ · ✧ · ✦</span>
      <OfficialMascot pose="point" className="fair-thanks-mascot"/>
      <span className="fair-pill">RESPOSTA SALVA · VALEU DEMAIS!</span>
      {testMode && <small>Teste da equipe · não entra no total de participantes reais.</small>}
      <h1 id="fair-thanks">Obrigada, {savedName.split(' ')[0]}!</h1>
      <p>Você ajudou a deixar o Uai Bora<br/><strong>mais a cara de quem vive BH.</strong></p>
      <p className="fair-thanks-note">Obrigada por nos ajudar a melhorar o Uai Bora.<br/>Suas descobertas vão inspirar nossos próximos rolês!</p>
      <Link href="/" className="primary-button">Bora descobrir BH? →</Link>
    </section>
  </main>;

  return <main className="fair-page">
    <header className="fair-top"><Link href="/" className="text-link">← Voltar ao início</Link><Link href="/feira-tecnica/qr" className="secondary-button">QR code do estande ↗</Link></header>
    {testMode && <p className="fair-pill">Modo de teste da equipe · requer admin local e não altera o total real.</p>}
    <div className="fair-layout">
      <section className="fair-story" aria-labelledby="fair-title">
        <span className="fair-pill">FEIRA TÉCNICA · UAI BORA</span>
        <h1 id="fair-title">Seu rolê favorito<br/>pode virar a<br/><em>próxima descoberta.</em></h1>
        <p>Ô, de casa! Conte dois lugares de que você gosta e ajude a gente a descobrir uma BH ainda mais incrível.</p>
        <div className="fair-mascot-scene"><span aria-hidden="true" className="fair-doodle one">✦</span><OfficialMascot pose="wave"/><span aria-hidden="true" className="fair-doodle two">♡</span><span className="fair-mascot-bubble">Bora trocar uma prosa?</span></div>
        <p className="fair-duration">2 perguntas · cerca de 2 minutos · sem precisar de login</p>
      </section>
      <form className="fair-form form-stack" onSubmit={submit}>
        <div className="fair-form-heading"><span className="eyebrow">QUEM É DE BH SABE DOS TREM BÃO</span><h2>Conta pra nossa capivara!</h2><p>Todos os campos abaixo são obrigatórios.</p></div>
        <label>Como podemos te chamar?<input name="name" required minLength={2} maxLength={80} autoComplete="given-name" placeholder="Seu primeiro nome já tá ótimo" disabled={busy}/></label>
        <div className="fair-trap" aria-hidden="true"><label>Não preencher<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <fieldset className="fair-question free-question" disabled={busy}>
          <legend><span>01</span> Um rolê de graça</legend>
          <p>Qual lugar com entrada gratuita você já visitou ou gosta de frequentar? E por que gostou?</p>
          <label>Nome do lugar gratuito<input name="free_place" required minLength={2} maxLength={160} placeholder="Ex.: uma praça, um parque, um museu…"/></label>
          <label>O que fez você gostar desse lugar?<textarea name="free_reason" required minLength={10} maxLength={1200} rows={3} placeholder="A vista, a tranquilidade, as pessoas, a cultura… conta pra gente!"/></label>
          <small>Considere a entrada gratuita, mesmo que você tenha comprado algo por lá.</small>
        </fieldset>
        <fieldset className="fair-question paid-question" disabled={busy}>
          <legend><span>02</span> Um rolê que valeu o ingresso</legend>
          <p>Qual lugar ou evento com entrada paga você já visitou ou gosta de frequentar? E por que gostou?</p>
          <label>Nome do lugar ou evento pago<input name="paid_place" required minLength={2} maxLength={160} placeholder="Ex.: um festival, uma feira, um espetáculo…"/></label>
          <label>Por que essa experiência valeu a pena?<textarea name="paid_reason" required minLength={10} maxLength={1200} rows={3} placeholder="O que tornou esse passeio especial?"/></label>
          <small>Aqui, pense em um passeio com ingresso ou taxa de entrada.</small>
        </fieldset>
        <label className="fair-consent"><input type="checkbox" name="consent" required disabled={busy}/><span>Concordo que a equipe do Uai Bora guarde meu nome e minhas respostas para esta pesquisa e para melhorar a plataforma. As respostas não serão publicadas no site.</span></label>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="primary-button fair-submit" disabled={busy}>{busy ? 'Guardando suas descobertas…' : 'Enviar e ajudar o Uai Bora →'}</button>
        <small className="fair-private">Suas respostas vão para a equipe do projeto. Não inclua endereço de casa, telefone ou informações sensíveis.</small>
      </form>
    </div>
  </main>;
}
