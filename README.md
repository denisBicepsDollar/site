# Зелёные усы (`zelenyeusy.ru`)

Монорепозиторий (npm workspaces): витрина Next.js, админ-панель, API, статический легаси-магазин и общий UI-кит.

## Структура

| Каталог | Что это |
|---|---|
| `apps/web` | Витрина (Next.js 16), порт **3001** |
| `apps/admin` | Админ-панель (React + Vite), порт **5173** |
| `apps/api` | Backend (Express 5 + Drizzle ORM + PostgreSQL), порт **3000** |
| `apps/shop` | Легаси-магазин на HTML/CSS/JS (раздаётся nginx) |
| `packages/ui` | Общий UI-кит `@site/ui` |
| `infra/` | SQL-инициализация БД (`infra/db-init/`), конфиги nginx и мониторинга |

Подробнее по каждому сервису — в `apps/*/README.md`.

---

## Требования

- **Node.js** `>= 22.13.0` и **npm** `>= 10`
- **PostgreSQL** `15+` (локально или в Docker-контейнере)

---

## 1. Установка зависимостей и настройка `.env`

```bash
npm install
cp .env.example .env
```

При необходимости отредактируйте `.env` в корне репозитория (или `apps/api/.env`). Основные переменные для локального запуска:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DB=zelenyeusy

CONNECTION_STRING=postgres://postgres:12345@localhost:5432/zelenyeusy
SECRET_KEY=dev-secret-1234567890
LOG_LEVEL=debug
```

> `apps/api` и `drizzle-kit` автоматически подхватывают `.env` как из `apps/api/.env`, так и из корня репозитория.

---

## 2. Подготовка PostgreSQL

Выберите один из двух способов:

### Вариант A: Локальный PostgreSQL

Убедитесь, что локальный сервер PostgreSQL запущен на порту `5432`, а пользователь, пароль и база данных из `CONNECTION_STRING` существуют:

```bash
createdb -U postgres zelenyeusy
```

### Вариант B: PostgreSQL в Docker-контейнере

#### Вариант B1 — пустой контейнер (если далее будете заполнять и мигрировать вручную)

```bash
docker run -d \
  --name zelenyeusy-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=zelenyeusy \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Вариант B2 — контейнер с автоматической инициализацией из `infra/db-init`

При первом старте на пустом volume PostgreSQL автоматически выполнит `backup.sql` и `seed.sql`:

```bash
docker run -d \
  --name zelenyeusy-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=zelenyeusy \
  -p 5432:5432 \
  -v "$(pwd)/infra/db-init:/docker-entrypoint-initdb.d:ro" \
  postgres:15-alpine
```

---

## 3. Тестовые данные БД (`infra/db-init/`)

В `infra/db-init/` находятся два идемпотентных SQL-скрипта:

- `infra/db-init/backup.sql` — создание схем (`messages`, `orders`, `products`, `users`) и всех таблиц по актуальной схеме.
- `infra/db-init/seed.sql` — тестовое наполнение:
  - пользователь для входа в админку: логин `admin`, пароль `123`;
  - справочник русских названий категорий, подкатегорий и типов (`products.catalog_labels`);
  - 12 тестовых товаров (комнатные и садовые, статусы `active`, `draft`, `archived`), 23 варианта с ценами, скидками и остатками, изображения;
  - 4 тестовых заказа (`orders.orders` + `orders.order_items`);
  - 3 тестовых обращения из формы обратной связи (`messages.contacts`).

### Заполнение локальной БД (или контейнера без автоинициализации)

Если используете **локальный PostgreSQL**:

```bash
psql "postgres://postgres:12345@localhost:5432/zelenyeusy" \
  -f infra/db-init/backup.sql \
  -f infra/db-init/seed.sql
```

Если PostgreSQL запущен в **Docker-контейнере** (`zelenyeusy-db`) без монтирования `/docker-entrypoint-initdb.d`:

```bash
docker exec -i zelenyeusy-db psql -U postgres -d zelenyeusy < infra/db-init/backup.sql
docker exec -i zelenyeusy-db psql -U postgres -d zelenyeusy < infra/db-init/seed.sql
```

> При запуске контейнера по варианту **B2** оба скрипта выполняются автоматически. Повторный запуск `seed.sql` безопасен (`ON CONFLICT DO NOTHING`).

---

## 4. Миграции из `apps/api` в БД

Примените Drizzle-миграции из `apps/api/drizzle/` в базу данных (используется `CONNECTION_STRING` из `.env`):

```bash
npm run db:migrate --workspace=api
```

Или напрямую из директории `apps/api`:

```bash
cd apps/api
npx drizzle-kit migrate
```

Для быстрой синхронизации схемы при разработке также доступна команда:

```bash
npm run db:push --workspace=api
```

---

## 5. Запуск приложений для разработки

Запустите сервисы в отдельных терминалах из корня репозитория:

```bash
npm run dev:api    # http://localhost:3000
npm run dev:web    # http://localhost:3001
npm run dev:admin  # http://localhost:5173
```

- Проверка API: `http://localhost:3000/health/ping` и `http://localhost:3000/api/v1/products`
- Витрина: `http://localhost:3001`
- Админка: `http://localhost:5173` (логин `admin`, пароль `123`)

---

## 6. Опционально: мониторинг (`docker-compose.monitoring.yml`)

> **Важно:** работоспособность стека мониторинга (`alloy`, `loki`, `grafana`) ещё **не проверялась**.

Конфигурация находится в `docker-compose.monitoring.yml`. Перед запуском создайте файл окружения:

```bash
cp .env.monitoring.example .env.monitoring
```

Опциональный запуск:

```bash
docker compose -f docker-compose.monitoring.yml --env-file .env.monitoring up -d
```

Что стоит учитывать перед проверкой мониторинга:

- В `docker-compose.monitoring.yml` используется внешняя сеть `site_app-net` (при необходимости создаётся вручную: `docker network create site_app-net`).
- Grafana проброшена на `127.0.0.1:3001:3000`, поэтому при одновременном запуске с `npm run dev:web` (`http://localhost:3001`) будет конфликт порта `3001`.
- Файлы мониторинга в репозитории лежат в `infra/monitoring/`, а в `docker-compose.monitoring.yml` сейчас указаны пути `./monitoring/...` — перед реальным запуском их может потребоваться поправить.

---

## 7. Проверки и продакшен

```bash
npm run test:api              # тесты API и конфигов (не требуют живой БД)
npm run test:ui               # тесты @site/ui
npm run lint --workspace api  # линтер API
npm run lint --workspace admin # линтер админки
npm run build --workspace api  # сборка API
npm run build --workspace admin # сборка админки
```

- `docker-compose.yml` + `docker-compose.dev.yml` — nginx, api, db, certbot (пути рассчитаны на раскладку сервера).
- Деплой на сервер: `deploy.sh` (запускается CI при пуше в `main`).
