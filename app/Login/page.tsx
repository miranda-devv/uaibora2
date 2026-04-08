"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tela, setTela] = useState("inicio");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/Dashboard/home");
      } else {
        setErro(data.message || "Erro ao fazer login.");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (data.success) {
        setTela("login");
        setErro("");
        alert("Conta criada com sucesso! Agora você pode fazer login.");
      } else {
        setErro(data.message || "Erro ao criar conta.");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

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

          {erro && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
              <p className="text-sm">{erro}</p>
            </div>
          )}

          {/* 🧭 TELA INICIAL */}
          {tela === "inicio" && (
            <>
              <h2 className="text-3xl font-bold text-center mb-=2 font-heading">Bora...?</h2>
              <p className="text-center text-gray-400 mt-20">
                  Acesse sua conta
                </p>

              <button
                onClick={() => setTela("login")}
                className="w-full mb-4 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition shadow-sm font-medium"
              >
                Entrar com Email
              </button>

              <button
                onClick={() => setTela("cadastro")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:shadow-lg transition font-medium"
              >
                Criar nova conta
              </button>
            </>
          )}

          {/* 🔐 LOGIN */}
          {tela === "login" && (
            <form onSubmit={handleLogin}>
              <h2 className="text-3xl font-bold text-center mb-6">Entrar</h2>

              <input
                type="email"
                placeholder="Seu Gmail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <input
                type="password"
                placeholder="Sua Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 shadow-md"
              >
                {carregando ? "Carregando..." : "Entrar"}
              </button>

              <p
                onClick={() => { setTela("inicio"); setErro(""); }}
                className="text-center mt-6 cursor-pointer text-sm text-gray-500 hover:text-orange-600 transition"
              >
                ← Voltar
              </p>
            </form>
          )}

          {/* 🆕 CADASTRO */}
          {tela === "cadastro" && (
            <form onSubmit={handleRegister}>
              <h2 className="text-3xl font-bold text-center mb-6">Criar conta</h2>

              <input
                type="text"
                placeholder="Seu Nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <input
                type="email"
                placeholder="Seu Gmail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <input
                type="password"
                placeholder="Sua Senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 shadow-md"
              >
                {carregando ? "Carregando..." : "Criar conta"}
              </button>

              <p
                onClick={() => { setTela("inicio"); setErro(""); }}
                className="text-center mt-6 cursor-pointer text-sm text-gray-500 hover:text-orange-600 transition"
              >
                ← Voltar
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}