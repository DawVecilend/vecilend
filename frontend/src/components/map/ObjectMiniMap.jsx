import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "../../utils/leafletIconFix";

const objectPin = L.divIcon({
  className: "vecilend-object-pin",
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
    background: #ef4444; transform: rotate(-45deg);
    border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.4);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const searchCenterIcon = L.divIcon({
  className: "vecilend-search-center",
  html: `<div style="
    width: 18px; height: 18px; border-radius: 50%;
    background: #14B8A6; border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.4);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/**
 * Mini-mapa al detall.
 *
 * @param {Object} ubicacio          {lat, lng} de l'objecte (obligatori)
 * @param {string} nom
 * @param {?Object} searchCenter     {lat, lng} (opcional)
 * @param {?number} searchRadiusKm   (opcional)
 */
function ObjectMiniMap({ ubicacio, nom, searchCenter, searchRadiusKm }) {
  if (!ubicacio?.lat || !ubicacio?.lng) return null;

  const showSearchContext = !!(searchCenter && searchRadiusKm);

  // Centre = punt mig si hi ha context, altrament l'objecte
  const center = showSearchContext
    ? {
        lat: (ubicacio.lat + searchCenter.lat) / 2,
        lng: (ubicacio.lng + searchCenter.lng) / 2,
      }
    : ubicacio;

  return (
    <div className="h-[220px] w-full rounded-2xl overflow-hidden border border-vecilend-dark-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={showSearchContext ? 12 : 14}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showSearchContext && (
          <>
            <Circle
              center={[searchCenter.lat, searchCenter.lng]}
              radius={searchRadiusKm * 1000}
              pathOptions={{
                color: "#14B8A6",
                fillColor: "#14B8A6",
                fillOpacity: 0.1,
                weight: 2,
                dashArray: "4 6",
              }}
            />
            <Marker
              position={[searchCenter.lat, searchCenter.lng]}
              icon={searchCenterIcon}
              title="Tu zona de búsqueda"
            />
          </>
        )}

        <Marker
          position={[ubicacio.lat, ubicacio.lng]}
          icon={objectPin}
          title={nom}
        />
      </MapContainer>
    </div>
  );
}

export default ObjectMiniMap;
