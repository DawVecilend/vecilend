import ProductCard from '../elementos/ProductCard'
import ProfileProductCard from '../elementos/ProfileProductCard'

function ProductsSection({ title, products = [], profile = false }) {
  console.log("📦 Productos recibidos en ProductsSection:", products)
  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full">
        <h2 className="mb-8 text-center font-heading text-h2-desktop leading-h2 font-bold text-vecilend-dark-text">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {profile ? (
            products.map((product) => (
              <ProfileProductCard
                key = {product.id}
                id = {product.id}
                image = {product.imatge_principal || '/assets/product1-image.jpg'}
                category = {product.categoria?.nom || 'Sense categoria'}
                description = {product.descripcio || 'Sense descripció'}
                title = {product.nom || 'producte'}
                userName = {product.user?.nom || 'Usuari'}
                userAvatar = {product.user?.avatar_url || '/assets/avatar-omar.jpg'}
                rating = {product.valoracio_mitjana ?? 0}
                priceDay = {product.preu_diari ? Number(product.preu_diari) : 0}
                status = {product.estat}
              />
            ))) : (
            products.map((product) => (
              <ProductCard
                key = {product.id}
                id = {product.id}
                image = {product.imatge_principal || '/assets/product1-image.jpg'}
                category = {product.categoria?.nom || 'Sense categoria'}
                description = {product.descripcio || 'Sense descripció'}
                title = {product.nom || 'producte'}
                userName = {product.user?.nom || 'Usuari'}
                userAvatar = {product.user?.avatar_url || '/assets/avatar-omar.jpg'}
                rating = {product.valoracio_mitjana ?? 0}
                priceDay = {product.preu_diari ? Number(product.preu_diari) : 0}
                status = {product.estat}
              />
            )))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductsSection