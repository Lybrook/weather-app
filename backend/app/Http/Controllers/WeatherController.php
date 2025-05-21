<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY', 'YOUR_API_KEY');
        $this->baseUrl = 'http://api.openweathermap.org';
    }

    public function geocoding(Request $request)
    {
        $request->validate([
            'city' => 'required|string|max:255',
        ]);

        $city = $request->input('city');
        $limit = $request->input('limit', 5);

        try {
            $response = Http::get("{$this->baseUrl}/geo/1.0/direct", [
                'q' => $city,
                'limit' => $limit,
                'appid' => $this->apiKey,
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch geocoding data'], 500);
        }
    }

    public function currentWeather(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'nullable|string|in:standard,metric,imperial',
        ]);

        $lat = $request->input('lat');
        $lon = $request->input('lon');
        $units = $request->input('units', 'metric');

        try {
            $response = Http::get("{$this->baseUrl}/data/2.5/weather", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch current weather data'], 500);
        }
    }

    public function forecast(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'units' => 'nullable|string|in:standard,metric,imperial',
        ]);

        $lat = $request->input('lat');
        $lon = $request->input('lon');
        $units = $request->input('units', 'metric');

        try {
            $response = Http::get("{$this->baseUrl}/data/2.5/forecast", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch forecast data'], 500);
        }
    }
}