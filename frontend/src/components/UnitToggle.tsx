'use client';

import React from 'react';
import { TemperatureUnit } from '../types';
import { useAppContext } from '../context/AppContext';

const UnitToggle = () => {
  const { state, setTemperatureUnit } = useAppContext();
  const { temperatureUnit } = state;

  const handleToggle = () => {
    const newUnit: TemperatureUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
    setTemperatureUnit(newUnit);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${temperatureUnit === 'metric' ? 'text-primary' : 'text-gray-500'}`}>°C</span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={temperatureUnit === 'imperial'} 
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
      <span className={`text-sm font-medium ${temperatureUnit === 'imperial' ? 'text-primary' : 'text-gray-500'}`}>°F</span>
    </div>
  );
};

export default UnitToggle;
