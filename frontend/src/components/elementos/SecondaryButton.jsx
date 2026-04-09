import { Link } from 'react-router-dom'

function SecondaryButton({ url, text, onClick, width }) {
  // Si té onClick (com el botó de logout), renderitzar un <button>
  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{ width }}
        className="border-2 border-[#14B8A6] h-[44px] px-4 flex items-center text-[#F2F4F8] rounded-2xl"
      >
        {text}
      </button>
    )
  }

  // Si té url, renderitzar un Link
  return (
    <Link
      to={url}
      style={{ width }}
      className="border-2 border-[#14B8A6] h-[44px] px-4 flex items-center text-[#F2F4F8] rounded-2xl"
    >
      {text}
    </Link>
  )
}