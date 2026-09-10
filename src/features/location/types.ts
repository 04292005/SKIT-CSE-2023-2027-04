export interface CurrentLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface GeocodedAddress {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface LocationResult extends CurrentLocation, GeocodedAddress {}
