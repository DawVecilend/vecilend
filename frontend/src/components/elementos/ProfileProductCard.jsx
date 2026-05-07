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
      container: "bg-[#0e1513]/60 text-[#ef4444]",
      dot: "bg-[#ef4444]",
    };
  }

  return {
    container: "bg-[#0e1513]/60 text-[#4fdbc8]",
    dot: "bg-[#4fdbc8]",
  };
}

function ProfileProductCard({
  id,
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
    <div className="relative w-[255px]">
      <Link to={`/objects/${id}`} className="block w-[255px]">
        <div className="group flex h-full w-[255px] flex-col overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
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
                className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#0e1513]/40 text-white backdrop-blur-md transition-colors hover:text-[#4fdbc8]"
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

            <div
              className={`absolute bottom-4 left-4 flex items-center rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${availabilityClasses.container}`}
            >
              <span
                className={`mr-2 h-2 w-2 rounded-full ${availabilityClasses.dot}`}
              ></span>

              {availabilityLabel}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="min-h-[56px] text-lg font-bold text-[#dde4e1] line-clamp-2 transition-colors group-hover:text-[#4fdbc8]">
                {title}
              </h3>

              <div className="flex shrink-0 items-center text-sm font-bold text-[#f38764]">
                {rating != null ? (
                  <>
                    <span
                      className="material-symbols-outlined mr-0.5 text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {Number(rating).toFixed(1)}
                  </>
                ) : (
                  <span className="font-normal text-[#bbcac6]">Nuevo</span>
                )}
              </div>
            </div>

            <p className="mb-4 min-h-[42px] text-sm text-[#bbcac6] line-clamp-2">
              {description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-[#3c4947] pt-4">
              <div>
                {priceDay > 0 ? (
                  <>
                    <span className="text-xl font-black text-[#dde4e1]">
                      {priceDay}€
                    </span>

                    <span className="text-sm text-[#bbcac6]"> / día</span>
                  </>
                ) : (
                  <span className="text-xl font-black text-[#dde4e1]">
                    Gratuito
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
          className="absolute right-4 top-[64px] z-50 w-[180px] overflow-hidden rounded-[14px] border border-[#2A2B31] bg-[#101217] shadow-xl"
        >
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#F2F4F8] transition hover:bg-[#16181C]"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isHidden ? "visibility" : "visibility_off"}
            </span>

            {isHidden ? "Hacer visible" : "Ocultar"}
          </button>

          <button
            type="button"
            onClick={handleEditClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#F2F4F8] transition hover:bg-[#16181C]"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Editar
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#ef4444] transition hover:bg-[#ef4444]/10"
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