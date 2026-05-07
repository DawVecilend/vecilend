import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../elementos/ProductCard";
import ProfileProductCard from "../elementos/ProfileProductCard";
import { cldTransform } from "../../utils/cloudinary";
import { useAuth } from "../../contexts/AuthContext";
import { getFavorites } from "../../services/favorites";

function getMainImage(product) {
  const image =
    product.imatge_principal ||
    product.imatges?.[0]?.url ||
    product.imatges?.[0]?.url_cloudinary ||
    null;

  return cldTransform(image, "card") || "/assets/product1-image.jpg";
}

function getUserName(product) {
  return (
    product.user?.username ||
    product.propietari?.username ||
    product.user?.nom ||
    product.propietari?.nom ||
    "usuario"
  );
}

function getUserAvatar(product) {
  return (
    product.user?.avatar_url ||
    product.propietari?.avatar_url ||
    "/assets/icons/empty-user-icon.svg"
  );
}

function getRating(product) {
  return (
    product.valoracio_objecte?.avg ??
    product.user?.valoracio_propietari_avg ??
    product.user?.valoracio_mitjana ??
    product.propietari?.valoracio_propietari_avg ??
    product.propietari?.valoracio_mitjana ??
    null
  );
}

function backendSaysFavorite(product) {
  return Boolean(
    product.favorit ||
      product.is_favorite ||
      product.is_favorited ||
      product.isFavorite ||
      product.favorited,
  );
}

function ProductsSection({
  title,
  products = [],
  profile = false,
  preserveSearchParams = false,
  isOwnProfile = false,
  onFavoriteAdded,
  onFavoriteRemoved,
  onToggleVisibility,
  onDeleteProduct,
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const searchParamsString = preserveSearchParams
    ? location.search.replace(/^\?/, "")
    : "";

  useEffect(() => {
    let cancelled = false;

    async function loadFavoriteIds() {
      if (!isAuthenticated) {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const response = await getFavorites();

        if (cancelled) return;

        const ids = new Set(
          response.favorites
            .map((favorite) => favorite.id)
            .filter((id) => id !== undefined && id !== null),
        );

        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error cargando ids de favoritos:", error);
      }
    }

    loadFavoriteIds();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    function handleFavoriteChanged(event) {
      const { objectId, isFavorite } = event.detail;

      setFavoriteIds((currentIds) => {
        const nextIds = new Set(currentIds);

        if (isFavorite) {
          nextIds.add(objectId);
        } else {
          nextIds.delete(objectId);
        }

        return nextIds;
      });
    }

    window.addEventListener("favorites:changed", handleFavoriteChanged);

    return () => {
      window.removeEventListener("favorites:changed", handleFavoriteChanged);
    };
  }, []);

  function isProductFavorite(product) {
    return backendSaysFavorite(product) || favoriteIds.has(product.id);
  }

  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full">
        {title && (
          <h2 className="mb-8 text-center font-heading text-h2-desktop font-bold leading-h2 text-vecilend-dark-text">
            {title}
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {profile
            ? products.map((product) => (
                <ProfileProductCard
                  key={product.id}
                  id={product.id}
                  image={getMainImage(product)}
                  category={product.categoria?.nom || "Sin categoría"}
                  description={product.descripcio || "Sin descripción"}
                  title={product.nom || "Producto"}
                  userName={getUserName(product)}
                  userAvatar={getUserAvatar(product)}
                  rating={getRating(product)}
                  priceDay={product.preu_diari ? Number(product.preu_diari) : 0}
                  status={product.estat}
                  isOwnProfile={isOwnProfile}
                  initialIsFavorite={isProductFavorite(product)}
                  onFavoriteAdded={onFavoriteAdded}
                  onFavoriteRemoved={onFavoriteRemoved}
                  onToggleVisibility={onToggleVisibility}
                  onDeleteProduct={onDeleteProduct}
                />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={getMainImage(product)}
                  category={product.categoria?.nom || "Sin categoría"}
                  description={product.descripcio || "Sin descripción"}
                  title={product.nom || "Producto"}
                  userName={getUserName(product)}
                  userAvatar={getUserAvatar(product)}
                  rating={getRating(product)}
                  priceDay={product.preu_diari ? Number(product.preu_diari) : 0}
                  status={product.estat}
                  searchParamsString={searchParamsString}
                  initialIsFavorite={isProductFavorite(product)}
                  onFavoriteAdded={onFavoriteAdded}
                  onFavoriteRemoved={onFavoriteRemoved}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;