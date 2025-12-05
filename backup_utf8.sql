--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Debian 16.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vouchers_discounttype_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.vouchers_discounttype_enum AS ENUM (
    'percentage',
    'fixed'
);


ALTER TYPE public.vouchers_discounttype_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cartId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL
);


ALTER TABLE public.cart_items OWNER TO admin;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO admin;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "imageUrl" character varying
);


ALTER TABLE public.categories OWNER TO admin;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "productName" character varying NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_items OWNER TO admin;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "voucherCode" character varying,
    "voucherDiscount" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "shippingAddress" text NOT NULL,
    notes text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO admin;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "paymentMethod" character varying,
    "vnpTxnRef" character varying,
    "vnpTransactionNo" character varying,
    "vnpResponseCode" character varying,
    "vnpTransactionStatus" character varying,
    "vnpBankCode" character varying,
    "vnpBankTranNo" character varying,
    "vnpCardType" character varying,
    "vnpPayDate" character varying,
    "failureReason" text,
    metadata jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO admin;

--
-- Name: products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "categoryId" uuid NOT NULL,
    "sellerId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "originalPrice" numeric(10,2),
    sold integer DEFAULT 0 NOT NULL,
    rating numeric(2,1) DEFAULT '0'::numeric NOT NULL,
    location character varying,
    discount integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.products OWNER TO admin;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reviews OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "fullName" character varying NOT NULL,
    role character varying DEFAULT 'buyer'::character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    address character varying,
    phone character varying,
    "bankName" character varying,
    "bankAccountNumber" character varying,
    "bankAccountHolder" character varying
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: vouchers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.vouchers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying NOT NULL,
    description character varying NOT NULL,
    "discountType" public.vouchers_discounttype_enum DEFAULT 'percentage'::public.vouchers_discounttype_enum NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "minOrderValue" numeric(10,2),
    "maxDiscountAmount" numeric(10,2),
    "usageLimit" integer DEFAULT 0 NOT NULL,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "startDate" timestamp without time zone,
    "expiryDate" timestamp without time zone,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vouchers OWNER TO admin;

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cart_items (id, "cartId", "productId", quantity, "unitPrice") FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.carts (id, "userId", "createdAt", "updatedAt") FROM stdin;
d4bf4db8-a6ea-4c5d-84ae-867756bdba1e	03a66bf1-a743-4d53-a9e0-8ddf40795ef9	2025-12-05 06:25:52.911446	2025-12-05 06:25:52.911446
2a8f2880-cd50-4158-8c9d-38906d3e7a6a	f43ca14e-a4fb-4ce0-aaca-fab3d54da214	2025-12-05 06:50:14.272353	2025-12-05 06:50:14.272353
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categories (id, name, description, status, "createdAt", "updatedAt", "imageUrl") FROM stdin;
d992eff2-c73a-4559-8a1e-e5dab923a5c1	Manual Category 20251205000057	\N	active	2025-12-04 17:00:57.563337	2025-12-04 17:00:57.563337	\N
26fb91d4-7ebd-4f8b-bd0b-69b424029918	Ô Tô & Xe Máy & Xe Đạp	\N	active	2025-12-04 17:01:22.928428	2025-12-04 17:01:22.928428	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897026/shopee-clone/category/o-to-va-xe-may-va-xe-dap.png
b985eb4f-5a0f-4daa-81f5-5a3743e49d95	Balo & Túi Ví Nam	\N	active	2025-12-04 17:01:22.950396	2025-12-04 17:01:22.950396	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896985/shopee-clone/category/balo-va-tui-vi-nam.png
753d9887-acad-44e4-b768-a0816d26ac7d	Thời Trang Nữ	\N	active	2025-12-04 17:01:22.970955	2025-12-04 17:01:22.970955	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897039/shopee-clone/category/thoi-trang-nu.png
347ecb9f-b901-457e-9b02-d54c1469f028	Mẹ & Bé	\N	active	2025-12-04 17:01:22.992584	2025-12-04 17:01:22.992584	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897021/shopee-clone/category/me-va-be.png
428b1b84-3397-4d61-b090-18a9975bbfb7	Nhà Cửa & Đời Sống	\N	active	2025-12-04 17:01:23.012121	2025-12-04 17:01:23.012121	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897023/shopee-clone/category/nha-cua-va-doi-song.png
b4abcaf1-7838-43e8-a21c-eea5b71fc1eb	Sắc Đẹp	\N	active	2025-12-04 17:01:23.031583	2025-12-04 17:01:23.031583	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897029/shopee-clone/category/sac-dep.png
7e3fdef6-e26e-4abc-993c-fabbacd6484c	Sức Khỏe	\N	active	2025-12-04 17:01:23.053491	2025-12-04 17:01:23.053491	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897030/shopee-clone/category/suc-khoe.png
6eaa312a-6475-4ffa-9b6c-561e6722d366	Giày Dép Nữ	\N	active	2025-12-04 17:01:23.07731	2025-12-04 17:01:23.07731	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897016/shopee-clone/category/giay-dep-nu.png
9c95bb6b-792a-40c2-b49d-414e47c1e8f7	Phụ Kiện & Trang Sức Nữ	\N	active	2025-12-04 17:01:23.095556	2025-12-04 17:01:23.095556	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897027/shopee-clone/category/phu-kien-va-trang-suc-nu.png
100a67bc-cc4f-4693-91cc-511fba737fb5	Nhà Sách Online	\N	active	2025-12-04 17:01:23.131031	2025-12-04 17:01:23.131031	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897024/shopee-clone/category/nha-sach-online.png
e33cfec1-4467-4f89-9c25-6db75d99c9d1	Đồ Chơi	\N	active	2025-12-04 17:01:23.146909	2025-12-04 17:01:23.146909	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896990/shopee-clone/category/do-choi.png
9db287ca-c8d8-45fa-88dd-7e80ee3c644e	Chăm Sóc Thú Cưng	\N	active	2025-12-04 17:01:23.168496	2025-12-04 17:01:23.168496	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896986/shopee-clone/category/cham-soc-thu-cung.png
ba6cf698-4dd8-4f2a-945e-084da68212f9	Dụng cụ và thiết bị tiện ích	\N	active	2025-12-04 17:01:23.198095	2025-12-04 17:01:23.198095	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897011/shopee-clone/category/dung-cu-va-thiet-bi-tien-ich.png
18ccfc5a-bbd2-4a4a-a912-378ba777fcc7	Thời Trang Trẻ Em	\N	active	2025-12-04 17:01:23.215027	2025-12-04 17:01:23.215027	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897041/shopee-clone/category/thoi-trang-tre-em.png
71de0e44-8dbf-4aa5-92b9-1409de812b9f	Giặt Giũ & Chăm Sóc Nhà Cửa	\N	active	2025-12-04 17:01:23.241687	2025-12-04 17:01:23.241687	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897013/shopee-clone/category/giat-giu-va-cham-soc-nha-cua.png
9147458f-ff61-4316-a285-c28b056891c3	Voucher & Dịch Vụ	\N	active	2025-12-04 17:01:23.275667	2025-12-04 17:01:23.275667	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897043/shopee-clone/category/voucher-va-dich-vu.png
b53af9c2-1fb4-4c98-b3c4-d7b157be0834	Thời Trang Nam	\N	active	2025-12-04 17:01:22.593041	2025-12-04 17:01:22.593041	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897037/shopee-clone/category/thoi-trang-nam.png
e755eaa6-da36-4ff0-b19f-36a0733fcd7f	Điện Thoại & Phụ Kiện	\N	active	2025-12-04 17:01:22.620613	2025-12-04 17:01:22.620613	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896989/shopee-clone/category/dien-thoai-va-phu-kien.png
e8340a58-f1da-4705-9a7d-3e6ca15d7b7a	Thiết Bị Điện Tử	\N	active	2025-12-04 17:01:22.650289	2025-12-04 17:01:22.650289	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897035/shopee-clone/category/thiet-bi-dien-tu.png
b98b8c63-ef4a-4ca1-8c0b-3347fadbef53	Máy Tính & Laptop	\N	active	2025-12-04 17:01:22.689092	2025-12-04 17:01:22.689092	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897019/shopee-clone/category/may-tinh-va-laptop.png
be6f9754-b4d6-4efb-9753-05389fa99750	Máy Ảnh & Máy Quay Phim	\N	active	2025-12-04 17:01:22.715211	2025-12-04 17:01:22.715211	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897018/shopee-clone/category/may-anh-va-may-quay-phim.png
90410bed-cbff-481f-b07a-1055ea05b5a0	Đồng Hồ	\N	active	2025-12-04 17:01:22.750063	2025-12-04 17:01:22.750063	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896999/shopee-clone/category/dong-ho.png
3312e885-c3ec-4eaa-809c-070aa8c09daf	Giày Dép Nam	\N	active	2025-12-04 17:01:22.81685	2025-12-04 17:01:22.81685	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897014/shopee-clone/category/giay-dep-nam.png
5fae71c5-3059-42a7-b567-fd2edacebeaa	Thiết Bị Điện Gia Dụng	\N	active	2025-12-04 17:01:22.865608	2025-12-04 17:01:22.865608	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897033/shopee-clone/category/thiet-bi-dien-gia-dung.png
4f48a87a-08c0-4edf-836e-32fe6b2d4d0b	Thể Thao & Du Lịch	\N	active	2025-12-04 17:01:22.901355	2025-12-04 17:01:22.901355	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897032/shopee-clone/category/the-thao-va-du-lich.png
f7abb601-8680-4796-967f-9d8f1bafb10e	Bách Hóa Online	\N	active	2025-12-04 17:01:23.113231	2025-12-04 17:01:23.113231	https://res.cloudinary.com/dcbrkzuai/image/upload/v1764896983/shopee-clone/category/bach-hoa-online.png
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.order_items (id, "orderId", "productId", "productName", "unitPrice", quantity, "createdAt", "updatedAt") FROM stdin;
70f885a9-9993-4ea8-b9df-7aa8d80181dd	a8b5bdc6-99cb-4c86-a0d5-91800f0fd03c	d957c902-7159-4032-84b9-bd2a42f7ab13	Tinh Dầu Bưởi Cocoon	140000.00	1	2025-12-05 01:48:05.98799	2025-12-05 01:48:05.98799
bf41168f-f3a2-4830-b8a2-4d292f4307d1	4549e0ac-d88b-4120-8309-cc0605922431	0e7d5265-2825-4eec-9be8-62644b2ad7c8	Bộ Chăn Ga Gối Cotton	450000.00	1	2025-12-05 02:02:27.562504	2025-12-05 02:02:27.562504
33dd2973-b1ba-443c-bb78-b950f97c2ed1	e35c0f17-106e-4cfc-8d7b-f1ba64c69e7d	f6bc0f25-11d5-483d-9267-5a5aafeb30cc	Cây Lăn Bụi Quần Áo	30000.00	1	2025-12-05 06:50:13.8875	2025-12-05 06:50:13.8875
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.orders (id, "userId", subtotal, "voucherCode", "voucherDiscount", "totalAmount", status, "shippingAddress", notes, "createdAt", "updatedAt") FROM stdin;
a8b5bdc6-99cb-4c86-a0d5-91800f0fd03c	f43ca14e-a4fb-4ce0-aaca-fab3d54da214	140000.00	\N	0.00	140000.00	pending	[object Object]	\N	2025-12-05 01:48:05.98799	2025-12-05 01:48:05.98799
4549e0ac-d88b-4120-8309-cc0605922431	f43ca14e-a4fb-4ce0-aaca-fab3d54da214	450000.00	\N	0.00	450000.00	cancelled	[object Object]	\N	2025-12-05 02:02:27.562504	2025-12-05 02:26:57.799137
e35c0f17-106e-4cfc-8d7b-f1ba64c69e7d	f43ca14e-a4fb-4ce0-aaca-fab3d54da214	30000.00	\N	0.00	30000.00	pending	[object Object]	\N	2025-12-05 06:50:13.8875	2025-12-05 06:50:13.8875
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.payments (id, "orderId", "userId", amount, status, "paymentMethod", "vnpTxnRef", "vnpTransactionNo", "vnpResponseCode", "vnpTransactionStatus", "vnpBankCode", "vnpBankTranNo", "vnpCardType", "vnpPayDate", "failureReason", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.products (id, name, description, price, stock, images, status, "categoryId", "sellerId", "createdAt", "updatedAt", "originalPrice", sold, rating, location, discount) FROM stdin;
84e7b6dd-b57f-4ce4-a142-0bf51f2ae1cb	Sạc Laptop HP	Description for Sạc Laptop HP	150000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897102/shopee-clone/top-product/sac-laptop-hp.png}	active	e8340a58-f1da-4705-9a7d-3e6ca15d7b7a	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.303554	2025-12-04 17:01:23.303554	\N	0	0.0	\N	0
ffe48cb9-f18d-4eb9-b268-0120dc1fd64a	Bàn Phím Giả Cơ	Description for Bàn Phím Giả Cơ	250000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897083/shopee-clone/top-product/ban-phim-gia-co.png}	active	b98b8c63-ef4a-4ca1-8c0b-3347fadbef53	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.360195	2025-12-04 17:01:23.360195	\N	0	0.0	\N	0
96d741e1-b197-4de1-adbd-167e1bf33265	Tai Nghe Gaming	Description for Tai Nghe Gaming	300000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897104/shopee-clone/top-product/tai-nghe-gaming.png}	active	e8340a58-f1da-4705-9a7d-3e6ca15d7b7a	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.407931	2025-12-04 17:01:23.407931	\N	0	0.0	\N	0
8aa5eb54-5a55-488e-9819-94036387c5e2	Sạc Dự Phòng	Description for Sạc Dự Phòng	200000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897100/shopee-clone/top-product/sac-du-phong.png}	active	e755eaa6-da36-4ff0-b19f-36a0733fcd7f	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.436986	2025-12-04 17:01:23.436986	\N	0	0.0	\N	0
ce6b839e-ec69-462a-b662-073490366957	Thảm Trải Sàn	Description for Thảm Trải Sàn	100000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897105/shopee-clone/top-product/tham-trai-san.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.466109	2025-12-04 17:01:23.466109	\N	0	0.0	\N	0
bde15b77-36a0-45f0-be7b-9c4edf9d914a	Bộ Vệ Sinh Laptop	Description for Bộ Vệ Sinh Laptop	50000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897087/shopee-clone/top-product/bo-ve-sinh-laptop.png}	active	b98b8c63-ef4a-4ca1-8c0b-3347fadbef53	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.519394	2025-12-04 17:01:23.519394	\N	0	0.0	\N	0
59404c72-1f3a-4e9c-b5e5-5f740e7f8288	Khăn Trải Bàn Caro	Description for Khăn Trải Bàn Caro	80000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897099/shopee-clone/top-product/khan-trai-ban-caro.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.575316	2025-12-04 17:01:23.575316	\N	0	0.0	\N	0
0f0db6a7-62b0-4889-b0c5-e6f23a8dae4e	Áo Thun	Description for Áo Thun	120000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897081/shopee-clone/top-product/ao-thun.png}	active	b53af9c2-1fb4-4c98-b3c4-d7b157be0834	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.646351	2025-12-04 17:01:23.646351	\N	0	0.0	\N	0
ffcc161f-8158-4e2d-865e-10da3cb717cb	Bánh Trứng Tipo	Description for Bánh Trứng Tipo	40000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897084/shopee-clone/top-product/banh-trung-tipo.png}	active	f7abb601-8680-4796-967f-9d8f1bafb10e	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.689288	2025-12-04 17:01:23.689288	\N	0	0.0	\N	0
5ef3df94-bb6e-484e-9c05-f93cc582691f	Dép Đi Trong Nhà	Description for Dép Đi Trong Nhà	60000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897094/shopee-clone/top-product/dep-di-trong-nha.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.7174	2025-12-04 17:01:23.7174	\N	0	0.0	\N	0
c58cb4a4-c41d-48d1-b8a2-043f64e89bf3	Dụng Cụ Lấy Ráy Tai	Description for Dụng Cụ Lấy Ráy Tai	20000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897095/shopee-clone/top-product/dung-cu-lay-ray-tai.png}	active	7e3fdef6-e26e-4abc-993c-fabbacd6484c	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.79628	2025-12-04 17:01:23.79628	\N	0	0.0	\N	0
1245cffd-9036-422b-9005-f4c8f5ae276d	Dầu Gội Nguyên Xuân	Description for Dầu Gội Nguyên Xuân	110000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897092/shopee-clone/top-product/dau-goi-nguyen-xuan.png}	active	b4abcaf1-7838-43e8-a21c-eea5b71fc1eb	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.942335	2025-12-04 17:01:23.942335	\N	0	0.0	\N	0
120d056a-a9e0-4af9-8701-46e4b4678c04	ádasdsa	ádasdsaádasdsaádasdsaádasdsa	500000.00	10	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764913068/shopee-clone/toi-cuop-giat-tai-san-01.png}	active	f7abb601-8680-4796-967f-9d8f1bafb10e	f43ca14e-a4fb-4ce0-aaca-fab3d54da214	2025-12-05 05:27:16.634408	2025-12-05 05:37:48.113944	\N	0	0.0	\N	0
dd056499-002a-4194-884f-3fd0f967c1b1	Kem Dưỡng Cerave	Description for Kem Dưỡng Cerave	350000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897097/shopee-clone/top-product/kem-duong-cerave.png}	active	b4abcaf1-7838-43e8-a21c-eea5b71fc1eb	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:24.038848	2025-12-04 17:01:24.038848	\N	0	0.0	\N	0
652ddf12-0670-43d5-a16e-eb57c1cbe89f	Cây Lau Kính	Description for Cây Lau Kính	90000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897091/shopee-clone/top-product/cay-lau-kinh.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:24.090773	2025-12-04 17:01:24.090773	\N	0	0.0	\N	0
d957c902-7159-4032-84b9-bd2a42f7ab13	Tinh Dầu Bưởi Cocoon	Description for Tinh Dầu Bưởi Cocoon	140000.00	99	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897108/shopee-clone/top-product/tinh-dau-buoi-cocoon.png}	active	b4abcaf1-7838-43e8-a21c-eea5b71fc1eb	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.993105	2025-12-05 01:48:05.98799	\N	0	0.0	\N	0
f6bc0f25-11d5-483d-9267-5a5aafeb30cc	Cây Lăn Bụi Quần Áo	Description for Cây Lăn Bụi Quần Áo	30000.00	99	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897089/shopee-clone/top-product/cay-lan-bui-quan-ao.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.745253	2025-12-05 06:50:13.8875	\N	0	0.0	\N	0
0e7d5265-2825-4eec-9be8-62644b2ad7c8	Bộ Chăn Ga Gối Cotton	Description for Bộ Chăn Ga Gối Cotton	450000.00	100	{https://res.cloudinary.com/dcbrkzuai/image/upload/v1764897086/shopee-clone/top-product/bo-chan-ga-goi-cotton.png}	active	428b1b84-3397-4d61-b090-18a9975bbfb7	48500f3a-732d-4e36-a42f-2a7c63513a2c	2025-12-04 17:01:23.873398	2025-12-05 02:26:57.799137	\N	0	0.0	\N	0
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reviews (id, "userId", "productId", rating, comment, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, email, password, "fullName", role, status, "createdAt", "updatedAt", address, phone, "bankName", "bankAccountNumber", "bankAccountHolder") FROM stdin;
b0a3baa3-6d5b-428e-9ecb-2275e925b527	admin.1764863463765@shopee.clone	$2b$10$jj4nmAMeTnlyP.WAZcK.beTqU2NG4emv.X0GL5KidRkhzI7PjVSEu	Admin User	buyer	active	2025-12-04 15:51:04.822965	2025-12-04 15:51:04.822965	\N	\N	\N	\N	\N
84c221d5-c49e-4d7c-a304-960996a80a96	testuser_testuser_1719302400@example.com	$2b$10$5yeswrVdAqFX0MpiszVOMOpIiUmBFl9aPZPwM4EjG6a17KUKDK.z.	Test User	buyer	active	2025-12-04 15:54:15.327729	2025-12-04 15:54:15.327729	\N	\N	\N	\N	\N
245d03ce-8a97-4afb-81da-003696b0dc1a	test1764863800299@example.com	$2b$10$LyzrK72l6y5oClxyt3vBmOt3BEPT.0cNRE6VkYwuMHxOp/TqzGsxK	Test User	buyer	active	2025-12-04 15:56:40.717604	2025-12-04 15:56:40.717604	\N	\N	\N	\N	\N
b3a63ac1-75b4-41f1-93eb-89efd7818c56	admin.1764864759495@shopee.clone	$2b$10$Cf/.Bs0WGSrIwsgJkJ6LvONJe1AstV3KSCC7qZcDfX9tZlnysdXmy	Admin User	buyer	active	2025-12-04 16:12:39.561549	2025-12-04 16:12:39.561549	\N	\N	\N	\N	\N
1fe1e6a3-d815-48d2-a32b-62d4db10f258	admin.1764864840861@shopee.clone	$2b$10$F5Eg2MfE1IPPJyqBseFkv.d/naYoqVHFukDVSgss251OREF4ltONq	Admin User	buyer	active	2025-12-04 16:14:01.249406	2025-12-04 16:14:01.249406	\N	\N	\N	\N	\N
2703c4b5-1302-4f34-a372-dc7446c45783	admin@shopee.clone	$2b$10$jxOdel6WHJ5QDKU.6z9yout6DQJlgcqonKs6s9EtiDW/arnlB2GiK	Admin User	buyer	active	2025-12-04 16:15:03.258171	2025-12-04 16:15:03.258171	\N	\N	\N	\N	\N
b1b648cc-a58b-4a81-a88e-50f4dc8277e9	admin.1764865000737@shopee.clone	$2b$10$J3RjxQEMMrFo0lZzC93EY.ZKJFaBmptffJKO/n.H4Z1vTQTrUBh5O	Admin User	buyer	active	2025-12-04 16:16:40.979649	2025-12-04 16:16:40.979649	\N	\N	\N	\N	\N
7ed036fb-e5a0-48d1-9992-2e3b57d6309b	admin.1764865105701@shopee.clone	$2b$10$sIs8x3b2NtvgloaUkfB9telN56797en2wDERuurZSlNOeNfGMqtD.	Admin User	buyer	active	2025-12-04 16:18:25.640091	2025-12-04 16:18:25.640091	\N	\N	\N	\N	\N
ea8e79d2-b5d3-4a49-9996-2fd9ca276b9b	admin.1764865295973@shopee.clone	$2b$10$59ABMWY66tLiC.Ml2ZivuuastFjdHErAnJTHcxim.3zX3VruyE092	Admin User	buyer	active	2025-12-04 16:21:36.057525	2025-12-04 16:21:36.057525	\N	\N	\N	\N	\N
4f7bf0a1-d328-46cc-8968-6c585b2f9935	admin.1764865552253@shopee.clone	$2b$10$Za.KmlqEz8B5b3eMh5kcFucDXXD5XPmWWvdNoZrEG/kYKg2x8f5y.	Admin User	buyer	active	2025-12-04 16:25:52.643306	2025-12-04 16:25:52.643306	\N	\N	\N	\N	\N
9d828045-5171-4568-b93c-13a53302e541	admin.1764866974941@shopee.clone	$2b$10$YtJroHFFzdMi8V8BL9seGOZuBiMRnTqWp.o3F1ChU.z6K5PL/sZkO	Admin User	buyer	active	2025-12-04 16:49:35.163974	2025-12-04 16:49:35.163974	\N	\N	\N	\N	\N
e283a7df-5ef2-4dd1-930c-8b02dc3c730f	admin.1764867300818@shopee.clone	$2b$10$ZGrZG7XRl2uZdqdi5o3VT.mh2HDneozV3KAujhlrte3Kh0UQoBU8m	Admin User	buyer	active	2025-12-04 16:55:01.159268	2025-12-04 16:55:01.159268	\N	\N	\N	\N	\N
3e8d3a2a-79d6-4bd4-a5ff-a016d040c0cd	admin.verify@shopee.clone	$2b$10$fThQ22gkBw9hURHLIHDcZuhXoih6fK1RP7lmiJWOSEAXaNzcd.D1i	Verify Admin	buyer	active	2025-12-04 16:57:51.136635	2025-12-04 16:57:51.136635	\N	\N	\N	\N	\N
089f28e7-e1fe-4b0c-8d33-72a4853eb0c2	admin.verify.20251205000057@shopee.clone	$2b$10$Ohbd.pDLygYeQVRCs/.z1OGH4WXrZisqHiz3h5nE5jDlqTTc61kFe	Verify Admin	admin	active	2025-12-04 17:00:57.329586	2025-12-04 17:00:57.329586	\N	\N	\N	\N	\N
48500f3a-732d-4e36-a42f-2a7c63513a2c	admin.1764867682135@shopee.clone	$2b$10$dXLJVbZlCbDlKjzUawosKOBPMCQbYwUJVxctgrRh5W6M4n/TZiP72	Admin User	admin	active	2025-12-04 17:01:22.435097	2025-12-04 17:01:22.435097	\N	\N	\N	\N	\N
9bee714a-c5ee-463f-992a-0b59ab6f4507	admin.1764868364724@shopee.clone	$2b$10$5Ely4FRiUCjBFM4pPdRCke1SmC3.2fN0euBwqHsi2vcvmOsTgGvrW	Admin User	admin	active	2025-12-04 17:12:45.026648	2025-12-04 17:12:45.026648	\N	\N	\N	\N	\N
ce1a59e7-519a-4e39-92d3-155dbdbfda20	admin.1764868473591@shopee.clone	$2b$10$XVxC0hK58DqwGbiaaFgEPejEPqF0fMtKb3UjT2G2RDvB1O8/gFc4i	Admin User	admin	active	2025-12-04 17:14:34.197408	2025-12-04 17:14:34.197408	\N	\N	\N	\N	\N
03a66bf1-a743-4d53-a9e0-8ddf40795ef9	testadmin@gmail.com	$2b$10$fRnE1D27KR.RgPa4iPdXMOMeGmE6a7Pfk9ojQoaPHtu44tL0g.E/.	test	admin	active	2025-12-05 06:25:52.273997	2025-12-05 06:25:52.273997	\N	\N	\N	\N	\N
f43ca14e-a4fb-4ce0-aaca-fab3d54da214	test@gmail.com	$2b$10$KpYyIpM.2a6HwNaS0sUs0.gmR4FDoBSeruaVhq1kVMivAofYxyioS	Test User	seller	active	2025-12-04 23:33:57.289175	2025-12-05 06:44:55.888191	HA Noi	0123456789	Vietcombank	123456789	SHOP ONLINE
\.


--
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.vouchers (id, code, description, "discountType", "discountValue", "minOrderValue", "maxDiscountAmount", "usageLimit", "usedCount", "startDate", "expiryDate", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: reviews PK_231ae565c273ee700b283f15c1d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: cart_items PK_6fccf5ec03c172d27a28a82928b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: carts PK_b5f695a59f5ebb50af3c8160816; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id);


--
-- Name: vouchers PK_ed1b7dd909a696560763acdbc04; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY (id);


--
-- Name: carts UQ_69828a178f152f157dcf2f70a89; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "UQ_69828a178f152f157dcf2f70a89" UNIQUE ("userId");


--
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- Name: reviews UQ_9007ffba411fd471dfe233dabfb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "UQ_9007ffba411fd471dfe233dabfb" UNIQUE ("userId", "productId");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: vouchers UQ_efc30b2b9169e05e0e1e19d6dd6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6" UNIQUE (code);


--
-- Name: orders FK_151b79a83ba240b0cb31b2302d1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: cart_items FK_72679d98b31c737937b8932ebe6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: reviews FK_7ed5659e7139fc8bc039198cc1f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: reviews FK_a6b3c434392f5d10ec171043666; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: payments FK_af929a5f2a400fdb6913b4967e1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES public.orders(id);


--
-- Name: order_items FK_cdb99c05982d5191ac8465ac010; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: payments FK_d35cb3c13a18e1ea1705b2817b1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: products FK_e40a1dd2909378f0da1f34f7bd6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6" FOREIGN KEY ("sellerId") REFERENCES public.users(id);


--
-- Name: cart_items FK_edd714311619a5ad09525045838; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: order_items FK_f1d359a55923bb45b057fbdab0d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

