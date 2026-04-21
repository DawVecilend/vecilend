import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

function FloatingAddObjectButton() {
  const auth = useContext(AuthContext)

  if (!auth) return null

  const { user, loading } = auth

  if (loading || !user) return null

  return (
    <Link
      to="/objects/create"
      className="fixed right-12 bottom-12 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#14B8A6] shadow-lg shadow-[#14B8A6]/30 transition-all duration-300 hover:scale-105 hover:bg-[#0F766E]"
    >
      <img
        src="/assets/icons/add-object-icon.svg"
        alt="Subir producto"
        className="h-8 w-8"
      />
    </Link>
  )
}

export default FloatingAddObjectButton