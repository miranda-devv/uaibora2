"use client";

import { useEffect, useState } from "react";

interface Solicitacao {
  id: string;
  nome: string;
  categoria: string;
  criadoEm: string;
  sugeridoPor?: {
    nome: string;
    email: string;
  };
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/solicitacoes");
      const data = await res.json();
      if (data.success) {
        setSolicitacoes(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erro ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecisao = async (id: string, status: "APROVADO" | "REJEITADO") => {
    try {
      const res = await fetch(`/api/admin/solicitacoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        // Remover da lista local após ação
        setSolicitacoes(prev => prev.filter(s => s.id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erro ao processar decisão.");
    }
  };

  if (loading) return <div className="text-white/40 animate-pulse py-12 text-center text-lg">Carregando sugestões... ⏳</div>;

  if (error) return <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-2xl text-red-400 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sugestões de Locais</h2>
          <p className="text-white/40 text-sm italic">Revise as contribuições da nossa comunidade.</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 px-5 py-2 rounded-[14px] text-orange-400 text-sm font-bold shadow-lg shadow-orange-500/5">
          {solicitacoes.length} pedentes
        </div>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-20 text-center">
          <p className="text-white/30 text-lg">Tudo limpo por aqui! ✨</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {solicitacoes.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.07] hover:border-orange-500/20 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-orange-500/10 text-orange-500 rounded-md border border-orange-500/20">
                    {s.categoria}
                  </span>
                  <span className="text-white/10 text-xs">|</span>
                  <span className="text-xs text-white/30 font-medium">{new Date(s.criadoEm).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold mb-1 text-white/90 group-hover:text-white">{s.nome}</h3>
                <p className="text-xs text-white/40">
                  Enviado por: <span className="text-orange-400/80 font-semibold">{s.sugeridoPor?.nome}</span> <span className="text-white/20">({s.sugeridoPor?.email})</span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDecisao(s.id, "REJEITADO")}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/50 text-white/40 hover:text-red-400 rounded-xl text-sm font-black transition-all uppercase tracking-wider"
                >
                  Recusar
                </button>
                <button 
                  onClick={() => handleDecisao(s.id, "APROVADO")}
                  className="flex-1 md:flex-none px-8 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl hover:shadow-orange-600/30 text-white rounded-xl text-sm font-black transition-all uppercase tracking-wider transform hover:scale-[1.03] active:scale-95"
                >
                  Autorizar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
