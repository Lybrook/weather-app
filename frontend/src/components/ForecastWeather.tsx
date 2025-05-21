"use client";

import React from 'react';
import Image from 'next/image';
import { useWeather } from '@/context/WeatherContext';
import { getWeatherIconUrl } from '@/utils/weatherApi';

type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
};

export default function ForecastWeather() {
  const { forecast, temperatureUnit } = useWeather();

  if (!forecast) {
    return null;
  }

  // Get one forecast per day for the next 3 days (excluding today)
  const dailyForecasts = forecast.list.reduce((acc: { [key: string]: ForecastItem }, item: ForecastItem) => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    // Skip today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (day === todayStr) return acc;
    
    // Only keep one forecast per day (at noon if possible)
    if (!acc[day] || item.dt_txt.includes('12:00')) {
      acc[day] = item;
    }
    
    return acc;
  }, {});
  
  // Convert to array and take first 3 days
  const threeDayForecast = Object.values(dailyForecasts).slice(0, 3);
  
  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">3-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {threeDayForecast.map((day: ForecastItem) => (
          <div key={day.dt} className="card bg-base-100 shadow-md p-4">
            <div className="flex flex-col items-center">
              <Image
                src={getWeatherIconUrl(day.weather[0].icon)}
                alt={day.weather[0].description}
                width={64}
                height={64}
                className="w-16 h-16 my-2"
                unoptimized
              />
              <p className="text-2xl font-bold">{Math.round(day.main.temp)}{unitSymbol}</p>
              <p className="text-gray-600 capitalize text-sm">{day.weather[0].description}</p>
              <div className="flex justify-between w-full mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Wind</p>
                  <p>{day.wind.speed} {temperatureUnit === 'celsius' ? 'm/s' : 'mph'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Humidity</p>
                  <p>{day.main.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
