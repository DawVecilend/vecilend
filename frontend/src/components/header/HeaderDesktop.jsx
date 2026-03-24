import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import SearchBar from '../elementos/SearchBar'
import PrimaryButton from '../elementos/PrimaryButton'
import SecondaryButton from '../elementos/SecondaryButton'

function HeaderDesktop() {
  return (
    <header className="bg-[#071A16] h-[82px] flex items-center justify-between px-38">
        <Link to="/" className="flex items-center">
          <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]"/>
        </Link>
        <SearchBar/>
        <div className='flex gap-4'>
          <PrimaryButton url="/login" text="Iniciar sessión"/>
          <SecondaryButton url="/publication-product" text="Publicar Producto" />
        </div>
    </header>
  )
}

export default HeaderDesktop