"use client";
import Link from 'next/link';
import { OfficialMascot } from './brand';
import fair from '@/data/feira-tecnica.json';

export function FairQr() {
  return <main className="fair-qr-page">
    <header className="fair-top qr-controls"><Link className="text-link" href="/feira-tecnica">← Voltar à Feira Técnica</Link><Link className="text-link" href="/">Início →</Link></header>
    <div className="qr-setup qr-controls"><h2>O QR público do nosso estande</h2><p>Abre a pesquisa no Google Forms, sem login. Funciona com dados móveis ou qualquer Wi-Fi, mesmo com o computador desligado.</p><p>As respostas ficam privadas na conta Google da equipe.</p></div>
    <section className="fair-poster" aria-labelledby="poster-title">
      <span className="fair-pill">FEIRA TÉCNICA · UAI BORA</span>
      <h1 id="poster-title">Qual é o seu<br/><em>rolê favorito em BH?</em></h1>
      <p>Escaneie, conte duas descobertas<br/>e ajude o Uai Bora a crescer.</p>
      <div className="poster-art"><OfficialMascot className="poster-mascot" pose="point"/><div className="poster-code"><img src={fair.qrImage} width="1000" height="1000" alt="QR code público da pesquisa Uai Bora no Google Forms"/></div></div>
      <div className="poster-prompts"><span>01 · Um lugar gratuito</span><span>02 · Um lugar pago</span></div>
      <strong className="poster-thanks">Sua dica pode virar o próximo rolê de alguém. ♡</strong>
      <a href={fair.formUrl} className="poster-url" target="_blank" rel="noreferrer">{fair.formUrl}</a>
    </section>
    <div className="modal-actions qr-controls qr-downloads"><a className="primary-button" download="uai-bora-feira-qr-publico.png" href={fair.qrImage}>Baixar QR code público</a><a className="secondary-button" download="uai-bora-feira-cartaz-publico.png" href={fair.posterImage}>Baixar cartaz completo</a><button className="secondary-button" onClick={() => window.print()}>Imprimir cartaz / salvar PDF</button><a className="secondary-button" href={fair.formUrl} target="_blank" rel="noreferrer">Responder à pesquisa ↗</a></div>
  </main>;
}
