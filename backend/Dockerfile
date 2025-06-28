# Use the official FrankenPHP image for Laravel Octane
FROM dunglas/frankenphp

WORKDIR /app

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy the rest of the application
COPY . .

# Set permissions for storage and bootstrap/cache
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Expose port 8080 for Render
EXPOSE 8080

# Run Laravel Octane with FrankenPHP
CMD ["frankenphp", "serve", "--port=8080", "--worker", "--config=/app/frankenphp.yaml"]