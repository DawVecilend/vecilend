import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StatusPage from './pages/StatusPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import ObjectsPage from './pages/ObjectsPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/objects" element={<ObjectsPage />} />
        <Route path="/categorias/:slug" element={<CategoryPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </>
  )
}

export default App