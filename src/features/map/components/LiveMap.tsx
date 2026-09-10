import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Report } from "@/features/report/types";
import { ReportMarker } from "./ReportMarker";

interface LiveMapProps {
  reports: Report[];
  userLocation: [number, number] | null;
}

// User location icon (pulsing blue dot)
const createUserIcon = () => {
  return L.divIcon({
    className: "user-location-icon",
    html: `
      <div className="flex items-center justify-center relative">
        <div className="absolute w-6 h-6 rounded-full bg-blue-500 opacity-40 animate-ping"></div>
        <div className="relative w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Sub-component to manage map camera views, centering, and auto-fit bounds
function MapController({ reports, userLocation }: LiveMapProps) {
  const map = useMap();

  useEffect(() => {
    const coords: [number, number][] = [];

    // Include user location in fitting bounds if available
    if (userLocation) {
      coords.push(userLocation);
    }

    // Include all active report coordinates
    reports.forEach((r) => {
      if (r.location?.latitude && r.location?.longitude) {
        coords.push([r.location.latitude, r.location.longitude]);
      }
    });

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (userLocation) {
      // Centered on user location if there are no reports
      map.setView(userLocation, 14);
    }
  }, [reports, userLocation, map]);

  return null;
}

export function LiveMap({ reports, userLocation }: LiveMapProps) {
  // Default center: if no location is available, start with a fallback center (e.g. San Francisco or center of USA)
  const fallbackCenter: [number, number] = [37.7749, -122.4194];
  const defaultZoom = 13;

  const center = userLocation || fallbackCenter;

  return (
    <div className="relative z-10 h-[400px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-xl ring-1 ring-slate-950/5 sm:h-[550px]">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's current location pin */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserIcon()}>
            <Popup>
              <div className="p-1 text-xs font-semibold text-center text-slate-800">
                Your current location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic community report pins */}
        {reports.map((report) => (
          <ReportMarker key={report.id} report={report} />
        ))}

        {/* Custom controller to handle automatic boundary zooms and centering updates */}
        <MapController reports={reports} userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}
