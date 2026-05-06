import { useLocation } from "react-router-dom";
import ProductCard from "../elementos/ProductCard";
import ProfileProductCard from "../elementos/ProfileProductCard";
import { cldTransform } from "../../utils/cloudinary";

function ProductsSection({
  title,
  products = [],
  profile = false,
  preserveSearchParams = false,
  isOwnProfile = false,
  onToggleVisibility,
  onDeleteProduct,
}) {
  const location = useLocation();

  const searchParamsString = preserveSearchParams
    ? location.search.replace(/^\?/, "")
    : "";

  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full">
        {title && (
          <h2 className="mb-8 text-center font-heading text-h2-desktop leading-h2 font-bold text-vecilend-dark-text">
            {title}
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {profile
            ? products.map((product) => (
                <ProfileProductCard
                  key={product.id}
                  id={product.id}
                  image={
                    cldTransform(product.imatge_principal, "card") ||
                    "/assets/product1-image.jpg"
                  }
                  category={product.categoria?.nom || "Sin categoría"}
                  description={product.descripcio || "Sin descripción"}
                  title={product.nom || "producto"}
                  userName={product.user?.nom || "Usuario"}
                  userAvatar={
                    product.user?.avatar_url || "/assets/avatar-omar.jpg"
                  }
                  rating={product.valoracio_objecte?.avg ?? null}
                  priceDay={product.preu_diari ? Number(product.preu_diari) : 0}
                  status={product.estat}
                  isOwnProfile={isOwnProfile}
                  onToggleVisibility={onToggleVisibility}
                  onDeleteProduct={onDeleteProduct}
                />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={
                    cldTransform(product.imatge_principal, "card") ||
                    "/assets/product1-image.jpg"
                  }
                  category={product.categoria?.nom || "Sin categoría"}
                  description={product.descripcio || "Sin descripción"}
                  title={product.nom || "producto"}
                  userName={
                    product.user?.username || product.user?.nom || "usuario"
                  }
                  userAvatar={
                    product.user?.avatar_url || "/assets/avatar-omar.jpg"
                  }
                  rating={product.valoracio_objecte?.avg ?? null}
                  priceDay={product.preu_diari ? Number(product.preu_diari) : 0}
                  status={product.estat}
                  searchParamsString={searchParamsString}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
