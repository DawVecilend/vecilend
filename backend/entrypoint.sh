#!/bin/sh
set -e

echo "⏳ Verificant dependències..."
[ -f vendor/autoload.php ] || composer install --no-interaction

echo "⏳ Esperant a la base de dades..."
DB_DSN="pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}"
until php -r "
  try {
    new PDO('${DB_DSN}', '${DB_USERNAME}', '${DB_PASSWORD}');
    exit(0);
  } catch (Exception \$e) {
    exit(1);
  }
" 2>/dev/null; do
  echo "   BD no disponible, reintentant en 3s..."
  sleep 3
done
echo "✅ Base de dades connectada"

echo "⏳ Generant APP_KEY si no existeix..."
php artisan key:generate --no-interaction 2>/dev/null || true

echo "⏳ Executant migracions..."
php artisan migrate --force

# Seed només si la BD està buida (primer arranc)
USER_COUNT=$(php -r "
  \$pdo = new PDO('${DB_DSN}', '${DB_USERNAME}', '${DB_PASSWORD}');
  echo \$pdo->query('SELECT count(*) FROM users')->fetchColumn();
" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  echo "⏳ Executant seeders (primer arranc)..."
  php artisan db:seed --force
  echo "✅ Seeders executats"
else
  echo "✅ BD ja conté dades, seeders omesos"
fi

echo "🚀 Arrancant servidor Laravel..."
php artisan serve --host=0.0.0.0 --port=8000
