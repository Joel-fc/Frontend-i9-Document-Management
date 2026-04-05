import { useState } from 'react'
import { signUp } from '../../services/authServices.ts'
import { useNavigate } from 'react-router-dom';


function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  const handleSignUp = async (e: any) => {
    e.preventDefault();
    
    try {
      const data = await signUp(email, name, password.toString());
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="w-full max-w-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crie sua conta
        </h1>

        <form className="space-y-4">
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                Nome
            </label>
            <input id="name"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            ></input>
          </div>
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
            type="button"
            onClick={handleSignUp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-2"
          >
            Registrar
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 mt-2"
          >
            Voltar
          </button>
        </form>
      </div>
    </section>
  )
}

export default SignUp
