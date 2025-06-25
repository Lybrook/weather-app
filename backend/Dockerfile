# Use the official FrankenPHP image
FROM dunglas/frankenphp

WORKDIR /app

COPY . .
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Install Composer dependencies (production only)
RUN composer install --optimize-autoloader --no-dev

# Generate Laravel key if not set (for local, not used on Render)
RUN if [ ! -f .env ]; then cp .env.example .env; fi && \
    php artisan key:generate --force

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["frankenphp", "serve", "--config=/app/frankenphp.yaml"]
