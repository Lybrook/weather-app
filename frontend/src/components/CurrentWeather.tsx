'use client';

import React from 'react';
import { CurrentWeather as CurrentWeatherType } from '@/types';
import { formatDate, formatTemperature } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { state } = useAppContext();
  const { temperatureUnit } = state;
  
  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">
            {data.location.name}, {data.location.country}
          </h2>
          <p className="text-gray-500">{formatDate(data.current.dt)}</p>
          
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-5xl font-bold">
                {formatTemperature(data.current.temp, temperatureUnit)}
              </span>
            </div>
            <p className="text-gray-500">
              Feels like {formatTemperature(data.current.feels_like, temperatureUnit)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <WeatherIcon weather={data.current.weather} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
