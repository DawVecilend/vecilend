import { useTheme } from "../../contexts/ThemeContext";
import LogoDark from "/assets/logos/LogoDark.svg";
import LogoLight from "/assets/logos/LogoLight.svg";

function Logo({ className = "" }) {
  const { theme } = useTheme();
  const logo = theme === "dark" ? LogoDark : LogoLight;

  return <img src={logo} alt="Logo Vecilend" className={className} />;
}

export default Logo;
