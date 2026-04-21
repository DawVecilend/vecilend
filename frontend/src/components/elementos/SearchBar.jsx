import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isResultsPage = location.pathname === '/results'

  useEffect(() => {
    if (isResultsPage) {
      setQuery(searchParams.get('search') || '')
    }
  }, [isResultsPage, searchParams])

  const handleChange = (value) => {
    setQuery(value)

    if (!isResultsPage) return

    const trimmedValue = value.trim()

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
    <form
      onSubmit={handleSubmit}
      className="hidden lg:flex items-center rounded-full bg-[#1d2422] px-4 py-2 transition-all focus-within:bg-[#333b39] focus-within:ring-2 focus-within:ring-[#4fdbc8]/40"
    >
      <span className="material-symbols-outlined text-[#8b9390]">search</span>

      <input
        className="w-48 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-[#e1e3e0] placeholder:text-[#8b9390] px-3"
        type="text"
        placeholder="Buscar Objeto..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />

      <button
        type="submit"
        className="rounded-full bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] px-4 py-2 text-sm font-bold text-[#003730] transition-transform active:scale-95"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar