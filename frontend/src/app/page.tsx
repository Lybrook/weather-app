// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import WeatherIcon from '@/components/WeatherIcon';
import DailyForecast from '@/components/DailyForecast';
import WindStatus from '@/components/WindStatus';
import HumidityStatus from '@/components/HumidityStatus';

// Backend API URL (should be in environment variable in production)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000/api/weather';

// TypeScript interfaces
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt: number;
  sys: {
    country: string;
  };
}

interface ForecastDay {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

interface GeocodingData {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface AllWeatherData {
  geocoding: GeocodingData;
  current: WeatherData;
  forecast: {
    list: ForecastDay[];
    city: {
      name: string;
      country: string;
    };
  };
}

export default function WeatherDashboard() {
  const [city, setCity] = useState('Nairobi');
  const [searchCity, setSearchCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [date, setDate] = useState(new Date());

  // Convert temperature based on selected unit
  const convertTemp = (temp: number) => {
    if (isCelsius) {
      return Math.round(temp);
    }
    return Math.round((temp * 9) / 5 + 32);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Fetch weather data from our Laravel backend API
  const fetchWeatherData = useCallback(async (cityName: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Use the all-in-one endpoint from our Laravel backend
      const response = await fetch(`${API_URL}/all?city=${encodeURIComponent(cityName)}&units=${isCelsius ? 'metric' : 'imperial'}`);
      
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data: AllWeatherData = await response.json();
      
      setWeatherData(data.current);
      
      // Process forecast data - get one forecast per day (noon) for the next 3 days
      const dailyForecasts = data.forecast.list
        .filter((item, index) => {
          const itemDate = new Date(item.dt * 1000);
          const today = new Date();
          return itemDate.getDate() !== today.getDate() && index % 8 === 0;
        })
        .slice(0, 3);
      
      setForecastData(dailyForecasts);
      setCity(data.current.name);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  }, [isCelsius]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity);
    }
  };

  // Removed unused toggleUnit function

  // Initial load
  useEffect(() => {
    fetchWeatherData(city);
    
    // Update date every minute
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [city, fetchWeatherData]);

  if (loading && !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left panel - Current weather */}
        <div className="md:col-span-4 bg-gray-50 p-6 flex flex-col justify-between">
          {/* Weather icon and temp */}
          <div className="mb-4">
            <div className="flex justify-center">
              {weatherData && (
                <WeatherIcon 
                  iconCode={weatherData.weather[0].icon}
                  size={120}
                  className="mb-4"
                />
              )}
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold">
                {weatherData && convertTemp(weatherData.main.temp)}°{isCelsius ? 'C' : 'F'}
              </h1>
              <p className="text-2xl text-gray-600 mt-2">
                {weatherData?.weather[0].main}
              </p>
            </div>
          </div>
          
          {/* Date and location */}
          <div className="text-center mt-auto">
            <p className="text-lg text-gray-600">
              {date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
            <p className="text-xl font-medium">
              {weatherData?.name}, {weatherData?.sys.country}
            </p>
          </div>
        </div>
        
        {/* Right panel - Search, forecast and details */}
        <div className="md:col-span-8 p-6">
          {/* Search bar and unit toggle */}
          <div className="flex gap-2 mb-8">
            <form onSubmit={handleSearch} className="flex-grow flex gap-2">
              <input
                type="text"
                placeholder="Search city..."
                className="input input-bordered w-full"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Go</button>
            </form>
            
            <div className="flex gap-2">
              <button 
                className={`btn ${isCelsius ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setIsCelsius(true);
                  if (city) fetchWeatherData(city);
                }}
              >
                °C
              </button>
              <button 
                className={`btn ${!isCelsius ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => {
                  setIsCelsius(false);
                  if (city) fetchWeatherData(city);
                }}
              >
                °F
              </button>
            </div>
          </div>
          
          {/* 3-day forecast */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {forecastData.map((day, index) => (
              <DailyForecast
                key={index}
                date={formatDate(day.dt)}
                temp={convertTemp(day.main.temp)}
                icon={day.weather[0].icon}
                unit={isCelsius ? 'C' : 'F'}
              />
            ))}
          </div>
          
          {/* Weather details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WindStatus 
              speed={weatherData?.wind.speed || 0} 
            />
            <HumidityStatus 
              humidity={weatherData?.main.humidity || 0} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}