'use client';

import React from 'react';
import { WeatherCondition } from '@/types';
import { getWeatherIconUrl } from '@/utils/api';

interface WeatherIconProps {
  weather: WeatherCondition;
  size?: 'sm' | 'md' | 'lg';
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weather, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center">
      <img 
        src={getWeatherIconUrl(weather.icon)} 
        alt={weather.description}
        className={`${sizeClasses[size]}`}
      />
      <span className="text-sm capitalize">{weather.description}</span>
    </div>
  );
};

export default WeatherIcon;
