import React, { use, useContext } from 'react';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function SecuritySettingsPage() {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-[#0e1513] text-[#dde4e1] min-h-screen font-inter antialiased dark">
        <div className="flex min-h-screen">
            <aside className="hidden md:flex flex-col p-4 bg-[#090f0e] w-64 border-r border-[#3c4947] transition-all duration-150 font-inter text-sm z-40">
                <div className="mb-8 px-2">
                    <h2 className="text-[#68f0de] font-bold text-lg">Configuración</h2>
                    <p className="text-[#859490] text-xs">Gestiona tu cuenta</p>
                </div>
                <nav className="space-y-1">
                    <Link to={`/settings/profile/${user?.username}`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                        <span className="material-symbols-outlined">home</span>
                        <span>Página principal</span>
                    </Link>
                    <Link to={`/settings/profile/${user?.username}/editing`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                        <span className="material-symbols-outlined">person</span>
                        <span>Perfil</span>
                    </Link>
                    <Link to={`/settings/profile/${user?.username}/security`} className="flex items-center gap-3 px-3 py-3 bg-[#4fdbc8]/10 text-[#4fdbc8] font-semibold border-r-4 border-[#4fdbc8] transition-all duration-150">
                        <span className="material-symbols-outlined">security</span>
                        <span>Seguridad</span>
                    </Link>
                    <Link to={`/settings/profile/${user?.username}/privacy`} className="flex items-center gap-3 px-3 py-3 text-[#859490] hover:bg-[#161d1b] hover:text-[#dde4e1] transition-all duration-150">
                        <span className="material-symbols-outlined">privacy</span>
                        <span>Privacidad</span>
                    </Link>
                </nav>
            </aside>

            <main className="md:ml-64 flex-1 p-6 md:p-8 lg:p-12 max-w-5xl mt-4">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#dde4e1] mb-2">Seguridad de la Cuenta</h1>
                <p className="text-[#bbcac6]">Administra tus credenciales de acceso y protege tu información personal.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 md:mb-12">
                <section className="lg:col-span-7 bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/30">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#4fdbc8]">lock</span>
                    <h2 className="text-xl font-bold">Cambiar Contraseña</h2>
                </div>
                <form className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-[#bbcac6] mb-1.5">Contraseña Actual</label>
                    <input className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]" placeholder="••••••••••••" type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#bbcac6] mb-1.5">Nueva Contraseña</label>
                        <input className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]" type="password" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#bbcac6] mb-1.5">Confirmar Contraseña</label>
                        <input className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent transition-all outline-none text-[#dde4e1]" type="password" />
                    </div>
                    </div>
                    <div className="pt-4">
                    <button className="bg-[#4fdbc8] text-[#003731] px-6 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all active:scale-95" type="submit">
                        Actualizar Contraseña
                    </button>
                    </div>
                </form>
                </section>

                <section className="lg:col-span-5 bg-[#1a211f] rounded-xl p-6 border border-[#3c4947]/30">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ffb59e]">verified_user</span>
                    <h2 className="text-xl font-bold">2FA</h2>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#2f3634] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4fdbc8]"></div>
                    </label>
                </div>
                <p className="text-sm text-[#bbcac6] mb-6">Añade una capa extra de seguridad a tu cuenta usando una aplicación de autenticación.</p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#161d1b] rounded-lg border border-[#3c4947]/20">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#bbcac6]">smartphone</span>
                        <span className="text-sm font-medium">Authenticator App</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-[#14b8a6]/20 text-[#4fdbc8] px-2 py-0.5 rounded">Activo</span>
                    </div>
                    <button className="w-full py-2 border border-[#4fdbc8] text-[#4fdbc8] rounded-lg text-sm font-bold hover:bg-[#4fdbc8]/5 transition-colors">
                    Configurar métodos alternativos
                    </button>
                </div>
                </section>

                <section className="lg:col-span-12 bg-[#1a211f] rounded-xl border border-[#3c4947]/30 overflow-hidden">
                <div className="p-6 border-b border-[#3c4947]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#bbcac6]">devices</span>
                    <h2 className="text-xl font-bold">Sesiones Activas</h2>
                    </div>
                    <button className="text-[#4fdbc8] text-sm font-bold hover:underline">Cerrar todas las sesiones</button>
                </div>
                <div className="divide-y divide-[#3c4947]/20">
                    <div className="p-4 md:p-6 flex items-center justify-between hover:bg-[#252b2a] transition-colors">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#2f3634] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#bbcac6]">desktop_windows</span>
                        </div>
                        <div>
                        <p className="font-bold text-[#dde4e1] flex items-center gap-2">
                            MacBook Pro • Chrome
                            <span className="text-[10px] bg-[#21514a] text-[#92c2b8] px-2 py-0.5 rounded-full uppercase tracking-tighter">Esta sesión</span>
                        </p>
                        <p className="text-xs text-[#bbcac6]">Madrid, España • IP: 192.168.1.45</p>
                        </div>
                    </div>
                    <button className="text-[#bbcac6] hover:text-[#ffb4ab] transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                    </div>
                    <div className="p-4 md:p-6 flex items-center justify-between hover:bg-[#252b2a] transition-colors">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#2f3634] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#bbcac6]">phone_iphone</span>
                        </div>
                        <div>
                        <p className="font-bold text-[#dde4e1]">iPhone 14 • Vecilend App</p>
                        <p className="text-xs text-[#bbcac6]">Barcelona, España • Hace 2 horas</p>
                        </div>
                    </div>
                    <button className="text-[#bbcac6] hover:text-[#ffb4ab] transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                    </div>
                </div>
                </section>

                <section className="lg:col-span-12 mt-4">
                <div className="bg-[#93000a]/10 border border-[#ffb4ab]/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                    <h2 className="text-xl font-bold text-[#ffb4ab] mb-1">Zona de Peligro</h2>
                    <p className="text-sm text-[#bbcac6] max-w-xl">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que esto es lo que quieres hacer.</p>
                    </div>
                    <button className="whitespace-nowrap px-6 py-2.5 rounded-lg border border-[#ffb4ab] text-[#ffb4ab] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all active:scale-95">
                    Eliminar Cuenta
                    </button>
                </div>
                </section>
            </div>
            </main>
        </div>

        <nav className="md:hidden fixed bottom-0 w-full bg-[#090f0e] border-t border-[#3c4947] flex justify-around items-center h-16 z-50">
            <Link className="flex flex-col items-center gap-1 text-[#859490] hover:text-[#4fdbc8] transition-colors" to="#">
            <span className="material-symbols-outlined">explore</span>
            <span className="text-[10px]">Explorar</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-[#859490] hover:text-[#4fdbc8] transition-colors" to="#">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-[10px]">Pedidos</span>
            </Link>
            <Link className="flex flex-col items-center gap-1 text-[#4fdbc8]" to="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px]">Ajustes</span>
            </Link>
        </nav>
        </div>
    );
}

export default SecuritySettingsPage;