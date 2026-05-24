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
 * Selector d'ubicació SENSE radi — pensat per pujar/editar objectes.
 *
 * Comportament:
 *   - Si `value` ja porta coordenades (cas d'edició d'un objecte
 *     existent), centrem el mapa i marquem el pin allà.
 *   - Si `value` és null (cas de creació), el mapa es centra a
 *     la ubicació de l'usuari (de useGeolocation: navigator → user.ubicacio
 *     → DEFAULT_FALLBACK_LOCATION) i NO posa pin fins que l'usuari toca.
 *   - "Usar mi ubicación actual" demana al navegador i si funciona, selecciona
 *     aquesta ubicació com a valor. Si l'usuari denega, no fa res.
 */
function ObjectLocationPicker({ value, onChange }) {
  const { user } = useAuth();
  const { status, requestLocation } = useGeolocation({ autoRequest: false });
  const [mapCenter, setMapCenter] = useState(null);
  const [geoFailed, setGeoFailed] = useState(false);

  // Centrem el mapa amb la prioritat correcta per a creació d'objectes:
  //   1. value (si venim d'edició o l'usuari ja ha triat)
  //   2. user.ubicacio (ubicació guardada al perfil — el cas habitual a creació)
  //   3. DEFAULT_FALLBACK_LOCATION
  // NO demanem geolocalització automàticament: això sobreescrivia la ubicació
  // del perfil amb la geolocalització del navegador/IP, que sovint no és on
  // viu realment l'usuari.
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
      <div className="h-[260px] md:h-[320px] w-full rounded-[16px] bg-app-bg-card border border-app-border flex items-center justify-center">
        <span className="text-sm text-app-text-secondary font-body">
          Obteniendo ubicación…
        </span>
      </div>
    );
  }

  const center = value || mapCenter;

  const handleUseMyLocation = async () => {
    setGeoFailed(false);
    try {
      const result = await requestLocation();
      if (result && result.lat != null) {
        onChange(result);
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
                  onChange({ lat: ll.lat, lng: ll.lng });
                },
              }}
            />
          )}

          <ClickHandler onChange={onChange} />
          <FlyTo position={value} />
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={status === "requesting"}
          className="inline-flex items-center gap-2 rounded-[14px] bg-app-bg-card border border-app-border px-4 py-2 font-body text-[14px] text-app-text hover:border-vecilend-dark-primary disabled:opacity-50 transition"
        >
          <span className="material-symbols-outlined text-base">
            my_location
          </span>
          {status === "requesting" ? "Obteniendo…" : "Usar mi ubicación actual"}
        </button>

        {value ? (
          <span className="text-xs text-vecilend-dark-primary font-body">
            ✓ Ubicación seleccionada
          </span>
        ) : (
          <span className="text-xs text-app-text-secondary font-body">
            Pulsa en el mapa o arrastra el marcador
          </span>
        )}
      </div>

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
