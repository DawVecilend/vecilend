import { useEffect, useState } from 'react'
import api from './services/api'

function App() {
  const [status, setStatus] = useState('Esperando...')
  const [backendData, setBackendData] = useState(null)

  const checkConnection = async () => {
    setStatus('Conectando...')
    try {
      // 1. Pedimos la cookie CSRF (obligatorio en Sanctum)
      await api.get('/sanctum/csrf-cookie');
      
      // 2. Intentamos llamar a la API
      const response = await api.get('/api/user');
      setBackendData(response.data);
      setStatus('✅ Conectado y Autenticado');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setStatus('✅ Conexión OK (Laravel responde 401 porque no hay login)');
      } else {
        setStatus('❌ Error: No se pudo contactar con el Backend');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Vecilend Link</h1>
        
        <div className={`p-4 rounded-lg mb-6 font-mono text-sm ${
          status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status}
        </div>

        <button 
          onClick={checkConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all"
        >
          Reintentar Conexión
        </button>
      </div>
    </div>
  )
}

export default App
