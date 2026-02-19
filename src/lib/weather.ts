import type { WeatherResponse, WeatherConditions } from '@/types/weather';
import { computeConditionsScore } from './scoring';

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=40.7128&longitude=-74.0060' +
  '&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code' +
  '&wind_speed_unit=mph&temperature_unit=fahrenheit';

const WMO_LABELS: Array<[number, number, string, string, string]> = [
  [0,  0,  'Clear',         'sun.max',           '☀️'],
  [1,  3,  'Partly Cloudy', 'cloud.sun',          '⛅'],
  [45, 48, 'Foggy',         'cloud.fog',          '🌫️'],
  [51, 55, 'Drizzle',       'cloud.drizzle',      '🌦️'],
  [56, 67, 'Rain',          'cloud.rain',         '🌧️'],
  [71, 77, 'Snow',          'cloud.snow',         '🌨️'],
  [80, 82, 'Showers',       'cloud.heavyrain',    '🌧️'],
  [95, 99, 'Thunderstorm',  'cloud.bolt.rain',    '⛈️'],
];

function describeWeatherCode(code: number): { label: string; sfSymbol: string; emoji: string } {
  for (const [min, max, label, sfSymbol, emoji] of WMO_LABELS) {
    if (code >= min && code <= max) return { label, sfSymbol, emoji };
  }
  return { label: 'Cloudy', sfSymbol: 'cloud', emoji: '☁️' };
}

export async function fetchWeather(): Promise<WeatherConditions> {
  const res = await fetch(OPEN_METEO_URL);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
  const data: WeatherResponse = await res.json();
  const c = data.current;

  const conditionsScore = computeConditionsScore(
    c.precipitation,
    c.wind_speed_10m,
    c.temperature_2m,
    c.weather_code
  );

  const { label, sfSymbol, emoji } = describeWeatherCode(c.weather_code);

  return {
    temperature: Math.round(c.temperature_2m),
    apparentTemperature: Math.round(c.apparent_temperature),
    precipitation: c.precipitation,
    windSpeed: Math.round(c.wind_speed_10m),
    weatherCode: c.weather_code,
    conditionsScore,
    label,
    sfSymbol,
    emoji,
  };
}
