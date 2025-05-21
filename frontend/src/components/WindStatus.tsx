'use client';

import React from 'react';
import { getWindDirection } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

interface WindStatusProps {
  speed: number;
  degrees: number;
}

const WindStatus: React.FC<WindStatusProps> = ({ speed, degrees }) => {
  const { state } = useAppContext();
  const { temperatureUnit } = state;
  
  // Format wind speed with the correct unit
  const formattedSpeed = `${speed.toFixed(1)} ${temperatureUnit === 'metric' ? 'm/s' : 'mph'}`;
  const direction = getWindDirection(degrees);

  return (
    <div className="card bg-base-100 shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Wind Status</h3>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">{formattedSpeed}</div>
        <div className="flex items-center">
          <div 
            className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
            style={{ transform: `rotate(${degrees}deg)` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v11.586l-2.293-2.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 15.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="ml-2">{direction}</span>
        </div>
      </div>
    </div>
  );
};

export default WindStatus;
