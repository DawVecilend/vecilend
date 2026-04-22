import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StatusPage from './pages/StatusPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import ObjectsPage from './pages/ObjectsPage'
import ResultsPage from './pages/ResultsPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CreateObjectPage from './pages/CreateObjectPage'
import EditProfilePage from './pages/EditProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import ObjectPage from './pages/ObjectPage'
import HeaderDesktop from './components/layouts/header/HeaderDesktop'
import HeaderMobile from './components/layouts/header/HeaderMobile'
import Footer from './components/layouts/footer/Footer'
import FloatingAddObjectButton from './components/elementos/FloatingAddObjectButton'

function App() {
  return (
    <AuthProvider>
      <div className="hidden md:block">
        <HeaderDesktop />
      </div>

      <div className="md:hidden">
        <HeaderMobile />
      </div>

      <main className="pt-[80px] pb-[110px] md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/status" element={<StatusPage />} />
          
          <Route path="/objects" element={<ObjectsPage />} />
          <Route path="/object/:id" element={<ObjectPage />} />

          <Route path="/categorias/:slug" element={<CategoryPage />} />
          <Route path="/results" element={<ResultsPage />} />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/objects/create"
            element={
              <ProtectedRoute>
                <CreateObjectPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/settings/profile/:username/editing" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <FloatingAddObjectButton />
      <Footer />
    </AuthProvider>
  )
}

export default App