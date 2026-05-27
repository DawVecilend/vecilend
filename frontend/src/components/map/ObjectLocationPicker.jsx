import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../contexts/AuthContext";
import {
  useGeolocation,
  DEFAULT_FALLBACK_LOCATION,
} from "../../hooks/useGeolocation";
import { isInSpain, SPAIN_MAX_BOUNDS } from "../../utils/spainBounds";
import "../../utils/leafletIconFix";

const pickerIcon = L.divIcon({
  className: "vecilend-picker-pin",
  html: `
    <div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: #14B8A6; transform: rotate(-45deg);
      border: 3px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,.4);
      cursor: grab;
    "></div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClickHandler({ onPick, onOutOfBounds }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!isInSpain(lat, lng)) {
        onOutOfBounds();
        return;
      }
      onPick({ lat, lng });
      map.setView([lat, lng], map.getZoom(), { animate: true });
    },
  });
  return null;
}

function ObjectLocationPicker({ value, onChange }) {
  const { user } = useAuth();
  const { status, requestLocation } = useGeolocation({ autoRequest: false });
  const [mapCenter, setMapCenter] = useState(null);
  const [geoFailed, setGeoFailed] = useState(false);
  const [outOfBounds, setOutOfBounds] = useState(false);

  useEffect(() => {
    if (mapCenter) return;
    if (value) {
      setMapCenter(value);
    } else if (user?.ubicacio) {
      setMapCenter(user.ubicacio);
    } else {
      setMapCenter(DEFAULT_FALLBACK_LOCATION);
    }
  }, [value, user, mapCenter]);

  if (!mapCenter) {
    return (
      <div className="h-[260px] md:h-[320px] w-full rounded-2xl bg-app-bg-card border border-app-border flex items-center justify-center">
        <span className="text-label text-app-text-secondary font-body">
          Cargando mapa…
        </span>
      </div>
    );
  }

  const center = value || mapCenter;

  const handleValidPick = (coords) => {
    setOutOfBounds(false);
    onChange(coords);
  };

  const handleUseMyLocation = async () => {
    setGeoFailed(false);
    try {
      const result = await requestLocation();
      if (result && result.lat != null) {
        if (!isInSpain(result.lat, result.lng)) {
          setOutOfBounds(true);
          return;
        }
        handleValidPick(result);
      }
    } catch {
      setGeoFailed(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[260px] md:h-[320px] w-full rounded-[16px] overflow-hidden border border-app-border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          scrollWheelZoom
          maxBounds={SPAIN_MAX_BOUNDS}
          maxBoundsViscosity={0.8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {value && (
            <Marker
              position={[value.lat, value.lng]}
              icon={pickerIcon}
              draggable
              eventHandlers={{
                dragend(e) {
                  const ll = e.target.getLatLng();
                  if (!isInSpain(ll.lat, ll.lng)) {
                    setOutOfBounds(true);
                    e.target.setLatLng([value.lat, value.lng]);
                    return;
                  }
                  handleValidPick({ lat: ll.lat, lng: ll.lng });
                },
              }}
            />
          )}

          <ClickHandler
            onPick={handleValidPick}
            onOutOfBounds={() => setOutOfBounds(true)}
          />
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={status === "requesting"}
          className="inline-flex items-center gap-2 rounded-[14px] bg-app-bg-card border border-app-border px-4 py-2 font-body text-[14px] text-app-text hover:border-app-primary disabled:opacity-50 transition"
        >
          <span className="material-symbols-outlined text-base">
            my_location
          </span>
          {status === "requesting" ? "Obteniendo…" : "Usar mi ubicación actual"}
        </button>

        {value ? (
          <span className="text-xs text-app-primary font-body">
            ✓ Ubicación seleccionada
          </span>
        ) : (
          <span className="text-xs text-app-text-secondary font-body">
            Pulsa en el mapa o arrastra el marcador
          </span>
        )}
      </div>

      {outOfBounds && (
        <p className="text-xs text-amber-400 font-body">
          {value
            ? "Ese punto no es válido porque no está lo suficientemente cerca de España. Tu ubicación actual sigue seleccionada."
            : "La ubicación debe estar en España o zonas cercanas. Selecciona un punto próximo al territorio español."}
        </p>
      )}

      {geoFailed && (
        <p className="text-xs text-amber-400 font-body">
          No hemos podido obtener tu ubicación. Selecciónala pulsando en el
          mapa.
        </p>
      )}
    </div>
  );
}

export default ObjectLocationPicker;
