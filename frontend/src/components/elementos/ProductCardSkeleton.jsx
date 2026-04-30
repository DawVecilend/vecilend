function ProductCardSkeleton() {
  return (
    <div className="w-63.75 bg-[#161d1b] rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-4/3 bg-[#1f2725]" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-4 bg-[#1f2725] rounded w-1/3" />
        <div className="h-5 bg-[#1f2725] rounded w-3/4" />
        <div className="h-4 bg-[#1f2725] rounded w-full" />
        <div className="h-4 bg-[#1f2725] rounded w-2/3" />
        <div className="mt-auto pt-4 border-t border-[#3c4947] flex justify-between">
          <div className="h-6 bg-[#1f2725] rounded w-16" />
          <div className="h-9 bg-[#1f2725] rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
