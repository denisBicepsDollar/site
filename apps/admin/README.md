# Админ-панель (apps/admin)

React 19 + Vite, порт **5173**. Управление товарами, заказами, сообщениями и настройками.

## Запуск

```bash
npm run dev     # из корня: npm run dev:admin  -> http://localhost:5173
npm run build   # vite build -> dist/
npm run lint
```

Vite-прокси направляет `/api`, `/auth`, `/uploads` на API
(по умолчанию `http://127.0.0.1:3000`, переопределяется `API_PROXY_TARGET`).
Поэтому для работы нужен запущенный `npm run dev:api`.

## Маршруты

`/login` — авторизация (cookie-сессия через `/auth/v1/login`),
`/dashboard` — продукты, заказы, сообщения, настройки.
