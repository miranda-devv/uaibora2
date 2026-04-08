export default function MetricasPage() {
  const stats = [
    { label: "Usuários Ativos", value: "1.284", change: "+12%", trend: "up" },
    { label: "Novas Sugestões", value: "42", change: "+5%", trend: "up" },
    { label: "Check-ins (Hoje)", value: "156", change: "-2%", trend: "down" },
    { label: "Eventos Futuros", value: "18", change: "Estável", trend: "neutral" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Relatórios & Métricas</h2>
          <p className="text-white/30 text-base mt-2">Visualize o crescimento e o engajamento na plataforma.</p>
        </div>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1c1917] border border-white/5 p-6 rounded-3xl shadow-lg hover:border-orange-500/20 transition-all group">
            <p className="text-[10px] font-black text-white/20 mb-3 tracking-[0.2em] uppercase">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">{stat.value}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                stat.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' :
                stat.trend === 'down' ? 'text-red-500 bg-red-500/10' :
                'text-white/20 bg-white/5'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder para Gráfico */}
      <div className="bg-[#1c1917] border border-white/5 rounded-[2.5rem] h-[450px] flex items-center justify-center relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-red-500/5 opacity-50" />
        
        <div className="text-center z-10">
          <div className="text-5xl mb-6 filter drop-shadow-2xl">📊</div>
          <h4 className="text-white font-bold text-lg">Engajamento Semanal</h4>
          <p className="text-white/20 text-xs mt-2 uppercase tracking-widest font-black">Visualização de Dados em Tempo Real</p>
          <div className="mt-8 flex gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-75" />
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
          </div>
        </div>
        
        {/* Mock de linhas do gráfico */}
        <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end gap-1.5 px-6 opacity-10 group-hover:opacity-25 transition-all duration-700">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-orange-500/50 to-red-600/50 rounded-t-lg transition-all duration-500 hover:orange-500" 
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
