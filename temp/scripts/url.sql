-- Table: public.urls

-- DROP TABLE IF EXISTS public.urls;

CREATE TABLE IF NOT EXISTS public.urls
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    name character varying(1024) COLLATE pg_catalog."default",
    description character varying(1024) COLLATE pg_catalog."default",
    website_url character varying(1024) COLLATE pg_catalog."default",
    shortened_url character varying(1024) COLLATE pg_catalog."default",
    created_at timestamp(6) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT urls_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.urls
    OWNER to postgres;