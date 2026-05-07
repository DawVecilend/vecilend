import { useEffect, useState, useMemo } from "react";
import HeroSection from "../../components/home/HeroSection";
import CategoriesSection from "../../components/home/categories/CategoriesSection";
import ProductsSection from "../../components/home/ProductsSection";
import BenefitsSection from "../../components/home/BenefitsSection";
import ProductsGridSkeleton from "../../components/elementos/ProductsGridSkeleton";
import { getObjects } from "../../services/objects";
import { getCategories } from "../../services/categories";
import { mapCategories } from "../../mappers/categoryMapper";
import CTASection from "../../components/home/CTASection";

function HomePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      getObjects({ per_page: 5, sort: "popular" }).then((r) => r.data),
      getObjects({ per_page: 5, sort: "recent" }).then((r) => r.data),
      getCategories(),
    ])
      .then(([topResult, recentResult, categoriesResult]) => {
        if (cancelled) return;

        if (topResult.status === "fulfilled") {
          setTopProducts(topResult.value || []);
        } else {
          console.error("Error cargando más populares:", topResult.reason);
          setTopProducts([]);
        }

        if (recentResult.status === "fulfilled") {
          setRecentProducts(recentResult.value || []);
        } else {
          console.error(
            "Error cargando productos recientes:",
            recentResult.reason,
          );
          setRecentProducts([]);
        }

        if (categoriesResult.status === "fulfilled") {
          setCategories(mapCategories(categoriesResult.value));
        } else {
          console.error("Error cargando categorías:", categoriesResult.reason);
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

  return (
    <>
      <HeroSection />

      {loading ? (
        <>
          <div className="py-8 text-center">
            <div className="mx-auto max-w-[1380px] px-4 md:px-8">
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
          <div className="mx-auto w-full max-w-[1380px] px-4 md:px-8">
            <ProductsGridSkeleton count={5} />
          </div>
        </>
      ) : (
        <>
          <CategoriesSection categories={categories} />
          <ProductsSection title="Más Populares" products={topProducts} />
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
