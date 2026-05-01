import { Link, useNavigate } from "react-router-dom";

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
}) {
  const navigate = useNavigate();

  const availabilityLabel = getAvailabilityLabel(status);
  const availabilityClasses = getAvailabilityClasses(status);

  function handleEditClick(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/objects/${id}/edit`);
  }

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Link to={`/objects/${id}`} className="w-63.75">
      <div className="group flex h-full w-[255px] flex-col overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card transition-all duration-300 hover:border-vecilend-dark-primary hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)]">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={image}
          />

          {isOwnProfile ? (
            <button
              type="button"
              onClick={handleEditClick}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0e1513]/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#4fdbc8] transition-colors"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0e1513]/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4ab] transition-colors"
            >
              <span className="material-symbols-outlined">favorite</span>
            </button>
          )}

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
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="min-h-[56px] text-lg font-bold text-[#dde4e1] group-hover:text-[#4fdbc8] transition-colors line-clamp-2">
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

          <p className="min-h-[42px] text-[#bbcac6] text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#3c4947]">
            <div>
              {priceDay > 0 ? (
                <>
                  <span className="text-xl font-black text-[#dde4e1]">
                    {priceDay}€
                  </span>

                  <span className="text-[#bbcac6] text-sm"> / día</span>
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
  );
}

export default ProfileProductCard;