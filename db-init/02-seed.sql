-- ═══════════════════════════════════════════════════════════
-- SEED: тестовые товары для каталога "Зелёные усы"
-- ═══════════════════════════════════════════════════════════

-- ── ИРИСЫ ──────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'iris-indian-chief',
           'Ирис германский "Индиан Чиф"',
           'Высокорослый 80-90 см, лавандово-розовый верх, бордово-вишнёвый низ',
           'Ирис германский Индиан Чиф - высокорослый, необычайной нежной раскраски цветок, высотой 80-90 см. Благодаря хорошей зимостойкости культура распространена в различных регионах страны. Индиан Чиф радует продолжительным цветением, в течение нескольких недель мая и июня, которое сопровождается приятным ароматом.',
           850, 1000, '/images/iris-indian-chief.jpg',
           'garden', 'iris', 'germanskiy', 'indian-chief',
           'Корневище 1 шт', 15, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'iris-belle-de-nuit',
           'Ирис бородатый "Бэль де Нюи"',
           'Крупные цветки до 1м, белые стандарты с фиолетово-голубыми фолами',
           'Ирис бородатый Бэль де Нюи, 1 саженец. Крупные цветки высокорослого ириса Бэль де Нюи хороши не только своими размерами и присущим им легким пряным ароматом, но и очень гармоничным сочетанием оттенков.',
           950, NULL, '/images/iris-belle-de-nuit.jpg',
           'garden', 'iris', 'borodaty', 'belle-de-nuit',
           'Корневище 1 шт', 12, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'iris-black-tie-affair',
           'Ирис бородатый "Black Tie Affair"',
           'Тёмно-фиолетовые бархатистые цветки, высота 90 см',
           'Ирис бородатый Black Tie Affair — один из самых тёмных сортов. Цветки насыщенного тёмно-фиолетового, почти чёрного цвета с бархатистой текстурой. Высота стебля до 90 см. Цветение май-июнь. Зимостойкость хорошая.',
           1100, NULL, '/images/no-image.jpg',
           'garden', 'iris', 'borodaty', 'black-tie-affair',
           'Корневище 1 шт', 6, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ГОРТЕНЗИИ ──────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'gortenziya-fraise-melba',
           'Гортензия метельчатая "Фрайз Мельба"',
           'H-1.7м, соцветия до 55см, цветение июль-октябрь, зимостойкость -35℃',
           'Гортензия Фрайз Мельба (Hydrangea paniculata Fraise Melba). Высота взрослого куста 1,7м, диаметр 1,5м. Соцветия крупные, до 55 см, пирамидальные. Цветение с июля до заморозков. Морозоустойчив до -35℃.',
           1850, NULL, '/images/gortenziya-fraise-melba.jpg',
           'garden', 'gortenziya', 'metelchataya', 'fraise-melba',
           'Контейнер 5 л', 8, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'gortenziya-vanilla-fraise',
           'Гортензия метельчатая "Ванилла Фрайз"',
           'H-2м, соцветия 30см, цветение июнь-октябрь, зимостойкость -35°C',
           'Гортензия метельчатая Ванилла Фрайз. Высота и ширина куста до 2 м. Побеги тёмно-бордовые. Соцветия крупные, широкопирамидальные, длиной до 30 см. Сначала молочно-белые, затем розовеют, а к осени становятся тёмно-красными. Цветение с июня по октябрь. Морозостойкость до -34°C.',
           350, 550, '/images/no-image.jpg',
           'garden', 'gortenziya', 'metelchtaya', 'vanilla-fraise',
           'Контейнер 3 л', 10, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'gortenziya-candybelle',
           'Гортензия древовидная "Candybelle"',
           'Компактный куст H-1м, нежно-розовые шаровидные соцветия',
           'Гортензия древовидная Candybelle — компактный куст высотой до 1 м. Соцветия шаровидные, нежно-розовые, диаметром до 20 см. Цветение июль-сентябрь. Зимостойкость до -30°C. Предпочитает полутень и влажную почву.',
           1300, NULL, '/images/no-image.jpg',
           'garden', 'gortenziya', 'drevovidnaya', 'candybelle',
           'Контейнер 5 л', 4, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'gortenziya-limelight',
           'Гортензия метельчатая "Limelight"',
           'H-2м, лаймово-зелёные соцветия, зимостойкость -34°C',
           'Гортензия метельчатая Limelight — один из самых популярных сортов. Соцветия крупные, плотные, лаймово-зелёные в начале цветения, затем белые и розовеющие. Высота куста до 2 м. Цветение июль-октябрь. Морозостойкость до -34°C.',
           1600, 1900, '/images/no-image.jpg',
           'garden', 'gortenziya', 'metelchataya', 'limelight',
           'Контейнер 5 л', 7, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

-- ── РОЗЫ ───────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'roza-avalanche',
           'Роза срезочная "Avalanche"',
           'Белоснежные крупные бутоны, высота 70-90 см, долго стоит в вазе',
           'Роза срезочная Avalanche — классика флористики. Крупные белоснежные бутоны диаметром до 10 см. Высота стебля 70-90 см. Долго стоит в вазе — до 2 недель. Подходит для свадебных букетов и монобукетов.',
           120, NULL, '/images/no-image.jpg',
           'cut', 'roza', 'srezochnaya', 'avalanche',
           '1 шт', 50, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'roza-black-magic',
           'Роза срезочная "Black Magic"',
           'Тёмно-бордовые бархатистые бутоны, высота 60-80 см',
           'Роза срезочная Black Magic — эффектная тёмно-красная роза с бархатистыми лепестками. Бутоны крупные, диаметром 8-9 см. Высота стебля 60-80 см. Долго стоит в вазе. Популярна в мужских и монобукетах.',
           130, NULL, '/images/no-image.jpg',
           'cut', 'roza', 'srezochnaya', 'black-magic',
           '1 шт', 35, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'roza-garden-peach',
           'Роза садовая "Peach Avalanche"',
           'Персиково-кремовые бутоны, плетистая, H-до 2м',
           'Роза садовая Peach Avalanche — плетистая роза с нежными персиково-кремовыми бутонами. Высота до 2 м. Цветение обильное, повторное. Аромат нежный. Зимостойкость до -25°C при укрытии.',
           890, 1100, '/images/no-image.jpg',
           'garden', 'roza', 'pletistaya', 'peach-avalanche',
           'Контейнер 3 л', 5, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ПИОНЫ ──────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'pion-sarah-bernhardt',
           'Пион "Sarah Bernhardt"',
           'Крупные розово-серебристые цветки, аромат, H-90см',
           'Пион Sarah Bernhardt — один из самых популярных садовых пионов. Цветки крупные, махровые, розово-серебристые с нежным ароматом. Высота куста до 90 см. Цветение июнь. Долговечный, живёт на одном месте до 50 лет.',
           650, NULL, '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'sarah-bernhardt',
           'Деленка 2-3 почки', 9, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'pion-coral-charm',
           'Пион "Coral Charm"',
           'Уникальный коралловый цвет, меняется по мере распускания',
           'Пион Coral Charm — обладатель золотой медали Американского общества пионов. Бутоны ярко-коралловые, при распускании светлеют до персикового. Высота до 80 см. Цветение май-июнь.',
           750, NULL, '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'coral-charm',
           'Деленка 2-3 почки', 6, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ТЮЛЬПАНЫ ───────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'tulpan-queen-of-night',
           'Тюльпан "Queen of Night"',
           'Тёмно-бордовые почти чёрные цветки, высота 60 см',
           'Тюльпан Queen of Night — легендарный сорт с тёмно-бордовыми, почти чёрными цветками. Высота 60 см. Цветение апрель-май. Луковица крупная, 12 см в обхвате. Подходит для срезки и посадки в саду.',
           45, NULL, '/images/no-image.jpg',
           'bulbs', 'tulpan', 'prostyye', 'queen-of-night',
           'Луковица 1 шт', 100, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'tulpan-parrot-mix',
           'Тюльпан попугайный "Parrot Mix"',
           'Бахромчатые лепестки, яркий микс цветов, высота 50 см',
           'Тюльпан попугайный Parrot Mix — смесь ярких попугайных тюльпанов с бахромчатыми лепестками. Высота 50 см. Цветение май. Эффектно смотрится в групповых посадках и в срезке.',
           55, 70, '/images/no-image.jpg',
           'bulbs', 'tulpan', 'popugaynyye', 'parrot-mix',
           'Луковица 1 шт', 80, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── НАРЦИССЫ ───────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'narciss-ice-follies',
           'Нарцисс "Ice Follies"',
           'Белые лепестки, лимонно-жёлтая корона, высота 40 см',
           'Нарцисс Ice Follies — один из самых популярных крупнокорончатых нарциссов. Белые лепестки с широкой лимонно-жёлтой короной. Высота 40 см. Цветение апрель. Неприхотлив, зимостоек.',
           35, NULL, '/images/no-image.jpg',
           'bulbs', 'narciss', 'krupnokoronchatyye', 'ice-follies',
           'Луковица 1 шт', 120, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'narciss-tete-a-tete',
           'Нарцисс "Tete-a-Tete"',
           'Миниатюрный, жёлтые цветки по 2-3 на стебле, высота 15 см',
           'Нарцисс Tete-a-Tete — популярный миниатюрный сорт. На одном стебле 2-3 ярко-жёлтых цветка. Высота 15 см. Цветение март-апрель. Подходит для выгонки и горшечного выращивания.',
           40, NULL, '/images/no-image.jpg',
           'bulbs', 'narciss', 'miniatyurnyye', 'tete-a-tete',
           'Луковица 1 шт', 90, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ЛИЛИИ ──────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'lily-stargazer',
           'Лилия восточная "Stargazer"',
           'Ярко-малиновые цветки с белой каймой, сильный аромат, H-90см',
           'Лилия восточная Stargazer — один из самых ароматных сортов. Цветки крупные, ярко-малиновые с белой каймой и тёмными крапинками. Высота до 90 см. Цветение июль-август. Луковица крупная.',
           180, NULL, '/images/no-image.jpg',
           'bulbs', 'lily', 'vostochnaya', 'stargazer',
           'Луковица 1 шт', 40, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'lily-white-heaven',
           'Лилия ОТ-гибрид "White Heaven"',
           'Белоснежные крупные цветки, высота до 120 см, аромат',
           'Лилия ОТ-гибрид White Heaven — мощный высокорослый сорт с белоснежными цветками диаметром до 25 см. Высота до 120 см. Сильный приятный аромат. Цветение июль-август. Зимостойкость хорошая.',
           220, 280, '/images/no-image.jpg',
           'bulbs', 'lily', 'ot-gibrid', 'white-heaven',
           'Луковица 1 шт', 25, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ФИАЛКИ / КОМНАТНЫЕ ─────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'fialka-optimara',
           'Фиалка узамбарская "Optimara"',
           'Фиолетовые цветки, компактная розетка, неприхотлива',
           'Фиалка узамбарская Optimara — классическая комнатная фиалка с фиолетовыми цветками. Компактная розетка диаметром 15-20 см. Цветёт почти круглый год. Неприхотлива, подходит для начинающих.',
           250, NULL, '/images/no-image.jpg',
           'indoor', 'fialka', 'uzambarska', 'optimara',
           'Горшок 9 см', 20, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'fialka-chimera-moroz',
           'Фиалка химера "Мороз"',
           'Сиренево-белые цветки с тонкой каймой, редкий сорт',
           'Фиалка химера Мороз — редкий коллекционный сорт. Цветки сиренево-белые с тонкой белой каймой на каждом лепестке. Розетка стандартная. Цветение обильное. Размножается только пасынками.',
           450, NULL, '/images/no-image.jpg',
           'indoor', 'fialka', 'chimera', 'moroz',
           'Горшок 9 см', 5, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ОРХИДЕИ ────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'orhideya-phalaenopsis-white',
           'Орхидея Фаленопсис белая',
           'Классическая белая орхидея, 2 цветоноса, высота 60 см',
           'Орхидея Фаленопсис белая — самая популярная комнатная орхидея. 2 цветоноса с 10-15 цветками на каждом. Высота 60 см. Цветение 2-3 месяца. Неприхотлива при правильном поливе.',
           890, 1200, '/images/no-image.jpg',
           'indoor', 'orhideya', 'falenopsis', 'white',
           'Горшок 12 см', 12, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'orhideya-phalaenopsis-pink',
           'Орхидея Фаленопсис розовая',
           'Нежно-розовые цветки с малиновым центром, 1 цветонос',
           'Орхидея Фаленопсис розовая — нежная розовая окраска с малиновым центром цветка. 1 цветонос с 8-12 цветками. Высота 50 см. Цветение до 3 месяцев. Отличный подарок.',
           750, NULL, '/images/no-image.jpg',
           'indoor', 'orhideya', 'falenopsis', 'pink',
           'Горшок 12 см', 8, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── БУКЕТЫ ─────────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'buket-spring-mix',
           'Букет "Весенний микс"',
           'Тюльпаны, нарциссы, гиацинты — яркий весенний букет',
           'Букет Весенний микс — сборный весенний букет из тюльпанов, нарциссов и гиацинтов. Состав может незначительно меняться в зависимости от сезона. Оформление в крафт-бумагу. Высота 50 см.',
           1200, NULL, '/images/no-image.jpg',
           'cut', 'buket', 'sezonnye', 'spring-mix',
           'Букет 15 стеблей', 10, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'buket-roses-25',
           'Букет 25 роз "Эквадор"',
           'Эквадорские розы 60 см, крупный бутон, на выбор цвет',
           'Букет 25 эквадорских роз высотой 60 см. Крупный плотный бутон. Доступны: красные, белые, розовые, жёлтые. Оформление в фирменную упаковку. Стоят в вазе до 2 недель.',
           3500, 4000, '/images/no-image.jpg',
           'cut', 'buket', 'rozy', 'ecuador-25',
           'Букет 25 шт', 15, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'buket-pion-mix',
           'Букет из пионов',
           'Нежные пионы в пастельных тонах, сезонный товар',
           'Букет из свежих пионов в нежных пастельных тонах — белые, розовые, кремовые. Состав 7-9 пионов. Оформление в крафт или матовую плёнку. Доступен в сезон цветения пионов (май-июнь).',
           2200, NULL, '/images/no-image.jpg',
           'cut', 'buket', 'piony', 'pion-mix',
           'Букет 7-9 шт', 8, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ЕЩЁ САДОВЫЕ ────────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'gortenziya-annabelle',
           'Гортензия древовидная "Annabelle"',
           'Огромные белые шаровидные соцветия до 30 см, H-1.5м',
           'Гортензия древовидная Annabelle — самый популярный сорт с огромными белыми шаровидными соцветиями диаметром до 30 см. Высота куста 1.5 м. Цветение июль-сентябрь. Зимостойкость высокая, не требует укрытия.',
           1400, NULL, '/images/no-image.jpg',
           'garden', 'gortenziya', 'drevovidnaya', 'annabelle',
           'Контейнер 5 л', 6, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'pion-duchesse-de-nemours',
           'Пион "Duchesse de Nemours"',
           'Белоснежные махровые цветки с лимонным центром, аромат',
           'Пион Duchesse de Nemours — классический белый пион с нежным ароматом. Цветки крупные, махровые, белоснежные с лимонно-жёлтым центром. Высота до 90 см. Цветение июнь. Один из лучших белых пионов.',
           700, 850, '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'duchesse-de-nemours',
           'Деленка 2-3 почки', 7, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'lily-asiatic-orange',
           'Лилия азиатская "Orange Electric"',
           'Ярко-оранжевые цветки без аромата, высота 60-70 см',
           'Лилия азиатская Orange Electric — яркий оранжевый сорт без аромата. Цветки смотрят вверх, диаметр до 15 см. Высота 60-70 см. Цветение июнь-июль. Неприхотлива, хорошо зимует.',
           160, NULL, '/images/no-image.jpg',
           'bulbs', 'lily', 'aziatskaya', 'orange-electric',
           'Луковица 1 шт', 55, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, price, old_price, image, group_name, type, subtype, variety, volume, stock, tags)
VALUES (
           'tulpan-double-peach',
           'Тюльпан махровый "Double Peach"',
           'Персиковые махровые цветки, похожи на пионы, H-45 см',
           'Тюльпан махровый Double Peach — нежные персиковые цветки с множеством лепестков, напоминающие пионы. Высота 45 см. Цветение май. Эффектно смотрится в букетах и групповых посадках.',
           60, NULL, '/images/no-image.jpg',
           'bulbs', 'tulpan', 'makrovye', 'double-peach',
           'Луковица 1 шт', 70, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;


INSERT INTO product_variants (product_id, volume, price, old_price, stock)
VALUES
    ('iris-indian-chief', 'Контейнер P9', 850, 1000, 15),
    ('iris-indian-chief', 'Контейнер C2', 1200, NULL, 8);