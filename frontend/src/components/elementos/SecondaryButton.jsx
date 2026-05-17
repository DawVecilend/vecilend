import { Link } from 'react-router-dom'

function SecondaryButton({ url, text, onClick, width }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{ width }}
        className="border-2 border-[#14B8A6] h-[44px] px-4 flex items-center text-app-text rounded-2xl"
      >
        {text}
      </button>
    )
  }
  return (
    <Link
      to={url}
      style={{ width }}
      className="border-2 border-[#14B8A6] h-[44px] px-4 flex items-center text-app-text rounded-2xl"
    >
      {text}
    </Link>
  )
}

export default SecondaryButton;