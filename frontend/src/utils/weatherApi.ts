import { GeocodingResult, WeatherData, ForecastData } from '@/types/weather';

const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // This would be replaced with environment variable in production
const BASE_URL = 'http://api.openweathermap.org';

export async function searchCity(city: string): Promise<GeocodingResult[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch geocoding data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching city:', error);
    throw error;
  }
}

export async function getCurrentWeather(lat: number, lon: number, units: string = 'metric'): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

export async function getWeatherForecast(lat: number, lon: number, units: string = 'metric'): Promise<ForecastData> {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

export function getWeatherIconUrl(iconCode: string): string {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function convertTemperature(temp: number, from: 'celsius' | 'fahrenheit', to: 'celsius' | 'fahrenheit'): number {
  if (from === to) return temp;
  
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9/5) + 32;
  } else {
    return (temp - 32) * 5/9;
  }
}

export function formatDate(timestamp: number, timezone: number = 0): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getDayFromTimestamp(timestamp: number, timezone: number = 0): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
