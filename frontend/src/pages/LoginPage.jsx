import { Link } from 'react-router-dom'
import PrimaryButton from '../components/elementos/PrimaryButton'
import HeaderDesktop from '../components/header/HeaderDesktop'
import { useState } from "react"

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const submitData = {
        ...formData
        }

        try {
        const response = await fetch("http://localhost:8000/api/v1/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submitData)
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error del backend:", errorText);
            throw new Error("Error al i")
        }

        alert("inicio de sesion correcto")
        window.location.href = "/"
        } catch (error) {
            console.error(error)
            alert("❌ Error al iniciar session")
        }
    }

  return (
    <>
        <HeaderDesktop />
        <form  onSubmit={handleSubmit} className="relative h-full bg-[url('/assets/fondo-login-register.jpg')] flex flex-col items-center bg-cover bg-center">
            <div className="absolute inset-0 bg-black/90"></div>
            <div className="relative flex flex-col items-center pt-20 gap-10 w-full px-38 pb-38">
                <div className='flex'>
                    <a href="/register" className='bg-[#16181C] text-white h-full px-8 py-4 rounded-l-2xl'>Crear cuenta</a>
                    <a href="/login" className='bg-[#14B8A6] h-full px-8 py-4 rounded-r-2xl'>Iniciar sessión</a>
                </div>
                <div className='flex flex-col w-[382px] gap-6'>
                    <div className='flex items-center'>
                        <img className='relative h-[24px] left-8' src="/assets/icons/mail-icon.svg" alt="Icono email" />
                       <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Email'/>
                    </div>
                    <div className='flex items-center'>
                        <img className='relative h-[24px] left-8' src="/assets/icons/key-icon.svg" alt="Icono contraseña" />
                        <input type="password" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Contraseña' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
                    </div>
                </div>
                <div className='flex items-center flex-col w-full gap-6'>
                    <Link to="#" className='text-[#4B5563]'>¿Olvidaste tu contraseña?</Link>
                    <button className='bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl w-[298px]' type="submit">Entrar</button>
                </div>
                <div className='flex items-center'>
                    <p className='text-[#4B5563] text-center'>Al continuar aceptas nuestros Términos y  la Política de privacidad.</p>
                </div>
                <div className='flex flex-col justify-center mt-38'>
                    <p className='text-[#4B5563]'>¿No tienes cuenta?</p>
                    <Link to="" className='text-vecilend-dark-primary text-center w-full'>Crear una aquí</Link>
                </div>
            </div>
        </form>
    </>
  )
}

export default LoginPage