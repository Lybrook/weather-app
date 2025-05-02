#!/bin/bash

# Exit on error
set -e

# Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Set up environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
php artisan migrate --force

# Optimize
php artisan optimize

# Set permissions
chmod -R 755 storage bootstrap/cache