# Уровень 1 и 2 подробно: контракт-проверки и юнит-тесты

Дополнение к `docs/TESTING-PLAN.md`. Без кода — только цель, место и способ.
Все факты про файлы получены чтением/запуском кода в этом репозитории 2026-09-05.

---

## Часть 0. Тестопригодность: что я проверил запуском

Прежде чем планировать тесты, я импортировал каждый кандидат в голом Node 22 без всякой
подготовки. Результат определяет, сколько усилий стоит каждый тест.

**Фронт магазина (`shop/`):**

| Модуль | Импорт в голом Node | Вывод |
|---|---|---|
| `shop/cart/validation.js` | OK | тестируется без jsdom |
| `shop/shared/product-store.js` | OK | без jsdom |
| `shop/catalog/state.js` | OK | без jsdom |
| `shop/catalog/filters.js` | OK | без jsdom (но внутри рендерит DOM) |
| `shop/shared/product-card/render.js` | OK | без jsdom |
| `shop/cart/cart.js` | OK | нужен только стаб `localStorage` |
| `shop/contacts/validation.js` | OK | без jsdom |
| `shop/cart/checkout-step3/submit.js` | OK | нужен стаб `fetch` |
| `shop/cart/checkout-step3/summary.js` | OK | нужны стабы `els` |
| `shop/cart/utils.js` | **FAIL: `document is not defined`** | на строке 33 `document.getElementById` вызывается **на уровне модуля** |

Итог: 9 из 10 модулей тестируются **без jsdom вообще** — обычными объектами-заглушками.
jsdom нужен ровно для одного файла.

**Бэкенд (`back/server/`), два прогона — без переменных окружения и с ними:**

| Модуль | Без env | С `CATALOG_URL`/`REPORTS_URL`/`USERS_URL`/`SECRET_KEY` |
|---|---|---|
| `utils/ApiError.js` | OK | OK |
| `worker/generator/csv.js` | OK | OK |
| `middleware/errorHandler.js` | OK | OK |
| `middleware/rateLimiters.js` | OK | OK |
| `middleware/authHandler.js` | OK | OK |
| `services/Auth/authService.js` | FAIL: `Users database connection string is missing` | OK |
| `controllers/shopController.js` | FAIL: `Main database connection string is missing` | OK |
| `db/common/rowRepo.js` | FAIL | OK |
| `db/common/shopRepo.js` | FAIL | OK |
| `routes/routes.js` | FAIL | OK |

Итог: **половина бэкенда не импортируется без переменных окружения** — проверка
`if (!config.db.catalogConnectionString) throw` (`db/common/defaultClient.js:4-6`,
`db/auth/authClient.js:4-6`) выполняется в момент импорта модуля, то есть до старта любого
теста. Отсюда правило №1 ниже.

---

# УРОВЕНЬ 1 — контракт-проверки конфигов

## Цель

Ловить не «код сломался», а **«две части системы перестали договариваться»**. Именно так
сайт ложится на деплое: код рабочий, сборка зелёная, а переменная не передана или nginx не
проксирует путь. Такие дефекты не видны ни линтеру, ни сборке, ни review — только сверкой.

Уровень 1 не проверяет логику. Он проверяет четыре согласованности:
переменные окружения ↔ код, маршруты фронт ↔ API ↔ nginx, синтаксис nginx, валидность compose.

Цена: один вечер. Польза: закрывает находки №1 и №2 из основного плана навсегда.

---

## Проверка 1A. Переменные окружения: compose ↔ код

**Источник правды — код.** Все чтения `process.env` в `back/server/src` (grep даёт ровно 6):

| Переменная | Где читается | Обязательна? |
|---|---|---|
| `PORT` | `config/index.js` | нет, дефолт 3000 |
| `SECRET_KEY` | `config/index.js` | **да** для `/auth/*` |
| `CATALOG_URL` | `config/index.js` | **да**, иначе `defaultClient.js:5` бросает на импорте |
| `REPORTS_URL` | `config/index.js` | **да**, иначе `reportsClient.js:12` бросает |
| `USERS_URL` | `config/index.js` | **да**, иначе `authClient.js:5` бросает |
| `NODE_ENV` | `authController.js` (флаг `secure` у cookie), `errorHandler.js` (утечка стека) | нет, но важна |

**Что реально отдаёт compose сегодня:**

| Сервис | Отдаёт | Не хватает | Лишнее |
|---|---|---|---|
| `api` (строки 28–32) | `NODE_ENV`, `PORT`, `DATABASE_URL`, `REPORTS_URL` | `SECRET_KEY`, `CATALOG_URL`, `USERS_URL` | `DATABASE_URL` — не читается нигде |
| `worker` (строки 78–80) | `NODE_ENV`, `REPORTS_URL` | `CATALOG_URL` (нужен: `reportService` → `rowRepo` → `defaultClient`) | — |

**Как сделать (по шагам):**

1. Тест живёт в `back/server/tests/config/compose-env.test.js`.
2. Понадобится парсер YAML — в Node его нет, поставь `yaml` (или `js-yaml`) как
   **devDependency** в `back/server`. Это единственная новая зависимость уровня 1.
3. Тест читает `docker-compose.yml` **и** `docker-compose.dev.yml` из корня репозитория
   (путь относительно теста — `../../../../docker-compose.yml`).
4. Для каждого сервиса, у которого `build.context` указывает на `./back/server`
   (сейчас это `api` и `worker`), тест собирает полный набор переменных:
   ключи из `environment` **плюс** ключи из файлов, перечисленных в `env_file`.
5. Сверяет с обязательным списком из таблицы выше. Провал — если обязательной переменной нет.
6. Отдельное утверждение: в `environment` нет переменных, которых нет в списке чтений
   (это ловит мёртвый `DATABASE_URL` — не критично, но показывает, что конфиг протух).
7. Второе утверждение про `env_file`: если сервис полагается на `env_file: .env`, то **все**
   обязательные ключи обязаны присутствовать в `.env.example`. Смысл: `.env` в git не лежит
   (`.gitignore`), значит единственный способ узнать состав файла — пример. Если в проде
   `.env` соберут по устаревшему примеру — будет та же авария, что и №1.

**Что должно падать сегодня:** оба сервиса. После починки — ни одного.

**Нюанс, который легко пропустить:** тест проверяет *наличие ключа*, а не его значение.
Значения в compose содержат подстановки `${POSTGRES_PASSWORD}` — подставлять их не надо.

---

## Проверка 1B. Маршруты: фронт ↔ Express ↔ nginx (три списка)

**Цель:** любой путь, который браузер реально дёргает, обязан (а) существовать в API и
(б) быть проксирован nginx на том хосте, откуда идёт запрос. Это ровно та проверка, которая
не пропустила бы №2 (`/auth` отсутствует в прод-nginx) и №5 (`/api/upload` не зарегистрирован).

**Список A — что дёргает фронт.** Собирается grep'ом по `fetch(` — полный перечень сегодня:

Магазин (`shop/`):
`/api/products?...` (`shared/api.js:4`), `/api/products/:id` (`cart/cart.js:149`,
`shared/product-card/events.js:16`, `shared/product-modal/events.js:14`),
`/api/orders` (`cart/checkout-step3/submit.js:96`), `/api/contacts` (`contacts/submit.js:37`).

Админка (`back/frontend/src/`):
`/tables` (`api.js:39`, `api.js:69`), `/tables/:name` (`api.js:50`, `api.js:85`),
`/tables/:name/rows` (`api.js:101`), `/tables/:name/rows/:col/:val` (`api.js:118`, `api.js:135`),
`/tables/:name/reports` (`api.js:169`, `api.js:184`), отчёты-статус/скачивание/удаление
(`api.js:196`, `api.js:213`, `api.js:235`), `/api/upload` (`api.js:150`,
`addForm/addFormRow.jsx:89`), `/auth/login` (`features/auth/authApi.js:3`),
`/auth/validation` (`shared/components/AccessControl.jsx`).

Из проверки надо **исключить внешние URL** — `cart/checkout-step2/pochta-api.js:35-36` ходит
на сторонние API Почты/СДЭК, они не наши.

**Список B — что зарегистрировано в Express.** Из `routes/routes.js` и `routes/admin.js`:
`GET /api/products`, `GET /api/products/:id`, `POST /api/orders`, `POST /api/contacts`,
`POST /auth/login`, `GET /auth/validation`, и под префиксом `/admin`:
`GET|POST /tables`, `DELETE /tables/:tableName`, `GET|POST /tables/:tableName/rows`,
`GET|PUT|DELETE /tables/:tableName/rows/:filterColumn/:filterValue`,
`GET|POST /tables/:tableName/reports`, `GET .../reports/:reportId/status`,
`GET .../reports/:reportId/download`, `DELETE .../reports/:reportId`.

Собирать список лучше не парсингом текста, а **подняв приложение с тестовым env и обойдя
стек роутера Express** — тогда список не разъедется с реальностью при рефакторинге.

**Список C — что проксирует nginx.** Для каждого `server`-блока в `nginx/nginx.conf` и
`nginx/nginx.dev.conf`: все `location`, внутри которых есть `proxy_pass http://api_backend`.
Сегодня:

| Конфиг | Хост | Проксируется |
|---|---|---|
| `nginx.conf` | `zelenyeusy.ru` | `/api/` |
| `nginx.conf` | `admin.zelenyeusy.ru` | `/tables`, `/api/` |
| `nginx.dev.conf` | `localhost` | `/api/`, `^~ /auth/` |
| `nginx.dev.conf` | `admin.localhost` | `^~ /admin/`, `/api/`, `/auth` |

**Расхождения, которые тест обязан показать прямо сейчас:**

| Путь | Фронт зовёт | Express | nginx prod | nginx dev | Вердикт |
|---|---|---|---|---|---|
| `/auth/login` | да | да | **нет** | да | админка не может войти в проде |
| `/auth/validation` | да | да | **нет** | да | отдаёт HTML 200 → ложная авторизация |
| `/api/upload` | да | **нет** | да (`/api/`) | да | 404 на загрузке картинки |
| `/tables...` | да | только как `/admin/tables` | `/tables` без переписывания префикса | `/admin/` | префиксы не сходятся ни там, ни там |

**Как сделать:**
1. Тест в корне репозитория — `tests/config/routes-contract.test.js` (отдельный мини-пакет
   или запуск из `back/server`, где уже есть node:test; корневой `package.json` в репо нет,
   поэтому проще положить в `back/server/tests/config/` и читать nginx-конфиги по относительному пути).
2. Список A — регуляркой по `fetch(` в двух каталогах, с нормализацией шаблонных строк
   (`` `/tables/${...}` `` → `/tables/:param`) и исключением внешних хостов.
3. Список B — обходом роутера поднятого приложения.
4. Список C — разбором `location`-блоков: для каждого префикса запомнить, есть ли внутри `proxy_pass`.
5. Утверждения: каждый путь из A для магазина покрыт `/api/` на хосте магазина; каждый путь
   из A для админки покрыт на admin-хосте; каждый путь из A присутствует в B.
6. Дополнительно: набор проксируемых префиксов в prod- и dev-конфиге обязан совпадать
   (это отдельное утверждение, оно и ловит дрейф конфигов).

---

## Проверка 1C. `nginx -t` для обоих конфигов

**Цель:** синтаксическая ошибка в nginx.conf = nginx не поднимется = лежит **весь** сайт,
включая статику. Это самый дешёвый способ потерять всё.

**Как сделать:** шаг в CI, который запускает `nginx:alpine` с примонтированным конфигом и
командой проверки синтаксиса. Подвох: проверка упадёт не из-за синтаксиса, а из-за
отсутствующих файлов — конфиг ссылается на `/etc/letsencrypt/live/zelenyeusy.ru/fullchain.pem`,
`privkey.pem` и `/etc/nginx/.htpasswd`. Их надо подложить фиктивными (самоподписанный
сертификат генерируется одной командой, `.htpasswd` — любой непустой файл). Без этого шаг
будет красным всегда и его просто wyłączат.

---

## Проверка 1D. `docker compose config` + «сервис стартует»

`docker compose config` раскрывает подстановки `${...}` и печатает итоговый конфиг — ловит
опечатки в именах переменных и битый YAML. Сейчас в CI есть только `docker compose build`,
который образ собирает, но конфиг не проверяет и контейнер не запускает.

Самое ценное дополнение — **шаг «поднять и спросить»**: `docker compose up -d`, дождаться
health-эндпоинта (или хотя бы отсутствия рестартов), сделать один запрос к `/api/products`.
Это единственный способ поймать №1 в CI без единой строчки хардкода.

---

## Уровень 1: итог

| Проверка | Ловит | Цена |
|---|---|---|
| 1A env | №1 (сайт лежит полностью) | ~1 час |
| 1B маршруты | №2, №5, дрейф nginx | ~2 часа |
| 1C `nginx -t` | битый конфиг = весь сайт | ~30 мин |
| 1D compose + старт | всё вышеперечисленное на реальном стеке | ~1 час |

---

# УРОВЕНЬ 2 — юнит-тесты чистых функций

## Цель

Зафиксировать **поведение отдельных функций** так, чтобы правка в одном месте не сломала
другое молча. Уровень 2 не проверяет, что сайт поднялся (это уровни 3–5), он проверяет,
что «фильтр с кавычкой в значении не превращается в SQL-инъекцию», «итог заказа считается
правильно», «телефон из 10 цифр не проходит».

Инструмент: встроенный `node:test` через `node --test`. Node 22 уже стоит в CI, новых
зависимостей не нужно (кроме `yaml` из уровня 1 и, опционально, `jsdom` для одного файла).

---

## Пять правил подготовки — без них тесты не запустятся

**Правило 1. Переменные окружения должны появиться ДО импорта модулей.**
Из части 0: `shopRepo`, `rowRepo`, `shopController`, `authService`, `routes` бросают
исключение на импорте, если не заданы `CATALOG_URL`/`REPORTS_URL`/`USERS_URL`. Если задать
их внутри теста — будет поздно. Решения (любое одно):
- флаг запуска `node --env-file=.env.test --test tests/` и файл `back/server/.env.test`
  с заведомо фейковыми URL (`postgres://test:test@localhost:5432/test`) — подключение к БД
  на уровне 2 не происходит, пул создаётся лениво;
- либо отдельный setup-модуль, который импортируется первым и выставляет `process.env`.

Файл `.env.test` **не должен** попадать в `.gitignore` — он не секрет, он часть тестов.
Настоящий `.env` остаётся в игноре.

**Правило 2. Приватные функции надо экспортировать.**
Самые важные для тестирования функции сейчас не видны снаружи:

| Файл | Приватные сейчас | Зачем экспортировать |
|---|---|---|
| `db/common/rowRepo.js:7,13,28,93,105,168` | `quoteIdent`, `quoteValue`, `buildWhereClause`, `buildCoalesceMap`, `buildSelectParts`, `buildWindowParts` | вся динамика SQL живёт здесь |
| `db/common/shopRepo.js:5,10,18` | `quoteIdent`, `quoteValue`, `mapProduct` | цена, картинка, варианты |

Экспорт не меняет поведение. Если экспортировать не хочется — тестировать через публичные
`findByColumns`/`getProducts`, но тогда нужен мок пула `pg`, что дороже и хрупче.
Рекомендация: экспортировать.

**Правило 3. Импортировать `test`/`describe`/`assert` из `node:test` и `node:assert` явно.**
В `shop/eslint.config.js` для `**/*.js` выставлен `globals.browser`, а в
`back/server/eslint.config.js` — `globals.node`. Глобальные `describe`/`it` в магазине
дадут `no-undef` и покрасят существующий job `shop_frontend`. Явный импорт решает проблему
без правки eslint-конфигов.

**Правило 4. DOM подменять обычными объектами, jsdom не нужен.**
Валидаторы читают `els.surname?.value` и дёргают `input.classList.add(...)`. Достаточно
объекта с полем `value` и объектом `classList` с двумя методами. Это в разы быстрее jsdom
и не тянет зависимость. `els` — это просто экспортируемый пустой объект
(`checkout-step3/elements.js:1` — `export const els = {}`), который заполняет
`initElements3()`; в тесте его заполняешь сам, импортировать `initElements3` не нужно.

**Правило 5. `shop/cart/utils.js` — единственный файл, требующий jsdom.**
Строка 33 вызывает `document.getElementById` на уровне модуля. Два варианта: либо добавить
jsdom как devDependency и поднимать его в setup-файле, либо (лучше) перенести привязку
обработчика внутрь функции — тогда модуль станет импортируемым, и jsdom не понадобится
нигде. Это правка на две строки в проде-коде, но она же убирает скрытый side effect.

---

## Группа A. SQL-билдеры — самый высокий приоритет

**Файл-цель:** `back/server/src/db/common/rowRepo.js`, функции `quoteIdent`, `quoteValue`,
`buildWhereClause`, `buildCoalesceMap`, `buildSelectParts`.
**Где тест:** `back/server/tests/unit/rowRepo.test.js`.

**Почему первым:** это единственное место, где пользовательские данные превращаются в SQL
строковой склейкой. Всё остальное в худшем случае покажет неверную цену; здесь — отдаст базу.

**Кейсы для `quoteIdent`:** обычное имя; имя с двойной кавычкой внутри; имя с точкой и
пробелом; пустая строка; `undefined`/`null` (сейчас даст `"undefined"` — стоит решить,
ошибка это или нет, и зафиксировать).

**Кейсы для `quoteValue`:** строка без кавычек; строка с одной кавычкой (`O'Brien`);
строка с двумя кавычками подряд; число; `null`; многострочное значение.

**Кейсы для `buildWhereClause`** (операторы видны в коде, строки 28–88):

| Вход | Что проверяем |
|---|---|
| `null`, `undefined`, `[]`, `'строка'` | вернулась пустая строка, не `undefined` |
| `{stock: {op: '=', value: 5}}` | число без кавычек |
| `{name: {op: '=', value: "O'Brien"}}` | кавычка удвоена, инъекции нет |
| `{name: {op: '=', value: 'x" OR 1=1 --'}}` | значение осталось строкой в кавычках |
| `{deleted: {op: 'IS NULL'}}` | без `AND undefined`, без значения |
| `{price: {op: 'BETWEEN', value: [10, 20]}}` | оба конца в кавычках |
| `{price: {op: 'BETWEEN', value: 10, value2: 20}}` | альтернативная форма работает |
| `{id: {op: 'IN', value: ['a','b']}}` и строка `'a, b'` | обе формы дают один результат |
| `{name: {op: 'ILIKE', value: 'роза'}}` | автоматические `%` добавились |
| `{name: {op: 'ILIKE', value: '%роза'}}` | `%` не задвоился |
| `{a: ..., b: ...}` | условия соединены ` AND `, порядок стабилен |
| регистр оператора: `'in'`, `' In '` | приводится к верхнему регистру |
| **legacy-форма** `{col: '= 5'}` | **см. ниже** |

**Отдельно про legacy-ветку (`rowRepo.js:81-82`).** Там значение подставляется в SQL
**как есть, без экранирования**. То есть legacy-фильтр — это открытая SQL-инъекция, если
значение приходит извне. Реальный путь попадания: фильтр отчёта хранится в БД
(`reports.filter`, тип JSONB, см. `db-init/createReportsDataBase.sql`) и приходит в
`findByColumns` как `filter` (строки 269–271). Тест должен зафиксировать текущее поведение
явно — и тогда станет видно решение: либо legacy-ветку убрать, либо прогонять значение
через `quoteValue`.

**Кейсы для `buildCoalesceMap` и `buildSelectParts`:** числовой дефолт без кавычек,
строковый — в кавычках; `columns: ['*']`; агрегаты `COUNT`/`AVG`/`MEDIAN` (для MEDIAN
генерируется `PERCENTILE_CONT`, строка ~140); `expression` вида `stock * price` — имена
колонок кавычатся, а ключевые слова SQL из списка `SQL_KEYWORDS` не трогаются (проверить,
что `NOT NULL` не превратился в `"NOT" "NULL"`).

---

## Группа B. Маппинг данных

**`shopRepo.mapProduct`** (тест: `back/server/tests/unit/shopRepo.test.js`):

| Кейс | Ожидание |
|---|---|
| варианты есть, у части `stock = 0` | цена = минимум по **доступным** |
| все варианты `stock = 0` | цена первого варианта, а не 0 |
| вариантов нет, есть `min_price` | берётся `min_price` |
| вариантов нет, `min_price` = `null` | цена 0, не `NaN` и не `undefined` |
| `variant_image` есть | берётся он |
| нет `variant_image`, есть `image` | берётся `image` |
| нет ни того, ни другого | фолбэк-путь; **сверить с реальным файлом** — сейчас это `/images/no-image.png` (`shopRepo.js:16`), а на диске лежит `shop/images/no-image.svg` (находка №6) |
| `tags` = `null` | пустой массив, не `null` (фронт вызывает `.includes` у тегов) |
| `row` = `undefined` | сейчас будет `TypeError`; решить, должен ли `getProductById` возвращать `null` раньше |

**`shopController.create`** (тест: `back/server/tests/unit/shopController.test.js`) —
это контракт «корзина → заказ»:

| Кейс | Ожидание |
|---|---|
| полный `customer` | ФИО склеено через пробел в порядке surname name fathername |
| без отчества | лишних пробелов нет |
| `delivery.company = 'pochta'` | заполнены только `pochtaTariffId/Name`, cdek-поля `null` |
| `delivery.company = 'cdek'` | наоборот |
| `comment` отсутствует | `null`, а не `undefined` (иначе pg запишет странное) |
| элемент корзины `{id, count}` | в репо уходит `quantity`, а не `count` |
| `variantId`/`volume` отсутствуют | `null` |

Почему это важно: `shopRepo.createOrder` при нецелом `quantity` бросает обычный `Error`,
который `errorHandler` превратит в **500**, а не 400. То есть рассинхрон имён полей между
фронтом и бэком выглядит как «сервер сломался», а не как «неверные данные». Тест на
маппинг — единственное, что catches это до прода.

---

## Группа C. Поведение HTTP-слоя

**`errorHandler`** (тест: `back/server/tests/unit/errorHandler.test.js`).
Функция принимает четыре аргумента и пишет в ответ; для теста достаточно объектов,
похожих на `res` (с методами `status` и `json`, которые запоминают вызов).

| Кейс | Ожидание |
|---|---|
| `ApiError(404)` | статус 404, тело `{status:'error', message:'Not Found'}` |
| `ApiError(401, 'свой текст')` | свой текст, не дефолт |
| ошибка с `name = 'ValidationError'` | 400 |
| `JsonWebTokenError`, `TokenExpiredError` | 401 |
| любая другая ошибка, `NODE_ENV=production` | 500, в теле **нет** `details` и `stack` |
| любая другая ошибка, `NODE_ENV=development` | 500, `details` и `stack` присутствуют |

Последние два пункта — про утечку internals в проде. Сейчас поведение правильное,
но ничем не закреплённое: одна правка `isDev` — и стек уезжает клиентам.

**`ApiError`** (там же): дефолтные сообщения для 400/401/403/404/409/500; неизвестный статус
даёт `Unknown Error`; `name` равен `ApiError` (от этого зависит ветка в `errorHandler`).

**`authHandler`**: нет cookie → 401; мусорный токен → 401; валидный токен → `req.user`
заполнен и вызван `next`. Нужен `SECRET_KEY` в env (правило 1) — токен для теста
генерируется тем же `jsonwebtoken`.

**`rateLimiters`**: проверить сами настройки как данные — `apiLimiter` 100/15 мин,
`authLimiter` 3/12 ч. Ценность не в цифрах, а в том, что случайное изменение `max: 3`
на `max: 1` (или наоборот) станет видимым в диффе теста, а не в продакшене.

---

## Группа D. Воркер и выгрузка

**`worker/generator/csv.js`** (тест: `back/server/tests/unit/csv.test.js`) — маленькая
функция, но её вывод открывают в Excel:

| Кейс | Ожидание |
|---|---|
| пустой массив / `null` | пустая строка, не `'undefined'` |
| обычные строки | значения в кавычках, разделитель запятая |
| значение с кавычкой | кавычка удвоена |
| значение с запятой внутри | не ломает число колонок |
| `null`/`undefined` в ячейке | пустая ячейка |
| **имя колонки с запятой** | сейчас заголовок собирается без экранирования (`cols.join(',')`) — файл разъедет. Зафиксировать и решить |
| числа | сейчас тоже в кавычках — Excel покажет их как текст; осознанное решение? |
| перенос строки внутри значения | проверить, что Excel не разорвёт строку (нужен `\r\n` как разделитель строк) |

---

## Группа E. Фронт магазина: валидация и деньги

**`shop/cart/validation.js`** — 15 экспортов, 288 строк. Тест: `shop/tests/validation.test.js`.
По правилу 4 заполняешь `els` объектами-заглушками (не забудь: `els` импортируется из
`checkout-step3/elements.js`, а не из step1).

| Функция | Кейсы |
|---|---|
| `validateSurname`, `validateName` | пусто; 1 символ; 2 символа; пробелы по краям (`'  А  '` должно пройти после trim); при ошибке вызван `classList.add` с нужным классом |
| `validateEmail` | пусто; `user@mail.ru` проходит; `user@mail` не проходит; `user @mail.ru` не проходит; `a@b.co` проходит |
| `validatePhone` | пусто; 10 цифр не проходит; 11 проходит; 12 проходит; 13 не проходит; `+7 (999) 123-45-67` проходит (проверяется количество **цифр**, не формат) |
| `validatePrivacy` | не отмечен → `false` и текст ошибки; отмечен → `true` и текст очищен |
| `validateStep` | все поля валидны → `true`; одно поле невалидно → `false`, **при этом ошибки показаны на всех полях сразу** (функция вызывает все валидаторы, а не коротко замыкается — это намеренное поведение, его стоит закрепить) |
| `formatPrice` | `0` → `0 руб.`; `1234.5`; `null`/`undefined` → не `NaN руб.`; проверь, что `toLocaleString('ru-RU')` даёт неразрывный пробел — если фронт где-то сравнивает строку, это всплывёт |
| `getCartItemsData` | `count`/`price` приходят строками → приводятся к числу; `subtotal` = price × count; отсутствующий `volume` → `null` |
| `getProductsSummaryData` | `totalItemsText`/`totalPriceText` согласованы с `getCartTotal` |
| `getDeliveryPriceText` | самовывоз → «Бесплатно»; цена 0 → тире; цена есть → формат цены |
| `getDeliveryCompanyName`, `getDeliveryTypeName`, `getDeliveryFullName`, `getDeliveryTariffName`, `getDeliveryAddress`, `getPochtaAddress`, `getCdekAddress` | по каждому состоянию `state` из `checkout-step2/state.js` — свой ожидаемый текст. Это то, что видит клиент в подтверждении заказа |

Для `getCartItemsData`/`getProductsSummaryData` нужен стаб `localStorage` (глобальный
объект с `getItem`/`setItem`), потому что `cart.js:16,21` обращается к нему напрямую.

**`shop/cart/checkout-step3/submit.js` → `collectFormData`** — самый ценный тест во всём
фронте. Это **точное тело запроса на `POST /api/orders`**. Тест должен утверждать структуру:
`customer.{surname,name,fathername,email,phone,comment}`, `delivery.{method,company,type,
tariffId,tariffName,address,price}`, `cart[].{id,variantId,volume,name,price,count,subtotal}`,
`totals.{...}`. И отдельно: `tariffId` берётся из четырёх мест по приоритету
(`selectedPochtaTariff?.id` → `selectedCdekTariff?.id` → `selectedPochtaTariff` →
`selectedCdekTariff`) — это хрупкая цепочка, её легко сломать рефакторингом.
Нужен стаб `fetch`, чтобы `submitOrder` не ходил в сеть.

**`shop/contacts/validation.js`** — `validateName`, `validateEmail`: те же кейсы, что выше.

---

## Группа F. Фронт магазина: поиск и каталог

**`shop/shared/product-store.js`** (тест: `shop/tests/product-store.test.js`):

| Функция | Кейсы |
|---|---|
| `normalizeText` | `Ёлка` → `елка`; `Можжевельник` → й переходит в и (проверь, что это желаемое поведение, а не баг: `й` → `и` меняет слово); знаки препинания → пробелы; несколько пробелов схлопываются; `null`/`undefined`/число не роняют функцию |
| `buildSearchIndex` (через `loadProductsData`) | в индекс попадают `name`, `description`, `category`, `group`, `type`, `subtype`, `variety` и **теги**; отсутствующие поля не дают `'undefined'` в строке; `tags` не массив — не роняет |
| `loadProductsData` | индекс построен для **всех** товаров, а не только для тех, у кого `name` содержит текущий поисковый запрос (находка №4); повторный вызов не делает второй запрос (кэш); два параллельных вызова дают один запрос (`loadingPromise`); ошибка сети сбрасывает `loadingPromise`, иначе кэш залипнет навсегда |
| `getProductById` | строковый и числовой `id` находятся одинаково; до загрузки возвращает `null`, а не падает |

Для `loadProductsData` нужен стаб `fetch`/`getProducts` — модуль ходит в
`shop/shared/api.js`.

**`shop/shared/product-card/render.js`** — функция фильтрации/сортировки:

| Кейс | Ожидание |
|---|---|
| поиск из двух слов | оба слова обязаны найтись (`every`), порядок слов в запросе не важен |
| поиск с опечаткой `манстера` | находится через `includes` по словам индекса |
| товар без `_searchWords` | **сейчас роняет весь фильтр** (`render.js:66`, находка №4) — тест должен показать ожидаемое поведение: пропустить товар, а не упасть |
| `filterTag` = `popular`/`new`/`all` | отбор по тегам |
| сортировки `price-asc`, `price-desc`, `name-asc`, `name-desc` | порядок |
| `limit` | карточек не больше, чем просят |
| пустой результат | возвращается пустой массив |

**`shop/catalog/state.js`** — дешёвые, но полезные тесты на `resetLimit`,
`resetTypeAndBelow`, `resetSubtypeAndBelow`, `resetVariety`: при смене группы сбрасываются
тип/подтип/сорт, при смене типа — подтип и сорт, лимит возвращается к 15. Именно поломка
этих сбросов даёт «выбрал фильтр — список пустой».

---

## Где всё это лежит и как запускать

| Пакет | Каталог тестов | Скрипт в `package.json` |
|---|---|---|
| `back/server` | `tests/unit/`, `tests/config/` | `test` → запуск `node --test` по `tests/unit/`; `test:config` → по `tests/config/`; позже `test:integration` |
| `shop` | `tests/` | `test` → `node --test tests/` |
| `back/frontend` | `src/**/*.test.jsx` или `tests/` | `test` (сейчас скрипта нет вообще) |

**Обязательно:** в `shop/package.json:6` сейчас
`"test": "echo \"Error: no test specified\" && exit 1"` — этот скрипт надо заменить, иначе
первый же `npm test` в CI упадёт с кодом 1.

**В CI:** одна job `unit` с матрицей из трёх каталогов (`npm ci` → `npm test`), и добавить
её в `needs:` у job `deploy` — сейчас там только
`[admin_frontend, shop_frontend, api_backend, docker_api, docker_compose]`.

---

## Порядок внутри уровня 2 (по ценности за час работы)

1. `rowRepo` — `quoteIdent`, `quoteValue`, `buildWhereClause` (безопасность).
2. `shopController.create` — контракт корзины (деньги).
3. `submit.js → collectFormData` — вторая половина того же контракта.
4. `errorHandler` + `ApiError` — коды статусов и отсутствие стека в проде.
5. `mapProduct` — цена и картинка (закрывает №6).
6. `cart/validation.js` — валидация клиента.
7. `product-store.js` + `product-card/render.js` — поиск (закрывает №4).
8. `csv.js`, `catalog/state.js`, `contacts/validation.js`, `authHandler`, `rateLimiters`.

## Чего на этом уровне делать НЕ надо

- Не мокай `pg.Pool` ради тестов SQL-билдеров — экспортируй билдеры и проверяй строку.
- Не пиши юнит-тесты на контроллеры, которые целиком состоят из вызова сервиса
  (`shopController.list`, `get`, `createContact`) — их покрывает уровень 3.
- Не тестируй DOM-функции рендера (`renderStep3Summary`, `renderProductsList`, `filters.js`)
  через jsdom ради процента покрытия — их ловит E2E (уровень 4), а юнит-тест здесь будет хрупким.
- Не гоняй реальный Postgres — это уровень 3.
