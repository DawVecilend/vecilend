import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const wrapperRef = useRef(null);

  const isResultsPage = location.pathname === "/results";

  // Sincronitzar amb la URL quan estem a /results
  useEffect(() => {
    if (isResultsPage) {
      setQuery(searchParams.get("search") || "");
    }
  }, [isResultsPage, searchParams]);

  // Sortir de mode "actiu" en clicar fora del component
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value) => {
    setQuery(value);

    if (!isResultsPage) return;

    const trimmedValue = value.trim();

    // Si està buit, treiem el param però seguim a /results sense buscar
    if (!trimmedValue) {
      navigate("/results", { replace: true });
      return;
    }

    navigate(`/results?search=${encodeURIComponent(trimmedValue)}`, {
      replace: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    // No fer res si està buit
    if (!trimmedQuery) {
      return;
    }

    navigate(`/results?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      ref={wrapperRef}
      onSubmit={handleSubmit}
      onFocus={() => setActive(true)}
      className={`hidden lg:flex items-center rounded-full bg-[#1d2422] px-4 py-2 transition-all ${active ? "ring-2 ring-[#4fdbc8]/40 bg-[#333b39]" : ""}`}
    >
      <span className="material-symbols-outlined text-[#8b9390]">search</span>

      <input
        className="w-48 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-[#e1e3e0] placeholder:text-[#8b9390] px-3"
        type="text"
        placeholder="Buscar Objeto..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setActive(true)}
      />

      <button
        type="submit"
        className="rounded-full bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] px-4 py-2 text-sm font-bold text-[#003730] transition-transform active:scale-95"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
