import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsSection from "../components/home/ProductsSection";
import BtnOrder from "../components/elementos/BtnOrder";
import BtnBack from "../components/elementos/BtnBack";
import { getObjects } from "../services/objects";

function ResultsPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderBy, setOrderBy] = useState("recent");
  const [searchParams] = useSearchParams();

  const searchText = (searchParams.get("search") || "").trim();
  const hasQuery = searchText.length > 0;

  useEffect(() => {
    let cancelled = false;
    async function loadResults() {
      setLoadingProducts(true);
      try {
        const rawObjects = await getObjects({
          ...(hasQuery && { search: searchText }),
          sort: orderBy,
        });
        if (!cancelled) setProducts(rawObjects);
      } catch (error) {
        console.error("Error cargando resultados:", error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }
    loadResults();
    return () => {
      cancelled = true;
    };
  }, [searchText, orderBy, hasQuery]);

  const hasResults = products.length > 0;

  return (
    <>
      <section className="mx-auto w-full max-w-[1380px] px-10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <BtnBack />
          <BtnOrder value={orderBy} onChange={setOrderBy} />
        </div>

        <div className="mt-6">
          {hasQuery ? (
            <>
              <h1 className="font-heading text-h2-desktop text-vecilend-dark-text">
                Resultados de búsqueda para "{searchText}"
              </h1>
              <p className="mt-2 font-body text-body text-vecilend-dark-text-secondary">
                Se han encontrado {products.length} resultados
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-h2-desktop text-vecilend-dark-text">
                Todos los objetos
              </h1>
              <p className="mt-2 font-body text-body text-vecilend-dark-text-secondary">
                {products.length} objetos disponibles
              </p>
            </>
          )}
        </div>
      </section>

      {loadingProducts ? (
        <p className="py-10 text-center text-vecilend-dark-text">
          Cargando productos...
        </p>
      ) : hasResults ? (
        <ProductsSection title="Resultados" products={products} />
      ) : (
        <section className="mx-auto w-full max-w-[1380px] px-10 py-12">
          <div className="rounded-[20px] border border-vecilend-dark-border bg-vecilend-dark-card p-10 text-center">
            <h2 className="font-heading text-h3-desktop text-vecilend-dark-text">
              {hasQuery
                ? "No se han encontrado resultados"
                : "No hay objetos disponibles"}
            </h2>
            <p className="mt-3 font-body text-body text-vecilend-dark-text-secondary">
              {hasQuery
                ? `No hemos encontrado objetos para "${searchText}". Prueba con otro término más general o revisa la ortografía.`
                : "Vuelve más tarde para ver nuevas publicaciones."}
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export default ResultsPage;
