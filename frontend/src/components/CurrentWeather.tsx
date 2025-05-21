"use client";

import React from 'react';
import { useWeather } from '@/context/WeatherContext';
import { getWeatherIconUrl, formatDate } from '@/utils/weatherApi';

export default function CurrentWeather() {
  const { currentWeather, temperatureUnit, city } = useWeather();

  if (!currentWeather || !city) {
    return null;
  }

  const { weather, main, wind, sys, dt, timezone } = currentWeather;
  const weatherIcon = weather[0].icon;
  const weatherDescription = weather[0].description;
  const temperature = Math.round(main.temp);
  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
  const formattedDate = formatDate(dt, timezone);

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="flex flex-col items-center md:flex-row md:justify-between">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-1">{city.name}, {city.country}</h2>
          <p className="text-gray-500">{formattedDate}</p>
          <div className="flex items-center mt-4">
            <img 
              src={getWeatherIconUrl(weatherIcon)} 
              alt={weatherDescription}
              className="w-16 h-16"
            />
            <div className="ml-2">
              <p className="text-4xl font-bold">{temperature}{unitSymbol}</p>
              <p className="text-gray-600 capitalize">{weatherDescription}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-500">Humidity</p>
            <p className="text-xl font-semibold">{main.humidity}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Wind</p>
            <p className="text-xl font-semibold">{wind.speed} {temperatureUnit === 'celsius' ? 'm/s' : 'mph'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Feels Like</p>
            <p className="text-xl font-semibold">{Math.round(main.feels_like)}{unitSymbol}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Pressure</p>
            <p className="text-xl font-semibold">{main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
