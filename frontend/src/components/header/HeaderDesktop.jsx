import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'

function HeaderDesktop() {
  return (
    <div className="bg-[#071A16] h-[82px] flex align-center">
      <Link to="/">
        <img src={LogoDark} alt="Logo modo oscuro" className="h-[45px] w-[136px]"/>
      </Link>
    </div>
  )
}

export default HeaderDesktop