# Backend Laravel API

## :star2: About the Project

This is the backend API for the weather application, built with Laravel 10 and PHP 8.1+. It provides RESTful endpoints for weather data and user management, including authentication using Laravel Sanctum. The backend supports database migrations, caching, queues, and integrates with external APIs.

## :space_invader: Tech Stack

- PHP 8.1+
- Laravel Framework 10
- MySQL (or other supported databases)
- Redis (for caching and queues)
- Docker (for containerized deployment)
- Composer (PHP dependency manager)

## :dart: Features

- RESTful API endpoints for weather data
- User authentication and authorization with Laravel Sanctum
- Database migrations and seeders
- Queue management for background jobs
- Caching with Redis
- Dockerized environment for easy deployment

## :key: Environment Variables

The following environment variables are required in your `.env` file:

- `APP_NAME` - Application name
- `APP_ENV` - Application environment (local, production, etc.)
- `APP_KEY` - Application encryption key
- `APP_DEBUG` - Debug mode (true/false)
- `APP_URL` - Application URL

- `DB_CONNECTION` - Database connection type (mysql, pgsql, etc.)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

- `CACHE_DRIVER` - Cache driver (file, redis, etc.)
- `SESSION_DRIVER` - Session driver
- `QUEUE_CONNECTION` - Queue connection driver

- `REDIS_HOST` - Redis host
- `REDIS_PASSWORD` - Redis password
- `REDIS_PORT` - Redis port

- `MAIL_MAILER` - Mail driver (smtp, sendmail, etc.)
- `MAIL_HOST` - Mail server host
- `MAIL_PORT` - Mail server port
- `MAIL_USERNAME` - Mail username
- `MAIL_PASSWORD` - Mail password
- `MAIL_ENCRYPTION` - Mail encryption (tls, ssl)

- `OPENWEATHER_API_KEY` - API key for OpenWeather integration

## :cloud: Weather API Endpoints

The backend provides RESTful API endpoints to fetch current weather and forecast data using the OpenWeather API. The main controller handling these endpoints is `WeatherController`.

### Endpoints

- `GET /api/weather/city?city={city_name}&units={units}`  
  Fetches current weather and forecast data for a given city name.  
  - Query Parameters:  
    - `city` (required): Name of the city (string)  
    - `units` (optional): Units of measurement (`metric`, `imperial`, or `standard`). Default is `metric`.  
  - Response: JSON object containing current weather, forecast, and location details.

- `GET /api/weather/coordinates?lat={latitude}&lon={longitude}&units={units}`  
  Fetches current weather and forecast data for given geographic coordinates.  
  - Query Parameters:  
    - `lat` (required): Latitude (numeric)  
    - `lon` (required): Longitude (numeric)  
    - `units` (optional): Units of measurement (`metric`, `imperial`, or `standard`). Default is `metric`.  
  - Response: JSON object containing current weather, forecast, and location details.

### Features

- Uses OpenWeather's Geocoding API to convert city names to coordinates.
- Fetches current weather and 5-day forecast data from OpenWeather.
- Supports unit selection for temperature and other measurements.
- Reverse geocoding to get city and country information from coordinates.

### Environment Variable

- `OPENWEATHER_API_KEY` must be set in the `.env` file to authenticate requests to the OpenWeather API.

## :toolbox: Getting Started

### :bangbang: Prerequisites

- PHP 8.1 or higher
- Composer
- Docker (optional, for containerized deployment)

### :gear: Installation

Clone the repository:

```bash
git clone <repository-url>
cd backend
```

Run the build script to install dependencies, set up environment, and migrate the database:

```bash
./build.sh
```

Alternatively, you can run the commands manually:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### :test_tube: Running Tests

Run the test suite with PHPUnit:

```bash
./vendor/bin/phpunit
```

### :running: Run Locally

To run the backend server locally, use the built-in Laravel server:

```bash
php artisan serve
```

The server will start at http://localhost:8000 by default.

### :triangular_flag_on_post: Deployment

The backend can be deployed using Docker. Build and run the Docker container with:

```bash
docker build -t weather-backend .
docker run -p 80:80 weather-backend
```

The Dockerfile uses the `richarvey/nginx-php-fpm` image to serve the Laravel application.

## :eyes: Usage

This backend provides RESTful API endpoints for the weather application. Use the API to fetch weather data, manage users, and authenticate requests.

Example API endpoint:

```
GET /api/weather/today
```

## :compass: Roadmap

- [x] Implement weather data API endpoints
- [x] Add user authentication with Sanctum
- [ ] Add more detailed API documentation
- [ ] Implement background job processing with queues
- [ ] Add caching for improved performance

## :wave: Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## :scroll: Code of Conduct

Please adhere to the [Code of Conduct](https://laravel.com/docs/10.x/contributions#code-of-conduct) when contributing.

## :grey_question: FAQ

**Q:** What database systems are supported?  
**A:** MySQL, PostgreSQL, SQLite, and SQL Server are supported by Laravel.

**Q:** How do I get an API key for OpenWeather?  
**A:** Sign up at https://openweathermap.org/api to obtain an API key.

## :warning: License

This project is licensed under the MIT License.

## :handshake: Contact

Project Maintainer - email@example.com

## :gem: Acknowledgements

- [Laravel](https://laravel.com/)
- [Docker](https://www.docker.com/)
- [OpenWeather](https://openweathermap.org/)
- [PHP](https://www.php.net/)
