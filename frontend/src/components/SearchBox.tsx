"use client";

import React, { useState } from 'react';
import { searchCity } from '@/utils/weatherApi';
import { GeocodingResult } from '@/types/weather';
import { useWeather } from '@/context/WeatherContext';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setCity } = useWeather();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const data = await searchCity(query);
      setResults(data);
    } catch (error) {
      console.error('Error searching for city:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = (city: GeocodingResult) => {
    setCity(city);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city name..."
          className="input input-primary flex-grow"
          disabled={isSearching}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Search'
          )}
        </button>
      </form>
      
      {results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <li 
                key={`${result.lat}-${result.lon}-${index}`}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCity(result)}
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-gray-500">
                  {result.state ? `${result.state}, ` : ''}{result.country}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
