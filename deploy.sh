#!/bin/bash
set -e

cd ~/zelenyeusy

echo "=== Обновление кода ==="
cp .env.dev /tmp/.env.dev.backup 2>/dev/null || true

git fetch origin main
git reset --hard origin/main

cp /tmp/.env.dev.backup .env.dev 2>/dev/null || echo "WARN: .env не найден в бэкапе!"

echo "=== Сборка админки (React) ==="
cd back/frontend
npm ci
npm run build
cd ../..

echo "=== Перезапуск Docker-сервисов ==="
docker compose -f docker-compose.yml up -d --build

echo "=== Очистка старых образов ==="
docker image prune -f
