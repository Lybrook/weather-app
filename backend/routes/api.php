<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

Route::get('/weather/city', [WeatherController::class, 'getWeatherByCity']);
Route::get('/weather/coordinates', [WeatherController::class, 'getWeatherByCoordinates']);