FROM dunglas/frankenphp:1.1-builder-php8.2.16

# Image config
ENV SKIP_COMPOSER=1
ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

# Laravel config
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1
# Set Caddy server name to "http://" to serve on 80 and not 443
# Read more: https://frankenphp.dev/docs/config/#environment-variables
ENV SERVER_NAME="http://"

# Install dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    git \
    unzip \
    librabbitmq-dev \
    libpq-dev \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN install-php-extensions \
    gd \
    pcntl \
    opcache \
    pdo \
    pdo_mysql \
    redis

# Copy composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Copy PHP and supervisor config
COPY ./.docker/php/php.ini /usr/local/etc/php/
COPY ./.docker/etc/supervisor.d/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install PHP extensions
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Install Laravel dependencies
RUN composer install --no-dev --prefer-dist

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose ports
EXPOSE 80 443

# Start Supervisor
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
# Start Caddy server
# For Render, override the default CMD to use /start.sh
CMD ["/start.sh"]