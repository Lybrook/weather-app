<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    protected string $apiKey;
    protected string $geoBaseUrl = 'http://api.openweathermap.org/geo/1.0/direct';
    protected string $weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    protected string $forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY');
    }

    /**
     * Get weather data by city name
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getWeatherByCity(Request $request): JsonResponse
    {
        $request->validate([
            'city' => 'required|string|max:255',
            'units' => 'sometimes|string|in:metric,imperial,standard',
        ]);

        $city = $request->query('city');
        $units = $request->query('units', 'metric');

        try {
            // Step 1: Geocode the city name to get coordinates
            $geoData = $this->geocodeCity($city);

            if (empty($geoData)) {
                return response()->json(['error' => 'City not found'], 404);
            }

            $lat = $geoData[0]['lat'];
            $lon = $geoData[0]['lon'];

            // Step 2: Fetch current weather data
            $weatherData = $this->getCurrentWeather($lat, $lon, $units);
            
            // Step 3: Fetch forecast data
            $forecastData = $this->getForecast($lat, $lon, $units);

            // Return combined data
            return response()->json([
                'current' => $weatherData,
                'forecast' => $forecastData,
                'location' => [
                    'city' => $geoData[0]['name'],
                    'country' => $geoData[0]['country'] ?? null,
                    'lat' => $lat,
                    'lon' => $lon,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get weather by coordinates
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getWeatherByCoordinates(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'sometimes|string|in:metric,imperial,standard',
        ]);

        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        try {
            // Fetch current weather data
            $weatherData = $this->getCurrentWeather($lat, $lon, $units);
            
            // Fetch forecast data
            $forecastData = $this->getForecast($lat, $lon, $units);

            // Reverse geocoding to get city name
            $locationInfo = $this->reverseGeocode($lat, $lon);

            return response()->json([
                'current' => $weatherData,
                'forecast' => $forecastData,
                'location' => $locationInfo
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Geocode a city name to get coordinates
     * 
     * @param string $city
     * @return array
     */
    protected function geocodeCity(string $city): array
    {
        $response = Http::get($this->geoBaseUrl, [
            'q' => $city,
            'limit' => 1,
            'appid' => $this->apiKey
        ]);

        return $response->json() ?? [];
    }

    /**
     * Get current weather data by coordinates
     * 
     * @param float $lat
     * @param float $lon
     * @param string $units
     * @return array
     */
    protected function getCurrentWeather(float $lat, float $lon, string $units): array
    {
        $response = Http::get($this->weatherBaseUrl, [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $units,
            'appid' => $this->apiKey
        ]);

        return $response->json() ?? [];
    }

    /**
     * Get weather forecast by coordinates
     * 
     * @param float $lat
     * @param float $lon
     * @param string $units
     * @return array
     */
    protected function getForecast(float $lat, float $lon, string $units): array
    {
        $response = Http::get($this->forecastBaseUrl, [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $units,
            'appid' => $this->apiKey
        ]);

        return $response->json() ?? [];
    }

    /**
     * Reverse geocode coordinates to get location info
     * 
     * @param float $lat
     * @param float $lon
     * @return array
     */
    protected function reverseGeocode(float $lat, float $lon): array
    {
        $reverseGeoUrl = 'http://api.openweathermap.org/geo/1.0/reverse';
        
        $response = Http::get($reverseGeoUrl, [
            'lat' => $lat,
            'lon' => $lon,
            'limit' => 1,
            'appid' => $this->apiKey
        ]);

        $data = $response->json() ?? [];
        
        if (empty($data)) {
            return [
                'city' => 'Unknown',
                'country' => 'Unknown',
                'lat' => $lat,
                'lon' => $lon
            ];
        }

        return [
            'city' => $data[0]['name'] ?? 'Unknown',
            'country' => $data[0]['country'] ?? 'Unknown',
            'lat' => $lat,
            'lon' => $lon
        ];
    }
}