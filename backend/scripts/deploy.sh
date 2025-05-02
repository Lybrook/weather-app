#!/bin/bash

# Navigate to the application directory
cd /var/www/html

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html/storage

# Run Laravel commands
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
