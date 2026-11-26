# API (apps/api)

Backend магазина: Express 5 + Drizzle ORM + PostgreSQL, порт **3000**.

## Запуск

```bash
# нужен PostgreSQL и переменные окружения
cp .env.example .env   # заполни CONNECTION_STRING и SECRET_KEY

npm run dev     # из корня: npm run dev:api
```

Другие команды (из корня: `npm run <cmd> --workspace api`):

```bash
npm run build   # tsup -> dist/server.js
npm start       # node dist/server.js
npm run lint
npm test        # тесты не требуют живой БД
```

## Окружение

| Переменная | Назначение |
|---|---|
| `CONNECTION_STRING` | строка подключения к PostgreSQL (обязательна) |
| `SECRET_KEY` | секрет для JWT (обязательна) |
| `NODE_ENV`, `LOG_LEVEL`, `SERVICE_NAME` | режим, логи, имя сервиса |

## Эндпоинты

- Публичные: `GET /api/v1/products*`, `POST /api/v1/orders`, `POST /api/v1/contacts`
- Админка (cookie `token`): `/api/v1/admin/*` — товары, заказы, сообщения
- Auth: `POST /auth/v1/login`, `POST /auth/v1/logout`, `GET /auth/v1/validation`
- Health: `GET /health`, `GET /health/ping`

Схема БД: `drizzle/schema.ts`, миграции: `drizzle/` (drizzle-kit, `drizzle.config.ts`).
