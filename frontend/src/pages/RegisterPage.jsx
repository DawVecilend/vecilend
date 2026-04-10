import { Link, useNavigate } from 'react-router-dom'
import HeaderDesktop from '../components/layouts/header/HeaderDesktop'
import { useState } from "react"
import { useAuth } from '../contexts/AuthContext'

function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "", nom: "", cognoms: "", email: "", telefon: "", direccio: "",
        password: "", password_confirmation: "", accepta_termes: false,
        avatar_url: "", radi_proximitat: 10, ubicacio: { lat: 0, lng: 0 },
    })
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            await register(formData)
            navigate('/')
        } catch (err) {
            if (err.response?.status === 422) setError(Object.values(err.response.data.errors).flat()[0])
            else setError("Error al crear l'usuari.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <HeaderDesktop />
            <form onSubmit={handleSubmit} className="relative h-full bg-[url('/assets/fondo-login-register.jpg')] flex flex-col items-center bg-cover bg-center">
                <div className="absolute inset-0 bg-black/90"></div>
                <div className="relative flex flex-col items-center pt-6 gap-6 w-full px-38 pb-36">
                    <div className='flex'>
                        <Link to="/register" className='bg-vecilend-dark-primary h-full px-8 py-4 rounded-l-2xl'>Crear cuenta</Link >
                        <Link to="/login" className='bg-vecilend-dark-neutral text-white h-full px-8 py-4 rounded-r-2xl'>Iniciar sessión</Link >
                    </div>
                    <div className='flex flex-col w-[382px] gap-[10px]'>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/person-icon.svg" alt="Icono Persona" />
                            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Nombre de usuario' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/person-icon.svg" alt="Icono Persona" />
                            <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Nombre' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/apellidos-icon.svg" alt="Icono Apellidos" />
                            <input type="text" value={formData.cognoms} onChange={(e) => setFormData({ ...formData, cognoms: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Apellidos' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/mail-icon.svg" alt="Icono email" />
                            <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Email' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/call-icon.svg" alt="Icono email" />
                            <input type="text" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Teléfono' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/location-icon-white.svg" alt="Icono Direccion" />
                            <input type="text" value={formData.direccio} onChange={(e) => setFormData({ ...formData, direccio: e.target.value })} className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Dirección' required />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/key-icon.svg" alt="Icono contraseña" />
                            <input type="password" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Contraseña' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div className='flex items-center'>
                            <img className='relative h-[24px] left-8' src="/assets/icons/key-icon.svg" alt="Icono contraseña" />
                            <input type="password" className='bg-[#4B5563]/40 text-[#D9D9D9] w-full px-10 h-[45px] focus:outline-none rounded-xl' placeholder='Confirmar Contraseña' value={formData.password_confirmation} onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
                        </div>
                    </div>
                    <div className='flex items-center flex-col w-full gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" onChange={(e) => setFormData({ ...formData, accepta_termes: e.target.checked })} id="accept" className='scale-125 accent-vecilend-dark-primary cursor-pointer transition' required />
                            <label htmlFor="accept" className='text-white'>Acepto los Términos y la <span className='text-vecilend-dark-primary'>Política de privacidad</span></label>
                        </div>
                        <button className='bg-vecilend-dark-primary text-white h-[44px] px-4 flex items-center justify-center rounded-2xl w-[298px] cursor-pointer' type="submit">Registrarse</button>
                    </div>
                    <div className='flex flex-col justify-center mt-4'>
                        <p className='text-[#4B5563]'>¿Ya tienes cuenta?</p>
                        <Link to="/login" className='text-vecilend-dark-primary text-center w-full'>Inicia sesión aquí</Link>
                    </div>
                </div>
            </form>
        </>
    )
}

export default RegisterPage