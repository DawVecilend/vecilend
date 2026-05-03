import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import LocationPicker from "../map/LocationPicker";
import DateRangeCalendar from "../calendar/DateRangeCalendar";
import PriceFilter from "../filters/PriceFilter";
import RatingFilter from "../filters/RatingFilter";

/**
 * Modal de filtres avançats (ubicació, dates, preu, valoració).
 *
 * Aquest modal només estableix els filtres i NO redirigeix a
 * /objects: simplement actualitza l'URL si ja hi som, o tanca i guarda l'estat
 * perquè la pròxima cerca des de la SearchBar inclogui els filtres.
 */
function SearchModal({ open, onClose, initialFilters = {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [locationCoords, setLocationCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [price, setPrice] = useState({ minPrice: 1, maxPrice: 100 });
  const [rating, setRating] = useState({ minRating: 0 });

  useEffect(() => {
    if (!open) return;
    setLocationCoords(
      initialFilters.lat && initialFilters.lng
        ? { lat: Number(initialFilters.lat), lng: Number(initialFilters.lng) }
        : null,
    );
    setRadiusKm(
      initialFilters.radius
        ? Math.round(Number(initialFilters.radius) / 1000)
        : 10,
    );
    setPrice({
      minPrice: initialFilters.min_price ? Number(initialFilters.min_price) : 0,
      maxPrice: initialFilters.max_price
        ? Number(initialFilters.max_price)
        : 100,
    });
    setRating({
      minRating: initialFilters.min_user_rating
        ? Number(initialFilters.min_user_rating)
        : 0,
    });
    // dateRange el gestiona DateRangeCalendar via initialRange
  }, [open, initialFilters]);

  /**
   * Guarda els filtres a l'URL. Comportament:
   *   - Si estem a /objects: actualitza l'URL (els resultats es refresquen).
   *   - Si NO estem a /objects: només tanca el modal. Els filtres es
   *     "recordaran" la pròxima vegada que l'usuari obri el modal des de
   *     la SearchBar (perquè els llegim de l'URL), però per provocar la
   *     navegació cal que premi Enter / clic a la lupa.
   *
   * En realitat, com que els filtres viuen a l'URL, fora de /objects
   * no tenim on guardar-los sense navegar. Resolem això guardant l'estat
   * a sessionStorage temporalment.
   */
  const handleApply = () => {
    const params = new URLSearchParams(
      location.pathname === "/objects" ? searchParams : new URLSearchParams(),
    );

    // Aplica/elimina cada filtre
    if (locationCoords) {
      params.set("lat", locationCoords.lat.toFixed(6));
      params.set("lng", locationCoords.lng.toFixed(6));
      params.set("radius", String(radiusKm * 1000));
    } else {
      params.delete("lat");
      params.delete("lng");
      params.delete("radius");
    }

    if (dateRange.start && dateRange.end) {
      params.set("data_inici", dateRange.start.format("YYYY-MM-DD"));
      params.set("data_fi", dateRange.end.format("YYYY-MM-DD"));
    } else {
      params.delete("data_inici");
      params.delete("data_fi");
    }

    if (price.minPrice > 0) params.set("min_price", String(price.minPrice));
    else params.delete("min_price");

    if (price.maxPrice < 100) params.set("max_price", String(price.maxPrice));
    else params.delete("max_price");

    if (rating.minRating > 0)
      params.set("min_user_rating", String(rating.minRating));
    else params.delete("min_user_rating");

    if (location.pathname === "/objects") {
      // A /objects: actualitzem l'URL i refresquem els resultats
      navigate(`/objects?${params.toString()}`, { replace: true });
    } else {
      // Fora de /objects: guardem els filtres a sessionStorage perquè
      // la SearchBar els reculli quan l'usuari executi la cerca amb Enter/lupa.
      const filtersToPersist = {};
      for (const [k, v] of params.entries()) {
        if (k !== "search") filtersToPersist[k] = v;
      }
      sessionStorage.setItem(
        "vecilend_pending_filters",
        JSON.stringify(filtersToPersist),
      );
    }

    onClose();
  };

  const handleClear = () => {
    setLocationCoords(null);
    setRadiusKm(10);
    setDateRange({ start: null, end: null });
    setPrice({ minPrice: 0, maxPrice: 100 });
    setRating({ minRating: 0 });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "#0A0A0B",
          color: "#F2F4F8",
          borderRadius: isMobile ? 0 : 4,
          border: "1px solid #2A2B31",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Montserrat",
          fontWeight: 700,
          color: "#F2F4F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2A2B31",
        }}
      >
        Filtros de búsqueda
        <IconButton
          onClick={onClose}
          sx={{ color: "#B6BCC8" }}
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Lloc */}
        <div className="mb-6">
          <label className="block text-label text-app-text-secondary font-body mb-2">
            ¿Dónde?
          </label>
          <LocationPicker
            value={locationCoords}
            onChange={setLocationCoords}
            radiusKm={radiusKm}
            onRadiusChange={setRadiusKm}
          />
        </div>

        {/* Dates */}
        <div className="mb-6">
          <label className="block text-label text-app-text-secondary font-body mb-2">
            ¿Cuándo?
          </label>
          <DateRangeCalendar
            initialRange={
              initialFilters.data_inici && initialFilters.data_fi
                ? {
                    start: initialFilters.data_inici,
                    end: initialFilters.data_fi,
                  }
                : undefined
            }
            onRangeChange={setDateRange}
          />
        </div>

        {/* Preu */}
        <div className="mb-6">
          <label className="block text-label text-app-text-secondary font-body mb-2">
            Precio
          </label>
          <div className="rounded-2xl bg-app-bg-card border border-app-border">
            <PriceFilter value={price} onChange={setPrice} />
          </div>
        </div>

        {/* Valoració */}
        <div className="mb-2">
          <label className="block text-label text-app-text-secondary font-body mb-2">
            Valoración
          </label>
          <div className="rounded-2xl bg-app-bg-card border border-app-border">
            <RatingFilter value={rating} onChange={setRating} />
          </div>
        </div>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid #2A2B31",
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-label text-app-text-secondary font-body underline"
        >
          Limpiar todo
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleApply}
          className="rounded-full bg-gradient-to-br from-vecilend-dark-primary to-[#4fdbc8] px-6 py-3 text-body-base font-bold text-[#003730]"
        >
          Guardar filtros
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default SearchModal;
