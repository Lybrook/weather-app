"use client";

import React from 'react';
import { useWeather } from '@/context/WeatherContext';

export default function WindStatus() {
  const { currentWeather, temperatureUnit } = useWeather();

  if (!currentWeather) {
    return null;
  }

  const { wind } = currentWeather;
  const speedUnit = temperatureUnit === 'celsius' ? 'm/s' : 'mph';
  
  // Convert wind direction degrees to cardinal direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const windDirection = getWindDirection(wind.deg);

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Wind Status</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{wind.speed} <span className="text-lg">{speedUnit}</span></p>
          <p className="text-gray-500 mt-1">Speed</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-2">
            <div 
              className="absolute w-1 h-8 bg-primary" 
              style={{ 
                transformOrigin: 'bottom center',
                transform: `translateY(-4px) rotate(${wind.deg}deg)`
              }}
            >
              <div className="w-3 h-3 bg-primary absolute -top-1.5 left-1/2 transform -translate-x-1/2 rotate-45"></div>
            </div>
          </div>
          <p className="text-lg font-medium">{windDirection}</p>
          <p className="text-gray-500 text-sm">{wind.deg}°</p>
        </div>
        {wind.gust && (
          <div>
            <p className="text-2xl font-bold">{wind.gust} <span className="text-lg">{speedUnit}</span></p>
            <p className="text-gray-500 mt-1">Gust</p>
          </div>
        )}
      </div>
    </div>
  );
}
