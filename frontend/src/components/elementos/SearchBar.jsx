import searchicon from '/assets/icons/search-icon.svg'

function SearchBar() {
  return (
    <div className="flex">
      <img src={searchicon} alt="Icono de buscar" className='relative left-8' />
      <input
        className="w-[433px] h-[45px] bg-[#14B8A6] rounded-l-2xl border-none px-10 text-black placeholder-black focus:outline-none"
        type="text"
        placeholder="Busca lo que quieres alquilar"
      />
      <button className="w-[82px] h-[45px] bg-[#0F766E] rounded-r-2xl text-white cursor-pointer">
        Buscar
      </button>
    </div>
  )
}

export default SearchBar