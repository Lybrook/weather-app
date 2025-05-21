<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

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

Route::middleware('api')->group(function () {
    Route::get('/geocoding', [WeatherController::class, 'geocoding']);
    Route::get('/weather/current', [WeatherController::class, 'currentWeather']);
    Route::get('/weather/forecast', [WeatherController::class, 'forecast']);
});