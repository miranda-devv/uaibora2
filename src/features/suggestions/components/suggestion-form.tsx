"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SuggestionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "Gastronomia",
    descricao: "",
    bairro: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/locais/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: data.message });
        setFormData({ nome: "", categoria: "Gastronomia", descricao: "", bairro: "" });
        setTimeout(() => router.push("/Dashboard/home"), 3000);
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl shadow-orange-950/10">
      {status && (
        <div className={`p-4 rounded-2xl text-sm font-bold uppercase tracking-wide ${
          status.type === "success" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-white/30 ml-1">Nome do Local</label>
        <input
          required
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/20"
          placeholder="Ex: Bar do Juarez"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-white/30 ml-1">Categoria</label>
          <div className="relative">
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none text-white/80"
            >
              <option value="Gastronomia">Gastronomia 🧀</option>
              <option value="Cultura">Cultura 🏛️</option>
              <option value="Lazer">Lazer 🌊</option>
              <option value="Noite">Noite 🍻</option>
              <option value="Natureza">Natureza 🌳</option>
              <option value="Passeio">Passeio ⛰️</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-white/30 ml-1">Bairro</label>
          <input
            type="text"
            value={formData.bairro}
            onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/20"
            placeholder="Ex: Savassi"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-white/30 ml-1">Por que você recomenda?</label>
        <textarea
          rows={4}
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none placeholder:text-white/20"
          placeholder="Descreva o que torna esse lugar especial..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-black uppercase tracking-[0.15em] py-5 rounded-2xl shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 mt-4"
      >
        {loading ? "Enviando..." : "Enviar Sugestão 🚀"}
      </button>
    </form>
  );
}
