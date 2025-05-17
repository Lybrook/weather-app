FROM dunglas/frankenphp:php8.4-bookworm

# Install required PHP extensions for Laravel and Octane
RUN install-php-extensions pdo_mysql redis zip opcache intl pcntl

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies in production mode
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Set environment variables for production and Render
ENV SERVER_NAME=:8080
ENV APP_ENV=production
ENV APP_DEBUG=false

# Run Laravel Octane with FrankenPHP
CMD ["php", "artisan", "octane:frankenphp"]