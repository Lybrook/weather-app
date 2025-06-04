#!/bin/bash

# Run database migrations
php artisan migrate --force

# Cache configuration and routes
php artisan config:cache
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Optimize the application
php artisan optimize