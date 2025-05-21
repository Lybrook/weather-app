"use client";

import React from 'react';
import { useWeather } from '@/context/WeatherContext';

export default function HumidityInfo() {
  const { currentWeather } = useWeather();

  if (!currentWeather) {
    return null;
  }

  const { main } = currentWeather;
  const humidity = main.humidity;

  // Determine humidity level for visual indicator
  const getHumidityLevel = (value: number) => {
    if (value < 30) return 'Low';
    if (value < 60) return 'Moderate';
    return 'High';
  };

  const humidityLevel = getHumidityLevel(humidity);
  
  // Determine color based on humidity level
  const getHumidityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-yellow-500';
      case 'Moderate': return 'text-green-500';
      case 'High': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const humidityColor = getHumidityColor(humidityLevel);

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Humidity</h3>
      <div className="flex flex-col items-center">
        <p className="text-4xl font-bold">{humidity}<span className="text-2xl">%</span></p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-2">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${humidity}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full text-xs text-gray-500">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <p className={`mt-2 ${humidityColor} font-medium`}>{humidityLevel}</p>
      </div>
    </div>
  );
}
