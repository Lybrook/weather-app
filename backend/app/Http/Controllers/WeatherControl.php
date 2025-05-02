<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    /**
     * The OpenWeatherMap API key
     * 
     * @var string
     */
    protected $apiKey;

    /**
     * Base URLs for OpenWeatherMap APIs
     * 
     * @var array
     */
    protected $apiUrls = [
        'geocoding' => 'http://api.openweathermap.org/geo/1.0/direct',
        'weather' => 'https://api.openweathermap.org/data/2.5/weather',
        'forecast' => 'https://api.openweathermap.org/data/2.5/forecast',
    ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY');
    }

    /**
     * Get geocoding data for a city
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function geocode(Request $request): JsonResponse
    {
        $request->validate([
            'city' => 'required|string|max:100',
            'limit' => 'sometimes|integer|min:1|max:5',
        ]);

        $city = $request->city;
        $limit = $request->limit ?? 1;
        
        try {
            $response = Http::get($this->apiUrls['geocoding'], [
                'q' => $city,
                'limit' => $limit,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Error fetching geocoding data',
                'details' => $response->json(),
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch geocoding data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current weather data by coordinates
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function currentWeather(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'sometimes|string|in:standard,metric,imperial',
        ]);

        $lat = $request->lat;
        $lon = $request->lon;
        $units = $request->units ?? 'metric';

        try {
            $response = Http::get($this->apiUrls['weather'], [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Error fetching weather data',
                'details' => $response->json(),
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch weather data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get forecast data by coordinates
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forecast(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'sometimes|string|in:standard,metric,imperial',
            'cnt' => 'sometimes|integer|min:1|max:40',
        ]);

        $lat = $request->lat;
        $lon = $request->lon;
        $units = $request->units ?? 'metric';
        $cnt = $request->cnt ?? 40; // Number of timestamps to return

        try {
            $response = Http::get($this->apiUrls['forecast'], [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'cnt' => $cnt,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'error' => 'Error fetching forecast data',
                'details' => $response->json(),
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch forecast data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all weather data in a single request (geocoding, current weather and forecast)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function allWeatherData(Request $request): JsonResponse
    {
        $request->validate([
            'city' => 'required|string|max:100',
            'units' => 'sometimes|string|in:standard,metric,imperial',
        ]);

        $city = $request->city;
        $units = $request->units ?? 'metric';

        try {
            // First get geocoding data
            $geocodingResponse = Http::get($this->apiUrls['geocoding'], [
                'q' => $city,
                'limit' => 1,
                'appid' => $this->apiKey,
            ]);

            if (!$geocodingResponse->successful() || empty($geocodingResponse->json())) {
                return response()->json([
                    'error' => 'City not found or geocoding failed',
                    'details' => $geocodingResponse->json(),
                ], $geocodingResponse->status());
            }

            $geocodingData = $geocodingResponse->json()[0];
            $lat = $geocodingData['lat'];
            $lon = $geocodingData['lon'];

            // Get current weather
            $weatherResponse = Http::get($this->apiUrls['weather'], [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            // Get forecast
            $forecastResponse = Http::get($this->apiUrls['forecast'], [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if (!$weatherResponse->successful() || !$forecastResponse->successful()) {
                return response()->json([
                    'error' => 'Error fetching weather or forecast data',
                ], 500);
            }

            // Return all data together
            return response()->json([
                'geocoding' => $geocodingData,
                'current' => $weatherResponse->json(),
                'forecast' => $forecastResponse->json(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch weather data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}