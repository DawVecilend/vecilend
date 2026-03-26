import PrimaryButton from '../components/elementos/PrimaryButton'
import HeaderDesktop from '../components/layouts/header/HeaderDesktop'

function LoginPage() {
  return (
    <>
        <HeaderDesktop />
        <div className="relative bg-[url('/assets/fondo-login-register.jpg')] bg-cover bg-center">

            <div className="absolute inset-0 bg-black/90"></div>
            <div className="relative flex flex-col items-center pt-20 gap-10 w-full px-38">
                <div className='flex'>
                    <a href="/register" className='bg-[#16181C] text-white h-full px-8 py-4 rounded-l-2xl'>Crear cuenta</a>
                    <a href="/login" className='bg-[#14B8A6] h-full px-8 py-4 rounded-r-2xl'>Iniciar sessión</a>
                </div>
                <div className='flex flex-col w-[382px] gap-6'>
                    <div className='flex items-center'>
                        <img className='relative h-[24px] left-8' src="/assets/icons/mail-icon.svg" alt="Icono email" />
                        <input type="text" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Email'/>
                    </div>
                    <div className='flex items-center'>
                        <img className='relative h-[24px] left-8' src="/assets/icons/key-icon.svg" alt="Icono contraseña" />
                        <input type="password" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Contraseña'/>
                    </div>
                </div>
                <div className='flex items-center flex-col w-full gap-6'>
                    <p className='text-[#4B5563]'>¿Olvidaste tu contraseña?</p>
                    <PrimaryButton url="/" text="Entrar" width="298px"/>
                </div>
            </div>

        </div>
    </>
  )
}

export default LoginPage