import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const login = (username: string, password: string): boolean => {
    // Simulated login logic
    return username === 'pote@gmail.com' && password === '123456';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
     

    if (login(credentials.username, credentials.password)) {
      sessionStorage.setItem("adminAuth", "true");  
      navigate('/admin');
    } else {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
          <p className="text-gray-600">Ingresá tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="inline mr-1" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="potes123"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* <div className="mt-6 text-center text-sm text-gray-600">
          <p>Credenciales de demo:</p>
          <p>Usuario: <code className="bg-gray-100 px-1 rounded">admin</code></p>
          <p>Contraseña: <code className="bg-gray-100 px-1 rounded">potes123</code></p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;