import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { addFavorite, removeFavorite } from "../../services/favorites";

function FavoriteButton({
  objectId,
  initialIsFavorite = false,
  onRemoved,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname + location.search,
        },
      });

      return;
    }

    if (busy) return;

    setBusy(true);

    try {
      if (isFavorite) {
        await removeFavorite(objectId);

        setIsFavorite(false);

        if (onRemoved) {
          onRemoved(objectId);
        }
      } else {
        await addFavorite(objectId);
        setIsFavorite(true);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setIsFavorite(true);
        return;
      }

      if (error.response?.status === 404) {
        setIsFavorite(false);
        return;
      }

      console.error("Error cambiando favorito:", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar favorito"}
      title={isFavorite ? "Quitar de favoritos" : "Guardar favorito"}
      onClick={handleClick}
      disabled={busy}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-app-bg/40 text-white backdrop-blur-md transition-colors hover:text-[#ffb4ab] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {busy ? (
        <span className="material-symbols-outlined animate-spin text-[22px]">
          progress_activity
        </span>
      ) : (
        <span
          className="material-symbols-outlined text-[24px]"
          style={{
            fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          favorite
        </span>
      )}
    </button>
  );
}

export default FavoriteButton;