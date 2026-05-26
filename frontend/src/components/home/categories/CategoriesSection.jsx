import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import CategoryPill from "./CategoryPill";

function CategoriesSection({ categories = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

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
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories.length]);

  const scrollByPage = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const delta = x - startX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    scrollRef.current.scrollLeft = scrollStart.current - delta;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleClickCapture = (e) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <section className="bg-app-bg-secondary py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-inter text-3xl font-extrabold tracking-tight mb-2 text-app-text">
              Descubre nuestras categorías
            </h2>
            <p className="text-app-text-secondary">
              Encuentra todo lo que necesitas en un solo lugar.
            </p>
          </div>
          <Link
            className="hidden md:inline-flex text-app-primary font-bold text-sm items-center hover:underline"
            to="/objects"
          >
            Ver todo el catálogo
          </Link>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label="Categorías anteriores"
              className="hidden md:flex absolute left-[-36px] top-1/2 -translate-y-1/2 z-10 items-center justify-center text-app-primary hover:text-white transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "32px" }}
              >
                chevron_left
              </span>
            </button>
          )}

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClickCapture={handleClickCapture}
            className="vecilend-carousel flex gap-4 overflow-x-auto scroll-smooth pb-2 select-none"
            style={{ cursor: "grab" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.3333%-0.6667rem)] lg:w-[calc(20%-0.8rem)] xl:w-[calc(16.6667%-0.84rem)]"
              >
                <CategoryPill
                  id={category.id}
                  name={category.name}
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
              className="hidden md:flex absolute right-[-36px] top-1/2 -translate-y-1/2 z-10 items-center justify-center text-app-primary hover:text-white transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "32px" }}
              >
                chevron_right
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
