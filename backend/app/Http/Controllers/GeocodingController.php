<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingController extends Controller
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY', '');
        $this->baseUrl = 'http://api.openweathermap.org/';
    }

    /**
     * Search for cities by name
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'limit' => 'nullable|integer|min:1|max:10',
        ]);

        $query = $request->query('query');
        $limit = $request->query('limit', 5);

        try {
            $response = Http::get($this->baseUrl . 'geo/1.0/direct', [
                'q' => $query,
                'limit' => $limit,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $cities = $response->json();
                $formattedCities = [];

                foreach ($cities as $city) {
                    $formattedCities[] = [
                        'name' => $city['name'],
                        'country' => $city['country'] ?? '',
                        'state' => $city['state'] ?? '',
                        'lat' => $city['lat'],
                        'lon' => $city['lon'],
                    ];
                }

                return response()->json([
                    'success' => true,
                    'data' => $formattedCities,
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'GEOCODING_ERROR',
                    'message' => 'Failed to fetch geocoding data: ' . ($response->json()['message'] ?? 'Unknown error'),
                ],
            ], 500);
        } catch (\Exception $e) {
            Log::error('Geocoding API error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'SERVER_ERROR',
                    'message' => 'An error occurred while fetching geocoding data',
                ],
            ], 500);
        }
    }
}
