"use client";

import React from 'react';
import { WeatherProvider } from '@/context/WeatherContext';
import SearchBox from '@/components/SearchBox';
import TemperatureToggle from '@/components/TemperatureToggle';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastWeather from '@/components/ForecastWeather';
import WindStatus from '@/components/WindStatus';
import HumidityInfo from '@/components/HumidityInfo';
import { useWeather } from '@/context/WeatherContext';

function WeatherDashboard() {
  const { city, isLoading, error } = useWeather();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Weather App</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchBox />
          <TemperatureToggle />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {city && !isLoading && (
        <>
          <CurrentWeather />
          <ForecastWeather />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <WindStatus />
            <HumidityInfo />
          </div>
        </>
      )}

      {!city && !isLoading && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Weather App</h2>
          <p className="text-gray-600 mb-6">Search for a city to get started</p>
          <div className="max-w-md mx-auto">
            <SearchBox />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <WeatherProvider>
      <main className="min-h-screen bg-gray-50">
        <WeatherDashboard />
      </main>
    </WeatherProvider>
  );
}