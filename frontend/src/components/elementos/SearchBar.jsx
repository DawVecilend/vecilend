import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SearchModal from "../search/SearchModal";

const PENDING_FILTERS_KEY = "vecilend_pending_filters";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isResultsPage = location.pathname === "/results";

  // Sincronitza l'input amb el param "search" si estem a /results
  useEffect(() => {
    if (isResultsPage) {
      setQuery(searchParams.get("search") || "");
    }
  }, [isResultsPage, searchParams]);

  // Llegeix els filtres pendents del sessionStorage cada vegada que
  // canviem de pàgina o tanquem el modal (perquè el badge es refresqui).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_FILTERS_KEY);
      setPendingFilters(raw ? JSON.parse(raw) : {});
    } catch {
      setPendingFilters({});
    }
  }, [filtersOpen, location.pathname, searchParams]);

  // Filtres a passar al modal — els actius si som a /results, o els pendents
  const initialFilters = useMemo(() => {
    if (isResultsPage) {
      return {
        lat: searchParams.get("lat"),
        lng: searchParams.get("lng"),
        radius: searchParams.get("radius"),
        data_inici: searchParams.get("data_inici"),
        data_fi: searchParams.get("data_fi"),
        min_price: searchParams.get("min_price"),
        max_price: searchParams.get("max_price"),
        min_user_rating: searchParams.get("min_user_rating"),
      };
    }
    return pendingFilters;
  }, [isResultsPage, searchParams, pendingFilters]);

  // Compta filtres actius (només els visuals, sense el text)
  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (initialFilters.lat) n++;
    if (initialFilters.data_inici) n++;
    if (initialFilters.min_price || initialFilters.max_price) n++;
    if (initialFilters.min_user_rating) n++;
    return n;
  }, [initialFilters]);

  /**
   * Executa la cerca amb el text actual + filtres (URL si estem a /results,
   * o sessionStorage si ve d'una altra pàgina).
   */
  const executeSearch = () => {
    const params = new URLSearchParams();

    // 1. Afegim el text si n'hi ha
    const trimmed = query.trim();
    if (trimmed) params.set("search", trimmed);

    // 2. Afegim els filtres (de l'URL si som a /results, altrament dels pendents)
    const source = isResultsPage
      ? Object.fromEntries(searchParams.entries())
      : pendingFilters;

    Object.entries(source).forEach(([k, v]) => {
      if (k === "search" || !v) return;
      params.set(k, v);
    });

    // 3. Quan executem la cerca, els filtres pendents passen a ser actius:
    //    netejem el sessionStorage perquè ja viuen a l'URL
    sessionStorage.removeItem(PENDING_FILTERS_KEY);
    setPendingFilters({});

    navigate(`/results?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  return (
    <>
      <div className="hidden lg:flex items-center rounded-full bg-[#1d2422] px-2 py-1 transition-colors">
        {/* Lupa = botó d'execució */}
        <button
          type="button"
          onClick={executeSearch}
          aria-label="Buscar"
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#333b39] transition-colors"
        >
          <span className="material-symbols-outlined text-[#8b9390]">
            search
          </span>
        </button>

        <input
          className="w-48 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-[#e1e3e0] placeholder:text-[#8b9390] px-3"
          type="text"
          placeholder="Buscar Objeto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Botó "Filtros" amb badge si n'hi ha actius o pendents */}
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#4fdbc8] px-4 py-2 text-sm font-bold text-[#003730] transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <SearchModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        initialFilters={initialFilters}
      />
    </>
  );
}

export default SearchBar;
