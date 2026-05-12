import { useEffect, useState } from "react";
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
  const [recentProducts, setRecentProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      // Mejores productos: ordre per nº de transaccions finalitzades (backend Tasca 2)
      getObjects({ per_page: 5, sort: "popular" }).then((r) => r.data),
      // Publicaciones recientes
      getObjects({ per_page: 5, sort: "recent" }).then((r) => r.data),
      getCategories(),
    ])
      .then(([rawTop, rawRecent, rawCategories]) => {
        if (cancelled) return;
        setTopProducts(rawTop || []);
        setRecentProducts(rawRecent || []);
        setCategories(mapCategories(rawCategories));
      })
      .catch((err) => {
        console.error("Error cargando home:", err);
        if (!cancelled) {
          setRecentProducts([]);
          setTopProducts([]);
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
