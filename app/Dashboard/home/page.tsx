"use client";

import { useEffect, useState } from "react";

interface FeedItem {
  evento_id: string;
  evento_titulo: string;
  evento_descricao: string | null;
  data_inicio: string;
  data_fim: string;
  local_id: string;
  local_nome: string;
  local_categoria: string | null;
  latitude: number | null;
  longitude: number | null;
  local_descricao: string | null;
}

const categoriaCores: Record<string, string> = {
  Cultura: "from-yellow-400 to-amber-500",
  Gastronomia: "from-orange-500 to-red-600",
  Lazer: "from-amber-400 to-orange-500",
  Noite: "from-red-600 to-rose-700",
  Natureza: "from-orange-700 to-red-800",
  Passeio: "from-yellow-500 to-orange-600",
};

const categoriaEmojis: Record<string, string> = {
  Cultura: "🏛️",
  Gastronomia: "🧀",
  Lazer: "🌊",
  Noite: "🍻",
  Natureza: "🌳",
  Passeio: "⛰️",
};

export default function HomePage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const response = await fetch("/api/feed/descubra");
        const json = await response.json();
        if (json.success) {
          setFeed(json.data);
        }
      } catch (error) {
        console.error("Erro ao carregar feed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0f0a] to-[#2a0a05] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            UaiBora 🚀
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">Bem-vindo!</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/20">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            Bora sair em <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">BH</span>? 🔥
          </h2>
          <p className="text-white/50 text-lg">
            Os melhores eventos e lugares na capital mineira
          </p>
        </div>
        <button
          onClick={() => window.location.href = "/Dashboard/sugerir"}
          className="bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 rounded-xl px-6 py-3 font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
        >
          <span className="group-hover:scale-110 transition-transform">➕</span> Sugerir Local
        </button>
      </section>

      {/* Feed de lugares */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : feed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((item) => {
              const categoria = item.local_categoria || "Passeio";
              return (
                <div
                  key={item.evento_id}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-950/20 cursor-pointer overflow-hidden"
                >
                  {/* Emoji grande */}
                  <div className="text-5xl mb-4 relative z-10">{categoriaEmojis[categoria] || "📍"}</div>

                  {/* Categoria badge */}
                  <span
                    className={`relative z-10 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                      categoriaCores[categoria] || "from-orange-500 to-red-600"
                    } mb-3`}
                  >
                    {categoria}
                  </span>

                  {/* Nome do Evento */}
                  <h3 className="relative z-10 text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {item.evento_titulo}
                  </h3>

                  {/* Descrição do Evento ou Local */}
                  <p className="relative z-10 text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.evento_descricao || item.local_descricao || "Sem descrição disponível."}
                  </p>

                  {/* Localização */}
                  <div className="relative z-10 flex items-center gap-2 text-white/30 text-xs mt-auto">
                    <span>🏠</span>
                    <span className="font-semibold uppercase tracking-wider">{item.local_nome}</span>
                  </div>

                  {/* Efeito de brilho no hover adaptado */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${
                    categoriaCores[categoria] || "from-orange-500 to-red-600"
                  } opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none`} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5">
            <div className="text-5xl mb-4">🙌</div>
            <h3 className="text-xl font-bold">Nenhum evento no momento!</h3>
            <p className="text-white/40">Recarregue em breve para ver novidades.</p>
          </div>
        )}
      </main>
    </div>
  );
}
