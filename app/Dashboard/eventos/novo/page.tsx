"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NovoEventoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const localId = searchParams.get("localId");

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!localId) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Local não especificado. Volte e selecione um local.</p>
        <button onClick={() => router.back()} className="mt-4 text-white/50 hover:text-white">← Voltar</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, localId }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Evento publicado com sucesso! Redirecionando..." });
        setTimeout(() => router.push("/Dashboard/home"), 2000);
      } else {
        setStatus({ type: "error", message: data.message });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Erro ao conectar com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <header className="mb-12">
        <button 
          onClick={() => router.back()}
          className="text-white/40 hover:text-white mb-6 transition-colors flex items-center gap-2"
        >
          ← Voltar
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Novo Evento 🚀
        </h1>
        <p className="text-white/50 text-lg mt-2">
          Preencha os detalhes para divulgar seu evento em BH.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {status && (
          <div className={`p-4 rounded-xl text-sm font-medium \${
            status.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {status.message}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2 text-white/70">Título do Evento</label>
          <input
            required
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            placeholder="Ex: Noite do Jazz"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-white/70">Data e Hora Início</label>
            <input
              required
              type="datetime-local"
              value={formData.dataInicio}
              onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white/70">Data e Hora Fim</label>
            <input
              required
              type="datetime-local"
              value={formData.dataFim}
              onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-white/70">Descrição</label>
          <textarea
            rows={4}
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
            placeholder="Conte um pouco sobre o que vai rolar..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:scale-100"
        >
          {loading ? "Publicando..." : "Publicar Evento 🔥"}
        </button>
      </form>
    </div>
  );
}

export default function NovoEventoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <Suspense fallback={<div className="text-center py-20">Carregando formulário...</div>}>
        <NovoEventoForm />
      </Suspense>
    </div>
  );
}
