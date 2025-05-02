// services/weatherService.ts

// Replace this with your Laravel API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export interface WeatherLocation {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  name: string;
  sys: {
    country: string;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface Forecast {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface WeatherResponse {
  current: CurrentWeather;
  forecast: Forecast;
  location: WeatherLocation;
}

export const fetchWeatherByCity = async (
  city: string, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}&units=${units}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather/coordinates?lat=${lat}&lon=${lon}&units=${units}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};