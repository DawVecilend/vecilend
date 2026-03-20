import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'
import SearchBar from '../elementos/SearchBar'

function HeaderDesktop() {
  return (
    <header className="bg-[#071A16] h-[82px] flex items-center gap-[20px]">
        <Link to="/" className="flex items-center">
          <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]"/>
        </Link>
        <SearchBar/>
    </header>
  )
}

export default HeaderDesktop