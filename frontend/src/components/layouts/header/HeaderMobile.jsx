import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'

function HeaderMobile() {
  const auth = useContext(AuthContext)

  if (!auth) return null

  const { user, loading } = auth

  if (loading) return null

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[94%] max-w-[430px] -translate-x-1/2 rounded-[15px] bg-vecilend-dark-primary px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.25)] md:hidden">
      <div className="flex items-end justify-between gap-2">
        <Link to="/" className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/icons/home-icon.svg" alt="Inicio" className="h-[22px] w-[22px] object-contain" />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">Inicio</span>
          </div>
        </Link>

        <Link to="/objects" className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/icons/search-white-icon.svg" alt="Buscar" className="h-[22px] w-[22px] object-contain" />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">Buscar</span>
          </div>
        </Link>

        <Link to="/upload-product" className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/icons/add-photo-icon.svg" alt="Subir producto" className="h-[22px] w-[22px] object-contain" />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">Publicar</span>
          </div>
        </Link>

        <Link to="/chats" className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/icons/chats-fill-icon.svg" alt="Chats" className="h-[22px] w-[22px] object-contain" />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">Chats</span>
          </div>
        </Link>

        <Link to={`/profile/${user?.username}`} className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/icons/person-white-icon.svg" alt="Mi perfil" className="h-[22px] w-[22px] object-contain" />
            <span className="mt-1 text-center font-body text-caption leading-caption text-white">Mi perfil</span>
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default HeaderMobile