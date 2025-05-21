'use client';

import React, { useState, useEffect, useRef } from 'react';
import { City } from '@/types';
import { searchCities } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

const SearchBox = () => {
  const { state, setSelectedCity, setIsLoading, setError } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const cities = await searchCities(query);
        setResults(cities);
        setShowDropdown(true);
        setIsSearching(false);
      } catch (error) {
        console.error('Error searching cities:', error);
        setError('Failed to search cities. Please try again.');
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, setError]);

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="input-group">
        <input
          type="text"
          className="input input-primary w-full"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        <button className="btn btn-primary">
          {isSearching ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
          <ul className="menu menu-sm">
            {results.map((city, index) => (
              <li key={`${city.name}-${city.lat}-${city.lon}`}>
                <button
                  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSelectCity(city)}
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
