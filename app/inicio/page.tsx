"use client"; // Necessário no Next.js para botões terem clique

import React from 'react';

export default function HomePage() {
    const categorias = [
        { nome: 'RESTAURANTES', cor: 'bg-[#FFD700]' }, // Amarelo
        { nome: 'TEATROS', cor: 'bg-[#8B4513]' },      // Marrom
        { nome: 'CINEMA', cor: 'bg-[#3232FF]' },       // Azul
        { nome: 'INFANTIL', cor: 'bg-[#FFB347]' },     // Laranja
        { nome: 'BALADAS', cor: 'bg-[#808080]' },      // Cinza
        { nome: 'SHOWS', cor: 'bg-[#FF69B4]' },        // Rosa
        { nome: 'SHOPPINGS', cor: 'bg-[#B22222]' },    // Vermelho
        { nome: 'PRAÇAS', cor: 'bg-[#00CED1]' },       // Ciano
        { nome: 'PARQUES', cor: 'bg-[#228B22]' },      // Verde
        { nome: 'MUSEUS', cor: 'bg-[#DDA0DD]' },       // Lilás
    ];

    return (
        <main className="min-h-screen bg-white text-black p-4 max-w-md mx-auto flex flex-col">

            {/* Topo: Perfil, Busca e Localização */}
            <div className="flex justify-between items-center mb-6 pt-2">
                <div className="flex gap-4 items-center">
                    <div className="text-3xl cursor-pointer">👤</div>
                    <div className="text-2xl cursor-pointer">🔍</div>
                </div>
                <div className="text-3xl text-red-600 cursor-pointer">📍</div>
            </div>

            {/* Botão Voltar e Logo da Capivara */}
            <div className="flex flex-col items-start mb-6">
                <button className="font-bold text-lg flex items-center hover:underline">
                    <span className="mr-1">←</span> Voltar
                </button>

                <div className="w-full flex justify-center mt-2">
                    {/* A imagem deve estar em public/capivara.png */}
                    <img
                        src="/capivara.png"
                        alt="Capivara"
                        className="w-32 h-32 object-contain"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Capivara"; }}
                    />
                </div>
            </div>

            {/* Grid de Categorias (Igual à sua foto do WhatsApp) */}
            <div className="grid grid-cols-2 gap-3 flex-grow pb-20">
                {categorias.map((cat) => (
                    <button
                        key={cat.nome}
                        className={`${cat.cor} text-black font-extrabold py-8 rounded-2xl shadow-md active:scale-95 transition-all text-sm border-b-4 border-black/20`}
                    >
                        {cat.nome}
                    </button>
                ))}
            </div>

            {/* Barra de Navegação estilo Android (Rodapé azul) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#3F51B5] h-14 flex justify-around items-center px-10 border-t border-gray-300">
                <div className="w-4 h-4 bg-gray-300 rotate-45 border border-gray-400"></div>
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-sm border border-gray-400"></div>
            </nav>

        </main>
    );
}