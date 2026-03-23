"use client";
import { useState } from "react";

export default function LoginPage() {
  const [tela, setTela] = useState("inicio");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-500 via-red-500 to-black relative overflow-hidden">

      {/* 🔥 FUNDO */}
      <div className="absolute w-[500px] h-[500px] bg-orange-400 rounded-full blur-3xl opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-red-600 rounded-full blur-3xl opacity-30 bottom-[-100px] right-[-100px]" />

      {/* ESQUERDA */}
      <div className="w-1/2 hidden lg:flex flex-col justify-center px-16 text-white z-10">
        <h1 className="text-5xl font-bold mb-6">UaiBora 🚀</h1>
        <p className="text-lg max-w-md text-white/80">
          Descubra eventos, conecte-se com pessoas e viva experiências únicas.
        </p>
      </div>

      {/* ✨ LINHA DIVISÓRIA */}
      <div className="hidden lg:flex items-center justify-center w-[1px] z-10">
        <div className="h-[60%] w-[2px] bg-white/30" />
      </div>

      {/* LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-end z-10 pr-26">
        <div className="bg-white/95 p-12 rounded-3xl shadow-2xl w-full max-w-lg min-h-[500px] flex flex-col justify-center">

          {/* 🧭 TELA INICIAL */}
          {tela === "inicio" && (
            <>
              <h2 className="text-3xl font-bold text-center mb-=2">Bora...?</h2>
              <p className="text-center text-gray-400 mt-20">
                  Acesse sua conta
                </p>

              <button
                onClick={() => setTela("login")}
                className="w-full mb-4 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Entrar com Google
              </button>

              <button
                onClick={() => setTela("cadastro")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg"
              >
                Cadastrar com Google
              </button>
            </>
          )}

          {/* 🔐 LOGIN */}
          {tela === "login" && (
            <>
              <h2 className="text-3xl font-bold text-center mb-6">Entrar</h2>

              <input
                type="email"
                placeholder="Gmail"
                className="w-full mb-3 p-3 border rounded-lg"
              />

              <input
                type="password"
                placeholder="Senha"
                className="w-full mb-4 p-3 border rounded-lg"
              />

              <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg">
                Entrar
              </button>

              <p
                onClick={() => setTela("inicio")}
                className="text-center mt-4 cursor-pointer text-sm text-gray-500"
              >
                Voltar
              </p>
            </>
          )}

          {/* 🆕 CADASTRO */}
          {tela === "cadastro" && (
            <>
              <h2 className="text-3xl font-bold text-center mb-6">Criar conta </h2>

              <input
                type="email"
                placeholder="Gmail"
                className="w-full mb-3 p-3 border rounded-lg"
              />

              <input
                type="password"
                placeholder="Senha"
                className="w-full mb-4 p-3 border rounded-lg"
              />

              <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg">
                Criar conta
              </button>

              <p
                onClick={() => setTela("inicio")}
                className="text-center mt-4 cursor-pointer text-sm text-gray-500"
              >
                Voltar
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}