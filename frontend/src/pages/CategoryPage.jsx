import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductsSection from "../components/home/ProductsSection";
import BtnBack from "../components/elementos/BtnBack";
import BtnOrder from "../components/elementos/BtnOrder";
import { getCategories } from "../services/categories";
import { getObjects } from "../services/objects";
import { mapCategories } from "../mappers/categoryMapper";
import ProductsGridSkeleton from "../components/elementos/ProductsGridSkeleton";

function CategoryPage() {
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderBy, setOrderBy] = useState("recent");

  // Trobar la categoria actual un cop carregades les categories
  const currentCategory = useMemo(() => {
    return categories.find((category) => category.slug === slug) || null;
  }, [categories, slug]);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Cargar categorías
        const rawCats = await getCategories();
        const mappedCats = mapCategories(rawCats);
        setCategories(mappedCats);

        // 2. Encontrar la categoría actual por slug
        const current = mappedCats.find((c) => c.slug === slug);
        if (!current) {
          setLoadingCategories(false);
          setLoadingProducts(false);
          return;
        }

        // 3. Cargar objetos filtrados y ordenados por el backend
        const { data: rawObjects } = await getObjects({
          category: current.id,
          sort: orderBy,
        });
        setProducts(rawObjects);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    }

    loadData();
  }, [slug, orderBy]);

  const isLoading = loadingCategories || loadingProducts;
  const hasCategory = Boolean(currentCategory);
  const hasProducts = products.length > 0;

  return (
    <>
      <main className="min-h-screen bg-app-bg px-6 py-10 text-app-text">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex items-center justify-between gap-4">
            <BtnBack />
            <BtnOrder value={orderBy} onChange={setOrderBy} />
          </div>

          {isLoading ? (
            <>
              <section className="mb-8 mt-6">
                <div className="h-10 w-64 bg-app-bg-card rounded animate-pulse" />
                <div className="mt-3 h-5 w-80 bg-app-bg-card rounded animate-pulse" />
              </section>
              <ProductsGridSkeleton count={6} />
            </>
          ) : !hasCategory ? (
            <section className="py-12 text-center">
              <h1 className="font-heading text-h2-desktop font-bold text-app-text">
                Categoría no encontrada
              </h1>
              <p className="mt-3 font-body text-body text-app-text-secondary">
                No existe ninguna categoría con el slug "{slug}".
              </p>
            </section>
          ) : hasProducts ? (
            <>
              <section className="mb-8 mt-6">
                <h1 className="font-heading text-h1-mobile font-bold text-app-text">
                  {currentCategory.name}
                </h1>
                <p className="mt-2 font-body text-body-base text-app-text-secondary">
                  Se han encontrado {products.length} productos en esta
                  categoría.
                </p>
              </section>
              <ProductsSection
                title={`Productos de ${currentCategory.name}`}
                products={products}
              />
            </>
          ) : (
            <>
              <section className="mb-8 mt-6">
                <h1 className="font-heading text-h1-mobile font-bold text-app-text">
                  {currentCategory.name}
                </h1>
                <p className="mt-2 font-body text-body-base text-app-text-secondary">
                  Se han encontrado 0 productos en esta categoría.
                </p>
              </section>
              <section className="rounded-[20px] border border-app-border bg-app-bg-card p-10 text-center">
                <h2 className="font-heading text-h3-desktop text-app-text">
                  No hay productos en esta categoría
                </h2>
                <p className="mt-3 font-body text-body text-app-text-secondary">
                  Todavía no hay productos publicados en "{currentCategory.name}
                  ".
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default CategoryPage;
