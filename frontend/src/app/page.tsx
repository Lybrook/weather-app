/* eslint-disable react-hooks/exhaustive-deps */
// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import WeatherIcon from '@/components/WeatherIcon';
import DailyForecast from '@/components/DailyForecast';
import WindStatus from '@/components/WindStatus';
import HumidityStatus from '@/components/HumidityStatus';
import { fetchWeatherByCity, fetchWeatherByCoordinates, WeatherResponse } from '@/services/weatherService';

export default function WeatherDashboard() {
  const [city, setCity] = useState('Nairobi');
  const [searchCity, setSearchCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [date, setDate] = useState(new Date());

  // Convert temperature based on selected unit
  const convertTemp = (temp: number) => {
    return Math.round(temp);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Extract daily forecasts from the forecast data
  const getDailyForecasts = () => {
    if (!weatherData?.forecast?.list) return [];
    
    const todayDate = new Date().setHours(0, 0, 0, 0);
    const uniqueDays = new Map();
    
    weatherData.forecast.list.forEach(item => {
      const forecastDate = new Date(item.dt * 1000);
      const forecastDay = forecastDate.setHours(0, 0, 0, 0);
      
      // Skip today's forecasts
      if (forecastDay === todayDate) return;
      
      // Get noon forecasts or closest to noon
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

  // Fetch weather data by city name
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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity);
    }
  };

  // Toggle temperature unit
  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
    // Refetch data with new unit
    if (city) {
      fetchWeatherData(city);
    }
  };

  // Get user's location if they allow it
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            const data = await fetchWeatherByCoordinates(
              latitude, 
              longitude, 
              isCelsius ? 'metric' : 'imperial'
            );
            setWeatherData(data);
            setCity(data.location.city);
            setLoading(false);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
            // Fall back to default city
            fetchWeatherData(city);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          
          // Handle specific geolocation errors
          let errorMessage = '';
          switch(err.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'Location access was denied. Using default city.';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = 'Your location could not be determined. Using default city.';
              break;
            case 3: // TIMEOUT
              errorMessage = 'Location request timed out. Using default city.';
              break;
            default:
              errorMessage = 'An unknown location error occurred. Using default city.';
          }
          
          setLocationError(errorMessage);
          // Fall back to default city
          fetchWeatherData(city);
        },
        // Add options for better performance and user experience
        {
          enableHighAccuracy: false, // Set to false for faster response
          timeout: 10000, // 10 seconds timeout
          maximumAge: 600000 // Cache location for 10 minutes
        }
      );
    } else {
      // Geolocation not supported
      setLocationError('Location services are not supported by your browser. Using default city.');
      fetchWeatherData(city);
    }
  };

  // Function to retry getting user location
  const retryGeolocation = () => {
    setLocationError('');
    getUserLocation();
  };

  // Initial load
  useEffect(() => {
    getUserLocation();
    
    // Update date every minute
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);
    
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

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left panel - Current weather */}
        <div className="md:col-span-4 bg-gray-50 p-6 flex flex-col justify-between">
          {/* Weather icon and temp */}
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
              {weatherData?.location?.city}, {weatherData?.location?.country}
            </p>
          </div>
        </div>
        
        {/* Right panel - Search, forecast and details */}
        <div className="md:col-span-8 p-6">
          {/* Location error notification */}
          {locationError && (
            <div className="mb-4 alert alert-warning flex justify-between items-center">
              <span>{locationError}</span>
              <button 
                onClick={retryGeolocation} 
                className="btn btn-sm btn-outline"
              >
                Retry
              </button>
            </div>
          )}
          
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
          
          {/* Current location button */}
          <div className="mb-4">
            <button 
              onClick={retryGeolocation} 
              className="btn btn-outline btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </button>
          </div>
          
          {/* 3-day forecast */}
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
          
          {/* Weather details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WindStatus 
              speed={weatherData?.current?.wind?.speed || 0} 
            />
            <HumidityStatus 
              humidity={weatherData?.current?.main?.humidity || 0} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}