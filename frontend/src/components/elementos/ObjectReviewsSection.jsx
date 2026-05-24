import { useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const PER_PAGE = 4;

function ReviewCard({ rev }) {
  const date = rev.created_at
    ? new Date(rev.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="bg-app-bg-card border-l-4 border-vecilend-dark-primary p-5 rounded-lg space-y-2">
      <div className="flex items-center gap-3">
        {rev.autor?.avatar_url ? (
          <img
            src={rev.autor.avatar_url}
            alt={rev.autor.nom}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-app-neutral" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-app-text truncate">
            {rev.autor?.username ? (
              <Link
                to={`/profile/${rev.autor.username}`}
                className="hover:text-vecilend-dark-primary transition-colors"
              >
                {rev.autor.nom}
              </Link>
            ) : (
              rev.autor?.nom
            )}
          </h3>
          <Rating
            value={rev.puntuacio}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": { color: "#facc15" },
              "& .MuiRating-iconEmpty": { color: "#facc15", opacity: 0.3 },
            }}
          />
        </div>
        {date && (
          <span className="text-caption text-app-text-secondary shrink-0">
            {date}
          </span>
        )}
      </div>

      {rev.comentari && (
        <p className="text-app-text-secondary italic">"{rev.comentari}"</p>
      )}
    </article>
  );
}

/**
 * Llista de valoracions específiques d'un objecte (al detall del producte).
 * Les valoracions arriben totes des de `product.valoracions`. Aquí fem
 * paginació en client (4 per pas) per no atapeir la pantalla.
 */
function ObjectReviewsSection({ valoracions = [] }) {
  const [shown, setShown] = useState(PER_PAGE);

  if (!valoracions.length) {
    return (
      <section className="mt-12">
        <h2 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text mb-4">
          Reseñas sobre este objeto
        </h2>
        <div className="rounded-lg border border-app-border bg-app-bg-card p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-app-text-secondary opacity-60">
            reviews
          </span>
          <p className="mt-3 text-app-text-secondary">
            Este objeto aún no tiene reseñas. ¡Sé el primero en valorarlo!
          </p>
        </div>
      </section>
    );
  }

  const visible = valoracions.slice(0, shown);
  const hasMore = shown < valoracions.length;

  return (
    <section className="mt-12">
      <header className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text">
          Reseñas sobre este objeto
        </h2>
        <span className="text-label text-app-text-secondary">
          {valoracions.length} reseña{valoracions.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map((rev) => (
          <ReviewCard key={rev.id} rev={rev} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setShown((s) => s + PER_PAGE)}
            className="rounded-full bg-app-bg-card border border-app-border hover:border-vecilend-dark-primary px-8 py-3 text-body-base font-bold text-app-text transition-colors"
          >
            Ver más reseñas ({valoracions.length - shown} restantes)
          </button>
        </div>
      )}
    </section>
  );
}

export default ObjectReviewsSection;
