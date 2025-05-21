'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider } from '../context/AppContext';
import { useAppContext } from '../context/AppContext';
import SearchBox from '@/components/SearchBox';
import UnitToggle from '../components/UnitToggle';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastStatus';
import WeatherStats from '@/components/WeatherStats';
import { getCurrentWeather, getWeatherForecast } from '../utils/api';
import { CurrentWeather as CurrentWeatherType, WeatherForecast } from '../types';

const WeatherApp = () => {
  const { state, setIsLoading, setError } = useAppContext();
  const { selectedCity, temperatureUnit } = state;
  
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);

  // Fetch weather data when city or unit changes
  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch current weather
        const currentData = await getCurrentWeather(
          selectedCity.lat,
          selectedCity.lon,
          temperatureUnit
        );
        setCurrentWeather(currentData);
        
        // Fetch forecast
        const forecastData = await getWeatherForecast(
          selectedCity.lat,
          selectedCity.lon,
          temperatureUnit
        );
        setForecast(forecastData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCity, temperatureUnit, setIsLoading, setError]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Weather App</h1>
        <UnitToggle />
      </div>
      
      <SearchBox />
      
      {state.isLoading && (
        <div className="flex justify-center my-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}
      
      {state.error && (
        <div className="alert alert-error my-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}
      
      {!state.isLoading && !state.error && currentWeather && (
        <div className="mt-8">
          <CurrentWeather data={currentWeather} />
          <WeatherStats data={currentWeather} />
          {forecast && <ForecastSection data={forecast} />}
        </div>
      )}
      
      {!selectedCity && !state.isLoading && (
        <div className="text-center my-12">
          <p className="text-gray-500">Search for a city to see weather information</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <WeatherApp />
    </AppProvider>
  );
}
