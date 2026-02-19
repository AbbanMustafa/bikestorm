import { useState, useEffect } from 'react';
import { fetchWeather } from '@/lib/weather';
import type { WeatherConditions } from '@/types/weather';

export interface UseWeatherResult {
  weather: WeatherConditions | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather()
      .then((w) => {
        if (!cancelled) {
          setWeather(w);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [tick]);

  return { weather, loading, error, refetch: () => setTick((t) => t + 1) };
}
