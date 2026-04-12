import { useState } from 'react'
import { signInService } from '../../services/authServices.ts'
import { useNavigate } from 'react-router-dom';


function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  const handleLogin = async (e: any) => {
    e.preventDefault();
    
    try {
      const data = await signInService(email, password.toString());
      const token = data.access_token;

      if (token) {
        localStorage.setItem('@i9:token', token);
        window.location.href = '/projects'; 
      }
    } catch (error) {
      console.error("Falha no login:", error);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#355a92] font-sans text-[#333]">
      <section className="w-full max-w-sm">
        <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Acesse sua conta
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="digite@seuemail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-2"
          >
            Entrar
          </button>

          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-2"
          >
            Criar uma conta
          </button>
        </form>
      </div>
      </section>
    </main>
  )
}

export default SignIn
