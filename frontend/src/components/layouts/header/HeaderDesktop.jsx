import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import SearchBar from '../../elementos/SearchBar'
import PrimaryButton from '../../elementos/PrimaryButton'
import SecondaryButton from '../../elementos/SecondaryButton'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'

function HeaderDesktop() {
  const { user, logout, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <header className="bg-vecilend-dark-bg-secondary h-[82px] flex items-center justify-between px-38">
      <Link to="/" className="flex items-center">
        <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]" />
      </Link>
      <SearchBar />
      <div className='flex gap-4'>
        {user ? (
          <>
            <p className="text-white flex items-center">Hola, {user.nom}</p>
            <Link to="" onClick={logout} className='bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl'>Cerrar sesión</Link>
          </>
        ) : (
          <>
            <PrimaryButton url="/login" text="Iniciar sesión" />
            <SecondaryButton url="/publication-product" text="Publicar Producto" />
          </>
        )}
      </div>
    </header>
  )
}

export default HeaderDesktop