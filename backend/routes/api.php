<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Weather API endpoints
Route::prefix('weather')->group(function () {
    // Geocoding endpoint
    Route::get('/geocode', [WeatherController::class, 'geocode']);
    
    // Current weather endpoint
    Route::get('/current', [WeatherController::class, 'currentWeather']);
    
    // Weather forecast endpoint
    Route::get('/forecast', [WeatherController::class, 'forecast']);
    
    // All weather data at once (geocoding + current + forecast)
    Route::get('/all', [WeatherController::class, 'allWeatherData']);
});