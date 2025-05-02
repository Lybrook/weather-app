// components/HumidityStatus.tsx
import React from 'react';
import { Droplet } from 'lucide-react';

interface HumidityStatusProps {
  humidity: number;
}

const HumidityStatus: React.FC<HumidityStatusProps> = ({ humidity }) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-700 text-center mb-4">Humidity</h3>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <Droplet size={24} className="text-blue-500" />
        <p className="text-2xl font-bold">{humidity}%</p>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${humidity}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default HumidityStatus;