// routes/api.php
use App\Http\Controllers\WeatherController;

Route::get('/weather/city', [WeatherController::class, 'getWeatherByCity']);
Route::get('/weather/coordinates', [WeatherController::class, 'getWeatherByCoordinates']);