"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import WeatherIcon from '@/components/WeatherIcon';
import { fetchWeatherByCity, WeatherResponse } from '@/services/weatherService';

// Dynamic imports for non-critical components
const DailyForecast = dynamic(() => import('@/components/DailyForecast'), {
  loading: () => <div className="h-24 flex items-center justify-center text-gray-500">Loading forecast...</div>,
});

const WindStatus = dynamic(() => import('@/components/WindStatus'), {
  loading: () => <div className="h-24 flex items-center justify-center text-gray-500">Loading wind status...</div>,
});

const HumidityStatus = dynamic(() => import('@/components/HumidityStatus'), {
  loading: () => <div className="h-24 flex items-center justify-center text-gray-500">Loading humidity...</div>,
});

export default function WeatherDashboard() {
  const [city, setCity] = useState('Nairobi');
  const [searchCity, setSearchCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCelsius, setIsCelsius] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUnit = localStorage.getItem('temperatureUnit');
      return savedUnit === 'imperial' ? false : true;
    }
    return true;
  });
  const [date, setDate] = useState(new Date());

  const convertTemp = (temp: number) => Math.round(temp);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const getDailyForecasts = () => {
    if (!weatherData?.forecast?.list) return [];
    const todayDate = new Date().setHours(0, 0, 0, 0);
    const uniqueDays = new Map();
    weatherData.forecast.list.forEach(item => {
      const forecastDate = new Date(item.dt * 1000);
      const forecastDay = forecastDate.setHours(0, 0, 0, 0);
      if (forecastDay === todayDate) return;
      if (!uniqueDays.has(forecastDay) || 
          Math.abs(forecastDate.getHours() - 12) < 
          Math.abs(new Date(uniqueDays.get(forecastDay).dt * 1000).getHours() - 12)) {
        uniqueDays.set(forecastDay, {
          dt: item.dt,
          temp: item.main.temp,
          icon: item.weather[0].icon
        });
      }
    });
    return Array.from(uniqueDays.values()).slice(0, 3);
  };

  const dailyForecasts = useMemo(() => getDailyForecasts(), [weatherData]);

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchWeatherByCity(cityName, isCelsius ? 'metric' : 'imperial');
      setWeatherData(data);
      setCity(data.location.city);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) fetchWeatherData(searchCity);
  };

  const toggleUnit = () => {
    const newUnit = !isCelsius;
    setIsCelsius(newUnit);
    if (typeof window !== 'undefined') {
      localStorage.setItem('temperatureUnit', newUnit ? 'metric' : 'imperial');
    }
    if (city) fetchWeatherData(city);
  };

  useEffect(() => {
    fetchWeatherData(city);
    const interval = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="md:col-span-4 bg-gray-50 p-6 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex justify-center">
              {weatherData && weatherData.current && (
                <WeatherIcon 
                  iconCode={weatherData.current.weather[0].icon}
                  size={120}
                  className="mb-4"
                />
              )}
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold">
                {weatherData && weatherData.current && 
                  convertTemp(weatherData.current.main.temp)}°{isCelsius ? 'C' : 'F'}
              </h1>
              <p className="text-2xl text-gray-600 mt-2">
                {weatherData?.current?.weather[0].main}
              </p>
            </div>
          </div>
          <div className="text-center mt-auto">
            <p className="text-lg text-gray-600">
              {date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
            <p className="text-xl font-medium">
              {weatherData?.location?.city}, {weatherData?.location?.country}
            </p>
          </div>
        </div>
        <div className="md:col-span-8 p-6">
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
                onClick={() => toggleUnit()}
              >
                °C
              </button>
              <button 
                className={`btn ${!isCelsius ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleUnit()}
              >
                °F
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {dailyForecasts.map((day, index) => (
              <DailyForecast
                key={index}
                date={formatDate(day.dt)}
                temp={convertTemp(day.temp)}
                icon={day.icon}
                unit={isCelsius ? 'C' : 'F'}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WindStatus speed={weatherData?.current?.wind?.speed || 0} />
            <HumidityStatus humidity={weatherData?.current?.main?.humidity || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
