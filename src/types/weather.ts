export interface WeatherResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export interface WeatherConditions {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  conditionsScore: number;
  label: string;
  sfSymbol: string;
  emoji: string;
}
