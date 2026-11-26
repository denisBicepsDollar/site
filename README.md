# Зелёные усы — zelenyeusy.ru

Монорепо (npm workspaces): витрина Next.js, админка, API, статический легаси-магазин и общий UI-кит.

## Структура

| Каталог | Что это |
|---|---|
| `apps/web` | Витрина (Next.js 16), порт **3001** |
| `apps/admin` | Админ-панель (React + Vite), порт **5173** |
| `apps/api` | Backend (Express + Drizzle + PostgreSQL), порт **3000** |
| `apps/shop` | Легаси-магазин на чистом HTML/CSS/JS, раздаётся nginx |
| `packages/ui` | Общий UI-кит `@site/ui` |
| `infra/` | nginx-конфиги, бэкап БД, мониторинг (Grafana/Loki/Alloy) |

## Требования

- Node.js >= 22.13, npm >= 10
- PostgreSQL 15 (для API)

## Быстрый старт (локальная разработка)

```bash
npm install

# PostgreSQL, например:
docker run -d --name zelenyeusy-db \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=zelenyeusy -p 5432:5432 postgres:15-alpine

# схема + данные: infra/db-init/backup.sql
docker exec -i zelenyeusy-db psql -U postgres -d zelenyeusy < infra/db-init/backup.sql
```

Дальше — три терминала:

```bash
npm run dev:api    # http://localhost:3000
npm run dev:web    # http://localhost:3001
npm run dev:admin  # http://localhost:5173
```

API читает `.env` из своего каталога: `cp .env.example apps/api/.env`
(нужны `CONNECTION_STRING` и `SECRET_KEY`).

Подробнее по каждому сервису — в `apps/*/README.md`.

## Проверки

```bash
npm run lint   # eslint во всех workspace
npm test       # architecture + UI-кит + API (тесты API не требуют БД)
npm run build  # сборка всех workspace
```

## Docker / продакшен

- `docker-compose.yml` + `docker-compose.dev.yml` — nginx, api, db, certbot (пути рассчитаны на раскладку сервера).
- `docker-compose.monitoring.yml` — Grafana/Loki/Alloy, нужен `.env.monitoring` (см. `.env.monitoring.example`).
- Деплой на сервер: `deploy.sh` (запускается CI при пуше в `main`).
