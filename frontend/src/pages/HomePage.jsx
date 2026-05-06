import { useEffect, useState, useMemo } from "react";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/categories/CategoriesSection";
import ProductsSection from "../components/home/ProductsSection";
import BenefitsSection from "../components/home/BenefitsSection";
import ProductsGridSkeleton from "../components/elementos/ProductsGridSkeleton";
import { getObjects } from "../services/objects";
import { getCategories } from "../services/categories";
import { mapCategories } from "../mappers/categoryMapper";
import CTASection from "../components/home/CTASection";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      // Només 10 objectes a la home (5 per secció)
      getObjects({ per_page: 10, sort: "recent" }).then((r) => r.data),
      getCategories(6),
    ])
      .then(([rawObjects, rawCategories]) => {
        if (cancelled) return;
        setProducts(rawObjects);
        setCategories(mapCategories(rawCategories));
      })
      .catch((err) => {
        console.error("Error cargando home:", err);
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Memoritzem els slices per evitar recalcular en cada render
  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        )
        .slice(0, 5),
    [products],
  );

  // TODO: quan funcioni `sort=rating` amb valoracions reals, fer una segona crida
  // a getObjects({ per_page: 5, sort: 'rating' }) per separar els "top" dels "recents".
  const topProducts = recentProducts;

  return (
    <>
      <HeroSection />

      {loading ? (
        <>
          {/* Placeholder de categories (alçada similar a CategoriesSection) */}
          <div className="py-8 text-center">
            <div className="mx-auto max-w-[1380px] px-4 md:px-10">
              <div className="h-8 w-48 mx-auto mb-6 bg-app-bg-card rounded animate-pulse" />
              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 w-32 bg-app-bg-card rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Skeleton dels productes */}
          <ProductsGridSkeleton count={5} />
        </>
      ) : (
        <>
          <CategoriesSection categories={categories} />
          <ProductsSection title="Mejores Productos" products={topProducts} />
          <ProductsSection
            title="Publicaciones Recientes"
            products={recentProducts}
          />
        </>
      )}

      <BenefitsSection />
      <CTASection />
    </>
  );
}

export default HomePage;
