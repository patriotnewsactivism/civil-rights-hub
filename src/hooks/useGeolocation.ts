import { useState, useEffect } from 'react';

interface GeolocationState {
  state: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

const STATE_COORDS: Record<string, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
  'Alabama': { minLat: 30.2, maxLat: 35.0, minLon: -88.5, maxLon: -84.9 },
  'Alaska': { minLat: 51.2, maxLat: 71.5, minLon: -179.1, maxLon: -129.9 },
  'Arizona': { minLat: 31.3, maxLat: 37.0, minLon: -114.8, maxLon: -109.0 },
  'Arkansas': { minLat: 33.0, maxLat: 36.5, minLon: -94.6, maxLon: -89.6 },
  'California': { minLat: 32.5, maxLat: 42.0, minLon: -124.4, maxLon: -114.1 },
  'Colorado': { minLat: 37.0, maxLat: 41.0, minLon: -109.0, maxLon: -102.0 },
  'Connecticut': { minLat: 41.0, maxLat: 42.0, minLon: -73.7, maxLon: -71.8 },
  'Delaware': { minLat: 38.5, maxLat: 39.8, minLon: -75.8, maxLon: -75.0 },
  'Florida': { minLat: 24.5, maxLat: 31.0, minLon: -87.6, maxLon: -80.0 },
  'Georgia': { minLat: 30.4, maxLat: 35.0, minLon: -85.6, maxLon: -80.8 },
  'Hawaii': { minLat: 18.9, maxLat: 28.5, minLon: -178.3, maxLon: -154.8 },
  'Idaho': { minLat: 42.0, maxLat: 49.0, minLon: -117.2, maxLon: -111.0 },
  'Illinois': { minLat: 37.0, maxLat: 42.5, minLon: -91.5, maxLon: -87.5 },
  'Indiana': { minLat: 37.8, maxLat: 41.8, minLon: -88.1, maxLon: -84.8 },
  'Iowa': { minLat: 40.4, maxLat: 43.5, minLon: -96.6, maxLon: -90.1 },
  'Kansas': { minLat: 37.0, maxLat: 40.0, minLon: -102.0, maxLon: -94.6 },
  'Kentucky': { minLat: 36.5, maxLat: 39.1, minLon: -89.6, maxLon: -81.9 },
  'Louisiana': { minLat: 29.0, maxLat: 33.0, minLon: -94.0, maxLon: -88.8 },
  'Maine': { minLat: 43.0, maxLat: 47.5, minLon: -71.1, maxLon: -66.9 },
  'Maryland': { minLat: 37.9, maxLat: 39.7, minLon: -79.5, maxLon: -75.0 },
  'Massachusetts': { minLat: 41.2, maxLat: 42.9, minLon: -73.5, maxLon: -69.9 },
  'Michigan': { minLat: 41.7, maxLat: 48.3, minLon: -90.4, maxLon: -82.4 },
  'Minnesota': { minLat: 43.5, maxLat: 49.4, minLon: -97.2, maxLon: -89.5 },
  'Mississippi': { minLat: 30.2, maxLat: 35.0, minLon: -91.7, maxLon: -88.1 },
  'Missouri': { minLat: 36.0, maxLat: 40.6, minLon: -95.8, maxLon: -89.1 },
  'Montana': { minLat: 45.0, maxLat: 49.0, minLon: -116.0, maxLon: -104.0 },
  'Nebraska': { minLat: 40.0, maxLat: 43.0, minLon: -104.0, maxLon: -95.3 },
  'Nevada': { minLat: 35.0, maxLat: 42.0, minLon: -120.0, maxLon: -114.0 },
  'New Hampshire': { minLat: 42.7, maxLat: 45.3, minLon: -72.6, maxLon: -70.6 },
  'New Jersey': { minLat: 38.9, maxLat: 41.4, minLon: -75.6, maxLon: -73.9 },
  'New Mexico': { minLat: 31.3, maxLat: 37.0, minLon: -109.0, maxLon: -103.0 },
  'New York': { minLat: 40.5, maxLat: 45.0, minLon: -79.8, maxLon: -71.9 },
  'North Carolina': { minLat: 33.8, maxLat: 36.6, minLon: -84.3, maxLon: -75.5 },
  'North Dakota': { minLat: 45.9, maxLat: 49.0, minLon: -104.0, maxLon: -96.6 },
  'Ohio': { minLat: 38.4, maxLat: 42.3, minLon: -84.8, maxLon: -80.5 },
  'Oklahoma': { minLat: 33.6, maxLat: 37.0, minLon: -103.0, maxLon: -94.4 },
  'Oregon': { minLat: 42.0, maxLat: 46.3, minLon: -124.6, maxLon: -116.5 },
  'Pennsylvania': { minLat: 39.7, maxLat: 42.3, minLon: -80.5, maxLon: -74.7 },
  'Rhode Island': { minLat: 41.1, maxLat: 42.0, minLon: -71.9, maxLon: -71.1 },
  'South Carolina': { minLat: 32.0, maxLat: 35.2, minLon: -83.4, maxLon: -78.5 },
  'South Dakota': { minLat: 42.5, maxLat: 45.9, minLon: -104.1, maxLon: -96.4 },
  'Tennessee': { minLat: 35.0, maxLat: 36.7, minLon: -90.3, maxLon: -81.6 },
  'Texas': { minLat: 25.8, maxLat: 36.5, minLon: -106.6, maxLon: -93.5 },
  'Utah': { minLat: 37.0, maxLat: 42.0, minLon: -114.0, maxLon: -109.0 },
  'Vermont': { minLat: 42.7, maxLat: 45.0, minLon: -73.4, maxLon: -71.5 },
  'Virginia': { minLat: 36.5, maxLat: 39.5, minLon: -83.7, maxLon: -75.2 },
  'Washington': { minLat: 45.5, maxLat: 49.0, minLon: -124.8, maxLon: -116.9 },
  'West Virginia': { minLat: 37.2, maxLat: 40.6, minLon: -82.6, maxLon: -77.7 },
  'Wisconsin': { minLat: 42.5, maxLat: 47.3, minLon: -92.9, maxLon: -86.2 },
  'Wyoming': { minLat: 41.0, maxLat: 45.0, minLon: -111.0, maxLon: -104.0 },
};

function getStateFromCoords(lat: number, lon: number): string | null {
  for (const [state, bounds] of Object.entries(STATE_COORDS)) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat && 
        lon >= bounds.minLon && lon <= bounds.maxLon) {
      return state;
    }
  }
  return null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    state: null,
    city: null,
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const state = getStateFromCoords(latitude, longitude);
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || null;

          setLocation({
            state: state || data.address?.state || null,
            city,
            latitude,
            longitude,
            loading: false,
            error: null,
          });
        } catch (error) {
          setLocation({
            state,
            city: null,
            latitude,
            longitude,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    );
  }, []);

  return location;
};
