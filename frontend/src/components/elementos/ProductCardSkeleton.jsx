function ProductCardSkeleton() {
  return (
    <div className="w-full bg-app-bg-card rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-4/3 bg-app-bg-card-secondary" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-4 bg-app-bg-card-secondary rounded w-1/3" />
        <div className="h-5 bg-app-bg-card-secondary rounded w-3/4" />
        <div className="h-4 bg-app-bg-card-secondary rounded w-full" />
        <div className="h-4 bg-app-bg-card-secondary rounded w-2/3" />
        <div className="mt-auto pt-4 border-t border-app-border flex justify-between">
          <div className="h-6 bg-app-bg-card-secondary rounded w-16" />
          <div className="h-9 bg-app-bg-card-secondary rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
