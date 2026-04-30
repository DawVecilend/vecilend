import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductsGridSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductsGridSkeleton;
