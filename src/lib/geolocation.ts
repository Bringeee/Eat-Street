// Restaurant coordinates — B-4 BSF Colony Airport Road, Gwalior, MP-474020
export const RESTAURANT_COORDS = {
  lat: 26.233,
  lng: 78.1685,
} as const;

// Maximum distance (km) for allowing Razorpay payment
export const MAX_DISTANCE_KM = 5;

/**
 * Haversine formula — returns distance in km between two lat/lng points.
 */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export interface ProximityResult {
  withinRange: boolean;
  distanceKm: number;
  userLat: number;
  userLng: number;
}

/**
 * One-shot position check wrapped in a Promise.
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 60_000,
    });
  });
}

/**
 * Check whether the user is within MAX_DISTANCE_KM of the restaurant.
 */
export async function checkProximity(): Promise<ProximityResult> {
  const pos = await getCurrentPosition();
  const { latitude, longitude } = pos.coords;

  const distanceKm = getDistanceKm(
    latitude,
    longitude,
    RESTAURANT_COORDS.lat,
    RESTAURANT_COORDS.lng,
  );

  return {
    withinRange: distanceKm <= MAX_DISTANCE_KM,
    distanceKm: Math.round(distanceKm * 100) / 100,
    userLat: latitude,
    userLng: longitude,
  };
}
