import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StatusPage from './pages/StatusPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import ObjectsPage from './pages/ObjectsPage'
import ResultsPage from './pages/ResultsPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './contexts/AuthContext'
import ObjectPage from './pages/ObjectPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/objects" element={<ObjectsPage />} />
        <Route path="/categorias/:slug" element={<CategoryPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/object/:id" element={<ObjectPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App