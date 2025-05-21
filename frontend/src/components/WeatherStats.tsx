'use client';

import React from 'react';
import { CurrentWeather as CurrentWeatherType } from '@/types';
import WindStatus from './WindStatus';
import HumidityStatus from './HumidityStatus';

interface WeatherStatsProps {
  data: CurrentWeatherType;
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ data }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Today's Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WindStatus 
          speed={data.current.wind_speed} 
          degrees={data.current.wind_deg} 
        />
        <HumidityStatus 
          humidity={data.current.humidity} 
        />
      </div>
    </div>
  );
};

export default WeatherStats;
