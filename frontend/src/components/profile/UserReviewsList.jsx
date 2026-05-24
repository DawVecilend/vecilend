import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { getUserReviews } from "../../services/reviews";

const PER_PAGE = 6;

/**
 * @param {string} username   El perfil que estem mirant
 */
function UserReviewsList({ username }) {
  const [role, setRole] = useState("qualsevol");
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Càrrega inicial / quan canvia el rol
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (reviews.length > 0) {
      setTransitioning(true);
    } else {
      setLoading(true);
    }

    getUserReviews(username, { role, page: 1, per_page: PER_PAGE })
      .then((res) => {
        if (cancelled) return;
        setReviews(res.data || []);
        setMeta(res.meta || { current_page: 1, last_page: 1, total: 0 });
      })
      .catch((err) => {
        console.error("Error cargando reviews:", err);
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setTransitioning(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, role]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || meta.current_page >= meta.last_page) return;
    setLoadingMore(true);
    try {
      const res = await getUserReviews(username, {
        role,
        page: meta.current_page + 1,
        per_page: PER_PAGE,
      });
      setReviews((prev) => [...prev, ...(res.data || [])]);
      setMeta(res.meta || meta);
    } catch (err) {
      console.error("Error cargando más reviews:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, meta, role, username]);

  const handleRoleChange = (newRole) => {
    if (newRole === role) return;
    setRole(newRole);
  };

  const ROLES = [
    { id: "qualsevol", label: "Todas" },
    { id: "propietari", label: "Como propietario" },
    { id: "solicitant", label: "Como solicitante" },
  ];

  const remaining = Math.max(0, (meta.total ?? 0) - reviews.length);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-app-text">
          Reseñas recibidas
        </h2>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRoleChange(r.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                role === r.id
                  ? "bg-vecilend-dark-primary text-[var(--color-app-success-on)]"
                  : "bg-app-bg-secondary border border-app-border text-app-text hover:border-vecilend-dark-primary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-app-border bg-app-bg-secondary p-10 text-center">
          <p className="text-app-text-secondary">Cargando…</p>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="rounded-lg border border-app-border bg-app-bg-secondary p-10 text-center">
          <p className="text-app-text-secondary">
            Aún no hay reseñas{role !== "qualsevol" ? " para este rol" : ""}.
          </p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 " +
            (transitioning ? "opacity-50" : "opacity-100")
          }
        >
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-app-bg-secondary p-6 rounded-lg space-y-3 border-l-4 border-vecilend-dark-primary"
            >
              <div className="flex items-center gap-3">
                {rev.autor?.avatar_url ? (
                  <img
                    src={rev.autor.avatar_url}
                    alt={rev.autor.nom}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-app-bg-card-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-app-text truncate">
                    {rev.autor?.username ? (
                      <Link
                        to={`/profile/${rev.autor.username}`}
                        className="hover:text-vecilend-dark-primary"
                      >
                        {rev.autor.nom} {rev.autor.cognoms}
                      </Link>
                    ) : (
                      <>
                        {rev.autor?.nom} {rev.autor?.cognoms}
                      </>
                    )}
                  </h3>
                  <Rating
                    value={rev.puntuacio}
                    readOnly
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#f97316" },
                      "& .MuiRating-iconEmpty": {
                        color: "#f97316",
                        opacity: 0.3,
                      },
                    }}
                  />
                </div>
                {rev.created_at && (
                  <span className="text-xs text-app-text-secondary shrink-0">
                    {new Date(rev.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {rev.comentari && (
                <p className="text-app-text-secondary italic">"{rev.comentari}"</p>
              )}

              {rev.objecte && (
                <p className="text-xs text-app-text-secondary">
                  Sobre el objeto:{" "}
                  <Link
                    to={(rev.objecte.slug ? `/objects/${rev.objecte.id}/${rev.objecte.slug}` : `/objects/${rev.objecte.id}`)}
                    className="text-vecilend-dark-primary hover:underline"
                  >
                    {rev.objecte.nom}
                  </Link>
                </p>
              )}

              {rev.rol && role === "qualsevol" && (
                <div className="flex justify-end">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-vecilend-dark-primary/20 text-vecilend-dark-primary border border-vecilend-dark-primary/30">
                    {rev.rol === "propietari"
                      ? "Como propietario"
                      : "Como solicitante"}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!loading && meta.current_page < meta.last_page && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-full bg-app-bg-card border border-app-border hover:border-vecilend-dark-primary px-8 py-3 text-body-base font-bold text-app-text disabled:opacity-50 transition-colors"
          >
            {loadingMore
              ? "Cargando…"
              : `Cargar más${remaining > 0 ? ` (${remaining} restantes)` : ""}`}
          </button>
        </div>
      )}
    </section>
  );
}

export default UserReviewsList;
