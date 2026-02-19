export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface BikeRoute {
  id: string;
  name: string;
  description: string;
  distanceMiles: number;
  difficulty: Difficulty;
  neighborhood: string;
  polyline: Coordinate[];
  centerCoordinate: Coordinate;
  defaultZoom: number;
}

export interface ScoredRoute extends BikeRoute {
  weatherSuitabilityScore: number;
  suitabilityLabel: string;
}

export type SortMode = 'best' | 'easiest' | 'shortest';
