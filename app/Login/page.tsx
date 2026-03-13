export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">

      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          UaiBora
        </h1>

        <form className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Seu email"
            className="p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Sua senha"
            className="p-3 border rounded-lg"
          />

          <button
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            Entrar
          </button>

        </form>

        <p className="text-center text-sm mt-4">
          Não tem conta? Cadastre-se
        </p>

      </div>

    </div>
  )
}