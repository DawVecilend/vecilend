import React from 'react';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';
import { Link } from 'react-router-dom';

function EditProfilePage() {
  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased min-h-screen flex flex-col dark">
      <HeaderDesktop />

      <div className="flex pt-20 min-h-screen">
        {/* SideNavBar */}
        <aside className="hidden md:flex fixed left-0 top-20 h-[calc(100vh-80px)] flex-col p-4 bg-[#090f0e] w-64 border-r border-[#3c4947] transition-all duration-150 font-inter text-sm z-40">
          <div className="mb-8 px-2">
            <h2 className="text-[#4fdbc8] font-bold text-lg">Configuración</h2>
            <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
          </div>
          <nav className="space-y-1">
            <Link className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150">
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150" to="#">
              <span className="material-symbols-outlined">security</span>
              <span>Security</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150" to="#">
              <span className="material-symbols-outlined">notifications</span>
              <span>Notifications</span>
            </Link>
            <Link className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150" to="#">
              <span className="material-symbols-outlined">payments</span>
              <span>Payments</span>
            </Link>
          </nav>
          <div className="mt-auto p-4 bg-[#1a211f] rounded-xl border border-[#3c4947]/30">
            <div className="flex items-center gap-2 text-[#4fdbc8] mb-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span className="text-xs font-bold uppercase tracking-wider">Pro Lender</span>
            </div>
            <p className="text-[10px] text-[#bbcac6] leading-relaxed">Tu cuenta profesional está activa. Disfruta de comisiones reducidas.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:ml-64 flex-1 p-6 md:p-8 lg:p-12 max-w-6xl mx-auto pb-24 md:pb-12">
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#dde4e1] mb-2 tracking-tight">Perfil de Usuario</h1>
            <p className="text-[#bbcac6]">Personaliza cómo te ven los demás en el marketplace de Vecilend.</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Profile Picture Card (Asymmetric Layout) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/20 shadow-xl">
                <div className="relative group w-40 h-40 mx-auto mb-6">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#4fdbc8]/20 p-1">
                    <img 
                      alt="Profile picture" 
                      className="w-full h-full object-cover rounded-xl" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4tzT2bahhTY5kauk7RbsnOcsLqwj9vkjE3aV7Xz-7F1gMFPCyHhs6xURtGbR0s046JtJxlcu3GbH0q3H19EhbKgf5cHmItQDSdZt-Lac6liELxUypNXq9g4-xVz8cdjcQmc88zRNwWFuO76vylbFu48X3fkdeeM50VLH3-1Q2mwlN3a0gobpQFpMZA-IFkt7gYdp7VXY744rLvP4Up9j354PiPriPDdt4U6_EnUlN749D39tD5xVS7If3-TY5V5JkXNNoUg8sVxuj" 
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-[#4fdbc8] text-[#003731] p-2 rounded-lg shadow-lg hover:bg-[#14b8a6] transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-[#dde4e1]">Mateo Jiménez</h3>
                  <p className="text-sm text-[#bbcac6] mb-4">@mateo_films</p>
                  <button className="w-full py-2.5 px-4 bg-[#21514a] text-[#92c2b8] text-xs font-semibold rounded-lg hover:bg-[#a0d0c6] hover:text-[#003731] transition-all">
                    Cambiar foto
                  </button>
                </div>
              </div>
              
              {/* Professional Tags Section */}
              <div className="bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/20 shadow-xl">
                <h4 className="text-sm font-bold text-[#dde4e1] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4fdbc8] text-lg">workspace_premium</span>
                  Especialidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#4fdbc8]/10 border border-[#4fdbc8]/20 text-[#4fdbc8] text-[11px] font-bold rounded-full uppercase tracking-wide">Cineasta</span>
                  <span className="px-3 py-1 bg-[#4fdbc8]/10 border border-[#4fdbc8]/20 text-[#4fdbc8] text-[11px] font-bold rounded-full uppercase tracking-wide">Fotógrafo</span>
                  <span className="px-3 py-1 bg-[#4fdbc8]/10 border border-[#4fdbc8]/20 text-[#4fdbc8] text-[11px] font-bold rounded-full uppercase tracking-wide">Editor</span>
                  <button className="px-3 py-1 border border-[#3c4947] text-[#bbcac6] text-[11px] font-bold rounded-full hover:border-[#4fdbc8] hover:text-[#4fdbc8] transition-all">
                    + Añadir
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields (Glassmorphism / Clean Grid) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947]/20 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input 
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all" 
                      type="text" 
                      defaultValue="Mateo Jiménez" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Correo Electrónico</label>
                    <input 
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all" 
                      type="email" 
                      defaultValue="mateo.j@vecilend.com" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Ubicación</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcac6] text-lg">location_on</span>
                      <input 
                        className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg pl-10 pr-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all" 
                        type="text" 
                        defaultValue="Madrid, España" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-[#bbcac6] uppercase tracking-widest ml-1">Biografía Profesional</label>
                    <textarea 
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all resize-none" 
                      rows="4"
                      defaultValue="Cineasta independiente con más de 10 años de experiencia en videografía de eventos y documentales. Especializado en iluminación cinemática y equipos RED/Sony."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947]/20 shadow-xl">
                <h4 className="text-sm font-bold text-[#dde4e1] mb-6 uppercase tracking-widest">Redes Sociales</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#252b2a] rounded-lg text-[#bbcac6]">
                      <span className="material-symbols-outlined">link</span>
                    </div>
                    <input 
                      className="flex-1 bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-2.5 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all text-sm" 
                      placeholder="https://instagram.com/usuario" 
                      type="text" 
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#252b2a] rounded-lg text-[#bbcac6]">
                      <span className="material-symbols-outlined">video_library</span>
                    </div>
                    <input 
                      className="flex-1 bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-2.5 text-[#dde4e1] focus:border-[#4fdbc8] focus:ring-1 focus:ring-[#4fdbc8] outline-none transition-all text-sm" 
                      placeholder="https://vimeo.com/portafolio" 
                      type="text" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button className="px-6 py-3 text-sm font-bold text-[#bbcac6] hover:text-[#dde4e1] transition-colors">
                  Descartar cambios
                </button>
                <button className="px-10 py-3 bg-[#4fdbc8] text-[#003731] font-bold rounded-lg shadow-lg shadow-[#4fdbc8]/20 hover:bg-[#14b8a6] transition-all transform active:scale-95">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0e1513] border-t border-[#3c4947] flex justify-around items-center h-16 z-50">
        <button className="flex flex-col items-center gap-1 text-[#4fdbc8]">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#859490]">
          <span className="material-symbols-outlined">security</span>
          <span className="text-[10px]">Seguridad</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#859490]">
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-[10px]">Avisos</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#859490]">
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px]">Pagos</span>
        </button>
      </nav>
    </div>
  );
}

export default EditProfilePage;