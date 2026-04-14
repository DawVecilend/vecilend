function SearchBar() {
  return (
    <div className="hidden lg:flex items-center bg-[#1d2422] rounded-full px-4 py-2 focus-within:bg-[#333b39] focus-within:ring-2 focus-within:ring-[#4fdbc8]/40 transition-all">
      <span className="material-symbols-outlined text-[#8b9390]">search</span>
      <input
        className="bg-transparent border-none outline-none focus:ring-0 text-sm w-48 font-medium placeholder:text-[#8b9390] text-[#e1e3e0]"
        placeholder="Buscar Objetos..."
        type="text"
      />
    </div>
  )
}

export default SearchBar