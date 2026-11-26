# Витрина (apps/web)

Публичный магазин на Next.js 16 (App Router), порт **3001**.

## Запуск

```bash
npm run dev     # из корня: npm run dev:web  -> http://localhost:3001
npm run build   # продакшен-сборка
npm start
npm run lint
```

Витрина ходит в API через server-side прокси (`src/app/api/*`), поэтому нужен запущенный API:

```bash
BACKEND_URL=http://localhost:3000   # по умолчанию http://localhost:3000
```

## Окружение

| Переменная | Назначение |
|---|---|
| `BACKEND_URL` | адрес API для server-side запросов |
| `NEXT_PUBLIC_SITE_URL` / `SITE_URL` | базовый URL сайта (по умолчанию https://zelenyeusy.ru) |
| `NEXT_PUBLIC_DADATA_TOKEN` | токен DaData для подсказок адреса |
| `NEXT_PUBLIC_POCHTA_WIDGET_ID` | виджет Почты России |

## Структура

`src/app` — роуты (/, /products, /product/[slug], /cart, /about, /contact, /blog),
`src/pages-flat` — экраны страниц, `src/widgets`, `src/features`, `src/entities`, `src/shared`.
