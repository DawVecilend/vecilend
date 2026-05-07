import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { addFavorite, removeFavorite } from "../../services/favorites";

function FavoriteButton({
  objectId,
  initialIsFavorite = false,
  onAdded,
  onRemoved,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  function notifyFavoriteChanged(nextValue) {
    window.dispatchEvent(
      new CustomEvent("favorites:changed", {
        detail: {
          objectId,
          isFavorite: nextValue,
        },
      }),
    );
  }

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    setErrorMessage("");

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
        notifyFavoriteChanged(false);

        if (onRemoved) {
          onRemoved(objectId);
        }
      } else {
        await addFavorite(objectId);

        setIsFavorite(true);
        notifyFavoriteChanged(true);

        if (onAdded) {
          onAdded(objectId);
        }
      }
    } catch (error) {
      console.error("Error cambiando favorito:", error);

      if (error.response?.status === 409) {
        setErrorMessage("Este objeto ya estaba en favoritos. Recarga la página.");
        return;
      }

      if (error.response?.status === 404) {
        setErrorMessage("Este favorito ya no existe. Recarga la página.");
        return;
      }

      setErrorMessage("No se ha podido actualizar el favorito.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`z-30 ${className}`}>
      <button
        type="button"
        aria-label={isFavorite ? "Quitar de favoritos" : "Guardar favorito"}
        title={isFavorite ? "Quitar de favoritos" : "Guardar favorito"}
        onClick={handleClick}
        disabled={busy}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#0e1513]/50 shadow-lg backdrop-blur-md transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          isFavorite
            ? "text-[#ff4d6d] hover:text-[#ff6b81]"
            : "text-white hover:text-[#ffb4ab]"
        }`}
      >
        {busy ? (
          <span className="material-symbols-outlined animate-spin text-[22px]">
            progress_activity
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-[23px] w-[23px]"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        )}
      </button>

      {errorMessage && (
        <div className="absolute right-0 top-12 z-50 w-[240px] rounded-[12px] border border-red-500/30 bg-[#16181C] px-3 py-2 text-xs font-medium text-red-300 shadow-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default FavoriteButton;