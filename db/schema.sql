--
-- PostgreSQL database dump
--

\restrict G7asKScdBTg6yEr9TfhbHFffh7J2KVfN3q70kua8SWlDRTFWy2yS2jvYTAefSgd

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum__customers_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__customers_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__events_v_version_event_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__events_v_version_event_type AS ENUM (
    'Conference',
    'Exhibition',
    'Webinar',
    'Meetup',
    'Speaking'
);


--
-- Name: enum__events_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__events_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__jobs_v_version_employment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__jobs_v_version_employment_type AS ENUM (
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
);


--
-- Name: enum__jobs_v_version_posting_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__jobs_v_version_posting_status AS ENUM (
    'open',
    'closed'
);


--
-- Name: enum__jobs_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__jobs_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__jobs_v_version_work_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__jobs_v_version_work_mode AS ENUM (
    'On-site',
    'Hybrid',
    'Remote'
);


--
-- Name: enum__knowledge_hub_articles_v_version_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__knowledge_hub_articles_v_version_category AS ENUM (
    'OT Security',
    'Threat Intelligence',
    'Compliance & Standards',
    'Architecture',
    'Field Notes'
);


--
-- Name: enum__knowledge_hub_articles_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__knowledge_hub_articles_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__press_mentions_v_version_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__press_mentions_v_version_kind AS ENUM (
    'News',
    'Feature',
    'Interview',
    'Award',
    'Analyst note'
);


--
-- Name: enum__press_mentions_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__press_mentions_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__whitepapers_v_version_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__whitepapers_v_version_kind AS ENUM (
    'Whitepaper',
    'Case Study',
    'Brochure'
);


--
-- Name: enum__whitepapers_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__whitepapers_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_customers_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_customers_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_events_event_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_events_event_type AS ENUM (
    'Conference',
    'Exhibition',
    'Webinar',
    'Meetup',
    'Speaking'
);


--
-- Name: enum_events_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_events_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_jobs_employment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_jobs_employment_type AS ENUM (
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
);


--
-- Name: enum_jobs_posting_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_jobs_posting_status AS ENUM (
    'open',
    'closed'
);


--
-- Name: enum_jobs_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_jobs_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_jobs_work_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_jobs_work_mode AS ENUM (
    'On-site',
    'Hybrid',
    'Remote'
);


--
-- Name: enum_knowledge_hub_articles_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_knowledge_hub_articles_category AS ENUM (
    'OT Security',
    'Threat Intelligence',
    'Compliance & Standards',
    'Architecture',
    'Field Notes'
);


--
-- Name: enum_knowledge_hub_articles_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_knowledge_hub_articles_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_press_mentions_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_press_mentions_kind AS ENUM (
    'News',
    'Feature',
    'Interview',
    'Award',
    'Analyst note'
);


--
-- Name: enum_press_mentions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_press_mentions_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_users_roles; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_roles AS ENUM (
    'admin',
    'hr',
    'tech',
    'editor'
);


--
-- Name: enum_whitepapers_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_whitepapers_kind AS ENUM (
    'Whitepaper',
    'Case Study',
    'Brochure'
);


--
-- Name: enum_whitepapers_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_whitepapers_status AS ENUM (
    'draft',
    'published'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _customers_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._customers_v (
    id integer NOT NULL,
    parent_id integer,
    version_name character varying,
    version_slug character varying,
    version_sector character varying,
    version_region character varying,
    version_logo_id integer,
    version_summary character varying,
    version_quote character varying,
    version_quote_author character varying,
    version_quote_role character varying,
    version_website_url character varying,
    version_display_order numeric DEFAULT 100,
    version_featured boolean DEFAULT false,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__customers_v_version_status DEFAULT 'draft'::public.enum__customers_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _customers_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._customers_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _customers_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._customers_v_id_seq OWNED BY public._customers_v.id;


--
-- Name: _events_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._events_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_event_type public.enum__events_v_version_event_type DEFAULT 'Conference'::public.enum__events_v_version_event_type,
    version_booth character varying,
    version_start_date timestamp(3) with time zone,
    version_end_date timestamp(3) with time zone,
    version_venue character varying,
    version_city character varying,
    version_country character varying,
    version_summary character varying,
    version_description jsonb,
    version_registration_url character varying,
    version_website_url character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__events_v_version_status DEFAULT 'draft'::public.enum__events_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _events_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._events_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _events_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._events_v_id_seq OWNED BY public._events_v.id;


--
-- Name: _jobs_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._jobs_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_team character varying,
    version_location character varying,
    version_work_mode public.enum__jobs_v_version_work_mode DEFAULT 'Hybrid'::public.enum__jobs_v_version_work_mode,
    version_employment_type public.enum__jobs_v_version_employment_type DEFAULT 'Full-time'::public.enum__jobs_v_version_employment_type,
    version_experience character varying,
    version_summary character varying,
    version_description jsonb,
    version_apply_url character varying,
    version_posting_status public.enum__jobs_v_version_posting_status DEFAULT 'open'::public.enum__jobs_v_version_posting_status,
    version_posted_at timestamp(3) with time zone,
    version_closing_date timestamp(3) with time zone,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__jobs_v_version_status DEFAULT 'draft'::public.enum__jobs_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _jobs_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._jobs_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _jobs_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._jobs_v_id_seq OWNED BY public._jobs_v.id;


--
-- Name: _jobs_v_version_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._jobs_v_version_requirements (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    item character varying,
    _uuid character varying
);


--
-- Name: _jobs_v_version_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._jobs_v_version_requirements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _jobs_v_version_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._jobs_v_version_requirements_id_seq OWNED BY public._jobs_v_version_requirements.id;


--
-- Name: _jobs_v_version_responsibilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._jobs_v_version_responsibilities (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    item character varying,
    _uuid character varying
);


--
-- Name: _jobs_v_version_responsibilities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._jobs_v_version_responsibilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _jobs_v_version_responsibilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._jobs_v_version_responsibilities_id_seq OWNED BY public._jobs_v_version_responsibilities.id;


--
-- Name: _knowledge_hub_articles_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._knowledge_hub_articles_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_category public.enum__knowledge_hub_articles_v_version_category DEFAULT 'OT Security'::public.enum__knowledge_hub_articles_v_version_category,
    version_author_name character varying,
    version_author_role character varying,
    version_excerpt character varying,
    version_hero_image_id integer,
    version_body jsonb,
    version_reading_time character varying,
    version_published_date timestamp(3) with time zone,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__knowledge_hub_articles_v_version_status DEFAULT 'draft'::public.enum__knowledge_hub_articles_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _knowledge_hub_articles_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._knowledge_hub_articles_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _knowledge_hub_articles_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._knowledge_hub_articles_v_id_seq OWNED BY public._knowledge_hub_articles_v.id;


--
-- Name: _knowledge_hub_articles_v_version_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._knowledge_hub_articles_v_version_tags (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    tag character varying,
    _uuid character varying
);


--
-- Name: _knowledge_hub_articles_v_version_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._knowledge_hub_articles_v_version_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _knowledge_hub_articles_v_version_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._knowledge_hub_articles_v_version_tags_id_seq OWNED BY public._knowledge_hub_articles_v_version_tags.id;


--
-- Name: _press_mentions_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._press_mentions_v (
    id integer NOT NULL,
    parent_id integer,
    version_headline character varying,
    version_outlet character varying,
    version_kind public.enum__press_mentions_v_version_kind DEFAULT 'News'::public.enum__press_mentions_v_version_kind,
    version_url character varying,
    version_published_date timestamp(3) with time zone,
    version_excerpt character varying,
    version_logo_id integer,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__press_mentions_v_version_status DEFAULT 'draft'::public.enum__press_mentions_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _press_mentions_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._press_mentions_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _press_mentions_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._press_mentions_v_id_seq OWNED BY public._press_mentions_v.id;


--
-- Name: _whitepapers_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._whitepapers_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_kind public.enum__whitepapers_v_version_kind DEFAULT 'Whitepaper'::public.enum__whitepapers_v_version_kind,
    version_series character varying,
    version_subtitle character varying,
    version_summary character varying,
    version_read_time character varying,
    version_pdf_id integer,
    version_pdf_path character varying,
    version_read_online_path character varying,
    version_published_date timestamp(3) with time zone,
    version_featured boolean DEFAULT false,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__whitepapers_v_version_status DEFAULT 'draft'::public.enum__whitepapers_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _whitepapers_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._whitepapers_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _whitepapers_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._whitepapers_v_id_seq OWNED BY public._whitepapers_v.id;


--
-- Name: _whitepapers_v_version_key_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._whitepapers_v_version_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    point character varying,
    _uuid character varying
);


--
-- Name: _whitepapers_v_version_key_points_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._whitepapers_v_version_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _whitepapers_v_version_key_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._whitepapers_v_version_key_points_id_seq OWNED BY public._whitepapers_v_version_key_points.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying,
    slug character varying,
    sector character varying,
    region character varying,
    logo_id integer,
    summary character varying,
    quote character varying,
    quote_author character varying,
    quote_role character varying,
    website_url character varying,
    display_order numeric DEFAULT 100,
    featured boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_customers_status DEFAULT 'draft'::public.enum_customers_status
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    event_type public.enum_events_event_type DEFAULT 'Conference'::public.enum_events_event_type,
    booth character varying,
    start_date timestamp(3) with time zone,
    end_date timestamp(3) with time zone,
    venue character varying,
    city character varying,
    country character varying,
    summary character varying,
    description jsonb,
    registration_url character varying,
    website_url character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_events_status DEFAULT 'draft'::public.enum_events_status
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    team character varying,
    location character varying,
    work_mode public.enum_jobs_work_mode DEFAULT 'Hybrid'::public.enum_jobs_work_mode,
    employment_type public.enum_jobs_employment_type DEFAULT 'Full-time'::public.enum_jobs_employment_type,
    experience character varying,
    summary character varying,
    description jsonb,
    apply_url character varying,
    posting_status public.enum_jobs_posting_status DEFAULT 'open'::public.enum_jobs_posting_status,
    posted_at timestamp(3) with time zone,
    closing_date timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_jobs_status DEFAULT 'draft'::public.enum_jobs_status
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: jobs_requirements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs_requirements (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    item character varying
);


--
-- Name: jobs_responsibilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs_responsibilities (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    item character varying
);


--
-- Name: knowledge_hub_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_hub_articles (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    category public.enum_knowledge_hub_articles_category DEFAULT 'OT Security'::public.enum_knowledge_hub_articles_category,
    author_name character varying,
    author_role character varying,
    excerpt character varying,
    hero_image_id integer,
    body jsonb,
    reading_time character varying,
    published_date timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_knowledge_hub_articles_status DEFAULT 'draft'::public.enum_knowledge_hub_articles_status
);


--
-- Name: knowledge_hub_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knowledge_hub_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knowledge_hub_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knowledge_hub_articles_id_seq OWNED BY public.knowledge_hub_articles.id;


--
-- Name: knowledge_hub_articles_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_hub_articles_tags (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    tag character varying
);


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    caption character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    sizes_thumbnail_url character varying,
    sizes_thumbnail_width numeric,
    sizes_thumbnail_height numeric,
    sizes_thumbnail_mime_type character varying,
    sizes_thumbnail_filesize numeric,
    sizes_thumbnail_filename character varying,
    sizes_card_url character varying,
    sizes_card_width numeric,
    sizes_card_height numeric,
    sizes_card_mime_type character varying,
    sizes_card_filesize numeric,
    sizes_card_filename character varying,
    sizes_hero_url character varying,
    sizes_hero_width numeric,
    sizes_hero_height numeric,
    sizes_hero_mime_type character varying,
    sizes_hero_filesize numeric,
    sizes_hero_filename character varying
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    jobs_id integer,
    whitepapers_id integer,
    knowledge_hub_articles_id integer,
    customers_id integer,
    events_id integer,
    press_mentions_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: press_mentions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.press_mentions (
    id integer NOT NULL,
    headline character varying,
    outlet character varying,
    kind public.enum_press_mentions_kind DEFAULT 'News'::public.enum_press_mentions_kind,
    url character varying,
    published_date timestamp(3) with time zone,
    excerpt character varying,
    logo_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_press_mentions_status DEFAULT 'draft'::public.enum_press_mentions_status
);


--
-- Name: press_mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.press_mentions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: press_mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.press_mentions_id_seq OWNED BY public.press_mentions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    job_title character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    reset_password_requested_at timestamp(3) with time zone,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_roles (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_users_roles,
    id integer NOT NULL
);


--
-- Name: users_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_roles_id_seq OWNED BY public.users_roles.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: whitepapers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whitepapers (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    kind public.enum_whitepapers_kind DEFAULT 'Whitepaper'::public.enum_whitepapers_kind,
    series character varying,
    subtitle character varying,
    summary character varying,
    read_time character varying,
    pdf_id integer,
    pdf_path character varying,
    read_online_path character varying,
    published_date timestamp(3) with time zone,
    featured boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_whitepapers_status DEFAULT 'draft'::public.enum_whitepapers_status
);


--
-- Name: whitepapers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.whitepapers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whitepapers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.whitepapers_id_seq OWNED BY public.whitepapers.id;


--
-- Name: whitepapers_key_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whitepapers_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    point character varying
);


--
-- Name: _customers_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._customers_v ALTER COLUMN id SET DEFAULT nextval('public._customers_v_id_seq'::regclass);


--
-- Name: _events_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v ALTER COLUMN id SET DEFAULT nextval('public._events_v_id_seq'::regclass);


--
-- Name: _jobs_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v ALTER COLUMN id SET DEFAULT nextval('public._jobs_v_id_seq'::regclass);


--
-- Name: _jobs_v_version_requirements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_requirements ALTER COLUMN id SET DEFAULT nextval('public._jobs_v_version_requirements_id_seq'::regclass);


--
-- Name: _jobs_v_version_responsibilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_responsibilities ALTER COLUMN id SET DEFAULT nextval('public._jobs_v_version_responsibilities_id_seq'::regclass);


--
-- Name: _knowledge_hub_articles_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v ALTER COLUMN id SET DEFAULT nextval('public._knowledge_hub_articles_v_id_seq'::regclass);


--
-- Name: _knowledge_hub_articles_v_version_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v_version_tags ALTER COLUMN id SET DEFAULT nextval('public._knowledge_hub_articles_v_version_tags_id_seq'::regclass);


--
-- Name: _press_mentions_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._press_mentions_v ALTER COLUMN id SET DEFAULT nextval('public._press_mentions_v_id_seq'::regclass);


--
-- Name: _whitepapers_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v ALTER COLUMN id SET DEFAULT nextval('public._whitepapers_v_id_seq'::regclass);


--
-- Name: _whitepapers_v_version_key_points id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v_version_key_points ALTER COLUMN id SET DEFAULT nextval('public._whitepapers_v_version_key_points_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: knowledge_hub_articles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_hub_articles ALTER COLUMN id SET DEFAULT nextval('public.knowledge_hub_articles_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: press_mentions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.press_mentions ALTER COLUMN id SET DEFAULT nextval('public.press_mentions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles ALTER COLUMN id SET DEFAULT nextval('public.users_roles_id_seq'::regclass);


--
-- Name: whitepapers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whitepapers ALTER COLUMN id SET DEFAULT nextval('public.whitepapers_id_seq'::regclass);


--
-- Name: _customers_v _customers_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._customers_v
    ADD CONSTRAINT _customers_v_pkey PRIMARY KEY (id);


--
-- Name: _events_v _events_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_pkey PRIMARY KEY (id);


--
-- Name: _jobs_v _jobs_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v
    ADD CONSTRAINT _jobs_v_pkey PRIMARY KEY (id);


--
-- Name: _jobs_v_version_requirements _jobs_v_version_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_requirements
    ADD CONSTRAINT _jobs_v_version_requirements_pkey PRIMARY KEY (id);


--
-- Name: _jobs_v_version_responsibilities _jobs_v_version_responsibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_responsibilities
    ADD CONSTRAINT _jobs_v_version_responsibilities_pkey PRIMARY KEY (id);


--
-- Name: _knowledge_hub_articles_v _knowledge_hub_articles_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v
    ADD CONSTRAINT _knowledge_hub_articles_v_pkey PRIMARY KEY (id);


--
-- Name: _knowledge_hub_articles_v_version_tags _knowledge_hub_articles_v_version_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v_version_tags
    ADD CONSTRAINT _knowledge_hub_articles_v_version_tags_pkey PRIMARY KEY (id);


--
-- Name: _press_mentions_v _press_mentions_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._press_mentions_v
    ADD CONSTRAINT _press_mentions_v_pkey PRIMARY KEY (id);


--
-- Name: _whitepapers_v _whitepapers_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v
    ADD CONSTRAINT _whitepapers_v_pkey PRIMARY KEY (id);


--
-- Name: _whitepapers_v_version_key_points _whitepapers_v_version_key_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v_version_key_points
    ADD CONSTRAINT _whitepapers_v_version_key_points_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: jobs_requirements jobs_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_requirements
    ADD CONSTRAINT jobs_requirements_pkey PRIMARY KEY (id);


--
-- Name: jobs_responsibilities jobs_responsibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_responsibilities
    ADD CONSTRAINT jobs_responsibilities_pkey PRIMARY KEY (id);


--
-- Name: knowledge_hub_articles knowledge_hub_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_hub_articles
    ADD CONSTRAINT knowledge_hub_articles_pkey PRIMARY KEY (id);


--
-- Name: knowledge_hub_articles_tags knowledge_hub_articles_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_hub_articles_tags
    ADD CONSTRAINT knowledge_hub_articles_tags_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: press_mentions press_mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.press_mentions
    ADD CONSTRAINT press_mentions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_roles users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: whitepapers_key_points whitepapers_key_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whitepapers_key_points
    ADD CONSTRAINT whitepapers_key_points_pkey PRIMARY KEY (id);


--
-- Name: whitepapers whitepapers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whitepapers
    ADD CONSTRAINT whitepapers_pkey PRIMARY KEY (id);


--
-- Name: _customers_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_created_at_idx ON public._customers_v USING btree (created_at);


--
-- Name: _customers_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_latest_idx ON public._customers_v USING btree (latest);


--
-- Name: _customers_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_parent_idx ON public._customers_v USING btree (parent_id);


--
-- Name: _customers_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_updated_at_idx ON public._customers_v USING btree (updated_at);


--
-- Name: _customers_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_version_version__status_idx ON public._customers_v USING btree (version__status);


--
-- Name: _customers_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_version_version_created_at_idx ON public._customers_v USING btree (version_created_at);


--
-- Name: _customers_v_version_version_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_version_version_logo_idx ON public._customers_v USING btree (version_logo_id);


--
-- Name: _customers_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_version_version_slug_idx ON public._customers_v USING btree (version_slug);


--
-- Name: _customers_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _customers_v_version_version_updated_at_idx ON public._customers_v USING btree (version_updated_at);


--
-- Name: _events_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_created_at_idx ON public._events_v USING btree (created_at);


--
-- Name: _events_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_latest_idx ON public._events_v USING btree (latest);


--
-- Name: _events_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_parent_idx ON public._events_v USING btree (parent_id);


--
-- Name: _events_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_updated_at_idx ON public._events_v USING btree (updated_at);


--
-- Name: _events_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version__status_idx ON public._events_v USING btree (version__status);


--
-- Name: _events_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_created_at_idx ON public._events_v USING btree (version_created_at);


--
-- Name: _events_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_slug_idx ON public._events_v USING btree (version_slug);


--
-- Name: _events_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_updated_at_idx ON public._events_v USING btree (version_updated_at);


--
-- Name: _jobs_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_created_at_idx ON public._jobs_v USING btree (created_at);


--
-- Name: _jobs_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_latest_idx ON public._jobs_v USING btree (latest);


--
-- Name: _jobs_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_parent_idx ON public._jobs_v USING btree (parent_id);


--
-- Name: _jobs_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_updated_at_idx ON public._jobs_v USING btree (updated_at);


--
-- Name: _jobs_v_version_requirements_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_requirements_order_idx ON public._jobs_v_version_requirements USING btree (_order);


--
-- Name: _jobs_v_version_requirements_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_requirements_parent_id_idx ON public._jobs_v_version_requirements USING btree (_parent_id);


--
-- Name: _jobs_v_version_responsibilities_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_responsibilities_order_idx ON public._jobs_v_version_responsibilities USING btree (_order);


--
-- Name: _jobs_v_version_responsibilities_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_responsibilities_parent_id_idx ON public._jobs_v_version_responsibilities USING btree (_parent_id);


--
-- Name: _jobs_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_version__status_idx ON public._jobs_v USING btree (version__status);


--
-- Name: _jobs_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_version_created_at_idx ON public._jobs_v USING btree (version_created_at);


--
-- Name: _jobs_v_version_version_posting_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_version_posting_status_idx ON public._jobs_v USING btree (version_posting_status);


--
-- Name: _jobs_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_version_slug_idx ON public._jobs_v USING btree (version_slug);


--
-- Name: _jobs_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _jobs_v_version_version_updated_at_idx ON public._jobs_v USING btree (version_updated_at);


--
-- Name: _knowledge_hub_articles_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_created_at_idx ON public._knowledge_hub_articles_v USING btree (created_at);


--
-- Name: _knowledge_hub_articles_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_latest_idx ON public._knowledge_hub_articles_v USING btree (latest);


--
-- Name: _knowledge_hub_articles_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_parent_idx ON public._knowledge_hub_articles_v USING btree (parent_id);


--
-- Name: _knowledge_hub_articles_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_updated_at_idx ON public._knowledge_hub_articles_v USING btree (updated_at);


--
-- Name: _knowledge_hub_articles_v_version_tags_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_tags_order_idx ON public._knowledge_hub_articles_v_version_tags USING btree (_order);


--
-- Name: _knowledge_hub_articles_v_version_tags_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_tags_parent_id_idx ON public._knowledge_hub_articles_v_version_tags USING btree (_parent_id);


--
-- Name: _knowledge_hub_articles_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_version__status_idx ON public._knowledge_hub_articles_v USING btree (version__status);


--
-- Name: _knowledge_hub_articles_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_version_created_at_idx ON public._knowledge_hub_articles_v USING btree (version_created_at);


--
-- Name: _knowledge_hub_articles_v_version_version_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_version_hero_image_idx ON public._knowledge_hub_articles_v USING btree (version_hero_image_id);


--
-- Name: _knowledge_hub_articles_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_version_slug_idx ON public._knowledge_hub_articles_v USING btree (version_slug);


--
-- Name: _knowledge_hub_articles_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _knowledge_hub_articles_v_version_version_updated_at_idx ON public._knowledge_hub_articles_v USING btree (version_updated_at);


--
-- Name: _press_mentions_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_created_at_idx ON public._press_mentions_v USING btree (created_at);


--
-- Name: _press_mentions_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_latest_idx ON public._press_mentions_v USING btree (latest);


--
-- Name: _press_mentions_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_parent_idx ON public._press_mentions_v USING btree (parent_id);


--
-- Name: _press_mentions_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_updated_at_idx ON public._press_mentions_v USING btree (updated_at);


--
-- Name: _press_mentions_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_version_version__status_idx ON public._press_mentions_v USING btree (version__status);


--
-- Name: _press_mentions_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_version_version_created_at_idx ON public._press_mentions_v USING btree (version_created_at);


--
-- Name: _press_mentions_v_version_version_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_version_version_logo_idx ON public._press_mentions_v USING btree (version_logo_id);


--
-- Name: _press_mentions_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _press_mentions_v_version_version_updated_at_idx ON public._press_mentions_v USING btree (version_updated_at);


--
-- Name: _whitepapers_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_created_at_idx ON public._whitepapers_v USING btree (created_at);


--
-- Name: _whitepapers_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_latest_idx ON public._whitepapers_v USING btree (latest);


--
-- Name: _whitepapers_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_parent_idx ON public._whitepapers_v USING btree (parent_id);


--
-- Name: _whitepapers_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_updated_at_idx ON public._whitepapers_v USING btree (updated_at);


--
-- Name: _whitepapers_v_version_key_points_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_key_points_order_idx ON public._whitepapers_v_version_key_points USING btree (_order);


--
-- Name: _whitepapers_v_version_key_points_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_key_points_parent_id_idx ON public._whitepapers_v_version_key_points USING btree (_parent_id);


--
-- Name: _whitepapers_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_version__status_idx ON public._whitepapers_v USING btree (version__status);


--
-- Name: _whitepapers_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_version_created_at_idx ON public._whitepapers_v USING btree (version_created_at);


--
-- Name: _whitepapers_v_version_version_pdf_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_version_pdf_idx ON public._whitepapers_v USING btree (version_pdf_id);


--
-- Name: _whitepapers_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_version_slug_idx ON public._whitepapers_v USING btree (version_slug);


--
-- Name: _whitepapers_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _whitepapers_v_version_version_updated_at_idx ON public._whitepapers_v USING btree (version_updated_at);


--
-- Name: customers__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX customers__status_idx ON public.customers USING btree (_status);


--
-- Name: customers_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX customers_created_at_idx ON public.customers USING btree (created_at);


--
-- Name: customers_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX customers_logo_idx ON public.customers USING btree (logo_id);


--
-- Name: customers_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX customers_slug_idx ON public.customers USING btree (slug);


--
-- Name: customers_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX customers_updated_at_idx ON public.customers USING btree (updated_at);


--
-- Name: events__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events__status_idx ON public.events USING btree (_status);


--
-- Name: events_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_created_at_idx ON public.events USING btree (created_at);


--
-- Name: events_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX events_slug_idx ON public.events USING btree (slug);


--
-- Name: events_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_updated_at_idx ON public.events USING btree (updated_at);


--
-- Name: jobs__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs__status_idx ON public.jobs USING btree (_status);


--
-- Name: jobs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_created_at_idx ON public.jobs USING btree (created_at);


--
-- Name: jobs_posting_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_posting_status_idx ON public.jobs USING btree (posting_status);


--
-- Name: jobs_requirements_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_requirements_order_idx ON public.jobs_requirements USING btree (_order);


--
-- Name: jobs_requirements_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_requirements_parent_id_idx ON public.jobs_requirements USING btree (_parent_id);


--
-- Name: jobs_responsibilities_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_responsibilities_order_idx ON public.jobs_responsibilities USING btree (_order);


--
-- Name: jobs_responsibilities_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_responsibilities_parent_id_idx ON public.jobs_responsibilities USING btree (_parent_id);


--
-- Name: jobs_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX jobs_slug_idx ON public.jobs USING btree (slug);


--
-- Name: jobs_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_updated_at_idx ON public.jobs USING btree (updated_at);


--
-- Name: knowledge_hub_articles__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles__status_idx ON public.knowledge_hub_articles USING btree (_status);


--
-- Name: knowledge_hub_articles_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles_created_at_idx ON public.knowledge_hub_articles USING btree (created_at);


--
-- Name: knowledge_hub_articles_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles_hero_image_idx ON public.knowledge_hub_articles USING btree (hero_image_id);


--
-- Name: knowledge_hub_articles_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX knowledge_hub_articles_slug_idx ON public.knowledge_hub_articles USING btree (slug);


--
-- Name: knowledge_hub_articles_tags_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles_tags_order_idx ON public.knowledge_hub_articles_tags USING btree (_order);


--
-- Name: knowledge_hub_articles_tags_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles_tags_parent_id_idx ON public.knowledge_hub_articles_tags USING btree (_parent_id);


--
-- Name: knowledge_hub_articles_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX knowledge_hub_articles_updated_at_idx ON public.knowledge_hub_articles USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_sizes_card_sizes_card_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_card_sizes_card_filename_idx ON public.media USING btree (sizes_card_filename);


--
-- Name: media_sizes_hero_sizes_hero_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_hero_sizes_hero_filename_idx ON public.media USING btree (sizes_hero_filename);


--
-- Name: media_sizes_thumbnail_sizes_thumbnail_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_thumbnail_sizes_thumbnail_filename_idx ON public.media USING btree (sizes_thumbnail_filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_customers_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_customers_id_idx ON public.payload_locked_documents_rels USING btree (customers_id);


--
-- Name: payload_locked_documents_rels_events_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_events_id_idx ON public.payload_locked_documents_rels USING btree (events_id);


--
-- Name: payload_locked_documents_rels_jobs_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_jobs_id_idx ON public.payload_locked_documents_rels USING btree (jobs_id);


--
-- Name: payload_locked_documents_rels_knowledge_hub_articles_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_knowledge_hub_articles_id_idx ON public.payload_locked_documents_rels USING btree (knowledge_hub_articles_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_press_mentions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_press_mentions_id_idx ON public.payload_locked_documents_rels USING btree (press_mentions_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_rels_whitepapers_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_whitepapers_id_idx ON public.payload_locked_documents_rels USING btree (whitepapers_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: press_mentions__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX press_mentions__status_idx ON public.press_mentions USING btree (_status);


--
-- Name: press_mentions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX press_mentions_created_at_idx ON public.press_mentions USING btree (created_at);


--
-- Name: press_mentions_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX press_mentions_logo_idx ON public.press_mentions USING btree (logo_id);


--
-- Name: press_mentions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX press_mentions_updated_at_idx ON public.press_mentions USING btree (updated_at);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_roles_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_roles_order_idx ON public.users_roles USING btree ("order");


--
-- Name: users_roles_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_roles_parent_idx ON public.users_roles USING btree (parent_id);


--
-- Name: users_roles_value_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_roles_value_idx ON public.users_roles USING btree (value);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: whitepapers__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers__status_idx ON public.whitepapers USING btree (_status);


--
-- Name: whitepapers_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers_created_at_idx ON public.whitepapers USING btree (created_at);


--
-- Name: whitepapers_key_points_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers_key_points_order_idx ON public.whitepapers_key_points USING btree (_order);


--
-- Name: whitepapers_key_points_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers_key_points_parent_id_idx ON public.whitepapers_key_points USING btree (_parent_id);


--
-- Name: whitepapers_pdf_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers_pdf_idx ON public.whitepapers USING btree (pdf_id);


--
-- Name: whitepapers_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX whitepapers_slug_idx ON public.whitepapers USING btree (slug);


--
-- Name: whitepapers_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX whitepapers_updated_at_idx ON public.whitepapers USING btree (updated_at);


--
-- Name: _customers_v _customers_v_parent_id_customers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._customers_v
    ADD CONSTRAINT _customers_v_parent_id_customers_id_fk FOREIGN KEY (parent_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- Name: _customers_v _customers_v_version_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._customers_v
    ADD CONSTRAINT _customers_v_version_logo_id_media_id_fk FOREIGN KEY (version_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _events_v _events_v_parent_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_parent_id_events_id_fk FOREIGN KEY (parent_id) REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: _jobs_v _jobs_v_parent_id_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v
    ADD CONSTRAINT _jobs_v_parent_id_jobs_id_fk FOREIGN KEY (parent_id) REFERENCES public.jobs(id) ON DELETE SET NULL;


--
-- Name: _jobs_v_version_requirements _jobs_v_version_requirements_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_requirements
    ADD CONSTRAINT _jobs_v_version_requirements_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._jobs_v(id) ON DELETE CASCADE;


--
-- Name: _jobs_v_version_responsibilities _jobs_v_version_responsibilities_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._jobs_v_version_responsibilities
    ADD CONSTRAINT _jobs_v_version_responsibilities_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._jobs_v(id) ON DELETE CASCADE;


--
-- Name: _knowledge_hub_articles_v _knowledge_hub_articles_v_parent_id_knowledge_hub_articles_id_f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v
    ADD CONSTRAINT _knowledge_hub_articles_v_parent_id_knowledge_hub_articles_id_f FOREIGN KEY (parent_id) REFERENCES public.knowledge_hub_articles(id) ON DELETE SET NULL;


--
-- Name: _knowledge_hub_articles_v _knowledge_hub_articles_v_version_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v
    ADD CONSTRAINT _knowledge_hub_articles_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _knowledge_hub_articles_v_version_tags _knowledge_hub_articles_v_version_tags_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._knowledge_hub_articles_v_version_tags
    ADD CONSTRAINT _knowledge_hub_articles_v_version_tags_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._knowledge_hub_articles_v(id) ON DELETE CASCADE;


--
-- Name: _press_mentions_v _press_mentions_v_parent_id_press_mentions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._press_mentions_v
    ADD CONSTRAINT _press_mentions_v_parent_id_press_mentions_id_fk FOREIGN KEY (parent_id) REFERENCES public.press_mentions(id) ON DELETE SET NULL;


--
-- Name: _press_mentions_v _press_mentions_v_version_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._press_mentions_v
    ADD CONSTRAINT _press_mentions_v_version_logo_id_media_id_fk FOREIGN KEY (version_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _whitepapers_v _whitepapers_v_parent_id_whitepapers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v
    ADD CONSTRAINT _whitepapers_v_parent_id_whitepapers_id_fk FOREIGN KEY (parent_id) REFERENCES public.whitepapers(id) ON DELETE SET NULL;


--
-- Name: _whitepapers_v_version_key_points _whitepapers_v_version_key_points_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v_version_key_points
    ADD CONSTRAINT _whitepapers_v_version_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._whitepapers_v(id) ON DELETE CASCADE;


--
-- Name: _whitepapers_v _whitepapers_v_version_pdf_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._whitepapers_v
    ADD CONSTRAINT _whitepapers_v_version_pdf_id_media_id_fk FOREIGN KEY (version_pdf_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: customers customers_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: jobs_requirements jobs_requirements_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_requirements
    ADD CONSTRAINT jobs_requirements_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: jobs_responsibilities jobs_responsibilities_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs_responsibilities
    ADD CONSTRAINT jobs_responsibilities_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: knowledge_hub_articles knowledge_hub_articles_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_hub_articles
    ADD CONSTRAINT knowledge_hub_articles_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: knowledge_hub_articles_tags knowledge_hub_articles_tags_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_hub_articles_tags
    ADD CONSTRAINT knowledge_hub_articles_tags_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.knowledge_hub_articles(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_customers_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_customers_fk FOREIGN KEY (customers_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_events_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_events_fk FOREIGN KEY (events_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_jobs_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_jobs_fk FOREIGN KEY (jobs_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_knowledge_hub_articles_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_knowledge_hub_articles_fk FOREIGN KEY (knowledge_hub_articles_id) REFERENCES public.knowledge_hub_articles(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_press_mentions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_press_mentions_fk FOREIGN KEY (press_mentions_id) REFERENCES public.press_mentions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_whitepapers_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_whitepapers_fk FOREIGN KEY (whitepapers_id) REFERENCES public.whitepapers(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: press_mentions press_mentions_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.press_mentions
    ADD CONSTRAINT press_mentions_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_roles users_roles_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_parent_fk FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: whitepapers_key_points whitepapers_key_points_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whitepapers_key_points
    ADD CONSTRAINT whitepapers_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.whitepapers(id) ON DELETE CASCADE;


--
-- Name: whitepapers whitepapers_pdf_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whitepapers
    ADD CONSTRAINT whitepapers_pdf_id_media_id_fk FOREIGN KEY (pdf_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict G7asKScdBTg6yEr9TfhbHFffh7J2KVfN3q70kua8SWlDRTFWy2yS2jvYTAefSgd

