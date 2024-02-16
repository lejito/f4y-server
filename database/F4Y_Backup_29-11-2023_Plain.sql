--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.3

-- Started on 2023-11-29 23:18:16

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

DROP DATABASE f4ydb;
--
-- TOC entry 2646 (class 1262 OID 16386)
-- Name: f4ydb; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE f4ydb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE f4ydb OWNER TO postgres;

\connect f4ydb

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
-- TOC entry 2648 (class 0 OID 0)
-- Name: f4ydb; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE f4ydb SET "TimeZone" TO 'America/Bogota';


\connect f4ydb

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 24629)
-- Name: bolsillos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bolsillos (
    id integer NOT NULL,
    cuenta integer NOT NULL,
    nombre character varying(20) NOT NULL,
    saldo numeric(16,2) DEFAULT 0 NOT NULL,
    saldo_objetivo numeric(16,2),
    eliminado boolean DEFAULT false NOT NULL,
    CONSTRAINT bolsillos_ck_saldo CHECK ((saldo >= (0)::numeric)),
    CONSTRAINT bolsillos_ck_saldo_objetivo CHECK ((saldo_objetivo > (0)::numeric))
);


ALTER TABLE public.bolsillos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24628)
-- Name: bolsillos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bolsillos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bolsillos_id_seq OWNER TO postgres;

--
-- TOC entry 2649 (class 0 OID 0)
-- Dependencies: 222
-- Name: bolsillos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bolsillos_id_seq OWNED BY public.bolsillos.id;


--
-- TOC entry 227 (class 1259 OID 24648)
-- Name: cdts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cdts (
    id integer NOT NULL,
    cuenta integer NOT NULL,
    inversion numeric(16,2) NOT NULL,
    interes numeric(5,2) NOT NULL,
    retencion numeric(5,2) NOT NULL,
    duracion smallint NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    liquidado boolean DEFAULT false NOT NULL,
    cancelado boolean DEFAULT false NOT NULL,
    CONSTRAINT cdts_ck_duracion CHECK ((duracion > 0)),
    CONSTRAINT cdts_ck_interes CHECK ((interes >= (0)::numeric)),
    CONSTRAINT cdts_ck_inversion CHECK ((inversion > (0)::numeric)),
    CONSTRAINT cdts_ck_retencion CHECK (((retencion >= (0)::numeric) AND (retencion <= (100)::numeric)))
);


ALTER TABLE public.cdts OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24647)
-- Name: cdts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cdts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cdts_id_seq OWNER TO postgres;

--
-- TOC entry 2650 (class 0 OID 0)
-- Dependencies: 226
-- Name: cdts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cdts_id_seq OWNED BY public.cdts.id;


--
-- TOC entry 215 (class 1259 OID 24589)
-- Name: cuentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuentas (
    id integer NOT NULL,
    tipo_identificacion character varying(2) NOT NULL,
    numero_identificacion character varying(10) NOT NULL,
    primer_nombre character varying(20) NOT NULL,
    segundo_nombre character varying(20),
    primer_apellido character varying(20) NOT NULL,
    segundo_apellido character varying(20),
    fecha_nacimiento date NOT NULL,
    correo character varying(120) NOT NULL,
    clave character varying(76) NOT NULL,
    saldo numeric(16,2) DEFAULT 0 NOT NULL,
    bloqueada boolean DEFAULT false NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT cuentas_ck_saldo CHECK ((saldo >= (0)::numeric)),
    CONSTRAINT cuentas_ck_tipo_identificacion CHECK (((tipo_identificacion)::text = ANY ((ARRAY['CC'::character varying, 'TI'::character varying, 'CE'::character varying, 'PP'::character varying])::text[])))
);


ALTER TABLE public.cuentas OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 24588)
-- Name: cuentas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuentas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cuentas_id_seq OWNER TO postgres;

--
-- TOC entry 2651 (class 0 OID 0)
-- Dependencies: 214
-- Name: cuentas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuentas_id_seq OWNED BY public.cuentas.id;


--
-- TOC entry 219 (class 1259 OID 24613)
-- Name: movimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos (
    id integer NOT NULL,
    cuenta integer NOT NULL,
    monto numeric(16,2) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT movimientos_ck_monto CHECK ((monto > (0)::numeric))
);


ALTER TABLE public.movimientos OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24612)
-- Name: movimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movimientos_id_seq OWNER TO postgres;

--
-- TOC entry 2652 (class 0 OID 0)
-- Dependencies: 218
-- Name: movimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_id_seq OWNED BY public.movimientos.id;


--
-- TOC entry 217 (class 1259 OID 24606)
-- Name: registros_actividad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registros_actividad (
    id integer NOT NULL,
    cuenta integer NOT NULL,
    accion character varying(50) NOT NULL,
    fecha timestamp without time zone NOT NULL
);


ALTER TABLE public.registros_actividad OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24605)
-- Name: registros_actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registros_actividad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.registros_actividad_id_seq OWNER TO postgres;

--
-- TOC entry 2653 (class 0 OID 0)
-- Dependencies: 216
-- Name: registros_actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registros_actividad_id_seq OWNED BY public.registros_actividad.id;


--
-- TOC entry 225 (class 1259 OID 24640)
-- Name: transferencias_bolsillos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencias_bolsillos (
    id integer NOT NULL,
    movimiento integer NOT NULL,
    bolsillo integer NOT NULL,
    carga boolean DEFAULT true NOT NULL
);


ALTER TABLE public.transferencias_bolsillos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24639)
-- Name: transferencias_bolsillos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transferencias_bolsillos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transferencias_bolsillos_id_seq OWNER TO postgres;

--
-- TOC entry 2654 (class 0 OID 0)
-- Dependencies: 224
-- Name: transferencias_bolsillos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_bolsillos_id_seq OWNED BY public.transferencias_bolsillos.id;


--
-- TOC entry 229 (class 1259 OID 24661)
-- Name: transferencias_cdts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencias_cdts (
    id integer NOT NULL,
    movimiento integer NOT NULL,
    cdt integer NOT NULL,
    tipo character varying(15) NOT NULL,
    CONSTRAINT transferencias_cdts_ck_tipo CHECK (((tipo)::text = ANY ((ARRAY['inversion'::character varying, 'liquidacion'::character varying, 'cancelacion'::character varying])::text[])))
);


ALTER TABLE public.transferencias_cdts OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24660)
-- Name: transferencias_cdts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transferencias_cdts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transferencias_cdts_id_seq OWNER TO postgres;

--
-- TOC entry 2655 (class 0 OID 0)
-- Dependencies: 228
-- Name: transferencias_cdts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_cdts_id_seq OWNED BY public.transferencias_cdts.id;


--
-- TOC entry 221 (class 1259 OID 24622)
-- Name: transferencias_externas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencias_externas (
    id integer NOT NULL,
    movimiento integer NOT NULL,
    entidad character varying(20) NOT NULL,
    cuenta character varying(15) NOT NULL,
    carga boolean DEFAULT true NOT NULL
);


ALTER TABLE public.transferencias_externas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24621)
-- Name: transferencias_externas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transferencias_externas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transferencias_externas_id_seq OWNER TO postgres;

--
-- TOC entry 2656 (class 0 OID 0)
-- Dependencies: 220
-- Name: transferencias_externas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_externas_id_seq OWNED BY public.transferencias_externas.id;


--
-- TOC entry 2435 (class 2604 OID 24632)
-- Name: bolsillos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolsillos ALTER COLUMN id SET DEFAULT nextval('public.bolsillos_id_seq'::regclass);


--
-- TOC entry 2440 (class 2604 OID 24651)
-- Name: cdts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cdts ALTER COLUMN id SET DEFAULT nextval('public.cdts_id_seq'::regclass);


--
-- TOC entry 2426 (class 2604 OID 24592)
-- Name: cuentas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas ALTER COLUMN id SET DEFAULT nextval('public.cuentas_id_seq'::regclass);


--
-- TOC entry 2431 (class 2604 OID 24616)
-- Name: movimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos ALTER COLUMN id SET DEFAULT nextval('public.movimientos_id_seq'::regclass);


--
-- TOC entry 2430 (class 2604 OID 24609)
-- Name: registros_actividad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_actividad ALTER COLUMN id SET DEFAULT nextval('public.registros_actividad_id_seq'::regclass);


--
-- TOC entry 2438 (class 2604 OID 24643)
-- Name: transferencias_bolsillos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_bolsillos ALTER COLUMN id SET DEFAULT nextval('public.transferencias_bolsillos_id_seq'::regclass);


--
-- TOC entry 2443 (class 2604 OID 24664)
-- Name: transferencias_cdts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_cdts ALTER COLUMN id SET DEFAULT nextval('public.transferencias_cdts_id_seq'::regclass);


--
-- TOC entry 2433 (class 2604 OID 24625)
-- Name: transferencias_externas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_externas ALTER COLUMN id SET DEFAULT nextval('public.transferencias_externas_id_seq'::regclass);


--
-- TOC entry 2634 (class 0 OID 24629)
-- Dependencies: 223
-- Data for Name: bolsillos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (4, 26, 'AhorritosXD', 0.00, NULL, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (9, 28, 'Echar a Fercho', 0.00, 1500000.00, false);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (10, 28, 'Bolsillo2', 0.00, NULL, false);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (11, 26, 'Pruebita2', 0.00, 655000.00, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (7, 26, 'LELELE', 0.00, 50000.00, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (6, 26, 'Pruebita3', 0.00, 10000000.00, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (8, 26, 'Pruebita', 0.00, NULL, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (5, 26, '2025-1', 0.00, 200000.00, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (3, 26, 'Emergencias', 1200000.00, NULL, false);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (1, 26, 'Ahorros 2025', 0.00, 2500000.00, true);
INSERT INTO public.bolsillos (id, cuenta, nombre, saldo, saldo_objetivo, eliminado) VALUES (2, 26, 'Universidad', 0.00, 10000000.00, false);


--
-- TOC entry 2638 (class 0 OID 24648)
-- Dependencies: 227
-- Data for Name: cdts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (2, 26, 700000.00, 12.25, 4.00, 30, '2023-06-15', '2023-07-15', false, true);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (4, 26, 5000000.00, 12.25, 4.00, 180, '2023-10-03', '2024-03-31', false, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (1, 26, 500000.00, 12.25, 4.00, 90, '2023-05-14', '2023-08-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (5, 26, 5000000.00, 12.25, 4.00, 1800, '2023-11-13', '2028-10-17', false, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (8, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (7, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (6, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (9, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', false, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (10, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (11, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (3, 26, 10000000.00, 12.25, 4.00, 360, '2022-11-15', '2023-11-10', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (12, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (13, 26, 500000.00, 12.25, 4.00, 90, '2023-11-14', '2024-02-12', true, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (14, 26, 500000.00, 12.25, 4.00, 90, '2023-10-14', '2024-01-12', false, false);
INSERT INTO public.cdts (id, cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin, liquidado, cancelado) VALUES (15, 26, 500000.00, 12.25, 4.00, 180, '2022-10-14', '2023-04-12', true, false);


--
-- TOC entry 2626 (class 0 OID 24589)
-- Dependencies: 215
-- Data for Name: cuentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cuentas (id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, clave, saldo, bloqueada, fecha_creacion) VALUES (28, 'CE', '1000000000', 'Fercho', 'Fernando', 'Aristixabal', 'Ramírez', '1980-10-26', 'aristizabal.fercho@gmail.com', '$2b$10$Nwx.7.mCU3BKlgItKWZ3jueUcwrxPo8rK.kgrd6QTzICgPeUnV1Mi', 2000000.00, false, '2023-11-13 22:38:25.046');
INSERT INTO public.cuentas (id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, clave, saldo, bloqueada, fecha_creacion) VALUES (1, 'CC', '1034576855', 'Adrian', 'Jesús', 'Perdomo', 'Echeverry', '2000-07-14', 'aecheverry@gmail.com', '$2b$10$MY0HQVqOOfzIFRnhyI5gMusmcvOVPCAUnGCeGPqs2MStPLCg4Wp.u', 0.00, false, '2023-11-05 16:46:27.256');
INSERT INTO public.cuentas (id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, clave, saldo, bloqueada, fecha_creacion) VALUES (29, 'CC', '1027662648', 'Kevin', 'Andres', 'gil', 'rojas', '2003-11-28', 'kevincitogil@hotmail.com', '$2b$10$JE3idzPwqhHgg2HsSA55A.gDaGufTeF9PF00e3d/k7QN/p9/lTkn2', 0.00, false, '2023-11-14 13:07:54.21');
INSERT INTO public.cuentas (id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, clave, saldo, bloqueada, fecha_creacion) VALUES (26, 'CC', '1001025610', 'Alejandro', NULL, 'Córdoba', 'Ríos', '2003-05-27', 'alejocrrs22455@gmail.com', '$2b$10$ct29uigE2kHdrlNepWtlo.LBhNIkMLtBhBBG8xqLp5sG4xahGJE8.', 25806530.01, false, '2023-11-04 22:21:13.653');


--
-- TOC entry 2630 (class 0 OID 24613)
-- Dependencies: 219
-- Data for Name: movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (1, 26, 500000.00, '2023-11-11 15:58:45.429594');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (2, 26, 300000.00, '2023-11-11 17:37:39.843304');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (3, 26, 200000.00, '2023-11-11 17:38:25.376641');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (4, 26, 500000.00, '2023-11-11 17:59:25.204786');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (5, 26, 200000.00, '2023-11-11 18:02:27.598738');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (6, 26, 2000000.00, '2023-11-11 18:03:24.908447');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (7, 26, 750000.00, '2023-11-11 18:05:37.077065');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (8, 26, 22569.99, '2023-11-11 18:06:54.670103');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (9, 26, 500000.00, '2023-05-14 14:25:30.744484');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (11, 26, 700000.00, '2023-06-15 15:18:23.755094');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (12, 26, 700000.00, '2023-06-17 11:01:53.345672');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (13, 26, 10000000.00, '2022-11-15 16:48:40.524983');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (14, 26, 5000000.00, '2023-10-03 20:14:45.380407');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (15, 26, 70000.00, '2023-11-11 23:46:46.851241');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (10, 26, 514700.00, '2023-08-12 22:32:40.067275');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (16, 26, 50000.00, '2023-11-12 20:49:46.051');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (17, 26, 50000.00, '2023-11-12 20:50:37.087');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (18, 26, 100000.00, '2023-11-12 21:25:39.512');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (19, 26, 30000.00, '2023-11-12 21:32:35.6');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (20, 26, 30000.00, '2023-11-12 21:33:25.79');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (21, 26, 40000.00, '2023-11-12 21:35:45.801');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (22, 26, 70000.00, '2023-11-12 21:37:01.62');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (23, 26, 50000.00, '2023-11-12 22:04:36.293');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (24, 26, 50000.00, '2023-11-12 22:05:14.785');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (25, 26, 50000.00, '2023-11-12 22:05:58.354');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (26, 26, 50000.00, '2023-11-12 22:22:46.029');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (27, 26, 10000.00, '2023-11-12 22:23:35.792');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (28, 26, 100000.00, '2023-11-12 22:24:40.053');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (29, 26, 10000.00, '2023-11-12 22:32:03.224');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (30, 26, 10000.00, '2023-11-12 22:37:58.316');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (31, 26, 10000.00, '2023-11-12 22:41:50.565');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (32, 26, 10000.00, '2023-11-12 22:42:26.705');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (33, 26, 5000.00, '2023-11-12 22:43:09.632');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (34, 26, 5000.00, '2023-11-12 22:44:29.892');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (35, 26, 10000.00, '2023-11-13 02:41:11.573');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (36, 26, 1200000.00, '2023-11-13 02:47:35.459');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (37, 26, 5000000.00, '2023-11-13 02:51:09.81');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (38, 26, 50000.00, '2023-11-13 03:10:49.592');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (39, 26, 50000.00, '2023-11-13 03:23:23.861');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (40, 26, 10000.00, '2023-11-13 19:12:08.819');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (41, 26, 10000.00, '2023-11-13 19:12:27.226');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (42, 26, 10000.00, '2023-11-13 19:13:16.696');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (43, 26, 10000.00, '2023-11-13 19:13:49.804');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (44, 26, 10000.00, '2023-11-13 19:18:38.973');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (45, 28, 2100000.00, '2023-11-13 22:43:32.534');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (46, 28, 100000.00, '2023-11-13 22:44:45.278');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (47, 26, 5000.00, '2023-11-14 00:06:00.129');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (48, 26, 5000.00, '2023-11-14 01:25:14.538');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (49, 26, 200000.00, '2023-11-14 01:25:28.416');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (50, 26, 727430.01, '2023-11-14 01:51:19.854');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (51, 26, 766000.00, '2023-11-14 01:52:41.352');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (52, 26, 5000.00, '2023-11-14 01:54:58.849');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (53, 26, 5000.00, '2023-11-14 01:55:53.85');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (54, 26, 5000.00, '2023-11-14 01:56:36.62');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (55, 26, 5000.00, '2023-11-14 01:57:34.953');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (56, 26, 5000.00, '2023-11-14 01:59:07.992');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (57, 26, 786000.00, '2023-11-14 01:59:42.426');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (58, 26, 200000.00, '2023-11-14 02:04:18.41');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (59, 26, 200000.00, '2023-11-14 02:05:35.405');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (60, 26, 2000000.00, '2023-11-14 02:05:59.206');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (61, 26, 2000000.00, '2023-11-14 02:06:18.27');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (62, 26, 10000000.00, '2023-11-14 02:06:51.202');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (63, 26, 4000000.00, '2023-11-14 02:07:29.711');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (64, 26, 1000000.00, '2023-11-14 02:07:38.893');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (65, 26, 1000000.00, '2023-11-14 02:12:51.239');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (66, 26, 100000.00, '2023-11-14 02:14:16.457');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (67, 26, 900000.00, '2023-11-14 02:16:45.473');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (68, 26, 1800000.00, '2023-11-14 02:17:00.185');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (69, 26, 500000.00, '2023-11-14 05:14:16.067');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (70, 26, 500000.00, '2023-11-14 05:15:15.766');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (71, 26, 500000.00, '2023-11-14 05:17:27.929');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (72, 26, 500000.00, '2023-11-14 05:29:33.615');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (73, 26, 500000.00, '2023-11-14 05:38:28.525');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (74, 26, 500000.00, '2023-11-14 05:39:43.007');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (75, 26, 500000.00, '2023-11-14 05:42:52.035');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (76, 26, 514700.00, '2023-11-14 05:43:07.246');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (77, 26, 10000000.00, '2023-11-14 05:51:44.161');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (78, 26, 500000.00, '2023-11-14 05:52:29.773');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (79, 26, 500000.00, '2023-11-14 05:53:07.484');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (80, 26, 500000.00, '2023-11-14 05:53:35.743');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (81, 26, 500000.00, '2023-11-14 05:53:41.802');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (82, 26, 500000.00, '2023-11-14 05:54:24.638');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (83, 26, 500000.00, '2023-11-14 11:44:41.166');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (84, 26, 529400.00, '2023-11-14 11:48:32.041');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (85, 29, 10000000.00, '2023-11-14 13:09:51.973');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (86, 29, 10000000.00, '2023-11-14 13:10:23.513');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (87, 26, 50000.00, '2023-11-14 13:56:01.818');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (88, 26, 50000.00, '2023-11-14 13:56:57.318');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (89, 26, 750000.00, '2023-11-14 13:57:40.909');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (90, 26, 200000.00, '2023-11-14 13:58:16.096');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (91, 26, 50000.00, '2023-11-14 14:16:14.053');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (92, 26, 50000.00, '2023-11-14 14:16:50.88');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (93, 26, 10000000.00, '2023-11-14 14:17:31.94');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (94, 26, 1000000.00, '2023-11-14 14:18:09.768');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (95, 26, 1000000.00, '2023-11-14 14:36:54.874');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (96, 26, 10000000.00, '2023-11-14 14:38:09.223');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (97, 26, 10000000.00, '2023-11-14 14:38:46.923');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (98, 26, 100000.00, '2023-11-15 03:41:15.363');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (99, 26, 50000.00, '2023-11-16 17:33:04.616');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (100, 26, 10000.00, '2023-11-16 17:37:06.442');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (101, 26, 10000.00, '2023-11-16 17:38:08.308');
INSERT INTO public.movimientos (id, cuenta, monto, fecha) VALUES (102, 26, 10000.00, '2023-11-17 02:26:32.892');


--
-- TOC entry 2628 (class 0 OID 24606)
-- Dependencies: 217
-- Data for Name: registros_actividad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (11, 26, 'Iniciar sesión', '2023-11-05 16:59:41.654');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (12, 26, 'Iniciar sesión', '2023-11-06 19:34:08.855');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (13, 26, 'Iniciar sesión', '2023-11-06 21:46:06.366');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (14, 26, 'Cerrar sesión', '2023-11-06 21:56:07.472');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (15, 26, 'Cerrar sesión', '2023-11-06 21:56:19.152');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (16, 26, 'Cerrar sesión', '2023-11-06 22:46:29.039');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (17, 26, 'Iniciar sesión', '2023-11-07 00:35:25.468');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (18, 26, 'Cerrar sesión', '2023-11-07 00:59:57.675');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (19, 26, 'Iniciar sesión', '2023-11-07 01:24:30.194');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (20, 26, 'Iniciar sesión', '2023-11-07 01:31:13.438');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (21, 26, 'Iniciar sesión', '2023-11-07 01:31:30.211');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (22, 26, 'Iniciar sesión', '2023-11-07 01:32:10.593');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (23, 26, 'Cerrar sesión', '2023-11-07 01:33:05.884');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (24, 26, 'Iniciar sesión', '2023-11-07 01:34:35.506');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (25, 26, 'Cerrar sesión', '2023-11-07 01:34:38.042');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (26, 26, 'Iniciar sesión', '2023-11-07 01:34:43.754');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (27, 26, 'Cerrar sesión', '2023-11-07 01:37:39.675');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (28, 26, 'Iniciar sesión', '2023-11-07 01:38:03.474');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (29, 26, 'Iniciar sesión', '2023-11-07 01:39:55.301');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (30, 26, 'Iniciar sesión', '2023-11-07 01:41:16.996');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (31, 26, 'Iniciar sesión', '2023-11-07 01:56:43.871');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (32, 26, 'Iniciar sesión', '2023-11-07 02:12:24.202');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (33, 26, 'Iniciar sesión', '2023-11-07 02:34:09.146');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (34, 26, 'Cerrar sesión', '2023-11-07 02:37:21.177');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (35, 26, 'Iniciar sesión', '2023-11-07 02:37:36.34');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (36, 26, 'Iniciar sesión', '2023-11-07 03:32:43.078');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (37, 26, 'Cerrar sesión', '2023-11-07 03:32:51.189');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (38, 26, 'Iniciar sesión', '2023-11-07 03:49:40.453');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (39, 26, 'Iniciar sesión', '2023-11-07 03:52:36.398');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (40, 26, 'Iniciar sesión', '2023-11-07 03:57:27.052');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (41, 26, 'Cerrar sesión', '2023-11-07 03:58:28.542');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (42, 26, 'Iniciar sesión', '2023-11-07 03:58:34.439');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (43, 26, 'Iniciar sesión', '2023-11-07 18:02:17.392');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (44, 26, 'Iniciar sesión', '2023-11-07 18:03:58.731');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (45, 26, 'Iniciar sesión', '2023-11-07 18:05:18.463');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (46, 26, 'Cerrar sesión', '2023-11-07 18:05:55.964');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (47, 26, 'Iniciar sesión', '2023-11-07 18:07:33.431');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (48, 26, 'Iniciar sesión', '2023-11-07 23:57:59.649');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (49, 26, 'Cerrar sesión', '2023-11-08 00:01:19.725');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (50, 26, 'Iniciar sesión', '2023-11-09 03:52:55.483');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (51, 26, 'Cerrar sesión', '2023-11-09 03:53:02.012');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (52, 26, 'Iniciar sesión', '2023-11-09 03:53:17.943');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (53, 26, 'Cerrar sesión', '2023-11-09 03:53:33.17');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (54, 26, 'Iniciar sesión', '2023-11-09 03:53:37.686');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (55, 26, 'Cerrar sesión', '2023-11-09 03:53:44.152');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (56, 26, 'Iniciar sesión', '2023-11-09 03:53:49.288');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (57, 26, 'Cerrar sesión', '2023-11-09 03:53:52.619');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (58, 26, 'Iniciar sesión', '2023-11-09 04:01:42.166');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (59, 26, 'Cerrar sesión', '2023-11-09 04:01:48.344');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (60, 26, 'Iniciar sesión', '2023-11-09 04:02:04.634');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (61, 26, 'Iniciar sesión', '2023-11-09 05:05:21.371');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (62, 26, 'Cerrar sesión', '2023-11-09 05:05:24.152');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (63, 26, 'Iniciar sesión', '2023-11-09 05:05:29.014');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (64, 26, 'Cerrar sesión', '2023-11-09 05:05:30.851');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (65, 26, 'Iniciar sesión', '2023-11-09 05:05:35.25');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (66, 26, 'Cerrar sesión', '2023-11-09 05:05:38.719');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (67, 26, 'Iniciar sesión', '2023-11-09 05:05:42.766');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (68, 26, 'Cerrar sesión', '2023-11-09 05:07:44.766');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (69, 26, 'Iniciar sesión', '2023-11-09 05:07:48.911');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (70, 26, 'Cerrar sesión', '2023-11-09 05:09:00.016');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (71, 26, 'Iniciar sesión', '2023-11-09 05:09:03.937');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (72, 26, 'Cerrar sesión', '2023-11-09 05:09:05.673');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (73, 26, 'Iniciar sesión', '2023-11-09 05:09:09.841');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (74, 26, 'Cerrar sesión', '2023-11-09 05:09:11.923');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (75, 26, 'Iniciar sesión', '2023-11-09 05:09:18.111');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (76, 26, 'Cerrar sesión', '2023-11-09 05:09:19.847');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (77, 26, 'Iniciar sesión', '2023-11-09 05:09:24.003');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (78, 26, 'Iniciar sesión', '2023-11-09 05:10:58.574');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (79, 26, 'Cerrar sesión', '2023-11-09 05:11:00.598');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (80, 26, 'Iniciar sesión', '2023-11-09 05:11:04.77');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (81, 26, 'Cerrar sesión', '2023-11-09 05:11:10.036');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (82, 26, 'Iniciar sesión', '2023-11-09 05:11:15.271');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (83, 26, 'Iniciar sesión', '2023-11-09 20:48:45.063');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (84, 26, 'Iniciar sesión', '2023-11-09 21:16:17.008');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (85, 26, 'Cerrar sesión', '2023-11-09 21:46:43.769');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (86, 26, 'Iniciar sesión', '2023-11-09 21:46:52.344');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (87, 26, 'Iniciar sesión', '2023-11-10 00:45:06.166');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (88, 26, 'Iniciar sesión', '2023-11-10 02:31:02.45');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (89, 26, 'Iniciar sesión', '2023-11-10 02:45:53.992');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (90, 26, 'Iniciar sesión', '2023-11-10 03:28:48.423');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (91, 26, 'Iniciar sesión', '2023-11-10 03:46:59.528');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (92, 26, 'Iniciar sesión', '2023-11-10 04:41:23.136');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (93, 26, 'Iniciar sesión', '2023-11-10 05:27:28.939');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (94, 26, 'Iniciar sesión', '2023-11-10 05:38:54.481');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (95, 26, 'Iniciar sesión', '2023-11-10 05:45:32.312');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (96, 26, 'Actualizar identificación', '2023-11-10 05:49:09.05');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (97, 26, 'Actualizar identificación', '2023-11-10 05:54:23.103');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (98, 26, 'Actualizar identificación', '2023-11-10 05:54:33.314');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (99, 26, 'Actualizar identificación', '2023-11-10 05:54:37.927');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (100, 26, 'Actualizar identificación', '2023-11-10 05:54:46.639');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (101, 26, 'Actualizar identificación', '2023-11-10 06:03:15.901');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (102, 26, 'Actualizar identificación', '2023-11-10 06:03:29.783');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (103, 26, 'Actualizar nombre', '2023-11-10 06:17:29.349');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (104, 26, 'Actualizar fecha de nacimiento', '2023-11-10 06:18:57.583');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (105, 26, 'Actualizar correo electrónico', '2023-11-10 06:20:21.923');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (106, 26, 'Actualizar correo electrónico', '2023-11-10 06:23:45.354');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (107, 26, 'Actualizar contraseña', '2023-11-10 06:29:01.156');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (108, 26, 'Iniciar sesión', '2023-11-10 06:43:39.075');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (109, 26, 'Actualizar nombre', '2023-11-10 06:45:40.392');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (110, 26, 'Iniciar sesión', '2023-11-10 06:58:17.86');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (111, 26, 'Actualizar fecha de nacimiento', '2023-11-10 07:00:18.877');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (112, 26, 'Actualizar correo electrónico', '2023-11-10 07:05:46.657');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (113, 26, 'Cerrar sesión', '2023-11-10 07:18:00.825');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (114, 26, 'Iniciar sesión', '2023-11-10 07:18:26.481');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (115, 26, 'Actualizar contraseña', '2023-11-10 07:19:08.665');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (116, 26, 'Actualizar contraseña', '2023-11-10 07:21:20.926');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (117, 26, 'Actualizar contraseña', '2023-11-10 07:22:17.849');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (118, 26, 'Cerrar sesión', '2023-11-10 07:31:55.003');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (119, 26, 'Iniciar sesión', '2023-11-10 15:08:33.162');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (120, 26, 'Iniciar sesión', '2023-11-11 02:08:54.452');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (121, 26, 'Cerrar sesión', '2023-11-11 02:11:01.48');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (122, 26, 'Iniciar sesión', '2023-11-11 02:13:19.766');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (123, 26, 'Iniciar sesión', '2023-11-11 03:18:42.478');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (124, 26, 'Iniciar sesión', '2023-11-11 03:20:59.313');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (125, 26, 'Iniciar sesión', '2023-11-11 03:21:52.917');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (126, 26, 'Iniciar sesión', '2023-11-11 03:22:10.012');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (127, 26, 'Cerrar sesión', '2023-11-11 03:35:59.507');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (128, 26, 'Iniciar sesión', '2023-11-11 03:36:05.671');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (129, 26, 'Cerrar sesión', '2023-11-11 03:38:31.685');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (130, 26, 'Iniciar sesión', '2023-11-11 03:39:51.155');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (131, 26, 'Cerrar sesión', '2023-11-11 03:43:31.895');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (132, 26, 'Iniciar sesión', '2023-11-11 03:43:37.099');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (133, 26, 'Iniciar sesión', '2023-11-11 04:43:52.952');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (134, 26, 'Iniciar sesión', '2023-11-11 05:46:51.013');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (135, 26, 'Cerrar sesión', '2023-11-11 05:49:06.897');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (136, 26, 'Iniciar sesión', '2023-11-11 05:49:33.533');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (137, 26, 'Iniciar sesión', '2023-11-11 15:33:54.864');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (138, 26, 'Iniciar sesión', '2023-11-11 15:47:09.95');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (139, 26, 'Iniciar sesión', '2023-11-11 20:57:22.56');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (140, 26, 'Iniciar sesión', '2023-11-11 21:13:33.269');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (141, 26, 'Iniciar sesión', '2023-11-11 22:14:01.463');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (142, 26, 'Iniciar sesión', '2023-11-11 23:16:27.029');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (143, 26, 'Iniciar sesión', '2023-11-12 01:03:30.819');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (144, 26, 'Iniciar sesión', '2023-11-12 01:13:17.004');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (145, 26, 'Iniciar sesión', '2023-11-12 01:18:25.889');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (146, 26, 'Iniciar sesión', '2023-11-12 02:19:13.537');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (147, 26, 'Iniciar sesión', '2023-11-12 02:47:42.999');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (148, 26, 'Iniciar sesión', '2023-11-12 03:52:30.474');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (149, 26, 'Iniciar sesión', '2023-11-12 04:52:55.223');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (150, 26, 'Iniciar sesión', '2023-11-12 06:45:18.907');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (151, 26, 'Iniciar sesión', '2023-11-12 07:53:51.639');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (152, 26, 'Iniciar sesión', '2023-11-12 17:08:39.024');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (153, 26, 'Iniciar sesión', '2023-11-12 20:50:16.864');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (154, 26, 'Iniciar sesión', '2023-11-12 21:13:33.716');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (155, 26, 'Cerrar sesión', '2023-11-12 21:36:15.706');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (156, 26, 'Iniciar sesión', '2023-11-12 21:36:29.134');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (157, 26, 'Iniciar sesión', '2023-11-12 21:56:07.508');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (158, 26, 'Iniciar sesión', '2023-11-12 22:07:40.821');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (159, 26, 'Iniciar sesión', '2023-11-12 22:39:34.624');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (160, 26, 'Iniciar sesión', '2023-11-12 23:40:15.838');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (161, 26, 'Iniciar sesión', '2023-11-13 00:53:00.535');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (162, 26, 'Iniciar sesión', '2023-11-13 02:14:19.892');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (163, 26, 'Iniciar sesión', '2023-11-13 03:18:20.982');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (164, 26, 'Iniciar sesión', '2023-11-13 04:55:54.693');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (165, 26, 'Iniciar sesión', '2023-11-13 05:56:00.957');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (166, 26, 'Iniciar sesión', '2023-11-13 06:56:15.559');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (167, 26, 'Iniciar sesión', '2023-11-13 15:48:16.851');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (168, 26, 'Iniciar sesión', '2023-11-13 16:15:08.542');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (169, 26, 'Iniciar sesión', '2023-11-13 16:23:52.824');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (170, 26, 'Iniciar sesión', '2023-11-13 17:16:55.521');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (171, 26, 'Actualizar bolsillo', '2023-11-13 17:27:48.853');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (172, 26, 'Iniciar sesión', '2023-11-13 17:31:40.937');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (173, 26, 'Eliminar bolsillo', '2023-11-13 17:32:26.04');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (174, 26, 'Iniciar sesión', '2023-11-13 18:54:47.19');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (175, 26, 'Iniciar sesión', '2023-11-13 19:07:02.807');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (176, 26, 'Iniciar sesión', '2023-11-13 19:10:30.291');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (177, 26, 'Iniciar sesión', '2023-11-13 19:17:19.244');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (178, 26, 'Cerrar sesión', '2023-11-13 19:55:46.519');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (179, 26, 'Iniciar sesión', '2023-11-13 19:55:52.083');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (180, 26, 'Iniciar sesión', '2023-11-13 21:01:39.606');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (181, 26, 'Crear bolsillo', '2023-11-13 21:39:17.102');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (182, 26, 'Iniciar sesión', '2023-11-13 22:04:08.977');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (183, 26, 'Crear bolsillo', '2023-11-13 22:05:22.48');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (184, 28, 'Iniciar sesión', '2023-11-13 22:38:44.166');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (185, 28, 'Cerrar sesión', '2023-11-13 22:38:47.686');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (186, 28, 'Iniciar sesión', '2023-11-13 22:39:15.152');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (187, 28, 'Actualizar identificación', '2023-11-13 22:39:47.377');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (188, 28, 'Cerrar sesión', '2023-11-13 22:39:51.995');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (189, 28, 'Iniciar sesión', '2023-11-13 22:40:09.843');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (190, 28, 'Actualizar nombre', '2023-11-13 22:40:21.898');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (191, 28, 'Actualizar nombre', '2023-11-13 22:40:38.393');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (192, 28, 'Actualizar fecha de nacimiento', '2023-11-13 22:40:54.109');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (193, 28, 'Crear bolsillo', '2023-11-13 22:46:18.719');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (194, 28, 'Crear bolsillo', '2023-11-13 22:47:37.016');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (195, 26, 'Cerrar sesión', '2023-11-13 22:50:12.219');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (196, 26, 'Iniciar sesión', '2023-11-13 22:50:19.679');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (197, 26, 'Cerrar sesión', '2023-11-13 22:50:49.059');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (198, 26, 'Iniciar sesión', '2023-11-13 22:51:12.567');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (199, 26, 'Iniciar sesión', '2023-11-13 22:52:15.534');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (200, 26, 'Cerrar sesión', '2023-11-13 22:52:36.828');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (201, 26, 'Iniciar sesión', '2023-11-13 22:55:28.332');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (202, 26, 'Cerrar sesión', '2023-11-13 23:01:53.284');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (203, 26, 'Iniciar sesión', '2023-11-13 23:02:26.747');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (204, 26, 'Crear bolsillo', '2023-11-13 23:02:58.294');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (205, 26, 'Eliminar bolsillo', '2023-11-13 23:08:22.93');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (206, 26, 'Eliminar bolsillo', '2023-11-13 23:08:27.691');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (207, 26, 'Eliminar bolsillo', '2023-11-13 23:08:30.367');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (208, 26, 'Eliminar bolsillo', '2023-11-13 23:08:34.168');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (209, 26, 'Actualizar bolsillo', '2023-11-13 23:35:48.656');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (210, 26, 'Actualizar bolsillo', '2023-11-13 23:36:52.105');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (211, 26, 'Actualizar bolsillo', '2023-11-13 23:36:57.413');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (212, 26, 'Iniciar sesión', '2023-11-14 00:04:56.347');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (213, 26, 'Iniciar sesión', '2023-11-14 00:06:08.351');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (214, 26, 'Iniciar sesión', '2023-11-14 00:07:35.239');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (215, 26, 'Iniciar sesión', '2023-11-14 01:23:00.313');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (216, 26, 'Eliminar bolsillo', '2023-11-14 02:05:39.351');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (217, 26, 'Actualizar bolsillo', '2023-11-14 02:16:30.806');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (218, 26, 'Actualizar bolsillo', '2023-11-14 02:17:12.375');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (219, 26, 'Iniciar sesión', '2023-11-14 03:59:10.924');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (220, 26, 'Iniciar sesión', '2023-11-14 05:13:20.535');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (221, 26, 'Iniciar sesión', '2023-11-14 05:18:11.064');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (222, 26, 'Iniciar sesión', '2023-11-14 05:36:15.742');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (223, 26, 'Iniciar sesión', '2023-11-14 05:42:31.46');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (224, 26, 'Iniciar sesión', '2023-11-14 11:26:54.062');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (225, 26, 'Iniciar sesión', '2023-11-14 11:40:31.186');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (226, 26, 'Iniciar sesión', '2023-11-14 11:48:48.873');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (227, 29, 'Iniciar sesión', '2023-11-14 13:08:12.513');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (228, 29, 'Cerrar sesión', '2023-11-14 13:46:21.714');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (229, 26, 'Iniciar sesión', '2023-11-14 13:46:29.615');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (230, 26, 'Cerrar sesión', '2023-11-14 13:46:34.807');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (231, 26, 'Iniciar sesión', '2023-11-14 13:54:34.11');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (232, 26, 'Actualizar bolsillo', '2023-11-14 13:57:29.055');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (233, 26, 'Eliminar bolsillo', '2023-11-14 13:57:49.833');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (234, 26, 'Cerrar sesión', '2023-11-14 14:03:24.697');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (235, 26, 'Iniciar sesión', '2023-11-14 14:15:08.902');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (236, 26, 'Actualizar correo electrónico', '2023-11-14 14:20:52.857');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (237, 26, 'Iniciar sesión', '2023-11-14 14:25:22.913');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (238, 26, 'Iniciar sesión', '2023-11-14 14:54:03.75');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (239, 26, 'Actualizar nombre', '2023-11-14 14:54:09.418');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (240, 26, 'Actualizar nombre', '2023-11-14 14:54:24.336');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (241, 26, 'Actualizar nombre', '2023-11-14 14:54:31.922');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (242, 26, 'Actualizar nombre', '2023-11-14 14:55:07.538');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (243, 26, 'Actualizar nombre', '2023-11-14 14:55:15.813');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (244, 26, 'Actualizar nombre', '2023-11-14 14:55:32.336');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (245, 26, 'Cerrar sesión', '2023-11-14 14:55:37.084');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (246, 26, 'Iniciar sesión', '2023-11-16 13:45:06.378');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (247, 26, 'Iniciar sesión', '2023-11-17 02:28:55.235');
INSERT INTO public.registros_actividad (id, cuenta, accion, fecha) VALUES (248, 26, 'Cerrar sesión', '2023-11-17 02:29:30.254');


--
-- TOC entry 2636 (class 0 OID 24640)
-- Dependencies: 225
-- Data for Name: transferencias_bolsillos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (1, 4, 1, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (2, 5, 1, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (3, 6, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (4, 7, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (5, 8, 3, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (6, 43, 5, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (7, 44, 5, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (8, 47, 5, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (9, 48, 5, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (10, 49, 5, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (11, 50, 3, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (12, 51, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (13, 53, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (14, 54, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (15, 55, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (16, 56, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (17, 57, 3, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (18, 58, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (19, 59, 5, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (20, 60, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (21, 61, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (22, 63, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (23, 64, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (24, 65, 3, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (25, 66, 2, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (26, 67, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (27, 68, 2, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (28, 88, 1, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (29, 89, 1, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (30, 93, 2, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (31, 94, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (32, 95, 2, false);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (33, 96, 2, true);
INSERT INTO public.transferencias_bolsillos (id, movimiento, bolsillo, carga) VALUES (34, 97, 2, false);


--
-- TOC entry 2640 (class 0 OID 24661)
-- Dependencies: 229
-- Data for Name: transferencias_cdts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (1, 9, 1, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (2, 10, 1, 'liquidacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (3, 11, 2, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (4, 12, 2, 'cancelacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (5, 13, 3, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (6, 14, 4, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (7, 71, 8, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (8, 72, 8, 'liquidacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (9, 73, 9, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (10, 74, 10, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (11, 75, 11, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (12, 76, 11, 'liquidacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (13, 77, 3, 'cancelacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (14, 78, 12, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (15, 79, 12, 'cancelacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (16, 80, 13, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (17, 81, 13, 'cancelacion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (18, 82, 14, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (19, 83, 15, 'inversion');
INSERT INTO public.transferencias_cdts (id, movimiento, cdt, tipo) VALUES (20, 84, 15, 'liquidacion');


--
-- TOC entry 2632 (class 0 OID 24622)
-- Dependencies: 221
-- Data for Name: transferencias_externas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (1, 1, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (2, 2, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (3, 3, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (4, 15, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (5, 16, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (6, 17, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (7, 18, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (8, 19, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (9, 20, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (10, 21, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (11, 22, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (12, 23, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (13, 24, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (14, 25, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (15, 26, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (16, 27, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (17, 28, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (18, 29, 'quyne', '30114542274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (19, 30, 'quyne', '30114542274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (20, 31, 'quyne', '30114542274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (21, 32, 'quyne', '30114544542274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (22, 33, 'quyne', '30114544542274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (23, 34, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (24, 35, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (25, 36, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (26, 37, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (27, 38, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (28, 39, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (29, 45, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (30, 46, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (31, 52, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (32, 62, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (33, 85, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (34, 86, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (35, 87, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (36, 90, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (37, 91, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (38, 92, 'quyne', '3011442274', false);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (39, 98, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (40, 99, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (41, 100, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (42, 101, 'quyne', '3011442274', true);
INSERT INTO public.transferencias_externas (id, movimiento, entidad, cuenta, carga) VALUES (43, 102, 'quyne', '3011442274', true);


--
-- TOC entry 2657 (class 0 OID 0)
-- Dependencies: 222
-- Name: bolsillos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bolsillos_id_seq', 11, true);


--
-- TOC entry 2658 (class 0 OID 0)
-- Dependencies: 226
-- Name: cdts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cdts_id_seq', 15, true);


--
-- TOC entry 2659 (class 0 OID 0)
-- Dependencies: 214
-- Name: cuentas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuentas_id_seq', 29, true);


--
-- TOC entry 2660 (class 0 OID 0)
-- Dependencies: 218
-- Name: movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_id_seq', 102, true);


--
-- TOC entry 2661 (class 0 OID 0)
-- Dependencies: 216
-- Name: registros_actividad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registros_actividad_id_seq', 248, true);


--
-- TOC entry 2662 (class 0 OID 0)
-- Dependencies: 224
-- Name: transferencias_bolsillos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_bolsillos_id_seq', 34, true);


--
-- TOC entry 2663 (class 0 OID 0)
-- Dependencies: 228
-- Name: transferencias_cdts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_cdts_id_seq', 20, true);


--
-- TOC entry 2664 (class 0 OID 0)
-- Dependencies: 220
-- Name: transferencias_externas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_externas_id_seq', 43, true);


--
-- TOC entry 2467 (class 2606 OID 24638)
-- Name: bolsillos bolsillos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolsillos
    ADD CONSTRAINT bolsillos_pk PRIMARY KEY (id);


--
-- TOC entry 2471 (class 2606 OID 24659)
-- Name: cdts cdts_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cdts
    ADD CONSTRAINT cdts_pk PRIMARY KEY (id);


--
-- TOC entry 2455 (class 2606 OID 24600)
-- Name: cuentas cuentas_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_pk PRIMARY KEY (id);


--
-- TOC entry 2457 (class 2606 OID 24604)
-- Name: cuentas cuentas_uq_correo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_uq_correo UNIQUE (correo);


--
-- TOC entry 2459 (class 2606 OID 24714)
-- Name: cuentas cuentas_uq_identificacion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_uq_identificacion UNIQUE (tipo_identificacion, numero_identificacion);


--
-- TOC entry 2463 (class 2606 OID 24620)
-- Name: movimientos movimientos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_pk PRIMARY KEY (id);


--
-- TOC entry 2461 (class 2606 OID 24611)
-- Name: registros_actividad registros_actividad_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_actividad
    ADD CONSTRAINT registros_actividad_pk PRIMARY KEY (id);


--
-- TOC entry 2469 (class 2606 OID 24646)
-- Name: transferencias_bolsillos transferencias_bolsillos_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_bolsillos
    ADD CONSTRAINT transferencias_bolsillos_pk PRIMARY KEY (id);


--
-- TOC entry 2473 (class 2606 OID 24667)
-- Name: transferencias_cdts transferencias_cdts_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_cdts
    ADD CONSTRAINT transferencias_cdts_pk PRIMARY KEY (id);


--
-- TOC entry 2465 (class 2606 OID 24627)
-- Name: transferencias_externas transferencias_externas_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_externas
    ADD CONSTRAINT transferencias_externas_pk PRIMARY KEY (id);


--
-- TOC entry 2477 (class 2606 OID 24683)
-- Name: bolsillos bolsillos_fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolsillos
    ADD CONSTRAINT bolsillos_fk_cuenta FOREIGN KEY (cuenta) REFERENCES public.cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2480 (class 2606 OID 24698)
-- Name: cdts cdts_fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cdts
    ADD CONSTRAINT cdts_fk_cuenta FOREIGN KEY (cuenta) REFERENCES public.cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2475 (class 2606 OID 24673)
-- Name: movimientos movimientos_fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT movimientos_fk_cuenta FOREIGN KEY (cuenta) REFERENCES public.cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2474 (class 2606 OID 24668)
-- Name: registros_actividad registros_actividad_fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registros_actividad
    ADD CONSTRAINT registros_actividad_fk_cuenta FOREIGN KEY (cuenta) REFERENCES public.cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2478 (class 2606 OID 24693)
-- Name: transferencias_bolsillos transferencias_bolsillos_fk_bolsillo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_bolsillos
    ADD CONSTRAINT transferencias_bolsillos_fk_bolsillo FOREIGN KEY (bolsillo) REFERENCES public.bolsillos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2479 (class 2606 OID 24688)
-- Name: transferencias_bolsillos transferencias_bolsillos_fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_bolsillos
    ADD CONSTRAINT transferencias_bolsillos_fk_movimiento FOREIGN KEY (movimiento) REFERENCES public.movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2481 (class 2606 OID 24708)
-- Name: transferencias_cdts transferencias_cdts_fk_cdt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_cdts
    ADD CONSTRAINT transferencias_cdts_fk_cdt FOREIGN KEY (cdt) REFERENCES public.cdts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2482 (class 2606 OID 24703)
-- Name: transferencias_cdts transferencias_cdts_fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_cdts
    ADD CONSTRAINT transferencias_cdts_fk_movimiento FOREIGN KEY (movimiento) REFERENCES public.movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2476 (class 2606 OID 24678)
-- Name: transferencias_externas transferencias_externas_fk_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias_externas
    ADD CONSTRAINT transferencias_externas_fk_movimiento FOREIGN KEY (movimiento) REFERENCES public.movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2647 (class 0 OID 0)
-- Dependencies: 2646
-- Name: DATABASE f4ydb; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE f4ydb TO neon_superuser;


-- Completed on 2023-11-29 23:18:36

--
-- PostgreSQL database dump complete
--

