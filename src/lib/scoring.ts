import type { BikeRoute, ScoredRoute } from '@/types/route';

function getWmoPenalty(code: number): number {
  if (code >= 0 && code <= 3) return 0;
  if (code >= 45 && code <= 48) return 20;
  if (code >= 51 && code <= 67) return 30;
  if (code >= 71 && code <= 77) return 35;
  if (code >= 80 && code <= 82) return 30;
  if (code >= 95 && code <= 99) return 50;
  return 0;
}

export function computeConditionsScore(
  precipitation: number,
  windSpeed: number,
  temperature: number,
  weatherCode: number
): number {
  let score = 100;

  if (precipitation > 0.1) score -= 40;

  if (windSpeed > 20) score -= 30;
  else if (windSpeed >= 15) score -= 15;

  if (temperature < 35) score -= 25;
  else if (temperature < 45) score -= 15;
  else if (temperature > 95) score -= 25;
  else if (temperature > 90) score -= 15;

  score -= getWmoPenalty(weatherCode);

  return Math.max(0, Math.min(100, score));
}

const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  Easy: 1.0,
  Moderate: 0.95,
  Hard: 0.9,
};

export function scoreRoute(route: BikeRoute, conditionsScore: number): ScoredRoute {
  const multiplier = DIFFICULTY_MULTIPLIER[route.difficulty] ?? 1.0;
  const weatherSuitabilityScore = Math.round(conditionsScore * multiplier);
  const suitabilityLabel =
    weatherSuitabilityScore >= 80 ? 'Great' :
    weatherSuitabilityScore >= 50 ? 'Fair' : 'Poor';

  return { ...route, weatherSuitabilityScore, suitabilityLabel };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#34C759';
  if (score >= 50) return '#FF9500';
  return '#FF3B30';
}
