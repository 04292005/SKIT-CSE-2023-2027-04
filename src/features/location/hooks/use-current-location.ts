"use client";

import { useEffect, useState } from "react";

import type { CurrentLocation } from "@/features/location/types";

export function useCurrentLocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
        setAccuracy(accuracy);
        setError(null);
        setLoading(false);
      },
      (positionError) => {
        setError(positionError.message || "Unable to detect location.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return {
    latitude,
    longitude,
    accuracy,
    loading,
    error,
  };
}
