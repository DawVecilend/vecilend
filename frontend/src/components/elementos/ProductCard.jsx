import { Link } from "react-router-dom";

function getAvailabilityLabel(status) {
  if (status === "disponible") return "Disponible";
  if (status === "no_disponible") return "No disponible";
  if (status === "reserved") return "Reservado";
  return "Disponible";
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
  const availabilityLabel = getAvailabilityLabel(status);

  // Conserva els filtres de cerca al navegar al detall
  const detailLink = searchParamsString
    ? `/objects/${id}?${searchParamsString}`
    : `/objects/${id}`;

  return (
    <Link to={detailLink} className="w-63.75">
      <div className="group bg-[#161d1b] rounded-2xl overflow-hidden border border-transparent hover:border-[#4fdbc8]/30 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(79,219,200,0.15)] flex flex-col">
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={image}
          />
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0e1513]/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4ab] transition-colors"
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <div className="absolute bottom-4 left-4 bg-[#0e1513]/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#4fdbc8] flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#4fdbc8] mr-2"></span>
            {availabilityLabel}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div
            className="relative px-4 -mt-5 mb-4 inline-flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/profile/${userName}`;
            }}
          >
            <img
              alt={userName}
              src={userAvatar}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#0e1513]/60"
            />
            <p className="text-[#bbcac6] text-sm">{userName}</p>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-[#dde4e1] group-hover:text-[#4fdbc8] transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center text-[#f38764] text-sm font-bold">
              <span
                className="material-symbols-outlined text-xs mr-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {rating}
            </div>
          </div>
          <p className="text-[#bbcac6] text-sm mb-4 line-clamp-2">
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
            <span className="bg-[#14b8a6] text-[#00423b] px-5 py-2.5 rounded-xl font-bold text-sm">
              Ver detalle
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
