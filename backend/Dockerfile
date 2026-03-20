FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar primer composer.json/lock per aprofitar la cache de Docker
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts

COPY . .

EXPOSE 8000

CMD sh -c "\
  [ -f vendor/autoload.php ] || composer install --no-interaction; \
  php artisan key:generate --no-interaction 2>/dev/null || true; \
  php artisan migrate --force 2>/dev/null || true; \
  php artisan serve --host=0.0.0.0 --port=8000"
