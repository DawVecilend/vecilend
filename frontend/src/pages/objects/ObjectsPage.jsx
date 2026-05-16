import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import ProductsSection from "../../components/home/ProductsSection";
import BtnOrder from "../../components/elementos/BtnOrder";
import BtnBack from "../../components/elementos/BtnBack";
import InlineFilterChip from "../../components/filters/InlineFilterChip";
import CategorySidebar from "../../components/filters/CategorySidebar";
import ChangeLocationModal from "../../components/search/modals/ChangeLocationModal";
import ChangeDatesModal from "../../components/search/modals/ChangeDatesModal";
import ChangePriceModal from "../../components/search/modals/ChangePriceModal";
import ChangeRatingModal from "../../components/search/modals/ChangeRatingModal";
import ProductsGridSkeleton from "../../components/elementos/ProductsGridSkeleton";

import { getObjects, getNearbyObjects } from "../../services/objects";
import { getCategories } from "../../services/categories";
import { mapCategories } from "../../mappers/categoryMapper";
import { formatDateRangeShort } from "../../utils/datetime";

function ObjectsPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderBy, setOrderBy] = useState("recent");
  const [categories, setCategories] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [locationOpen, setLocationOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search: (searchParams.get("search") || "").trim(),
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      radius: searchParams.get("radius"),
      data_inici: searchParams.get("data_inici"),
      data_fi: searchParams.get("data_fi"),
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      min_user_rating: searchParams.get("min_user_rating"),
      category: searchParams.get("category"),
      subcategory: searchParams.get("subcategory"),
    }),
    [searchParams],
  );

  const hasLocation = !!(filters.lat && filters.lng);
  const hasDates = !!(filters.data_inici && filters.data_fi);
  const hasPrice = !!(filters.min_price || filters.max_price);
  const hasRating = !!filters.min_user_rating;
  const hasCategory = !!filters.category;
  const hasSubcategory = !!filters.subcategory;

  const hasSearchOrModalFilter =
    filters.search || hasLocation || hasDates || hasPrice || hasRating;

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((raw) => {
        if (!cancelled) {
          setCategories(mapCategories(raw));
        }
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentCategory = useMemo(() => {
    if (!hasCategory) return null;

    return categories.find((c) => c.id === Number(filters.category)) || null;
  }, [categories, filters.category, hasCategory]);

  const currentSubcategory = useMemo(() => {
    if (!currentCategory || !hasSubcategory) return null;

    return (
      currentCategory.subcategories.find(
        (s) => s.id === Number(filters.subcategory),
      ) || null
    );
  }, [currentCategory, filters.subcategory, hasSubcategory]);

  const buildApiParams = (page = 1) => ({
    page,
    per_page: 12,
    sort: orderBy,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.subcategory && { subcategory: filters.subcategory }),
    ...(hasLocation && {
      lat: filters.lat,
      lng: filters.lng,
      radius: filters.radius || 5000,
    }),
    ...(hasDates && {
      data_inici: filters.data_inici,
      data_fi: filters.data_fi,
    }),
    ...(filters.min_price && {
      min_price: filters.min_price,
    }),
    ...(filters.max_price && {
      max_price: filters.max_price,
    }),
    ...(filters.min_user_rating && {
      min_user_rating: filters.min_user_rating,
    }),
  });

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setProducts([]);
    setMeta(null);

    const fetcher = hasLocation ? getNearbyObjects : getObjects;

    fetcher(buildApiParams(1))
      .then(({ data, meta }) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setMeta(meta);
        }
      })
      .catch((err) => {
        console.error("Error cargando resultados:", err);

        if (!cancelled) {
          setProducts([]);
          setMeta(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    orderBy,
    filters.search,
    filters.lat,
    filters.lng,
    filters.radius,
    filters.data_inici,
    filters.data_fi,
    filters.min_price,
    filters.max_price,
    filters.min_user_rating,
    filters.category,
    filters.subcategory,
  ]);

  const handleLoadMore = async () => {
    if (!meta || meta.current_page >= meta.last_page) return;

    setLoadingMore(true);

    try {
      const fetcher = hasLocation ? getNearbyObjects : getObjects;

      const { data, meta: newMeta } = await fetcher(
        buildApiParams(meta.current_page + 1),
      );

      setProducts((prev) => [...prev, ...(Array.isArray(data) ? data : [])]);
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
      if (v == null || v === "") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });

    navigate(`/objects?${next.toString()}`, {
      replace: true,
    });
  };

  const totalResults = meta?.total ?? products.length;
  const hasMore = meta && meta.current_page < meta.last_page;

  const renderTitle = () => {
    if (currentSubcategory) {
      return (
        <>
          <h1 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text">
            {currentSubcategory.name}
          </h1>

          <p className="mt-2 font-body text-body text-app-text-secondary">
            {totalResults} {totalResults === 1 ? "objeto" : "objetos"} en esta
            subcategoría de {currentCategory.name}
          </p>
        </>
      );
    }

    if (currentCategory) {
      return (
        <>
          <h1 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text">
            {currentCategory.name}
          </h1>

          <p className="mt-2 font-body text-body text-app-text-secondary">
            {totalResults} {totalResults === 1 ? "objeto" : "objetos"} en esta
            categoría
          </p>
        </>
      );
    }

    if (hasSearchOrModalFilter) {
      return (
        <>
          <h1 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text">
            {filters.search
              ? `Resultados de búsqueda para "${filters.search}"`
              : "Resultados de búsqueda"}
          </h1>

          <p className="mt-2 font-body text-body text-app-text-secondary">
            Se han encontrado {totalResults} resultado
            {totalResults === 1 ? "" : "s"}
          </p>
        </>
      );
    }

    return (
      <>
        <h1 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text">
          Todos los objetos
        </h1>

        <p className="mt-2 font-body text-body text-app-text-secondary">
          {totalResults} objetos disponibles
        </p>
      </>
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8 py-6">
      <div className="flex items-start gap-6">
        <CategorySidebar
          categories={categories}
          filters={filters}
          onOpenLocation={() => setLocationOpen(true)}
          onOpenDates={() => setDatesOpen(true)}
          onOpenPrice={() => setPriceOpen(true)}
          onOpenRating={() => setRatingOpen(true)}
          applyFilterPatch={applyFilterPatch}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <BtnBack />
            <BtnOrder value={orderBy} onChange={setOrderBy} />
          </div>

          <div className="mt-6">{renderTitle()}</div>

          <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
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
                  ? formatDateRangeShort(filters.data_inici, filters.data_fi)
                  : "Añadir fechas"
              }
              active={hasDates}
              onClick={() => setDatesOpen(true)}
            />

            <InlineFilterChip
              icon="payments"
              label={(() => {
                if (!hasPrice) return "Añadir precio";

                if (filters.min_price && !filters.max_price) {
                  return `Desde ${filters.min_price}€/día`;
                }

                if (!filters.min_price && filters.max_price) {
                  return `Hasta ${filters.max_price}€/día`;
                }

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

          <div className="mt-6">
            {loading ? (
              <ProductsGridSkeleton count={6} />
            ) : products.length > 0 ? (
              <>
                <ProductsSection
                  title=""
                  products={products}
                  preserveSearchParams
                  containerless
                  maxCols={4}
                />

                {hasMore && (
                  <div className="py-6 text-center">
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
              <div className="py-12">
                <div className="rounded-[20px] border border-app-border bg-app-bg-card p-10 text-center">
                  <h2 className="font-heading text-h3-desktop text-app-text">
                    No se han encontrado resultados
                  </h2>

                  <p className="mt-3 font-body text-body text-app-text-secondary">
                    Prueba a ampliar el radio, cambiar las fechas o quitar algún
                    filtro.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}

export default ObjectsPage;