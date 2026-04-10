import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import searchicon from '/assets/icons/search-icon.svg'

function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleChange = (value) => {
    setQuery(value)

    const trimmedValue = value.trim()

    if (location.pathname !== '/results') {
      if (!trimmedValue) return
      navigate(`/results?search=${encodeURIComponent(trimmedValue)}`)
      return
    }

    if (!trimmedValue) {
      navigate('/results', { replace: true })
      return
    }

    navigate(`/results?search=${encodeURIComponent(trimmedValue)}`, {
      replace: true,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      navigate('/objects')
      return
    }

    navigate(`/results?search=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <img src={searchicon} alt="Icono de buscar" className="relative left-8" />

      <input
        className="h-[45px] w-[433px] rounded-l-[15px] border-none bg-[#14B8A6] px-10 text-black placeholder-black focus:outline-none"
        type="text"
        placeholder="Busca lo que quieres alquilar"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />

      <button
        type="submit"
        className="h-[45px] w-[82px] cursor-pointer rounded-r-[15px] bg-[#0F766E] text-white"
      >
        Buscar
      </button>
    </form>
  )
}

export default SearchBar