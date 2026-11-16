export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Etapa 2 — Aplicação Inicializada com Sucesso
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            <span className="text-white">Uai</span>{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Bora
            </span>{" "}
            🚀
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-xl mx-auto">
            Descubra eventos, conecte-se com pessoas e viva experiências únicas em Minas Gerais.
          </p>
        </div>

        {/* Stack info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <p className="text-xs text-neutral-500 font-mono">Framework</p>
            <p className="text-sm font-semibold text-neutral-200 mt-1">Next.js 16 (App Router)</p>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <p className="text-xs text-neutral-500 font-mono">Tipagem</p>
            <p className="text-sm font-semibold text-neutral-200 mt-1">TypeScript 5</p>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <p className="text-xs text-neutral-500 font-mono">Estilização</p>
            <p className="text-sm font-semibold text-neutral-200 mt-1">Tailwind CSS 4</p>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
            <p className="text-xs text-neutral-500 font-mono">Qualidade</p>
            <p className="text-sm font-semibold text-neutral-200 mt-1">ESLint 9</p>
          </div>
        </div>

        {/* Status notice */}
        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 text-xs text-neutral-400">
          Estrutura limpa e pronta para os próximos passos de reconstrução do Uai Bora.
        </div>
      </div>
    </main>
  );
}
