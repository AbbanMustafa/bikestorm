import { useMemo, useState } from 'react';
import { NYC_BIKE_ROUTES } from '@/lib/routes-data';
import { scoreRoute } from '@/lib/scoring';
import type { WeatherConditions } from '@/types/weather';
import type { ScoredRoute, SortMode } from '@/types/route';

export function useScoredRoutes(weather: WeatherConditions | null) {
  const [sortMode, setSortMode] = useState<SortMode>('best');

  const scoredRoutes = useMemo<ScoredRoute[]>(() => {
    const conditionsScore = weather?.conditionsScore ?? 75;
    return NYC_BIKE_ROUTES.map((r) => scoreRoute(r, conditionsScore));
  }, [weather?.conditionsScore]);

  const sortedRoutes = useMemo(() => {
    return [...scoredRoutes].sort((a, b) => {
      if (sortMode === 'best') return b.weatherSuitabilityScore - a.weatherSuitabilityScore;
      if (sortMode === 'easiest') {
        const order: Record<string, number> = { Easy: 0, Moderate: 1, Hard: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      if (sortMode === 'shortest') return a.distanceMiles - b.distanceMiles;
      return 0;
    });
  }, [scoredRoutes, sortMode]);

  return { sortedRoutes, sortMode, setSortMode };
}
