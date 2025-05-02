// components/WeatherIcon.tsx
import Image from 'next/image';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  alt?: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode,
  size = 50,
  alt = 'Weather icon',
  className = '',
}) => {
  // Map OpenWeatherMap icon codes to more descriptive alt text
  const getAltText = (code: string): string => {
    const descriptions: Record<string, string> = {
      '01d': 'Clear sky (day)',
      '01n': 'Clear sky (night)',
      '02d': 'Few clouds (day)',
      '02n': 'Few clouds (night)',
      '03d': 'Scattered clouds',
      '03n': 'Scattered clouds',
      '04d': 'Broken clouds',
      '04n': 'Broken clouds',
      '09d': 'Shower rain',
      '09n': 'Shower rain',
      '10d': 'Rain (day)',
      '10n': 'Rain (night)',
      '11d': 'Thunderstorm',
      '11n': 'Thunderstorm',
      '13d': 'Snow',
      '13n': 'Snow',
      '50d': 'Mist',
      '50n': 'Mist',
    };
    
    return descriptions[code] || alt;
  };

  return (
    <div className={className}>
      <Image
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt={getAltText(iconCode)}
        width={size}
        height={size}
        priority
      />
    </div>
  );
};

export default WeatherIcon;