"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Local {
  id: string;
  nome: string;
  statusAprovacao: string;
  categoria: string;
}

export default function MeusEventosPage() {
  const router = useRouter();
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocais() {
      try {
        const res = await fetch("/api/locais/meus");
        const json = await res.json();
        if (json.success) {
          setLocais(json.data);
        }
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLocais();
  }, []);

  const locaisAprovados = locais.filter(l => l.statusAprovacao === "APROVADO");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto py-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Gerenciar Eventos 🎭
            </h1>
            <p className="text-white/50 mt-2">Publique eventos nos seus locais aprovados.</p>
          </div>
          <button 
            onClick={() => router.push("/Dashboard/home")}
            className="text-white/40 hover:text-white transition-colors"
          >
            Voltar para Home
          </button>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/10" />)}
          </div>
        ) : locaisAprovados.length > 0 ? (
          <div className="grid gap-6">
            {locaisAprovados.map(local => (
              <div 
                key={local.id} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold">{local.nome}</h3>
                  <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">{local.categoria}</span>
                </div>
                <button
                  onClick={() => router.push(`/Dashboard/eventos/novo?localId=\${local.id}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  + Novo Evento
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold">Nenhum local aprovado</h3>
            <p className="text-white/50 mb-6">Você precisa ter um local aprovado para publicar eventos.</p>
            <button
              onClick={() => router.push("/Dashboard/sugerir")}
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold border border-white/10 transition-all"
            >
              Sugerir um Local
            </button>
          </div>
        )}

        {locais.some(l => l.statusAprovacao === "PENDENTE") && (
          <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-amber-400 text-sm">
              💡 Você tem locais aguardando aprovação. Assim que forem revisados, aparecerão aqui para você criar eventos!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
