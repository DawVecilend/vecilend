import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import ProductsSection from "../components/home/ProductsSection";
import BtnBack from "../components/elementos/BtnBack";
import BtnOrder from "../components/elementos/BtnOrder";
import InlineFilterChip from "../components/filters/InlineFilterChip";
import ChangeLocationModal from "../components/search/modals/ChangeLocationModal";
import ChangeDatesModal from "../components/search/modals/ChangeDatesModal";
import ChangePriceModal from "../components/search/modals/ChangePriceModal";
import ChangeRatingModal from "../components/search/modals/ChangeRatingModal";
import { getCategories } from "../services/categories";
import { getObjects, getNearbyObjects } from "../services/objects";
import { mapCategories } from "../mappers/categoryMapper";
import ProductsGridSkeleton from "../components/elementos/ProductsGridSkeleton";
import NotFoundPage from "./NotFoundPage";

function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderBy, setOrderBy] = useState("recent");

  // Modals
  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const currentCategory = useMemo(
    () => categories.find((c) => c.slug === slug) || null,
    [categories, slug],
  );

  const filters = useMemo(
    () => ({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      radius: searchParams.get("radius"),
      data_inici: searchParams.get("data_inici"),
      data_fi: searchParams.get("data_fi"),
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      min_user_rating: searchParams.get("min_user_rating"),
    }),
    [searchParams],
  );

  const hasLocation = !!(filters.lat && filters.lng);
  const hasDates = !!(filters.data_inici && filters.data_fi);
  const hasPrice = !!(filters.min_price || filters.max_price);
  const hasRating = !!filters.min_user_rating;

  // Carregar categories al muntar
  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((raw) => !cancelled && setCategories(mapCategories(raw)))
      .catch((err) => console.error("Error categorías:", err))
      .finally(() => !cancelled && setLoadingCategories(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const buildApiParams = (page = 1) => ({
    page,
    per_page: 12,
    sort: orderBy,
    category: currentCategory?.id,
    ...(hasLocation && {
      lat: filters.lat,
      lng: filters.lng,
      radius: filters.radius || 5000,
    }),
    ...(hasDates && {
      data_inici: filters.data_inici,
      data_fi: filters.data_fi,
    }),
    ...(filters.min_price && { min_price: filters.min_price }),
    ...(filters.max_price && { max_price: filters.max_price }),
    ...(filters.min_user_rating && {
      min_user_rating: filters.min_user_rating,
    }),
  });

  // Càrrega de productes
  useEffect(() => {
    if (!currentCategory) return;
    let cancelled = false;
    setLoadingProducts(true);
    setProducts([]); // reset previo
    setMeta(null);

    const fetcher = hasLocation ? getNearbyObjects : getObjects;
    fetcher(buildApiParams(1))
      .then(({ data, meta }) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
        setMeta(meta);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        if (!cancelled) {
          setProducts([]);
          setMeta(null);
        }
      })
      .finally(() => !cancelled && setLoadingProducts(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCategory?.id,
    orderBy,
    filters.lat,
    filters.lng,
    filters.radius,
    filters.data_inici,
    filters.data_fi,
    filters.min_price,
    filters.max_price,
    filters.min_user_rating,
  ]);

  const handleLoadMore = async () => {
    if (!meta || meta.current_page >= meta.last_page || loadingMore) return;
    setLoadingMore(true);
    try {
      const fetcher = hasLocation ? getNearbyObjects : getObjects;
      const { data, meta: newMeta } = await fetcher(
        buildApiParams(meta.current_page + 1),
      );
      setProducts((prev) => [...prev, ...(data || [])]);
      setMeta(newMeta);
    } catch (err) {
      console.error("Error cargando más:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyFilterPatch = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === "") next.delete(k);
      else next.set(k, v);
    });
    const qs = next.toString();
    navigate(`/categorias/${slug}${qs ? `?${qs}` : ""}`, { replace: true });
  };

  const isLoading = loadingCategories || loadingProducts;
  const totalResults = meta?.total ?? products.length;
  const hasMore = meta && meta.current_page < meta.last_page;

  if (!loadingCategories && !currentCategory) {
    return (
      <NotFoundPage
        title="Categoría no encontrada"
        message={`No existe ninguna categoría con el slug "${slug}".`}
      />
    );
  }

  return (
    <main className="min-h-screen bg-app-bg px-4 md:px-10 py-8 text-app-text">
      <section className="mx-auto w-full max-w-[1380px]">
        <div className="flex items-center justify-between gap-4">
          <BtnBack />
          <BtnOrder value={orderBy} onChange={setOrderBy} />
        </div>

        <div className="mt-6">
          <h1 className="font-heading text-h2-mobile md:text-h2-desktop font-bold text-app-text">
            {currentCategory?.name || "Categoría"}
          </h1>
          <p className="mt-2 font-body text-body-base text-app-text-secondary">
            {totalResults} {totalResults === 1 ? "objeto" : "objetos"} en esta
            categoría
          </p>
        </div>

        {/* Chips de filtres — mateixos que /objects */}
        <div className="mt-5 flex flex-wrap gap-2">
          <InlineFilterChip
            icon="location_on"
            label={
              hasLocation
                ? `${Math.round((filters.radius || 5000) / 1000)} km · cambiar`
                : "Añadir ubicación"
            }
            active={hasLocation}
            onClick={() => setLocationOpen(true)}
          />
          <InlineFilterChip
            icon="calendar_month"
            label={
              hasDates
                ? `${filters.data_inici} → ${filters.data_fi}`
                : "Añadir fechas"
            }
            active={hasDates}
            onClick={() => setDatesOpen(true)}
          />
          <InlineFilterChip
            icon="payments"
            label={(() => {
              if (!hasPrice) return "Añadir precio";
              if (filters.min_price && !filters.max_price)
                return `Desde ${filters.min_price}€/día`;
              if (!filters.min_price && filters.max_price)
                return `Hasta ${filters.max_price}€/día`;
              return `${filters.min_price}€ – ${filters.max_price}€/día`;
            })()}
            active={hasPrice}
            onClick={() => setPriceOpen(true)}
          />
          <InlineFilterChip
            icon="star"
            label={
              hasRating
                ? Number(filters.min_user_rating) === 5
                  ? "5 estrellas"
                  : `${filters.min_user_rating} estrellas o más`
                : "Añadir valoración mínima"
            }
            active={hasRating}
            onClick={() => setRatingOpen(true)}
          />
        </div>
      </section>

      {/* Resultats */}
      {isLoading ? (
        <ProductsGridSkeleton count={6} />
      ) : products.length > 0 ? (
        <>
          <ProductsSection title="" products={products} preserveSearchParams />
          {hasMore && (
            <div className="mx-auto w-full max-w-[1380px] py-6 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-full bg-app-bg-card border border-app-border hover:border-vecilend-dark-primary px-8 py-3 text-body-base font-bold text-app-text disabled:opacity-50"
              >
                {loadingMore
                  ? "Cargando…"
                  : `Cargar más (${meta.total - products.length} restantes)`}
              </button>
            </div>
          )}
        </>
      ) : (
        <section className="mx-auto w-full max-w-[1380px] py-12">
          <div className="rounded-[20px] border border-app-border bg-app-bg-card p-10 text-center">
            <h2 className="font-heading text-h3-desktop text-app-text">
              No hay resultados con estos filtros
            </h2>
            <p className="mt-3 font-body text-body text-app-text-secondary">
              Prueba a ampliar el radio, cambiar las fechas o quitar algún
              filtro.
            </p>
          </div>
        </section>
      )}

      {/* Modals */}
      <ChangeLocationModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        initial={filters}
        onApply={applyFilterPatch}
      />
      <ChangeDatesModal
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        initial={filters}
        onApply={applyFilterPatch}
      />
      <ChangePriceModal
        open={priceOpen}
        onClose={() => setPriceOpen(false)}
        initial={filters}
        onApply={applyFilterPatch}
      />
      <ChangeRatingModal
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        initial={filters}
        onApply={applyFilterPatch}
      />
    </main>
  );
}

export default CategoryPage;
