import { Link, useLocation } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext, useState, useRef, useEffect } from 'react'
import SearchBar from '../../elementos/SearchBar'

function HeaderDesktop() {
  const auth = useContext(AuthContext)
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
      <div className="flex justify-between itemAs-center w-full px-6 py-4 max-w-7xl mx-auto">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/objects" className={getNavClass('/objects')}>
              Buscar
            </Link>
            <Link to="/how-it-works" className={getNavClass('/how-it-works')}>
              Como funciona
            </Link>
            <Link to="/about" className={getNavClass('/about')}>
              Sobre Nosotros
            </Link>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <SearchBar />

          {/* Lógica condicional de Usuario */}
          {user ? (
            <>
              {/* Icons */}
              <div className="flex items-center gap-2">
                <Link to="/chats" className="p-2 hover:bg-[#333b39] text-[#aebdb9] hover:text-[#4fdbc8] rounded-full transition-all duration-300 cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_571_4212" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_571_4212)">
                      <path d="M2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6L2 22ZM5.15 16H20V4H4V17.125L5.15 16Z" fill="currentColor" />
                    </g>
                  </svg>

                </Link>
                <Link to="/notifications" className="p-2 hover:bg-[#333b39] rounded-full text-[#aebdb9] hover:text-[#4fdbc8] hover:transition-all duration-300 cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" lassName="fill-current">
                    <mask id="mask0_551_2039" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_551_2039)">
                      <path d="M4 19V17H6V10C6 8.61667 6.41667 7.3875 7.25 6.3125C8.08333 5.2375 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.6458 2.72917 10.9375 2.4375C11.2292 2.14583 11.5833 2 12 2C12.4167 2 12.7708 2.14583 13.0625 2.4375C13.3542 2.72917 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.2375 16.75 6.3125C17.5833 7.3875 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.9792 21.8042 10.5875 21.4125C10.1958 21.0208 10 20.55 10 20H14C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                </Link>
              </div>
              <div onClick={() => setOpen(!open)} className='cursor-pointer'>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar usuario" className="h-[48px] w-[48px] rounded-full object-cover" />
                ) : (
                  <img src="/assets/icons/empty-user-icon.svg" alt="" className="h-[48px]" />
                )}
              </div>
              <div ref={menuRef} className="relative">
                {open && (
                  <div className="absolute top-10 right-2 z-20 w-56">
                    <div className="bg-[#0f1715]/70 backdrop-blur-[20px] shadow-lg border border-white/5 overflow-hidden backdrop-blur-sm">
                      <div className="flex flex-col divide-y divide-[#14B8A6]/10">
                        {user.rol === "admin" ? (
                          <Link to="/dashboard" className="px-4 py-3 text-sm text-[#14B8A6] hover:bg-white/5 hover:text-white transition-colors">
                            Dashboard
                          </Link>) : (
                          <Link to={"/profile/" + user.username} className="px-4 py-3 text-sm text-[#14B8A6] hover:bg-white/5 hover:text-white transition-colors">
                            <p className='text-white py-2 text-base'><span>{user.nom} {user.cognoms}</span></p>
                            Ver Perfil
                          </Link>
                        )}
                        <Link to="/settings" className="flex gap-2 px-4 py-3 text-sm text-[#14B8A6] hover:bg-white/5 hover:text-white hover:fill-white transition-colors">
                          Ajustes
                        </Link>
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-[#14B8A6] hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors">
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Botones si NO hay sesión iniciada */}
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