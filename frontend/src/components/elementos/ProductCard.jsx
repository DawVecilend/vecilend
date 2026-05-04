import { Link, useNavigate } from "react-router-dom";

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
}) {
  const navigate = useNavigate();
  const availabilityLabel = getAvailabilityLabel(status);
  const availabilityClasses = getAvailabilityClasses(status);

  const detailLink = searchParamsString
    ? `/objects/${id}?${searchParamsString}`
    : `/objects/${id}`;

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${userName.toLowerCase()}`);
  };

  return (
    <Link to={detailLink} className="w-63.75">
      <div className="group flex h-full w-[255px] flex-col overflow-hidden rounded-[12px] border border-app-border bg-app-bg-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={title}
            src={image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-app-bg/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4ab] transition-colors"
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>

          <div
            className={`absolute bottom-4 left-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center ${availabilityClasses.container}`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${availabilityClasses.dot}`}
            ></span>
            {availabilityLabel}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div
            role="link"
            tabIndex={0}
            onClick={handleProfileClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleProfileClick(e);
              }
            }}
            className="mb-4 inline-flex items-center gap-2 self-start cursor-pointer"
          >
            <img
              alt={userName}
              src={userAvatar}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#0e1513]/60"
            />
            <p className="text-app-text-secondary text-sm hover:text-[#4fdbc8] transition-colors">
              {userName}
            </p>
          </div>

          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="min-h-[56px] text-lg font-bold text-app-text group-hover:text-[#4fdbc8] transition-colors line-clamp-2">
              {title}
            </h3>

            <div className="flex shrink-0 items-center text-[#f38764] text-sm font-bold">
              <span
                className="material-symbols-outlined text-xs mr-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {rating}
            </div>
          </div>

          <p className="min-h-[42px] text-app-text-secondary text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-app-border">
            <div>
              {priceDay > 0 ? (
                <>
                  <span className="text-xl font-black text-app-text">
                    {priceDay}€
                  </span>
                  <span className="text-app-text-secondary text-sm">
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
