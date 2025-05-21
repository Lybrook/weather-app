'use client';

import Image from 'next/image';
import { WeatherCondition } from '../types';
import { getWeatherIconUrl } from '../utils/api';

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

  const imageSize = {
    sm: 48,
    md: 96,
    lg: 144,
  };

  const iconUrl = getWeatherIconUrl(weather.icon);

  if (!iconUrl) return null;

  return (
    <div className="flex items-center">
      <Image
        src={iconUrl}
        alt={weather.description}
        width={imageSize[size]}
        height={imageSize[size]}
        className={`${sizeClasses[size]}`}
        unoptimized
      />
      <span className="text-sm capitalize ml-2">{weather.description}</span>
    </div>
  );
};

export default WeatherIcon;