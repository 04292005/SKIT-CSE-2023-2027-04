import type { GeocodedAddress } from "@/features/location/types";

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodedAddress> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Reverse geocoding failed.");
  }

  const data = await response.json();
  const addressParts = data.address ?? {};

  const address = [
    addressParts.road,
    addressParts.neighbourhood,
    addressParts.suburb,
    addressParts.city || addressParts.town || addressParts.village,
    addressParts.state,
    addressParts.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    address: address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
    city: addressParts.city || addressParts.town || addressParts.village || "",
    state: addressParts.state || addressParts.region || "",
    country: addressParts.country || "",
  };
}
