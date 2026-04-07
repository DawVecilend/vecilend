import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </AuthProvider>
    </>

  )
}

export default App
