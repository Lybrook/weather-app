'use client';

import React from 'react';

interface HumidityStatusProps {
  humidity: number;
}

const HumidityStatus: React.FC<HumidityStatusProps> = ({ humidity }) => {
  // Determine humidity level class
  const getHumidityLevelClass = () => {
    if (humidity < 30) return 'bg-yellow-500'; // Dry
    if (humidity < 60) return 'bg-green-500'; // Comfortable
    return 'bg-blue-500'; // Humid
  };

  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Humidity</h3>
      <div className="flex flex-col">
        <div className="text-3xl font-bold mb-2">{humidity}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className={`h-2.5 rounded-full ${getHumidityLevelClass()}`} 
            style={{ width: `${humidity}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default HumidityStatus;
