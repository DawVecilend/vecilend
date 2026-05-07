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
      container: "bg-app-bg/60 text-[#ef4444]",
      dot: "bg-[#ef4444]",
    };
  }

  return {
    container: "bg-app-bg/60 text-[#4fdbc8]",
    dot: "bg-[#4fdbc8]",
  };
}

function ProductCard({
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
  searchParamsString = "",
  initialIsFavorite = false,
  onFavoriteRemoved,
}) {
  const navigate = useNavigate();

  const availabilityLabel = getAvailabilityLabel(status);
  const availabilityClasses = getAvailabilityClasses(status);

  const detailLink = searchParamsString
    ? `/objects/${id}?${searchParamsString}`
    : `/objects/${id}`;

  function handleProfileClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (userName) {
      navigate(`/profile/${userName.toLowerCase()}`);
    }
  }

  return (
    <Link to={detailLink} className="w-63.75">
      <div className="group flex h-full w-[255px] flex-col overflow-hidden rounded-[12px] border border-app-border bg-app-bg-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={title}
            src={image}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <FavoriteButton
            objectId={id}
            initialIsFavorite={initialIsFavorite}
            onRemoved={onFavoriteRemoved}
            className="absolute right-4 top-4"
          />

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
          <div
            role="link"
            tabIndex={0}
            onClick={handleProfileClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleProfileClick(e);
              }
            }}
            className="mb-4 inline-flex cursor-pointer items-center gap-2 self-start"
          >
            <img
              alt={userName}
              src={userAvatar}
              className="h-8 w-8 rounded-full border-2 border-[#0e1513]/60 object-cover"
            />

            <p className="text-sm text-app-text-secondary transition-colors hover:text-[#4fdbc8]">
              {userName}
            </p>
          </div>

          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="min-h-[56px] text-lg font-bold text-app-text line-clamp-2 transition-colors group-hover:text-[#4fdbc8]">
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
                  {rating}
                </>
              ) : (
                <span className="font-normal text-app-text-secondary">
                  Nuevo
                </span>
              )}
            </div>
          </div>

          <p className="mb-4 min-h-[42px] text-sm text-app-text-secondary line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-app-border pt-4">
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
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;