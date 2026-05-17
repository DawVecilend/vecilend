import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

function getAvailabilityLabel(status) {
  if (status === "disponible") return "Disponible";
  if (status === "no_disponible") return "No disponible";
  return "Disponible";
}

function getAvailabilityClasses(status) {
  if (status === "no_disponible") {
    return {
      container: "bg-app-bg/60 text-[var(--color-app-danger)]",
      dot: "bg-[var(--color-app-danger)]",
    };
  }

  return {
    container: "bg-app-bg/60 text-vecilend-dark-primary",
    dot: "bg-vecilend-dark-primary",
  };
}

function ProfileProductCard({
  id,
  slug,
  image,
  category,
  description,
  title,
  userName,
  userAvatar,
  rating,
  priceDay,
  status,
  isOwnProfile = false,
  initialIsFavorite = false,
  onFavoriteAdded,
  onFavoriteRemoved,
  onToggleVisibility,
  onDeleteProduct,
}) {
  const navigate = useNavigate();

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);

  const availabilityLabel = getAvailabilityLabel(status);
  const availabilityClasses = getAvailabilityClasses(status);

  const isHidden = status === "no_disponible";

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedButton && !clickedMenu) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleOpenMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    setOpenMenu((current) => !current);
  }

  function handleToggleVisibility(e) {
    e.preventDefault();
    e.stopPropagation();

    setOpenMenu(false);

    if (onToggleVisibility) {
      onToggleVisibility(id, status);
    }
  }

  function handleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();

    setOpenMenu(false);
    navigate(`/objects/${id}/edit`);
  }

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    setOpenMenu(false);

    if (onDeleteProduct) {
      onDeleteProduct({
        id,
        title,
      });
    }
  }

  return (
    <div className="relative w-full">
      <Link to={slug ? `/objects/${id}/${slug}` : `/objects/${id}`} className="block w-full">
        <div className="group flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-app-border bg-app-bg-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
          <div className="relative aspect-4/3 overflow-hidden">
            <img
              alt={title}
              src={image}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {isOwnProfile ? (
              <button
                ref={buttonRef}
                type="button"
                onClick={handleOpenMenu}
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-app-bg/40 text-white backdrop-blur-md transition-colors hover:text-vecilend-dark-primary"
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            ) : (
              <FavoriteButton
                objectId={id}
                initialIsFavorite={initialIsFavorite}
                onAdded={onFavoriteAdded}
                onRemoved={onFavoriteRemoved}
                className="absolute right-4 top-4"
              />
            )}

            {isOwnProfile && (
              <div
                className={`absolute bottom-4 left-4 flex items-center rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${availabilityClasses.container}`}
              >
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${availabilityClasses.dot}`}
                ></span>

                {availabilityLabel}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h3 className="min-h-[56px] mb-2 text-lg font-bold text-app-text line-clamp-2 transition-colors group-hover:text-vecilend-dark-primary">
              {title}
            </h3>

            <p className="mb-4 min-h-[42px] text-sm text-app-text-secondary line-clamp-2">
              {description}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-app-border pt-4">
              <div>
                {priceDay > 0 ? (
                  <>
                    <span className="text-xl font-black text-app-text">
                      {priceDay}€
                    </span>
                    <span className="text-sm text-app-text-secondary">
                      {" "}
                      / día
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-black text-app-text">
                    Gratuito
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-0.5 text-sm font-bold text-[var(--color-app-star)]">
                {rating != null ? (
                  <>
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span>{Number(rating).toFixed(1)}</span>
                  </>
                ) : (
                  <span className="font-normal text-app-text-secondary">
                    Nuevo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {openMenu && (
        <div
          ref={menuRef}
          className="absolute right-4 top-[64px] z-50 w-[180px] overflow-hidden rounded-[14px] border border-app-border bg-app-bg-card shadow-xl"
        >
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-app-text transition hover:bg-app-neutral"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isHidden ? "visibility" : "visibility_off"}
            </span>

            {isHidden ? "Hacer visible" : "Ocultar"}
          </button>

          <button
            type="button"
            onClick={handleEditClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-app-text transition hover:bg-app-neutral"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Editar
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[var(--color-app-danger)] transition hover:bg-[var(--color-app-danger)]/10"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileProductCard;
