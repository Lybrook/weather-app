'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, City, TemperatureUnit } from '@/types';

interface AppContextProps {
  state: AppState;
  setSelectedCity: (city: City | null) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: AppState = {
  selectedCity: null,
  temperatureUnit: 'metric',
  isLoading: false,
  error: null,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Load saved preferences from localStorage on client side
  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit && (savedUnit === 'metric' || savedUnit === 'imperial')) {
      setState(prev => ({ ...prev, temperatureUnit: savedUnit as TemperatureUnit }));
    }
    
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      try {
        const city = JSON.parse(savedCity);
        setState(prev => ({ ...prev, selectedCity: city }));
      } catch (e) {
        console.error('Failed to parse saved city', e);
      }
    }
  }, []);

  const setSelectedCity = (city: City | null) => {
    setState(prev => ({ ...prev, selectedCity: city }));
    if (city) {
      localStorage.setItem('selectedCity', JSON.stringify(city));
    } else {
      localStorage.removeItem('selectedCity');
    }
  };

  const setTemperatureUnit = (unit: TemperatureUnit) => {
    setState(prev => ({ ...prev, temperatureUnit: unit }));
    localStorage.setItem('temperatureUnit', unit);
  };

  const setIsLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setSelectedCity,
        setTemperatureUnit,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
