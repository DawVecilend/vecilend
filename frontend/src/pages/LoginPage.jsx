import { Link } from 'react-router-dom'
import HeaderDesktop from '../components/layouts/header/HeaderDesktop'
import { useState } from "react"
import api from "../services/api";

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
            const response = await api.post("/api/v1/login", formData);
            if (response.data.token) {
                localStorage.setItem("auth_token", response.data.token);
            }

            alert("inicio de sesion correcto");
            window.location.href = "/";

        } catch (error) {
            console.error("Error backend:", error.response?.data);
            alert("❌ Error al iniciar sesión");
        }
    }

    return (
        <>
            <HeaderDesktop />
            <form onSubmit={handleSubmit} className="relative h-full bg-[url('/assets/fondo-login-register.jpg')] flex flex-col items-center bg-cover bg-center">
                <div className="absolute inset-0 bg-black/90"></div>
                <div className="relative flex flex-col items-center pt-20 gap-6 w-full px-38 pb-36">
                    <div className='flex'>
                        <Link to="/register" className='bg-[#16181C] text-white h-full px-8 py-4 rounded-l-2xl'>Crear cuenta</Link >
                        <Link to="/login" className='bg-[#14B8A6] h-full px-8 py-4 rounded-r-2xl'>Iniciar sessión</Link >
                    </div>
                    <div className='flex flex-col w-[382px] gap-[10px]'>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/mail-icon.svg" alt="Icono email" />
                            <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Email' />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/key-icon.svg" alt="Icono contraseña" />
                            <input type="password" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Contraseña' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                    </div>
                    <div className='flex items-center flex-col w-full gap-6'>
                        <Link to="#" className='text-[#4B5563]'>¿Olvidaste tu contraseña?</Link>
                        <button className='bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl w-[298px] cursor-pointer' type="submit">Entrar</button>
                    </div>
                    <div className='flex items-center'>
                        <p className='text-[#4B5563] text-center'>Al continuar aceptas nuestros Términos y  la Política de privacidad.</p>
                    </div>
                    <div className='flex flex-col justify-center mt-60'>
                        <p className='text-[#4B5563]'>¿No tienes cuenta?</p>
                        <Link to="/register" className='text-vecilend-dark-primary text-center w-full'>Crear una aquí</Link>
                    </div>
                </div>
            </form>
        </>
    )
}

export default LoginPage