import type { Metadata } from 'next';
import Link from 'next/link';
import { OfficialMascot } from '@/components/brand';
import fair from '@/data/feira-tecnica.json';
export const metadata: Metadata = {title: 'Feira Técnica | Conta seu rolê — Uai Bora', description: 'Compartilhe um passeio gratuito e um pago que você adora. Ajude a construir o Uai Bora.'};
export default function Page() { return <main className="fair-page">
  <header className="fair-top"><Link href="/" className="text-link">← Voltar ao início</Link><Link href="/feira-tecnica/qr" className="secondary-button">Cartaz do estande ↗</Link></header>
  <div className="fair-layout">
    <section className="fair-story" aria-labelledby="fair-title"><span className="fair-pill">FEIRA TÉCNICA · UAI BORA</span><h1 id="fair-title">Seu rolê favorito<br/>pode virar a<br/><em>próxima descoberta.</em></h1><p>Ô, de casa! Conte um lugar gratuito, um lugar pago e o que tornou cada passeio especial.</p><div className="fair-mascot-scene"><span aria-hidden="true" className="fair-doodle one">✦</span><OfficialMascot pose="wave"/><span className="fair-mascot-bubble">Bora trocar uma prosa?</span></div></section>
    <section className="fair-form fair-public-invite" aria-labelledby="fair-invite-title"><span className="eyebrow">2 MINUTINHOS · SEM LOGIN</span><h2 id="fair-invite-title">Conta pra nossa capivara!</h2><p>Abra a pesquisa ou escaneie o QR com seu celular. Pode usar dados móveis ou qualquer Wi-Fi.</p><a href={fair.formUrl} target="_blank" rel="noreferrer" className="primary-button fair-submit">Dar minha opinião ↗</a><a href={fair.formUrl} target="_blank" rel="noreferrer" className="fair-public-qr"><img src={fair.qrImage} width="1000" height="1000" alt="Escaneie para responder à pesquisa do Uai Bora no Google Forms"/></a><div className="poster-prompts"><span>01 · Um lugar gratuito + motivo</span><span>02 · Um lugar pago + motivo</span></div><p className="fair-private">A pesquisa abre no Google Forms. Seu nome e suas respostas ficam privados com a equipe do projeto. O computador não precisa ficar ligado.</p><Link className="text-link" href="/feira-tecnica/qr">Baixar QR code ou cartaz do estande →</Link></section>
  </div>
</main>; }
