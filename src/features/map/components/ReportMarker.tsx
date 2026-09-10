import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Report } from "@/features/report/types";
import { MarkerPopup } from "./MarkerPopup";

interface ReportMarkerProps {
  report: Report;
}

// Marker color maps based on category
const categoryColors: Record<string, string> = {
  Roads: "#4f46e5", // Indigo
  Garbage: "#f97316", // Orange
  "Street Lights": "#eab308", // Yellow
  Water: "#06b6d4", // Cyan
  Traffic: "#3b82f6", // Blue
  Safety: "#ef4444", // Red
  Other: "#64748b", // Slate
};

const createMarkerIcon = (category: string) => {
  const color = categoryColors[category] || categoryColors["Other"];

  // Custom divIcon rendering an SVG teardrop pin (mirroring Leaflet's standard icon shape and anchor)
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <svg className="w-8 h-8 drop-shadow-md" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export function ReportMarker({ report }: ReportMarkerProps) {
  const lat = report.location?.latitude;
  const lng = report.location?.longitude;

  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const icon = createMarkerIcon(report.category);

  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <MarkerPopup report={report} />
      </Popup>
    </Marker>
  );
}
