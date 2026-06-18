import * as Location from 'expo-location';

import type { GeoLocation, WeatherSnapshot } from '@/types/models';

export interface WeatherNow extends WeatherSnapshot {
  /** Ionicons name for the condition. */
  icon: string;
  label: string;
}

/** Map a WMO weather code to a simple condition + Ionicons name + label. */
function codeInfo(code: number): { condition: string; icon: string; label: string } {
  if (code === 0) return { condition: 'clear', icon: 'sunny-outline', label: 'Clear' };
  if (code <= 2) return { condition: 'clouds', icon: 'partly-sunny-outline', label: 'Partly cloudy' };
  if (code === 3) return { condition: 'clouds', icon: 'cloudy-outline', label: 'Overcast' };
  if (code <= 48) return { condition: 'fog', icon: 'cloudy-outline', label: 'Fog' };
  if (code <= 57) return { condition: 'drizzle', icon: 'rainy-outline', label: 'Drizzle' };
  if (code <= 67) return { condition: 'rain', icon: 'rainy-outline', label: 'Rain' };
  if (code <= 77) return { condition: 'snow', icon: 'snow-outline', label: 'Snow' };
  if (code <= 82) return { condition: 'rain', icon: 'rainy-outline', label: 'Showers' };
  if (code <= 86) return { condition: 'snow', icon: 'snow-outline', label: 'Snow showers' };
  return { condition: 'thunder', icon: 'thunderstorm-outline', label: 'Thunderstorm' };
}

/** Fetch current conditions from Open-Meteo (free, no API key required). */
export async function fetchWeather(lat: number, lon: number, city?: string): Promise<WeatherNow> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather request failed');
  const j = await res.json();
  const code: number = j.current?.weather_code ?? 0;
  const info = codeInfo(code);
  return {
    tempC: Math.round(j.current?.temperature_2m ?? 18),
    feelsLikeC: Math.round(j.current?.apparent_temperature ?? j.current?.temperature_2m ?? 18),
    condition: info.condition,
    code,
    high: Math.round(j.daily?.temperature_2m_max?.[0] ?? 20),
    low: Math.round(j.daily?.temperature_2m_min?.[0] ?? 12),
    city,
    icon: info.icon,
    label: info.label,
  };
}

/**
 * Best-effort local weather: ask for location permission, otherwise fall back
 * to the user's saved city (or a sensible default). Works on web + native.
 */
export async function getDeviceWeather(fallback?: GeoLocation | null): Promise<WeatherNow> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      let city: string | undefined;
      try {
        const geo = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        city = geo[0]?.city ?? geo[0]?.region ?? undefined;
      } catch {
        // reverse geocode is optional
      }
      return fetchWeather(pos.coords.latitude, pos.coords.longitude, city);
    }
  } catch {
    // fall through to fallback location
  }
  const lat = fallback?.lat ?? 40.7128;
  const lon = fallback?.lon ?? -74.006;
  const city = fallback?.city ?? 'New York';
  return fetchWeather(lat, lon, city);
}
