FROM dunglas/frankenphp:php8.4-bookworm

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /app

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Install Laravel Octane
RUN composer require laravel/octane --no-interaction

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache


# Expose port
EXPOSE 8000

# Start FrankenPHP with Octane
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=${PORT:-8000}"]
