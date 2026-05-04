import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import RadiusSlider from "./RadiusSlider";
import { useGeolocation } from "../../hooks/useGeolocation";
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

function ClickHandler({ onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 0.6 });
    }
  }, [position, map]);
  return null;
}

/**
 * Selector visual de lloc + radi.
 *
 * Distinció important:
 *   - 'value' (prop controlada): el lloc seleccionat explícitament per l'usuari
 *     (click, drag, o "Usar mi ubicación"). Pot ser null si l'usuari no ha
 *     interactuat — en aquest cas, el component consumidor pot decidir no
 *     aplicar cap filtre d'ubicació.
 *   - 'mapCenter' (state intern): on es centra visualment el mapa per defecte
 *     (geolocalització del navegador o fallback). Sempre té valor perquè el
 *     mapa s'ha de mostrar en algun lloc, però NO surt del component.
 */
function LocationPicker({ value, onChange, radiusKm, onRadiusChange }) {
  const { coords, status, requestLocation } = useGeolocation();
  const [mapCenter, setMapCenter] = useState(null);
  const [geoFailed, setGeoFailed] = useState(false);

  // Primera vegada que arriben coords del navegador (o el fallback),
  // les usem per centrar el mapa — però no per fer setState a `value`.
  useEffect(() => {
    if (coords && !mapCenter) {
      setMapCenter(coords);
    }
  }, [coords, mapCenter]);

  // Mentre no tinguem ni mapCenter ni value, mostrem un placeholder.
  if (!mapCenter && !value) {
    return (
      <div className="h-[260px] md:h-[320px] w-full rounded-2xl bg-app-card border border-app-border flex items-center justify-center">
        <span className="text-label text-app-text-secondary font-body">
          Obteniendo ubicación…
        </span>
      </div>
    );
  }

  const center = value || mapCenter;

  const handleUseMyLocation = async () => {
    setGeoFailed(false);
    try {
      const fresh = await requestLocation();
      onChange(fresh);
    } catch {
      setGeoFailed(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[260px] md:h-[320px] w-full rounded-2xl overflow-hidden border border-app-border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Cercle + marker NOMÉS si l'usuari ha seleccionat un valor */}
          {value && (
            <>
              <Circle
                center={[value.lat, value.lng]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: "#14B8A6",
                  fillColor: "#14B8A6",
                  fillOpacity: 0.12,
                  weight: 2,
                }}
              />
              <Marker
                position={[value.lat, value.lng]}
                icon={pickerIcon}
                draggable
                eventHandlers={{
                  dragend(e) {
                    const ll = e.target.getLatLng();
                    onChange({ lat: ll.lat, lng: ll.lng });
                  },
                }}
              />
            </>
          )}

          <ClickHandler onChange={onChange} />
          <FlyTo position={value} />
        </MapContainer>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={status === "requesting"}
          className="self-start inline-flex items-center gap-2 rounded-full bg-vecilend-dark-neutral border border-app-border px-4 py-2 text-label text-app-text font-body hover:border-vecilend-dark-primary disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">
            my_location
          </span>
          {status === "requesting" ? "Obteniendo…" : "Usar mi ubicación"}
        </button>
        {geoFailed && (
          <p className="text-caption text-amber-400 font-body ml-1">
            No hemos podido obtener tu ubicación. Puedes seleccionarla pulsando
            en el mapa.
          </p>
        )}
      </div>

      <p className="text-caption text-app-text-secondary font-body">
        Pulsa en el mapa o arrastra el marcador para seleccionar la ubicación.
      </p>

      <RadiusSlider
        value={radiusKm}
        onChange={onRadiusChange}
        disabled={!value}
      />
    </div>
  );
}

export default LocationPicker;
