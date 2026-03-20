function SearchBar() {
  return (
    <div className="flex">
      <input
        className="w-[433px] h-[45px] bg-[#14B8A6] rounded-l-lg border-none px-3 text-white placeholder-white"
        type="text"
        placeholder="Busca lo que quieres alquilar"
      />
      <button className="w-[82px] h-[45px] bg-[#0F766E] rounded-r-lg text-white">
        Buscar
      </button>
    </div>
  )
}

export default SearchBar