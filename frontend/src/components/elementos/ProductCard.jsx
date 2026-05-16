import { Link, useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

function ProductCard({
  id,
  slug,
  image,
  category,
  description,
  title,
  userName,
  userAvatar,
  ownerId,
  rating,
  priceDay,
  status,
  searchParamsString = "",
  initialIsFavorite = false,
  onFavoriteAdded,
  onFavoriteRemoved,
}) {
  const navigate = useNavigate();

  const basePath = slug ? `/objects/${id}/${slug}` : `/objects/${id}`;
  const detailLink = searchParamsString ? `${basePath}?${searchParamsString}` : basePath;

  function handleProfileClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (userName) {
      navigate(`/profile/${userName.toLowerCase()}`);
    }
  }

  return (
    <Link to={detailLink} className="block w-full">
      <div className="group flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-app-border bg-app-bg-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={title}
            src={image}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <FavoriteButton
            objectId={id}
            ownerId={ownerId}
            initialIsFavorite={initialIsFavorite}
            onAdded={onFavoriteAdded}
            onRemoved={onFavoriteRemoved}
            className="absolute right-4 top-4"
          />
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

          <h3 className="min-h-[56px] mb-2 text-lg font-bold text-app-text line-clamp-2 transition-colors group-hover:text-[#4fdbc8]">
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

            <div className="flex shrink-0 items-center gap-0.5 text-sm font-bold text-[#facc15]">
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
  );
}

export default ProductCard;
