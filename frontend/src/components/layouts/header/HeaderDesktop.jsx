import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import SearchBar from '../../elementos/SearchBar'
import PrimaryButton from '../../elementos/PrimaryButton'
import SecondaryButton from '../../elementos/SecondaryButton'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'

function HeaderDesktop() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-vecilend-dark-bg-secondary h-[82px] flex items-center justify-between px-38">
      <Link to="/" className="flex items-center">
        <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]" />
      </Link>
      <SearchBar />
      <div className='flex gap-4'>
        {user ? (
          <>
            <span className="text-white">Hola, {user.name}</span>
            <PrimaryButton onClick={logout} text="Cerrar sesión" />
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