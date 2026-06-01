-- ═══════════════════════════════════════════════════════════
-- SEED: тестовые товары для каталога "Зелёные усы"
-- Триггер create_default_variants автоматически создаст
-- варианты P9/C1/C2 для garden и P5/P7/P10 для indoor
-- ═══════════════════════════════════════════════════════════

-- ── ИРИСЫ (garden) ─────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'iris-indian-chief',
           'Ирис германский "Индиан Чиф"',
           'Высокорослый 80-90 см, лавандово-розовый верх, бордово-вишнёвый низ',
           'Ирис германский Индиан Чиф - высокорослый, необычайной нежной раскраски цветок, высотой 80-90 см. Благодаря хорошей зимостойкости культура распространена в различных регионах страны.',
           '/images/iris-indian-chief.jpg',
           'garden', 'iris', 'germanskiy', 'indian-chief',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'iris-belle-de-nuit',
           'Ирис бородатый "Бэль де Нюи"',
           'Крупные цветки до 1м, белые стандарты с фиолетово-голубыми фолами',
           'Ирис бородатый Бэль де Нюи, 1 саженец. Крупные цветки высокорослого ириса Бэль де Нюи хороши не только своими размерами и присущим им легким пряным ароматом.',
           '/images/iris-belle-de-nuit.jpg',
           'garden', 'iris', 'borodaty', 'belle-de-nuit',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'iris-black-tie-affair',
           'Ирис бородатый "Black Tie Affair"',
           'Тёмно-фиолетовые бархатистые цветки, высота 90 см',
           'Ирис бородатый Black Tie Affair — один из самых тёмных сортов. Цветки насыщенного тёмно-фиолетового, почти чёрного цвета с бархатистой текстурой. Высота стебля до 90 см.',
           '/images/no-image.jpg',
           'garden', 'iris', 'borodaty', 'black-tie-affair',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ГОРТЕНЗИИ (garden) ─────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'gortenziya-fraise-melba',
           'Гортензия метельчатая "Фрайз Мельба"',
           'H-1.7м, соцветия до 55см, цветение июль-октябрь, зимостойкость -35℃',
           'Гортензия Фрайз Мельба (Hydrangea paniculata Fraise Melba). Высота взрослого куста 1,7м. Соцветия крупные, до 55 см, пирамидальные. Цветение с июля до заморозков. Морозоустойчив до -35℃.',
           '/images/gortenziya-fraise-melba.jpg',
           'garden', 'gortenziya', 'metelchataya', 'fraise-melba',
           0, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'gortenziya-vanilla-fraise',
           'Гортензия метельчатая "Ванилла Фрайз"',
           'H-2м, соцветия 30см, цветение июнь-октябрь, зимостойкость -35°C',
           'Гортензия метельчатая Ванилла Фрайз. Высота и ширина куста до 2 м. Соцветия крупные, широкопирамидальные, длиной до 30 см. Цветение с июня по октябрь. Морозостойкость до -34°C.',
           '/images/no-image.jpg',
           'garden', 'gortenziya', 'metelchataya', 'vanilla-fraise',
           0, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'gortenziya-candybelle',
           'Гортензия древовидная "Candybelle"',
           'Компактный куст H-1м, нежно-розовые шаровидные соцветия',
           'Гортензия древовидная Candybelle — компактный куст высотой до 1 м. Соцветия шаровидные, нежно-розовые, диаметром до 20 см. Цветение июль-сентябрь. Зимостойкость до -30°C.',
           '/images/no-image.jpg',
           'garden', 'gortenziya', 'drevovidnaya', 'candybelle',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'gortenziya-limelight',
           'Гортензия метельчатая "Limelight"',
           'H-2м, лаймово-зелёные соцветия, зимостойкость -34°C',
           'Гортензия метельчатая Limelight — один из самых популярных сортов. Соцветия крупные, плотные, лаймово-зелёные в начале цветения. Высота куста до 2 м. Цветение июль-октябрь.',
           '/images/no-image.jpg',
           'garden', 'gortenziya', 'metelchataya', 'limelight',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'gortenziya-annabelle',
           'Гортензия древовидная "Annabelle"',
           'Огромные белые шаровидные соцветия до 30 см, H-1.5м',
           'Гортензия древовидная Annabelle — самый популярный сорт с огромными белыми шаровидными соцветиями диаметром до 30 см. Высота куста 1.5 м. Цветение июль-сентябрь.',
           '/images/no-image.jpg',
           'garden', 'gortenziya', 'drevovidnaya', 'annabelle',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

-- ── РОЗЫ (garden) ──────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'roza-garden-peach',
           'Роза садовая "Peach Avalanche"',
           'Персиково-кремовые бутоны, плетистая, H-до 2м',
           'Роза садовая Peach Avalanche — плетистая роза с нежными персиково-кремовыми бутонами. Высота до 2 м. Цветение обильное, повторное. Зимостойкость до -25°C при укрытии.',
           '/images/no-image.jpg',
           'garden', 'roza', 'pletistaya', 'peach-avalanche',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ПИОНЫ (garden) ─────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'pion-sarah-bernhardt',
           'Пион "Sarah Bernhardt"',
           'Крупные розово-серебристые цветки, аромат, H-90см',
           'Пион Sarah Bernhardt — один из самых популярных садовых пионов. Цветки крупные, махровые, розово-серебристые с нежным ароматом. Высота куста до 90 см. Цветение июнь.',
           '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'sarah-bernhardt',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'pion-coral-charm',
           'Пион "Coral Charm"',
           'Уникальный коралловый цвет, меняется по мере распускания',
           'Пион Coral Charm — обладатель золотой медали Американского общества пионов. Бутоны ярко-коралловые, при распускании светлеют до персикового. Высота до 80 см.',
           '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'coral-charm',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'pion-duchesse-de-nemours',
           'Пион "Duchesse de Nemours"',
           'Белоснежные махровые цветки с лимонным центром, аромат',
           'Пион Duchesse de Nemours — классический белый пион с нежным ароматом. Цветки крупные, махровые, белоснежные с лимонно-жёлтым центром. Высота до 90 см. Цветение июнь.',
           '/images/no-image.jpg',
           'garden', 'pion', 'travyanisty', 'duchesse-de-nemours',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

-- ── ЛУКОВИЧНЫЕ (bulbs) ─────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'tulpan-queen-of-night',
           'Тюльпан "Queen of Night"',
           'Тёмно-бордовые почти чёрные цветки, высота 60 см',
           'Тюльпан Queen of Night — легендарный сорт с тёмно-бордовыми, почти чёрными цветками. Высота 60 см. Цветение апрель-май. Луковица крупная, 12 см в обхвате.',
           '/images/no-image.jpg',
           'bulbs', 'tulpan', 'prostyye', 'queen-of-night',
           100, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'tulpan-parrot-mix',
           'Тюльпан попугайный "Parrot Mix"',
           'Бахромчатые лепестки, яркий микс цветов, высота 50 см',
           'Тюльпан попугайный Parrot Mix — смесь ярких попугайных тюльпанов с бахромчатыми лепестками. Высота 50 см. Цветение май.',
           '/images/no-image.jpg',
           'bulbs', 'tulpan', 'popugaynyye', 'parrot-mix',
           80, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'tulpan-double-peach',
           'Тюльпан махровый "Double Peach"',
           'Персиковые махровые цветки, похожи на пионы, H-45 см',
           'Тюльпан махровый Double Peach — нежные персиковые цветки с множеством лепестков, напоминающие пионы. Высота 45 см. Цветение май.',
           '/images/no-image.jpg',
           'bulbs', 'tulpan', 'makrovye', 'double-peach',
           70, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'narciss-ice-follies',
           'Нарцисс "Ice Follies"',
           'Белые лепестки, лимонно-жёлтая корона, высота 40 см',
           'Нарцисс Ice Follies — один из самых популярных крупнокорончатых нарциссов. Белые лепестки с широкой лимонно-жёлтой короной. Высота 40 см. Цветение апрель.',
           '/images/no-image.jpg',
           'bulbs', 'narciss', 'krupnokoronchatyye', 'ice-follies',
           120, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'narciss-tete-a-tete',
           'Нарцисс "Tete-a-Tete"',
           'Миниатюрный, жёлтые цветки по 2-3 на стебле, высота 15 см',
           'Нарцисс Tete-a-Tete — популярный миниатюрный сорт. На одном стебле 2-3 ярко-жёлтых цветка. Высота 15 см. Цветение март-апрель.',
           '/images/no-image.jpg',
           'bulbs', 'narciss', 'miniatyurnyye', 'tete-a-tete',
           90, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'lily-stargazer',
           'Лилия восточная "Stargazer"',
           'Ярко-малиновые цветки с белой каймой, сильный аромат, H-90см',
           'Лилия восточная Stargazer — один из самых ароматных сортов. Цветки крупные, ярко-малиновые с белой каймой и тёмными крапинками. Высота до 90 см. Цветение июль-август.',
           '/images/no-image.jpg',
           'bulbs', 'lily', 'vostochnaya', 'stargazer',
           40, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'lily-white-heaven',
           'Лилия ОТ-гибрид "White Heaven"',
           'Белоснежные крупные цветки, высота до 120 см, аромат',
           'Лилия ОТ-гибрид White Heaven — мощный высокорослый сорт с белоснежными цветками диаметром до 25 см. Высота до 120 см. Цветение июль-август.',
           '/images/no-image.jpg',
           'bulbs', 'lily', 'ot-gibrid', 'white-heaven',
           25, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'lily-asiatic-orange',
           'Лилия азиатская "Orange Electric"',
           'Ярко-оранжевые цветки без аромата, высота 60-70 см',
           'Лилия азиатская Orange Electric — яркий оранжевый сорт без аромата. Цветки смотрят вверх, диаметр до 15 см. Высота 60-70 см. Цветение июнь-июль.',
           '/images/no-image.jpg',
           'bulbs', 'lily', 'aziatskaya', 'orange-electric',
           55, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── СРЕЗАННЫЕ (cut) ────────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'roza-avalanche',
           'Роза срезочная "Avalanche"',
           'Белоснежные крупные бутоны, высота 70-90 см, долго стоит в вазе',
           'Роза срезочная Avalanche — классика флористики. Крупные белоснежные бутоны диаметром до 10 см. Высота стебля 70-90 см. Долго стоит в вазе — до 2 недель.',
           '/images/no-image.jpg',
           'cut', 'roza', 'srezochnaya', 'avalanche',
           50, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'roza-black-magic',
           'Роза срезочная "Black Magic"',
           'Тёмно-бордовые бархатистые бутоны, высота 60-80 см',
           'Роза срезочная Black Magic — эффектная тёмно-красная роза с бархатистыми лепестками. Бутоны крупные, диаметром 8-9 см. Высота стебля 60-80 см.',
           '/images/no-image.jpg',
           'cut', 'roza', 'srezochnaya', 'black-magic',
           35, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'buket-spring-mix',
           'Букет "Весенний микс"',
           'Тюльпаны, нарциссы, гиацинты — яркий весенний букет',
           'Букет Весенний микс — сборный весенний букет из тюльпанов, нарциссов и гиацинтов. Оформление в крафт-бумагу. Высота 50 см.',
           '/images/no-image.jpg',
           'cut', 'buket', 'sezonnye', 'spring-mix',
           10, ARRAY['popular', 'new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'buket-roses-25',
           'Букет 25 роз "Эквадор"',
           'Эквадорские розы 60 см, крупный бутон, на выбор цвет',
           'Букет 25 эквадорских роз высотой 60 см. Крупный плотный бутон. Доступны: красные, белые, розовые, жёлтые. Стоят в вазе до 2 недель.',
           '/images/no-image.jpg',
           'cut', 'buket', 'rozy', 'ecuador-25',
           15, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'buket-pion-mix',
           'Букет из пионов',
           'Нежные пионы в пастельных тонах, сезонный товар',
           'Букет из свежих пионов в нежных пастельных тонах — белые, розовые, кремовые. Состав 7-9 пионов. Доступен в сезон цветения пионов (май-июнь).',
           '/images/no-image.jpg',
           'cut', 'buket', 'piony', 'pion-mix',
           8, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── КОМНАТНЫЕ (indoor) ─────────────────────────────────────

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'fialka-optimara',
           'Фиалка узамбарская "Optimara"',
           'Фиолетовые цветки, компактная розетка, неприхотлива',
           'Фиалка узамбарская Optimara — классическая комнатная фиалка с фиолетовыми цветками. Компактная розетка диаметром 15-20 см. Цветёт почти круглый год.',
           '/images/no-image.jpg',
           'indoor', 'fialka', 'uzambarska', 'optimara',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'fialka-chimera-moroz',
           'Фиалка химера "Мороз"',
           'Сиренево-белые цветки с тонкой каймой, редкий сорт',
           'Фиалка химера Мороз — редкий коллекционный сорт. Цветки сиренево-белые с тонкой белой каймой на каждом лепестке. Размножается только пасынками.',
           '/images/no-image.jpg',
           'indoor', 'fialka', 'chimera', 'moroz',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'orhideya-phalaenopsis-white',
           'Орхидея Фаленопсис белая',
           'Классическая белая орхидея, 2 цветоноса, высота 60 см',
           'Орхидея Фаленопсис белая — самая популярная комнатная орхидея. 2 цветоноса с 10-15 цветками на каждом. Высота 60 см. Цветение 2-3 месяца.',
           '/images/no-image.jpg',
           'indoor', 'orhideya', 'falenopsis', 'white',
           0, ARRAY['popular']
       ) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, full_description, image, group_name, type, subtype, variety, stock, tags)
VALUES (
           'orhideya-phalaenopsis-pink',
           'Орхидея Фаленопсис розовая',
           'Нежно-розовые цветки с малиновым центром, 1 цветонос',
           'Орхидея Фаленопсис розовая — нежная розовая окраска с малиновым центром цветка. 1 цветонос с 8-12 цветками. Высота 50 см. Цветение до 3 месяцев.',
           '/images/no-image.jpg',
           'indoor', 'orhideya', 'falenopsis', 'pink',
           0, ARRAY['new']
       ) ON CONFLICT (id) DO NOTHING;

-- ── Тестовые варианты для ирисов ───────────────────────────
-- (остальные варианты создаёт триггер автоматически)
-- Обновляем цены вариантов которые создал триггер
UPDATE product_variants SET price = 850, old_price = 1000, stock = 15
WHERE product_id = 'iris-indian-chief' AND volume = 'Контейнер P9';

UPDATE product_variants SET price = 1200, stock = 8
WHERE product_id = 'iris-indian-chief' AND volume = 'Контейнер C2';

UPDATE product_variants SET price = 950, stock = 12
WHERE product_id = 'iris-belle-de-nuit' AND volume = 'Контейнер P9';
