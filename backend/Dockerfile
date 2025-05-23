FROM dunglas/frankenphp

RUN install-php-extensions \
    pdo \
    gd \
    intl \
    zip \
    opcache

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /app

RUN composer install --no-interaction --no-scripts --no-suggest

RUN php artisan route:cache

# Line below needed otherwise build exits with a permissions error
RUN setcap -r /usr/local/bin/frankenphp
