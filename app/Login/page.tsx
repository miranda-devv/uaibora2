export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-500 via-red-500 to-black relative overflow-hidden">

      {/* 🔥 EFEITOS DE FUNDO */}
      <div className="absolute w-[500px] h-[500px] bg-orange-400 rounded-full blur-3xl opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-red-600 rounded-full blur-3xl opacity-30 bottom-[-100px] right-[-100px]" />

      {/* 🎨 LADO ESQUERDO */}
      <div className="w-1/2 hidden lg:flex flex-col justify-center px-16 text-white z-10">
        <h1 className="text-5xl font-bold mb-6">
          UaiBora 🚀
        </h1>
        <p className="text-lg max-w-md text-white/80">
          Descubra eventos, conecte-se com pessoas e viva experiências únicas. 
          Bora viver o melhor da sua cidade!
        </p>
      </div>

      {/* ✨ DIFERENCIAL (MEIO) */}
      <div className="hidden lg:flex items-center justify-center w-1/6 z-10">
        <div className="w-[2px] h-[60%] bg-white/30 backdrop-blur-md" />
      </div>

      {/* 🔐 LOGIN (DIREITA) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center z-10 px-6">
        
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-black mb-2 text-center">
            Entrar
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Acesse sua conta
          </p>

          <form className="flex flex-col gap-4">
            
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="password"
              placeholder="Senha"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform"
            >
              Entrar
            </button>

          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Não tem conta?{" "}
            <span className="text-orange-600 font-semibold cursor-pointer hover:underline">
              Cadastre-se
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}