#!/bin/bash
set -e

cd ~/zelenyeusy

echo "=== Обновление кода ==="
if [ -f ".env" ]; then
    echo "Создаем надежный бэкап .env..."
    cp .env .env.bak
else
    echo "WARN: Локальный .env не найден, бэкапить нечего."
fi

git fetch origin main
git reset --hard origin/main

if [ -f ".env.bak" ]; then
    echo "Восстанавливаем .env из бэкапа..."
    mv .env.bak .env
fi

echo "=== Сборка админки (React) ==="
cd back/frontend
npm ci
npm run build
cd ../..

echo "=== Проверка мониторинга ==="
if docker compose -f docker-compose.monitoring.yml --env-file .env.monitoring ps -q loki grafana alloy | grep -q .; then
  echo "Мониторинг уже запущен."
else
  echo "WARN: Мониторинг не запущен."
  echo "Запустить вручную: docker compose -f docker-compose.monitoring.yml --env-file .env.monitoring up -d"
fi

echo "=== Перезапуск Docker-сервисов ==="
docker compose -f docker-compose.yml up -d --build

echo "=== Очистка старых образов ==="
docker image prune -f
