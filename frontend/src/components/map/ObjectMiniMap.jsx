import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
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
 * Component intern: ajusta automàticament el zoom per encabir tots els punts
 * (objecte + opcionalment centre de cerca + cercle del radi).
 */
function FitToBounds({ ubicacio, searchCenter, searchRadiusKm }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !ubicacio) return;

    if (searchCenter && searchRadiusKm) {
      // Bounds = objecte + caixa que envolta el cercle de cerca
      const radDeg = searchRadiusKm / 111; // 1° latitud ≈ 111 km
      const bounds = L.latLngBounds([
        [ubicacio.lat, ubicacio.lng],
        [searchCenter.lat - radDeg, searchCenter.lng - radDeg],
        [searchCenter.lat + radDeg, searchCenter.lng + radDeg],
      ]);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } else {
      // Sense context: centra a l'objecte amb un zoom raonable
      map.setView([ubicacio.lat, ubicacio.lng], 14);
    }

    // Després d'un canvi de filtre, Leaflet pot quedar amb mida de container
    // antiga si la pàgina ha canviat. Forcem un invalidate.
    setTimeout(() => map.invalidateSize(), 100);
  }, [
    map,
    ubicacio?.lat,
    ubicacio?.lng,
    searchCenter?.lat,
    searchCenter?.lng,
    searchRadiusKm,
  ]);

  return null;
}

function ObjectMiniMap({ ubicacio, nom, searchCenter, searchRadiusKm }) {
  if (!ubicacio?.lat || !ubicacio?.lng) return null;

  const showSearchContext = !!(searchCenter && searchRadiusKm);

  return (
    <div className="h-[220px] w-full rounded-2xl overflow-hidden border border-app-border">
      <MapContainer
        center={[ubicacio.lat, ubicacio.lng]}
        zoom={14}
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

        <FitToBounds
          ubicacio={ubicacio}
          searchCenter={searchCenter}
          searchRadiusKm={searchRadiusKm}
        />
      </MapContainer>
    </div>
  );
}

export default ObjectMiniMap;
