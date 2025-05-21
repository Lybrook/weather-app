import { City, TemperatureUnit } from '@/types';

const API_BASE_URL = 'https://weather-app-k6pz.onrender.com/api';

// Geocoding API
export const searchCities = async (query: string, limit: number = 5): Promise<City[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/geocoding/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to search cities');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

// Weather API
export const getCurrentWeather = async (lat: number, lon: number, units: TemperatureUnit = 'metric') => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to get current weather');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error getting current weather:', error);
    throw error;
  }
};

export const getWeatherForecast = async (lat: number, lon: number, units: TemperatureUnit = 'metric', days: number = 3) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}&units=${units}&days=${days}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to get weather forecast');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    throw error;
  }
};

// Temperature conversion utilities
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

// Format date from timestamp
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Format temperature with unit
export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  const symbol = unit === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

// Get wind direction from degrees
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
