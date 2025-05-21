'use client';

import React from 'react';
import { ForecastDay } from '@/types';
import { formatDate, formatTemperature } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';
import WeatherIcon from './WeatherIcon';

interface ForecastDayCardProps {
  data: ForecastDay;
}

const ForecastDayCard: React.FC<ForecastDayCardProps> = ({ data }) => {
  const { state } = useAppContext();
  const { temperatureUnit } = state;

  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <div className="flex flex-col items-center">
        <h3 className="font-medium">{formatDate(data.dt)}</h3>
        <div className="my-2">
          <WeatherIcon weather={data.weather} size="sm" />
        </div>
        <div className="flex justify-between w-full mt-2">
          <span className="text-sm">{formatTemperature(data.temp.min, temperatureUnit)}</span>
          <span className="text-sm font-bold">{formatTemperature(data.temp.max, temperatureUnit)}</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastDayCard;
