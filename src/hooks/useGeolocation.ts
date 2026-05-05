import { useEffect, useRef, useState } from "react";
import {
  getDistanceKm,
  RESTAURANT_COORDS,
  MAX_DISTANCE_KM,
} from "@/lib/geolocation";

export interface GeoStatus {
  /** "idle" = haven't asked yet, "loading" = waiting for permission/GPS, "granted" = watching, "denied" = user refused, "unavailable" = browser doesn't support */
  state: "idle" | "loading" | "granted" | "denied" | "unavailable";
  distanceKm: number | null;
  withinRange: boolean;
  error: string | null;
}

/**
 * Continuously watches the user's position and computes distance
 * from the restaurant. Provides real-time distance info.
 */
export function useGeolocation(): GeoStatus {
  const [status, setStatus] = useState<GeoStatus>({
    state: "idle",
    distanceKm: null,
    withinRange: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus({
        state: "unavailable",
        distanceKm: null,
        withinRange: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setStatus((prev) => ({ ...prev, state: "loading" }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = getDistanceKm(
          latitude,
          longitude,
          RESTAURANT_COORDS.lat,
          RESTAURANT_COORDS.lng,
        );
        const rounded = Math.round(dist * 100) / 100;

        setStatus({
          state: "granted",
          distanceKm: rounded,
          withinRange: rounded <= MAX_DISTANCE_KM,
          error: null,
        });
      },
      (err) => {
        let errorMsg: string;
        let state: GeoStatus["state"] = "denied";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable it in your browser settings.";
            state = "denied";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location unavailable. Please check your device's GPS.";
            state = "unavailable";
            break;
          case err.TIMEOUT:
            errorMsg = "Location request timed out. Please try again.";
            state = "unavailable";
            break;
          default:
            errorMsg = "An unknown error occurred while fetching your location.";
            state = "unavailable";
        }

        setStatus({
          state,
          distanceKm: null,
          withinRange: false,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 30_000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return status;
}
