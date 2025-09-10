-- Adminer 5.3.0 PostgreSQL 17.5 dump

\connect "db_anrapp";

DROP TABLE IF EXISTS "tb_department";
CREATE TABLE "public"."tb_department" (
    "id" integer NOT NULL,
    "department" character varying(100) NOT NULL,
    CONSTRAINT "departement_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "tb_fraud";
DROP SEQUENCE IF EXISTS tb_fraud_id_seq;
CREATE SEQUENCE tb_fraud_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 90 CACHE 1;

CREATE TABLE "public"."tb_fraud" (
    "id" integer DEFAULT nextval('tb_fraud_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "fraud_message" text NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "type_id" integer NOT NULL,
    "img" character varying,
    CONSTRAINT "tb_fraud_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "tb_ide";
DROP SEQUENCE IF EXISTS tb_ide_id_seq;
CREATE SEQUENCE tb_ide_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 267 CACHE 1;

CREATE TABLE "public"."tb_ide" (
    "id" integer DEFAULT nextval('tb_ide_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "department_id" integer NOT NULL,
    "message" text NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "user_id" integer,
    CONSTRAINT "tb_ide_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "tb_kritiksaran";
DROP SEQUENCE IF EXISTS tb_kritiksaran_id_seq;
CREATE SEQUENCE tb_kritiksaran_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 200 CACHE 1;

CREATE TABLE "public"."tb_kritiksaran" (
    "id" integer DEFAULT nextval('tb_kritiksaran_id_seq') NOT NULL,
    "user_id" integer,
    "critique" text NOT NULL,
    "suggestion" text NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tb_kritiksaran_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "tb_role";
DROP SEQUENCE IF EXISTS tb_role_id_seq;
CREATE SEQUENCE tb_role_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 3 CACHE 1;

CREATE TABLE "public"."tb_role" (
    "id" integer DEFAULT nextval('tb_role_id_seq') NOT NULL,
    "role" character varying(255) NOT NULL,
    CONSTRAINT "tb_role_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "tb_types_fraud";
DROP SEQUENCE IF EXISTS tb_types_fraud_id_seq;
CREATE SEQUENCE tb_types_fraud_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."tb_types_fraud" (
    "id" integer DEFAULT nextval('tb_types_fraud_id_seq') NOT NULL,
    "types" character varying NOT NULL,
    CONSTRAINT "tb_types_fraud_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 78 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "username" character varying(50) NOT NULL,
    "password" character varying(255) NOT NULL,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "department_id" integer,
    "name" character varying(100),
    "role_id" integer,
    "np" character varying(255),
    "last_login" timestamptz,
    "last_device" jsonb,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


ALTER TABLE ONLY "public"."tb_fraud" ADD CONSTRAINT "tb_fraud_type_id_fkey" FOREIGN KEY (type_id) REFERENCES tb_types_fraud(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."tb_fraud" ADD CONSTRAINT "tb_fraud_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."tb_ide" ADD CONSTRAINT "tb_ide_department_id_fkey" FOREIGN KEY (department_id) REFERENCES tb_department(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."tb_ide" ADD CONSTRAINT "tb_ide_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."tb_kritiksaran" ADD CONSTRAINT "tb_kritiksaran_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "fk_department" FOREIGN KEY (department_id) REFERENCES tb_department(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES tb_role(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;

-- 2025-09-10 10:13:47 UTC
