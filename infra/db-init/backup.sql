--
-- PostgreSQL database dump
--

\restrict lxHfZ4WlGthIMuuP8pCjJOKQfUI1xYeywfPRl08nvOvYYMYEf2g17luwCTp7ZJB

-- Dumped from database version 15.19
-- Dumped by pg_dump version 18.4

-- Started on 2026-10-11 23:04:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 9 (class 2615 OID 16547)
-- Name: messages; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA messages;


ALTER SCHEMA messages OWNER TO postgres;

--
-- TOC entry 8 (class 2615 OID 16546)
-- Name: orders; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA orders;


ALTER SCHEMA orders OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 16545)
-- Name: products; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA products;


ALTER SCHEMA products OWNER TO postgres;

--
-- TOC entry 10 (class 2615 OID 16579)
-- Name: users; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 16567)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA products;


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16450)
-- Name: contacts; Type: TABLE; Schema: messages; Owner: postgres
--

CREATE TABLE messages.contacts (
    id integer NOT NULL,
    name text,
    email text,
    phone text,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE messages.contacts OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16449)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: messages; Owner: postgres
--

CREATE SEQUENCE messages.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE messages.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 225
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: messages; Owner: postgres
--

ALTER SEQUENCE messages.contacts_id_seq OWNED BY messages.contacts.id;


--
-- TOC entry 224 (class 1259 OID 16426)
-- Name: order_items; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id text,
    variant_id integer,
    name text NOT NULL,
    price integer NOT NULL,
    quantity integer NOT NULL,
    volume text
);


ALTER TABLE orders.order_items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16425)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders.order_items_id_seq OWNED BY orders.order_items.id;


--
-- TOC entry 221 (class 1259 OID 16396)
-- Name: orders; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders (
    id integer NOT NULL,
    customer_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    delivery_method text NOT NULL,
    delivery_company text,
    delivery_type text,
    delivery_price integer DEFAULT 0,
    address text,
    pochta_tariff_id text,
    pochta_tariff_name text,
    cdek_tariff_id text,
    cdek_tariff_name text,
    total_price integer NOT NULL,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT now(),
    comment text
);


ALTER TABLE orders.orders OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16395)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders.orders_id_seq OWNER TO postgres;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 220
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: orders; Owner: postgres
--

ALTER SEQUENCE orders.orders_id_seq OWNED BY orders.orders.id;


--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: product_variants; Type: TABLE; Schema: products; Owner: postgres
--

CREATE TABLE products.product_variants (
    price numeric(10,2) DEFAULT 0 NOT NULL,
    old_price integer,
    stock integer DEFAULT 0 NOT NULL,
    preview_image text,
    created_at timestamp with time zone DEFAULT now(),
    name text,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE products.product_variants OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16538)
-- Name: product_variants_images; Type: TABLE; Schema: products; Owner: postgres
--

CREATE TABLE products.product_variants_images (
    img_url text,
    alt_text text,
    title_text text,
    is_main boolean DEFAULT false,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    variant_id uuid NOT NULL
);


ALTER TABLE products.product_variants_images OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: products; Type: TABLE; Schema: products; Owner: postgres
--

CREATE TABLE products.products (
    name text NOT NULL,
    description text,
    type text NOT NULL,
    subtype text,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    preview_image text,
    category text,
    status text DEFAULT 'draft'::text,
    sku text,
    price numeric(10,2),
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    updated timestamp with time zone
);


ALTER TABLE products.products OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16580)
-- Name: users; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE users.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text,
    password_hash character varying(255)
);


ALTER TABLE users.users OWNER TO postgres;

--
-- TOC entry 3351 (class 2604 OID 16453)
-- Name: contacts id; Type: DEFAULT; Schema: messages; Owner: postgres
--

ALTER TABLE ONLY messages.contacts ALTER COLUMN id SET DEFAULT nextval('messages.contacts_id_seq'::regclass);


--
-- TOC entry 3350 (class 2604 OID 16429)
-- Name: order_items id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_items ALTER COLUMN id SET DEFAULT nextval('orders.order_items_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 16399)
-- Name: orders id; Type: DEFAULT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders ALTER COLUMN id SET DEFAULT nextval('orders.orders_id_seq'::regclass);


--
-- TOC entry 3521 (class 0 OID 16450)
-- Dependencies: 226
-- Data for Name: contacts; Type: TABLE DATA; Schema: messages; Owner: postgres
--

COPY messages.contacts (id, name, email, phone, message, created_at) FROM stdin;
\.


--
-- TOC entry 3519 (class 0 OID 16426)
-- Dependencies: 224
-- Data for Name: order_items; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.order_items (id, order_id, product_id, variant_id, name, price, quantity, volume) FROM stdin;
\.


--
-- TOC entry 3516 (class 0 OID 16396)
-- Dependencies: 221
-- Data for Name: orders; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.orders (id, customer_name, email, phone, delivery_method, delivery_company, delivery_type, delivery_price, address, pochta_tariff_id, pochta_tariff_name, cdek_tariff_id, cdek_tariff_name, total_price, status, created_at, comment) FROM stdin;
\.


--
-- TOC entry 3517 (class 0 OID 16408)
-- Dependencies: 222
-- Data for Name: product_variants; Type: TABLE DATA; Schema: products; Owner: postgres
--

COPY products.product_variants (price, old_price, stock, preview_image, created_at, name, id, product_id) FROM stdin;
0.00	700	2	\N	2026-10-11 19:36:11.977999+00	D5	bdf14aaf-c3a0-4459-87e4-1fbc97ff0501	27efabe2-91ce-45d9-9653-2ed66eb7555a
0.00	\N	0	\N	2026-10-11 19:36:52.94421+00	D10	92b95a72-bbf6-47a1-9a25-b10c7a3bf443	27efabe2-91ce-45d9-9653-2ed66eb7555a
\.


--
-- TOC entry 3522 (class 0 OID 16538)
-- Dependencies: 227
-- Data for Name: product_variants_images; Type: TABLE DATA; Schema: products; Owner: postgres
--

COPY products.product_variants_images (img_url, alt_text, title_text, is_main, id, variant_id) FROM stdin;
\N	\N	\N	f	7716b46d-90f8-467d-9ff3-429292dd48b8	92b95a72-bbf6-47a1-9a25-b10c7a3bf443
\.


--
-- TOC entry 3514 (class 0 OID 16385)
-- Dependencies: 219
-- Data for Name: products; Type: TABLE DATA; Schema: products; Owner: postgres
--

COPY products.products (name, description, type, subtype, tags, created_at, preview_image, category, status, sku, price, id, updated) FROM stdin;
Аглаонема ложноприцветниковая\n	Аглаонема ложноприцветниковая (лат. Aglaonema commutatum pseudobracteatum) — это одна из форм аглаонемы, популярного комнатного растения из семейства Ароидные. Её ценят за декоративные листья с пёстрой окраской.\n\nЛистья вытянутые, ланцетовидной формы, с заострённым кончиком. Могут достигать 30 см в длину и 10 см в ширину. Окраска светлая: по краям — кайма разных оттенков зелёного (от светло- до тёмно-зелёного), а к середине листа оттенок становится почти белым. Рисунок размытый, без чётких границ. Стебель прямостоячий, со временем растение может вытягиваться и достигать высоты около 1 метра. Крона формируется в виде прореженного куста.\n\nАглаонема ложноприцветниковая считается неприхотливым растением, подходящим даже для начинающих цветоводов. Однако для сохранения декоративности ей нужны определённые условия. Предпочитает яркий рассеянный свет. Прямые солнечные лучи могут вызвать ожоги на листьях. Хорошо подойдут восточные или западные окна. При достаточном освещении окраска листьев становится более насыщенной. Комфортный диапазон температуры — 18–27 °C. Растение не любит сквозняков и резких перепадов температуры. Полив умеренный. Поливайте, когда высохнет верхний слой грунта. Аглаонема легко переносит непродолжительные засухи, но плохо реагирует на застой воды в горшке, который может привести к загниванию корней. Любит влажный воздух. Регулярно опрыскивайте листья или используйте поддон с влажным керамзитом. Грунт должен быть рыхлым и лёгким, хорошо пропускающим воздух и воду. Можно использовать готовую смесь для ароидных или универсальный грунт с добавлением перлита, торфа и измельчённой сосновой коры. Обязательно обеспечьте дренаж. \n\nУважаемый покупатель! В зеленой массе ароидных содержится токсин — оксалат кальция, который попадая на кожу рук или слизистую оболочку, может вызывать жжение и аллергическую реакцию. \n\nПоставляются молодые растения в технических горшках 9х8х8 см/ 8х7х7 см/ 7х7х7 см/ 6х6х7 см.\n\nПросим Вас при покупке растения не пересаживать его без крайней необходимости 10-14 дней для быстрой и легкой адаптации к новым условиям после транспортировки. Также, после вскрытия транспортировочной коробки и извлечения, не рекомендуется ставить растение под прямые солнечные лучи – после темной коробки растение еще более подвержено солнечным ожогам.\n\nПожалуйста, соблюдайте условия карантина (вдали от Ваших домашних растений) первые 10-14 дней после получения растения с целью предупреждения заражения вредителями. Все наши зеленые питомцы тщательно контролируются на предмет заражения вредителями и болезнями и своевременно обрабатываются, но, к сожалению, вредители на начальных стадиях развития, зачастую не поддаются обнаружению и не оставляют никаких следов своего пребывания.	Аглаонемы	ложноприцветниковая	{новинка,пестрые}	2026-10-11 17:01:17.075622+00	\N	Комнатные	active	AGL-LPR-001	900.00	27efabe2-91ce-45d9-9653-2ed66eb7555a	\N
\.


--
-- TOC entry 3523 (class 0 OID 16580)
-- Dependencies: 228
-- Data for Name: users; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY users.users (id, username, password_hash) FROM stdin;
782a9f9a-04f8-4dc8-84c7-f173af313698	admin	123
\.


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 225
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: messages; Owner: postgres
--

SELECT pg_catalog.setval('messages.contacts_id_seq', 1, false);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: orders; Owner: postgres
--

SELECT pg_catalog.setval('orders.order_items_id_seq', 1, false);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 220
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: orders; Owner: postgres
--

SELECT pg_catalog.setval('orders.orders_id_seq', 1, false);


--
-- TOC entry 3365 (class 2606 OID 16458)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: messages; Owner: postgres
--

ALTER TABLE ONLY messages.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 16433)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 16406)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3367 (class 2606 OID 16564)
-- Name: product_variants_images product_variants_images_pkey; Type: CONSTRAINT; Schema: products; Owner: postgres
--

ALTER TABLE ONLY products.product_variants_images
    ADD CONSTRAINT product_variants_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3361 (class 2606 OID 16566)
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: products; Owner: postgres
--

ALTER TABLE ONLY products.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 16562)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: products; Owner: postgres
--

ALTER TABLE ONLY products.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3369 (class 2606 OID 16585)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY users.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 16598)
-- Name: product_variants fk_product_variants__products; Type: FK CONSTRAINT; Schema: products; Owner: postgres
--

ALTER TABLE ONLY products.product_variants
    ADD CONSTRAINT fk_product_variants__products FOREIGN KEY (product_id) REFERENCES products.products(id) NOT VALID;


--
-- TOC entry 3371 (class 2606 OID 16604)
-- Name: product_variants_images fk_product_variants_images__product_variants; Type: FK CONSTRAINT; Schema: products; Owner: postgres
--

ALTER TABLE ONLY products.product_variants_images
    ADD CONSTRAINT fk_product_variants_images__product_variants FOREIGN KEY (variant_id) REFERENCES products.product_variants(id) NOT VALID;


-- Completed on 2026-10-11 23:04:49

--
-- PostgreSQL database dump complete
--

\unrestrict lxHfZ4WlGthIMuuP8pCjJOKQfUI1xYeywfPRl08nvOvYYMYEf2g17luwCTp7ZJB

