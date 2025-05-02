import React from 'react';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  date: string;
  temp: number;
  icon: string;
  unit: 'C' | 'F';
}

const DailyForecast: React.FC<DailyForecastProps> = ({ date, temp, icon, unit }) => {
  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <h3 className="text-md font-medium text-gray-700 mb-2">{date}</h3>
      <div className="flex justify-center">
        <WeatherIcon iconCode={icon} size={60} />
      </div>
      <p className="text-xl font-semibold mt-2">
        {temp}°{unit}
      </p>
    </div>
  );
};

export default DailyForecast;