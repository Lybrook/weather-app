# Weather App

This repository contains the full Weather App project, including both frontend and backend components.

## Live Demo

Try the live Weather App frontend here:  
[Weather App](https://weather-piebvskjx-lybrooks-projects.vercel.app/)

---

## Frontend

### About

Modern weather dashboard built with Next.js, React, and TypeScript. Search weather by city, view current conditions, 3-day forecast, and detailed metrics.

### Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- rippleui
- PostCSS

### Features

- City search
- Current weather display with icons
- Temperature unit toggle (Celsius/Fahrenheit)
- 3-day forecast
- Wind speed and humidity details
- Responsive UI

### Getting Started

Prerequisites:

- Node.js 16+
- Yarn

Install dependencies and run:

```bash
cd frontend
yarn install
yarn dev
```

Open http://localhost:3000 to view.

---

## Backend

### About

Backend API built with Laravel 10 and PHP 8.1+. Provides RESTful endpoints for weather data and user management with authentication.

### Tech Stack

- PHP 8.1+
- Laravel 10
- MySQL or other DB
- Redis
- Docker
- Composer

### Features

- Weather data API endpoints
- User authentication with Sanctum
- Database migrations and seeders
- Queue management
- Caching with Redis
- Dockerized deployment

### Getting Started

Prerequisites:

- PHP 8.1+
- Composer
- Docker (optional)

Install dependencies and run:

```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

Open http://localhost:8000 to view.

---

## License

MIT License

## Contact

Project Maintainer - omoshlybrook@gmail.com.com
