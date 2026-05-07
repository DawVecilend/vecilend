import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BtnBack from "../components/elementos/BtnBack";
import ProductsGridSkeleton from "../components/elementos/ProductsGridSkeleton";
import ProductsSection from "../components/home/ProductsSection";
import { getFavorites } from "../services/favorites";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    setError("");

    try {
      const response = await getFavorites();

      const favoritesWithState = response.favorites.map((product) => ({
        ...product,
        favorit: true,
      }));

      setFavorites(favoritesWithState);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setError("No se han podido cargar tus favoritos.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFavoriteRemoved(productId) {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((product) => product.id !== productId),
    );
  }

  return (
    <main className="min-h-screen bg-app-bg px-4 py-8 text-app-text md:px-10">
      <section className="mx-auto w-full max-w-[1380px]">
        <BtnBack />

        <div className="mt-8">
          <h1 className="font-heading text-h1-mobile font-bold text-app-text md:text-h1-desktop">
            Mis favoritos
          </h1>

          <p className="mt-2 font-body text-body-base text-app-text-secondary">
            Guarda aquí los objetos que te interesan para encontrarlos rápido
            más tarde.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-[16px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8">
            <ProductsGridSkeleton count={6} />
          </div>
        ) : favorites.length > 0 ? (
          <ProductsSection
            title=""
            products={favorites}
            onFavoriteRemoved={handleFavoriteRemoved}
          />
        ) : (
          <section className="mt-8 rounded-[24px] border border-app-border bg-app-bg-card px-6 py-14 text-center md:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-app-bg">
              <span
                className="material-symbols-outlined text-[34px] text-vecilend-dark-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>

            <h2 className="mt-6 font-heading text-h3-desktop font-bold text-app-text">
              Todavía no tienes favoritos
            </h2>

            <p className="mx-auto mt-3 max-w-[520px] font-body text-body-base text-app-text-secondary">
              Cuando encuentres un objeto que te guste, guárdalo en favoritos y
              aparecerá aquí.
            </p>

            <Link
              to="/objects"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-vecilend-dark-primary px-6 py-3 font-body text-sm font-bold text-white transition-colors hover:bg-vecilend-dark-primary-hover"
            >
              Explorar objetos
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}

export default FavoritesPage;