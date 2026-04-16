import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StatusPage from './pages/StatusPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './contexts/AuthContext';
import EditProfilePage from './pages/EditProfilePage'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/categorias/:slug" element={<CategoryPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/settings/profile/edit" element={<EditProfilePage />} />
        </Routes>
      </AuthProvider>
    </>

  )
}

export default App