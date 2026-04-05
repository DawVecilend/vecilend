import ProductCard from '../elementos/ProductCard'

function ProductsSection({ title, products = [] }) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto w-full">
        <h2 className="mb-8 text-center font-heading text-h2-desktop leading-h2 font-bold text-vecilend-dark-text">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              category={product.category}
              title={product.title}
              userName={product.userName}
              userAvatar={product.userAvatar}
              rating={product.rating}
              pricePerDay={product.pricePerDay}
              status={product.status}
              availableAt={product.availableAt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection