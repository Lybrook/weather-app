"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TemperatureUnit, WeatherData, ForecastData, GeocodingResult } from '@/types/weather';
import { getCurrentWeather, getWeatherForecast } from '@/utils/weatherApi';

interface WeatherContextType {
  city: GeocodingResult | null;
  setCity: (city: GeocodingResult | null) => void;
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<GeocodingResult | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const units = temperatureUnit === 'celsius' ? 'metric' : 'imperial';
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(city.lat, city.lon, units),
          getWeatherForecast(city.lat, city.lon, units)
        ]);
        
        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, temperatureUnit]);

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        currentWeather,
        forecast,
        isLoading,
        error,
        temperatureUnit,
        toggleTemperatureUnit
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
