export interface GeolocationCoordinates {
  lat: number;
  lng: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Get user's current location using browser Geolocation API
 */
export const getUserLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Unable to retrieve your location';
        if (error.code === 1) {
          message = 'Permission denied. Please enable location access.';
        } else if (error.code === 2) {
          message = 'Position unavailable. Please try again.';
        } else if (error.code === 3) {
          message = 'Location request timed out.';
        }
        reject({ code: error.code, message });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula (in km)
 */
export const calculateDistance = (
  from: GeolocationCoordinates,
  to: GeolocationCoordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Estimate travel time based on distance (average ambulance speed: 40 km/h in traffic)
 */
export const estimateTravelTime = (distanceKm: number): number => {
  // Average ambulance speed: 40 km/h (accounting for traffic)
  const baseSpeed = 40;
  // Add response time (2-3 minutes) + preparation
  const responseTime = 3;
  return Math.ceil((distanceKm / baseSpeed) * 60 + responseTime);
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Format travel time for display
 */
export const formatTravelTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Now';
  }
  if (minutes < 60) {
    return `${Math.ceil(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
