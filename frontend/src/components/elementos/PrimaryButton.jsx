import { Link } from 'react-router-dom'

function PrimaryButton({ url, text, onClick, width }) {
  // Si té onClick (com el botó de logout), renderitzar un <button>
  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{ width }}
        className="bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl cursor-pointer"
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
      className="bg-[#14B8A6] text-white h-[44px] px-4 flex items-center justify-center rounded-2xl"
    >
      {text}
    </Link>
  )
}

export default PrimaryButton