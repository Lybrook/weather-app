import Image from 'next/image';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  size = 50, 
  className = '' 
}) => {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <div className={className}>
      <Image 
        src={iconUrl}
        alt={`Weather icon ${iconCode}`}
        width={size}
        height={size}
        className="weather-icon"
      />
    </div>
  );
};

export default WeatherIcon;