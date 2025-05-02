import React from 'react';
import { Wind } from 'lucide-react';

interface WindStatusProps {
  speed: number;
}

const WindStatus: React.FC<WindStatusProps> = ({ speed }) => {
  // Convert wind direction degrees to cardinal direction
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees % 360) / 22.5)) % 16;
    return directions[index];
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-700 text-center mb-4">Wind Status</h3>
      
      <div className="flex items-center justify-center gap-4">
        <Wind size={24} className="text-gray-600" />
        <p className="text-2xl font-bold">{speed} km/h</p>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="badge badge-outline">{getWindDirection(225)}</div>
      </div>
    </div>
  );
};

export default WindStatus;