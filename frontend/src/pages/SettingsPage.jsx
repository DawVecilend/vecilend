import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';

function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased flex flex-col dark">
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-[#3c4947] transition-all duration-150 font-inter text-sm z-40">
          <div className="mb-8 px-2">
              <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
              <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
          </div>
          <nav className="space-y-1">
              <Link to={`/settings/profile/${user?.username}`} className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150">
                  <span className="material-symbols-outlined">home</span>
                  <span>Página principal</span>
              </Link>
              <Link to={`/settings/profile/${user?.username}/editing`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                  <span className="material-symbols-outlined">person</span>
                  <span>Perfil</span>
              </Link>
              <Link to={`/settings/profile/${user?.username}/security`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                  <span className="material-symbols-outlined">security</span>
                  <span>Seguridad</span>
              </Link>
              <Link to={`/settings/profile/${user?.username}/privacy`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                  <span className="material-symbols-outlined">privacy</span>
                  <span>Privacidad</span>
              </Link>
          </nav>
        </aside>

        {/* Main con las mismas clases que la página de EditProfile */}
        <main className="flex-1 p-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-[#0e1513] flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#dde4e1] mb-2 tracking-tight">
              Bienvenido, <span className="text-[#4fdbc8]">{user?.nom || 'Usuario'}</span>
            </h1>
            <p className="text-[#bbcac6] text-lg max-w-2xl leading-relaxed">
              Gestiona tu experiencia en Vecilend. Aquí puedes controlar tu información, la seguridad de tu cuenta y cómo tratamos tus datos.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={`/settings/profile/${user?.username}/editing`} className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 group p-8 rounded-xl flex flex-col justify-between hover:border-[#4fdbc8]/40 transition-all duration-300 cursor-pointer active:scale-[0.98]">
              <div>
                <div className="w-14 h-14 bg-[#4fdbc8]/10 text-[#4fdbc8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <h3 className="text-xl font-bold text-[#dde4e1] mb-3">Información personal</h3>
                <p className="text-[#bbcac6] text-sm leading-relaxed mb-6">
                  Gestiona tus datos de contacto, tu nombre legal y la apariencia de tu perfil público en la comunidad de Vecilend.
                </p>
              </div>
              <div className="flex items-center text-[#4fdbc8] font-semibold text-sm group-hover:gap-2 transition-all">
                <span>Configurar perfil</span>
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </div>
            </Link>

              <Link to={`/settings/profile/${user?.username}/security`} className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 group p-8 rounded-xl flex flex-col justify-between hover:border-[#4fdbc8]/40 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                <div>
                  <div className="w-14 h-14 bg-[#f38764]/20 text-[#f38764] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#dde4e1] mb-3">Seguridad</h3>
                  <p className="text-[#bbcac6] text-sm leading-relaxed mb-6">
                    Mantén tu cuenta protegida cambiando tu contraseña periódicamente y gestionando los métodos de verificación y correos de acceso.
                  </p>
                </div>
                <div className="flex items-center text-[#4fdbc8] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Reforzar seguridad</span>
                  <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </Link>
              
              <Link to={`/settings/profile/${user?.username}/privacy`} className="bg-[#2f3634]/40 backdrop-blur-md border border-[#859490]/10 group p-8 rounded-xl flex flex-col justify-between hover:border-[#4fdbc8]/40 transition-all duration-300 cursor-pointer active:scale-[0.98] md:col-span-2 lg:col-span-1">
                <div>
                  <div className="w-14 h-14 bg-[#21514a]/30 text-[#a0d0c6] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>privacy_tip</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#dde4e1] mb-3">Datos y privacidad</h3>
                  <p className="text-[#bbcac6] text-sm leading-relaxed mb-6">
                    Controla el uso que hacemos de tu información, gestiona tus preferencias de notificaciones y configura tus parámetros de privacidad.
                  </p>
                </div>
                <div className="flex items-center text-[#4fdbc8] font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Gestionar privacidad</span>
                  <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;