<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY', '');
        $this->baseUrl = 'http://api.openweathermap.org/';
    }

    /**
     * Get current weather for a location
     */
    public function current(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'nullable|in:metric,imperial',
        ]);

        $lat = $request->lat;
        $lon = $request->lon;
        $units = $request->units ?? 'metric';

        try {
            $response = Http::get($this->baseUrl . 'data/2.5/weather', [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'location' => [
                            'name' => $data['name'],
                            'country' => $data['sys']['country'] ?? '',
                        ],
                        'current' => [
                            'dt' => $data['dt'],
                            'temp' => $data['main']['temp'],
                            'feels_like' => $data['main']['feels_like'],
                            'humidity' => $data['main']['humidity'],
                            'wind_speed' => $data['wind']['speed'],
                            'wind_deg' => $data['wind']['deg'],
                            'weather' => $data['weather'][0] ?? null,
                        ],
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'WEATHER_ERROR',
                    'message' => 'Failed to fetch weather data: ' . ($response->json()['message'] ?? 'Unknown error'),
                ],
            ], 500);
        } catch (\Exception $e) {
            Log::error('Weather API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'SERVER_ERROR',
                    'message' => 'An error occurred while fetching weather data',
                ],
            ], 500);
        }
    }

    /**
     * Get forecast weather for a location
     */
    public function forecast(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'nullable|in:metric,imperial',
            'days' => 'nullable|integer|min:1|max:7',
        ]);

        $lat = $request->lat;
        $lon = $request->lon;
        $units = $request->units ?? 'metric';
        $days = $request->days ?? 3;

        try {
            $response = Http::get($this->baseUrl . 'data/2.5/forecast/daily', [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'cnt' => $days,
                'appid' => $this->apiKey,
            ]);

            // If the daily forecast endpoint fails, try the 5-day/3-hour forecast and convert it
            if (!$response->successful()) {
                return $this->getForecastFromHourly($lat, $lon, $units, $days);
            }

            $data = $response->json();
            $forecastData = [];

            foreach ($data['list'] as $day) {
                $forecastData[] = [
                    'dt' => $day['dt'],
                    'temp' => [
                        'day' => $day['temp']['day'],
                        'min' => $day['temp']['min'],
                        'max' => $day['temp']['max'],
                    ],
                    'humidity' => $day['humidity'],
                    'wind_speed' => $day['speed'],
                    'wind_deg' => $day['deg'],
                    'weather' => $day['weather'][0] ?? null,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'location' => [
                        'name' => $data['city']['name'],
                        'country' => $data['city']['country'] ?? '',
                    ],
                    'forecast' => $forecastData,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Weather Forecast API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'SERVER_ERROR',
                    'message' => 'An error occurred while fetching forecast data',
                ],
            ], 500);
        }
    }

    /**
     * Get forecast from 5-day/3-hour forecast and convert to daily
     */
    private function getForecastFromHourly($lat, $lon, $units, $days)
    {
        try {
            $response = Http::get($this->baseUrl . 'data/2.5/forecast', [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'WEATHER_ERROR',
                        'message' => 'Failed to fetch forecast data: ' . ($response->json()['message'] ?? 'Unknown error'),
                    ],
                ], 500);
            }

            $data = $response->json();
            $dailyForecasts = [];
            $currentDay = null;
            $dayData = [];

            // Group by day
            foreach ($data['list'] as $item) {
                $date = date('Y-m-d', $item['dt']);
                
                if ($currentDay !== $date) {
                    if ($currentDay !== null && count($dayData) > 0) {
                        // Process previous day
                        $dailyForecasts[] = $this->processDayData($dayData);
                        
                        // If we have enough days, break
                        if (count($dailyForecasts) >= $days) {
                            break;
                        }
                    }
                    
                    $currentDay = $date;
                    $dayData = [];
                }
                
                $dayData[] = $item;
            }
            
            // Process the last day if needed
            if (count($dayData) > 0 && count($dailyForecasts) < $days) {
                $dailyForecasts[] = $this->processDayData($dayData);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'location' => [
                        'name' => $data['city']['name'],
                        'country' => $data['city']['country'] ?? '',
                    ],
                    'forecast' => $dailyForecasts,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Weather Forecast API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'SERVER_ERROR',
                    'message' => 'An error occurred while processing forecast data',
                ],
            ], 500);
        }
    }

    /**
     * Process hourly data into a daily summary
     */
    private function processDayData($dayData)
    {
        $temps = array_column(array_map(function($item) {
            return $item['main']['temp'];
        }, $dayData), null);
        
        $minTemp = min($temps);
        $maxTemp = max($temps);
        $avgTemp = array_sum($temps) / count($temps);
        
        // Use noon data or the middle of the day for representative weather
        $middleIndex = floor(count($dayData) / 2);
        $representativeData = $dayData[$middleIndex];
        
        return [
            'dt' => $representativeData['dt'],
            'temp' => [
                'day' => $avgTemp,
                'min' => $minTemp,
                'max' => $maxTemp,
            ],
            'humidity' => $representativeData['main']['humidity'],
            'wind_speed' => $representativeData['wind']['speed'],
            'wind_deg' => $representativeData['wind']['deg'],
            'weather' => $representativeData['weather'][0] ?? null,
        ];
    }
}
