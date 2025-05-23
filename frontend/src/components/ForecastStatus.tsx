'use client';

import React from 'react';
import { WeatherForecast } from '../types';
// Ensure the file exists as ForecastDayCard.tsx or ForecastDayCard.jsx in the same directory
import ForecastDayCard from './ForecastDayCard';

interface ForecastSectionProps {
  data: WeatherForecast;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ data }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">3-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.forecast.map((day) => (
          <ForecastDayCard key={day.dt} data={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;
