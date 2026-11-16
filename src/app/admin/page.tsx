"use client";
import Link from 'next/link';
import { AdminPanel } from '@/components/admin-panel';
import { Brand } from '@/components/brand';
export default function Page(){return <main className="workspace-page"><header className="workspace-header"><Brand/><Link className="secondary-button" href="/">← Voltar ao início</Link></header><div className="page-intro"><span className="eyebrow">BASTIDORES DO UAI BORA</span><h1>Administração</h1><p>Cuide do catálogo e de quem faz BH acontecer.</p></div><AdminPanel onChange={()=>{}}/></main>;}
