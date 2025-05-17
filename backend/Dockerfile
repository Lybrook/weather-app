FROM dunglas/frankenphp:php8.4-bookworm

RUN install-php-extensions @composer

WORKDIR /app

COPY . .

RUN composer install \
  --ignore-platform-reqs \
  --optimize-autoloader \
  --prefer-dist \
  --no-interaction \
  --no-progress \
  --no-scripts