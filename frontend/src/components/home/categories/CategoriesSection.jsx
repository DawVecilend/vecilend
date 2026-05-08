import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CategoryPill from "./CategoryPill";

function CategoriesSection({ categories = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories.length]);

  const scrollByPage = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="bg-[#1d2422] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-inter text-3xl font-extrabold tracking-tight mb-2 text-[#e1e3e0]">
              Descubre nuestras categorías
            </h2>
            <p className="text-[#aebdb9]">
              Encuentra todo lo que necesitas en una sola ubicación
            </p>
          </div>
          <Link
            className="hidden md:inline-flex text-[#4fdbc8] font-bold text-sm items-center gap-1 hover:underline"
            to="/objects"
          >
            Ver todo el catálogo
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Carrusel amb fletxes */}
        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Categorías anteriores"
              className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-[#0e1513]/90 border border-[#3c4947] text-[#e1e3e0] hover:bg-[#4fdbc8] hover:text-[#003730] hover:border-[#4fdbc8] transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}

          <div
            ref={scrollRef}
            className="vecilend-carousel flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1"
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="snap-start shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.6667%-0.84rem)]"
              >
                <CategoryPill
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon || "category"}
                />
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label="Más categorías"
              className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-[#0e1513]/90 border border-[#3c4947] text-[#e1e3e0] hover:bg-[#4fdbc8] hover:text-[#003730] hover:border-[#4fdbc8] transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
