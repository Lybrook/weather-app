# Use the official FrankenPHP image
FROM dunglas/frankenphp

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Composer dependencies
RUN composer install --optimize-autoloader --no-dev

# Generate Laravel key if not set
RUN if [ ! -f .env ]; then cp .env.example .env; fi && \
    php artisan key:generate --force

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port 80 (FrankenPHP default)
EXPOSE 80

# Use the default FrankenPHP entrypoint
CMD ["frankenphp", "serve", "--config=/app/frankenphp.yaml"]