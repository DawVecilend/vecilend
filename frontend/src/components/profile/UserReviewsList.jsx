import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { getUserReviews } from "../../services/reviews";

/**
 * @param {string} username   El perfil que estem mirant
 */
function UserReviewsList({ username }) {
  const [role, setRole] = useState("qualsevol");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUserReviews(username, { role, page, per_page: 5 })
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
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username, role, page]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setPage(1);
  };

  const ROLES = [
    { id: "qualsevol", label: "Todas" },
    { id: "propietari", label: "Como propietario" },
    { id: "solicitant", label: "Como solicitante" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">
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
                  ? "bg-[#4fdbc8] text-[#003730]"
                  : "bg-[#161d1b] border border-[#3c4947] text-[#dde4e1] hover:border-[#4fdbc8]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-[#3c4947] bg-[#161d1b] p-10 text-center">
          <p className="text-[#bbcac6]">Cargando…</p>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="rounded-lg border border-[#3c4947] bg-[#161d1b] p-10 text-center">
          <p className="text-[#bbcac6]">
            Aún no hay reseñas {role !== "qualsevol" ? "para este rol" : ""}.
          </p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-[#161d1b] p-6 rounded-lg space-y-3 border-l-4 border-[#4fdbc8]"
            >
              <div className="flex items-center gap-3">
                {rev.autor?.avatar_url ? (
                  <img
                    src={rev.autor.avatar_url}
                    alt={rev.autor.nom}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#252b2a]" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#dde4e1] truncate">
                    {rev.autor?.username ? (
                      <Link
                        to={`/profile/${rev.autor.username}`}
                        className="hover:text-[#4fdbc8]"
                      >
                        {rev.autor.nom} {rev.autor.cognoms}
                      </Link>
                    ) : (
                      <>
                        {rev.autor?.nom} {rev.autor?.cognoms}
                      </>
                    )}
                  </h4>
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
              </div>

              {rev.comentari && (
                <p className="text-[#bbcac6] italic">"{rev.comentari}"</p>
              )}

              {rev.objecte && (
                <p className="text-xs text-[#859490]">
                  Sobre el objeto:{" "}
                  <Link
                    to={`/objects/${rev.objecte.id}`}
                    className="text-[#4fdbc8] hover:underline"
                  >
                    {rev.objecte.nom}
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full bg-[#161d1b] border border-[#3c4947] text-[#dde4e1] disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span className="text-[#bbcac6] text-sm">
            Página {meta.current_page} de {meta.last_page}
          </span>
          <button
            type="button"
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full bg-[#161d1b] border border-[#3c4947] text-[#dde4e1] disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
}

export default UserReviewsList;
