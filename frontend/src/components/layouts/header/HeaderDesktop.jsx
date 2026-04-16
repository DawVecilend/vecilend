import { Link, useLocation } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import SearchBar from '../../elementos/SearchBar'

function HeaderDesktop() {
  const auth = useContext(AuthContext)
  const location = useLocation()

  if (!auth) return null

  const { user, logout, loading } = auth

  if (loading) return null

  const getNavClass = (path) => {
    return location.pathname === path
      ? 'text-[#4fdbc8] border-b-2 border-[#4fdbc8] font-bold pb-1 text-sm tracking-tight'
      : 'text-[#aebdb9] font-medium hover:text-[#4fdbc8] transition-colors text-sm tracking-tight'
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0f1715]/70 backdrop-blur-[20px] border-b border-[#333b39]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/objects" className={getNavClass('/objects')}>
              Browse
            </Link>
            <Link to="/how-it-works" className={getNavClass('/how-it-works')}>
              How it Works
            </Link>
            <Link to="/about" className={getNavClass('/about')}>
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#333b39] rounded-full transition-all duration-300 scale-95 active:scale-90 text-[#aebdb9]">
                  <span className="material-symbols-outlined">chat_bubble</span>
                </button>
                <button className="p-2 hover:bg-[#333b39] rounded-full transition-all duration-300 scale-95 active:scale-90 text-[#aebdb9]">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
              </div>

              <Link
                to="/profile"
                className="hidden md:block text-[#aebdb9] hover:text-[#4fdbc8] font-bold text-sm px-4 py-2.5 transition-colors"
              >
                Hola, {user.nom}
              </Link>

              <button
                onClick={logout}
                className="hidden md:block bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] text-[#003730] px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-[#4fdbc8]/20"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-[#aebdb9] hover:text-[#4fdbc8] font-bold text-sm px-4 py-2.5 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="hidden md:block bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] text-[#003730] px-6 py-2.5 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-[#4fdbc8]/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderDesktop