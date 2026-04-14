import { Link, useLocation } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import { AuthContext } from '../../../contexts/AuthContext'
import { useContext, useState, useRef, useEffect } from 'react'

function HeaderDesktop() {
  const { user, logout, loading } = useContext(AuthContext);
  const location = useLocation();
  console.log(user);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;

  // Función que decide qué clases ponerle al enlace según la ruta actual
  const getNavClass = (path) => {
    return location.pathname === path
      ? "text-[#4fdbc8] border-b-2 border-[#4fdbc8] font-bold pb-1 text-sm tracking-tight"
      : "text-[#aebdb9] font-medium hover:text-[#4fdbc8] transition-colors text-sm tracking-tight";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0f1715]/70 backdrop-blur-[20px] border-b border-[#333b39]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">

        {/* Lado Izquierdo: Logo y Enlaces */}
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

        {/* Lado Derecho: Buscador, Iconos y Autenticación */}
        <div className="flex items-center gap-4">

          {/* Barra de Búsqueda */}
          <div className="hidden lg:flex items-center bg-[#1d2422] rounded-full px-4 py-2 focus-within:bg-[#333b39] focus-within:ring-2 focus-within:ring-[#4fdbc8]/40 transition-all">
            <span className="material-symbols-outlined text-[#8b9390]">search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 font-medium placeholder:text-[#8b9390] text-[#e1e3e0]"
              placeholder="Search for items..."
              type="text"
            />
          </div>

          {/* Lógica condicional de Usuario */}
          {user ? (
            <>
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
                        <Link to="/" className="flex gap-2 px-4 py-3 text-sm text-[#14B8A6] hover:bg-white/5 hover:text-white hover:fill-white transition-colors">
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
                          Notificaciones
                        </Link>
                        <Link to="/settings" className="flex gap-2 px-4 py-3 text-sm text-[#14B8A6] hover:bg-white/5 hover:text-white hover:fill-white transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='fill-current'>
                            <mask
                              id="mask0_321_1360"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#14B8A6" />
                            </mask>
                            <g mask="url(#mask0_321_1360)">
                              <path
                                d="M9.2502 22L8.8502 18.8C8.63353 18.7167 8.42936 18.6167 8.2377 18.5C8.04603 18.3833 7.85853 18.2583 7.6752 18.125L4.7002 19.375L1.9502 14.625L4.5252 12.675C4.50853 12.5583 4.5002 12.4458 4.5002 12.3375V11.6625C4.5002 11.5542 4.50853 11.4417 4.5252 11.325L1.9502 9.375L4.7002 4.625L7.6752 5.875C7.85853 5.74167 8.0502 5.61667 8.2502 5.5C8.4502 5.38333 8.6502 5.28333 8.8502 5.2L9.2502 2H14.7502L15.1502 5.2C15.3669 5.28333 15.571 5.38333 15.7627 5.5C15.9544 5.61667 16.1419 5.74167 16.3252 5.875L19.3002 4.625L22.0502 9.375L19.4752 11.325C19.4919 11.4417 19.5002 11.5542 19.5002 11.6625V12.3375C19.5002 12.4458 19.4835 12.5583 19.4502 12.675L22.0252 14.625L19.2752 19.375L16.3252 18.125C16.1419 18.2583 15.9502 18.3833 15.7502 18.5C15.5502 18.6167 15.3502 18.7167 15.1502 18.8L14.7502 22H9.2502ZM11.0002 20H12.9752L13.3252 17.35C13.8419 17.2167 14.321 17.0208 14.7627 16.7625C15.2044 16.5042 15.6085 16.1917 15.9752 15.825L18.4502 16.85L19.4252 15.15L17.2752 13.525C17.3585 13.2917 17.4169 13.0458 17.4502 12.7875C17.4835 12.5292 17.5002 12.2667 17.5002 12C17.5002 11.7333 17.4835 11.4708 17.4502 11.2125C17.4169 10.9542 17.3585 10.7083 17.2752 10.475L19.4252 8.85L18.4502 7.15L15.9752 8.2C15.6085 7.81667 15.2044 7.49583 14.7627 7.2375C14.321 6.97917 13.8419 6.78333 13.3252 6.65L13.0002 4H11.0252L10.6752 6.65C10.1585 6.78333 9.67936 6.97917 9.2377 7.2375C8.79603 7.49583 8.39186 7.80833 8.0252 8.175L5.5502 7.15L4.5752 8.85L6.7252 10.45C6.64186 10.7 6.58353 10.95 6.5502 11.2C6.51686 11.45 6.5002 11.7167 6.5002 12C6.5002 12.2667 6.51686 12.525 6.5502 12.775C6.58353 13.025 6.64186 13.275 6.7252 13.525L4.5752 15.15L5.5502 16.85L8.0252 15.8C8.39186 16.1833 8.79603 16.5042 9.2377 16.7625C9.67936 17.0208 10.1585 17.2167 10.6752 17.35L11.0002 20ZM12.0502 15.5C13.0169 15.5 13.8419 15.1583 14.5252 14.475C15.2085 13.7917 15.5502 12.9667 15.5502 12C15.5502 11.0333 15.2085 10.2083 14.5252 9.525C13.8419 8.84167 13.0169 8.5 12.0502 8.5C11.0669 8.5 10.2377 8.84167 9.5627 9.525C8.8877 10.2083 8.5502 11.0333 8.5502 12C8.5502 12.9667 8.8877 13.7917 9.5627 14.475C10.2377 15.1583 11.0669 15.5 12.0502 15.5Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>

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
    </header >
  )
}

export default HeaderDesktop