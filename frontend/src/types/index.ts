// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Geocoding Types
export interface City {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

export type GeocodingResponse = ApiResponse<City[]>;

// Weather Types
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: {
    name: string;
    country: string;
  };
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: WeatherCondition;
  };
}

export interface ForecastDay {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition;
}

export interface WeatherForecast {
  location: {
    name: string;
    country: string;
  };
  forecast: ForecastDay[];
}

export type CurrentWeatherResponse = ApiResponse<CurrentWeather>;
export type ForecastResponse = ApiResponse<WeatherForecast>;

// App State Types
export type TemperatureUnit = 'metric' | 'imperial';

export interface AppState {
  selectedCity: City | null;
  temperatureUnit: TemperatureUnit;
  isLoading: boolean;
  error: string | null;
}
