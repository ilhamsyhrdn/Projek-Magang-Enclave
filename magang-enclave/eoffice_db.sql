--
-- PostgreSQL database dump
--

\restrict lARKHIzI9jjCJdrMlWOGzDrbqKSLrz36IaQQ8v4uqVneqUru8XfzHHLTDJPDDAg

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-05 21:24:21

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
-- TOC entry 6 (class 2615 OID 23766)
-- Name: himatif; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA himatif;


ALTER SCHEMA himatif OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 24388)
-- Name: himatika_unpad; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA himatika_unpad;


ALTER SCHEMA himatika_unpad OWNER TO postgres;

--
-- TOC entry 5 (class 2615 OID 23745)
-- Name: superadmin; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA superadmin;


ALTER SCHEMA superadmin OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 264 (class 1259 OID 24100)
-- Name: archived_documents; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.archived_documents (
    id integer NOT NULL,
    document_id integer NOT NULL,
    document_type character varying(50) NOT NULL,
    document_number character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    content text,
    category character varying(100),
    division_id integer,
    department_id integer,
    document_date date NOT NULL,
    archived_date date DEFAULT CURRENT_DATE,
    file_url character varying(500),
    archived_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.archived_documents OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 24099)
-- Name: archived_documents_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.archived_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.archived_documents_id_seq OWNER TO postgres;

--
-- TOC entry 5633 (class 0 OID 0)
-- Dependencies: 263
-- Name: archived_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.archived_documents_id_seq OWNED BY himatif.archived_documents.id;


--
-- TOC entry 232 (class 1259 OID 23836)
-- Name: categories; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    module_type character varying(50) NOT NULL,
    division_id integer,
    department_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.categories OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 23835)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5634 (class 0 OID 0)
-- Dependencies: 231
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.categories_id_seq OWNED BY himatif.categories.id;


--
-- TOC entry 226 (class 1259 OID 23783)
-- Name: departments; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.departments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    division_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.departments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 23782)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.departments_id_seq OWNER TO postgres;

--
-- TOC entry 5635 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.departments_id_seq OWNED BY himatif.departments.id;


--
-- TOC entry 238 (class 1259 OID 23892)
-- Name: disposition_history; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.disposition_history (
    id integer NOT NULL,
    disposition_id integer NOT NULL,
    action character varying(100) NOT NULL,
    action_by integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.disposition_history OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 23891)
-- Name: disposition_history_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.disposition_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.disposition_history_id_seq OWNER TO postgres;

--
-- TOC entry 5636 (class 0 OID 0)
-- Dependencies: 237
-- Name: disposition_history_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.disposition_history_id_seq OWNED BY himatif.disposition_history.id;


--
-- TOC entry 236 (class 1259 OID 23875)
-- Name: dispositions; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.dispositions (
    id integer NOT NULL,
    incoming_mail_id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer,
    to_division_id integer,
    to_department_id integer,
    instruction text NOT NULL,
    notes text,
    due_date date,
    priority character varying(20) DEFAULT 'normal'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.dispositions OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 23874)
-- Name: dispositions_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.dispositions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.dispositions_id_seq OWNER TO postgres;

--
-- TOC entry 5637 (class 0 OID 0)
-- Dependencies: 235
-- Name: dispositions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.dispositions_id_seq OWNED BY himatif.dispositions.id;


--
-- TOC entry 224 (class 1259 OID 23768)
-- Name: divisions; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.divisions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.divisions OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 23767)
-- Name: divisions_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.divisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.divisions_id_seq OWNER TO postgres;

--
-- TOC entry 5638 (class 0 OID 0)
-- Dependencies: 223
-- Name: divisions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.divisions_id_seq OWNED BY himatif.divisions.id;


--
-- TOC entry 234 (class 1259 OID 23853)
-- Name: incoming_mails; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.incoming_mails (
    id integer NOT NULL,
    mail_number character varying(100) NOT NULL,
    mail_date date NOT NULL,
    mail_path character varying(500),
    sender_name character varying(255) NOT NULL,
    sender_address text,
    sender_organization character varying(255),
    subject text NOT NULL,
    priority character varying(20) DEFAULT 'normal'::character varying,
    notes text,
    status character varying(50) DEFAULT 'received'::character varying,
    received_by integer NOT NULL,
    received_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.incoming_mails OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 23852)
-- Name: incoming_mails_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.incoming_mails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.incoming_mails_id_seq OWNER TO postgres;

--
-- TOC entry 5639 (class 0 OID 0)
-- Dependencies: 233
-- Name: incoming_mails_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.incoming_mails_id_seq OWNED BY himatif.incoming_mails.id;


--
-- TOC entry 260 (class 1259 OID 24072)
-- Name: meeting_participants; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.meeting_participants (
    id integer NOT NULL,
    notulensi_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    role character varying(50),
    attendance_status character varying(20) DEFAULT 'invited'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.meeting_participants OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 24071)
-- Name: meeting_participants_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.meeting_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.meeting_participants_id_seq OWNER TO postgres;

--
-- TOC entry 5640 (class 0 OID 0)
-- Dependencies: 259
-- Name: meeting_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.meeting_participants_id_seq OWNED BY himatif.meeting_participants.id;


--
-- TOC entry 254 (class 1259 OID 24022)
-- Name: memo_approval_flows; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.memo_approval_flows (
    id integer NOT NULL,
    memo_id integer NOT NULL,
    approver_id integer NOT NULL,
    level_order integer NOT NULL,
    action character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.memo_approval_flows OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 24021)
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.memo_approval_flows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.memo_approval_flows_id_seq OWNER TO postgres;

--
-- TOC entry 5641 (class 0 OID 0)
-- Dependencies: 253
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.memo_approval_flows_id_seq OWNED BY himatif.memo_approval_flows.id;


--
-- TOC entry 250 (class 1259 OID 23987)
-- Name: memo_config_levels; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.memo_config_levels (
    id integer NOT NULL,
    template_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    level_order integer NOT NULL,
    action_type character varying(50) NOT NULL,
    is_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.memo_config_levels OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 23986)
-- Name: memo_config_levels_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.memo_config_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.memo_config_levels_id_seq OWNER TO postgres;

--
-- TOC entry 5642 (class 0 OID 0)
-- Dependencies: 249
-- Name: memo_config_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.memo_config_levels_id_seq OWNED BY himatif.memo_config_levels.id;


--
-- TOC entry 248 (class 1259 OID 23972)
-- Name: memo_templates; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.memo_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.memo_templates OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 23971)
-- Name: memo_templates_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.memo_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.memo_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5643 (class 0 OID 0)
-- Dependencies: 247
-- Name: memo_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.memo_templates_id_seq OWNED BY himatif.memo_templates.id;


--
-- TOC entry 252 (class 1259 OID 24001)
-- Name: memos; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.memos (
    id integer NOT NULL,
    memo_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    to_division_id integer,
    to_department_id integer,
    to_users integer[],
    priority character varying(20) DEFAULT 'normal'::character varying,
    mail_path character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    current_approval_level integer DEFAULT 0,
    generated_by integer,
    generated_at timestamp with time zone,
    effective_date date,
    notes text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.memos OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 24000)
-- Name: memos_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.memos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.memos_id_seq OWNER TO postgres;

--
-- TOC entry 5644 (class 0 OID 0)
-- Dependencies: 251
-- Name: memos_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.memos_id_seq OWNED BY himatif.memos.id;


--
-- TOC entry 258 (class 1259 OID 24052)
-- Name: notulensi; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.notulensi (
    id integer NOT NULL,
    notulensi_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    meeting_title character varying(255) NOT NULL,
    meeting_date timestamp with time zone NOT NULL,
    meeting_location character varying(255),
    meeting_agenda text,
    content text NOT NULL,
    chairman_id integer,
    secretary_id integer,
    attachment_url character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    completed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    updated_by integer
);


ALTER TABLE himatif.notulensi OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 24051)
-- Name: notulensi_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.notulensi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.notulensi_id_seq OWNER TO postgres;

--
-- TOC entry 5645 (class 0 OID 0)
-- Dependencies: 257
-- Name: notulensi_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.notulensi_id_seq OWNED BY himatif.notulensi.id;


--
-- TOC entry 256 (class 1259 OID 24037)
-- Name: notulensi_templates; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.notulensi_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.notulensi_templates OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 24036)
-- Name: notulensi_templates_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.notulensi_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.notulensi_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5646 (class 0 OID 0)
-- Dependencies: 255
-- Name: notulensi_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.notulensi_templates_id_seq OWNED BY himatif.notulensi_templates.id;


--
-- TOC entry 246 (class 1259 OID 23956)
-- Name: outgoing_approval_flows; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.outgoing_approval_flows (
    id integer NOT NULL,
    outgoing_mail_id integer NOT NULL,
    approver_id integer NOT NULL,
    level_order integer NOT NULL,
    action character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.outgoing_approval_flows OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 23955)
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.outgoing_approval_flows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.outgoing_approval_flows_id_seq OWNER TO postgres;

--
-- TOC entry 5647 (class 0 OID 0)
-- Dependencies: 245
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.outgoing_approval_flows_id_seq OWNED BY himatif.outgoing_approval_flows.id;


--
-- TOC entry 242 (class 1259 OID 23921)
-- Name: outgoing_config_levels; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.outgoing_config_levels (
    id integer NOT NULL,
    template_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    level_order integer NOT NULL,
    action_type character varying(50) NOT NULL,
    is_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.outgoing_config_levels OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 23920)
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.outgoing_config_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.outgoing_config_levels_id_seq OWNER TO postgres;

--
-- TOC entry 5648 (class 0 OID 0)
-- Dependencies: 241
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.outgoing_config_levels_id_seq OWNED BY himatif.outgoing_config_levels.id;


--
-- TOC entry 244 (class 1259 OID 23935)
-- Name: outgoing_mails; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.outgoing_mails (
    id integer NOT NULL,
    mail_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    subject text NOT NULL,
    recipient_name character varying(255) NOT NULL,
    recipient_address text,
    recipient_organization character varying(255),
    priority character varying(20) DEFAULT 'normal'::character varying,
    mail_path character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    current_approval_level integer DEFAULT 0,
    sent_date date,
    notes text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_read boolean DEFAULT false
);


ALTER TABLE himatif.outgoing_mails OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 23934)
-- Name: outgoing_mails_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.outgoing_mails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.outgoing_mails_id_seq OWNER TO postgres;

--
-- TOC entry 5649 (class 0 OID 0)
-- Dependencies: 243
-- Name: outgoing_mails_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.outgoing_mails_id_seq OWNED BY himatif.outgoing_mails.id;


--
-- TOC entry 240 (class 1259 OID 23906)
-- Name: outgoing_templates; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.outgoing_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.outgoing_templates OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 23905)
-- Name: outgoing_templates_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.outgoing_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.outgoing_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5650 (class 0 OID 0)
-- Dependencies: 239
-- Name: outgoing_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.outgoing_templates_id_seq OWNED BY himatif.outgoing_templates.id;


--
-- TOC entry 262 (class 1259 OID 24085)
-- Name: participant_notes; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.participant_notes (
    id integer NOT NULL,
    notulensi_id integer NOT NULL,
    user_id integer NOT NULL,
    notes text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.participant_notes OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 24084)
-- Name: participant_notes_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.participant_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.participant_notes_id_seq OWNER TO postgres;

--
-- TOC entry 5651 (class 0 OID 0)
-- Dependencies: 261
-- Name: participant_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.participant_notes_id_seq OWNED BY himatif.participant_notes.id;


--
-- TOC entry 228 (class 1259 OID 23799)
-- Name: positions; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.positions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    level character varying(50),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatif.positions OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 23798)
-- Name: positions_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.positions_id_seq OWNER TO postgres;

--
-- TOC entry 5652 (class 0 OID 0)
-- Dependencies: 227
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.positions_id_seq OWNED BY himatif.positions.id;


--
-- TOC entry 230 (class 1259 OID 23813)
-- Name: users; Type: TABLE; Schema: himatif; Owner: postgres
--

CREATE TABLE himatif.users (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    division_id integer,
    department_id integer,
    position_id integer,
    role character varying(50) NOT NULL,
    tenant_name character varying(100) NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reset_token character varying(255),
    reset_token_expiry timestamp without time zone
);


ALTER TABLE himatif.users OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 23812)
-- Name: users_id_seq; Type: SEQUENCE; Schema: himatif; Owner: postgres
--

CREATE SEQUENCE himatif.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatif.users_id_seq OWNER TO postgres;

--
-- TOC entry 5653 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: himatif; Owner: postgres
--

ALTER SEQUENCE himatif.users_id_seq OWNED BY himatif.users.id;


--
-- TOC entry 306 (class 1259 OID 24722)
-- Name: archived_documents; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.archived_documents (
    id integer NOT NULL,
    document_id integer NOT NULL,
    document_type character varying(50) NOT NULL,
    document_number character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    content text,
    category character varying(100),
    division_id integer,
    department_id integer,
    document_date date NOT NULL,
    archived_date date DEFAULT CURRENT_DATE,
    file_url character varying(500),
    archived_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.archived_documents OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 24721)
-- Name: archived_documents_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.archived_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.archived_documents_id_seq OWNER TO postgres;

--
-- TOC entry 5654 (class 0 OID 0)
-- Dependencies: 305
-- Name: archived_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.archived_documents_id_seq OWNED BY himatika_unpad.archived_documents.id;


--
-- TOC entry 274 (class 1259 OID 24458)
-- Name: categories; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    module_type character varying(50) NOT NULL,
    division_id integer,
    department_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.categories OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 24457)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5655 (class 0 OID 0)
-- Dependencies: 273
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.categories_id_seq OWNED BY himatika_unpad.categories.id;


--
-- TOC entry 268 (class 1259 OID 24405)
-- Name: departments; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.departments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    division_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.departments OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 24404)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.departments_id_seq OWNER TO postgres;

--
-- TOC entry 5656 (class 0 OID 0)
-- Dependencies: 267
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.departments_id_seq OWNED BY himatika_unpad.departments.id;


--
-- TOC entry 280 (class 1259 OID 24514)
-- Name: disposition_history; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.disposition_history (
    id integer NOT NULL,
    disposition_id integer NOT NULL,
    action character varying(100) NOT NULL,
    action_by integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.disposition_history OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 24513)
-- Name: disposition_history_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.disposition_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.disposition_history_id_seq OWNER TO postgres;

--
-- TOC entry 5657 (class 0 OID 0)
-- Dependencies: 279
-- Name: disposition_history_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.disposition_history_id_seq OWNED BY himatika_unpad.disposition_history.id;


--
-- TOC entry 278 (class 1259 OID 24497)
-- Name: dispositions; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.dispositions (
    id integer NOT NULL,
    incoming_mail_id integer NOT NULL,
    from_user_id integer NOT NULL,
    to_user_id integer,
    to_division_id integer,
    to_department_id integer,
    instruction text NOT NULL,
    notes text,
    due_date date,
    priority character varying(20) DEFAULT 'normal'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.dispositions OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 24496)
-- Name: dispositions_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.dispositions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.dispositions_id_seq OWNER TO postgres;

--
-- TOC entry 5658 (class 0 OID 0)
-- Dependencies: 277
-- Name: dispositions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.dispositions_id_seq OWNED BY himatika_unpad.dispositions.id;


--
-- TOC entry 266 (class 1259 OID 24390)
-- Name: divisions; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.divisions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.divisions OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 24389)
-- Name: divisions_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.divisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.divisions_id_seq OWNER TO postgres;

--
-- TOC entry 5659 (class 0 OID 0)
-- Dependencies: 265
-- Name: divisions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.divisions_id_seq OWNED BY himatika_unpad.divisions.id;


--
-- TOC entry 276 (class 1259 OID 24475)
-- Name: incoming_mails; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.incoming_mails (
    id integer NOT NULL,
    mail_number character varying(100) NOT NULL,
    mail_date date NOT NULL,
    mail_path character varying(500),
    sender_name character varying(255) NOT NULL,
    sender_address text,
    sender_organization character varying(255),
    subject text NOT NULL,
    priority character varying(20) DEFAULT 'normal'::character varying,
    notes text,
    status character varying(50) DEFAULT 'received'::character varying,
    received_by integer NOT NULL,
    received_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.incoming_mails OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 24474)
-- Name: incoming_mails_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.incoming_mails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.incoming_mails_id_seq OWNER TO postgres;

--
-- TOC entry 5660 (class 0 OID 0)
-- Dependencies: 275
-- Name: incoming_mails_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.incoming_mails_id_seq OWNED BY himatika_unpad.incoming_mails.id;


--
-- TOC entry 302 (class 1259 OID 24694)
-- Name: meeting_participants; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.meeting_participants (
    id integer NOT NULL,
    notulensi_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    role character varying(50),
    attendance_status character varying(20) DEFAULT 'invited'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.meeting_participants OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 24693)
-- Name: meeting_participants_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.meeting_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.meeting_participants_id_seq OWNER TO postgres;

--
-- TOC entry 5661 (class 0 OID 0)
-- Dependencies: 301
-- Name: meeting_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.meeting_participants_id_seq OWNED BY himatika_unpad.meeting_participants.id;


--
-- TOC entry 296 (class 1259 OID 24644)
-- Name: memo_approval_flows; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.memo_approval_flows (
    id integer NOT NULL,
    memo_id integer NOT NULL,
    approver_id integer NOT NULL,
    level_order integer NOT NULL,
    action character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.memo_approval_flows OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 24643)
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.memo_approval_flows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.memo_approval_flows_id_seq OWNER TO postgres;

--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 295
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.memo_approval_flows_id_seq OWNED BY himatika_unpad.memo_approval_flows.id;


--
-- TOC entry 292 (class 1259 OID 24609)
-- Name: memo_config_levels; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.memo_config_levels (
    id integer NOT NULL,
    template_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    level_order integer NOT NULL,
    action_type character varying(50) NOT NULL,
    is_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.memo_config_levels OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 24608)
-- Name: memo_config_levels_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.memo_config_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.memo_config_levels_id_seq OWNER TO postgres;

--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 291
-- Name: memo_config_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.memo_config_levels_id_seq OWNED BY himatika_unpad.memo_config_levels.id;


--
-- TOC entry 290 (class 1259 OID 24594)
-- Name: memo_templates; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.memo_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.memo_templates OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 24593)
-- Name: memo_templates_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.memo_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.memo_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5664 (class 0 OID 0)
-- Dependencies: 289
-- Name: memo_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.memo_templates_id_seq OWNED BY himatika_unpad.memo_templates.id;


--
-- TOC entry 294 (class 1259 OID 24623)
-- Name: memos; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.memos (
    id integer NOT NULL,
    memo_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    to_division_id integer,
    to_department_id integer,
    to_users integer[],
    priority character varying(20) DEFAULT 'normal'::character varying,
    mail_path character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    current_approval_level integer DEFAULT 0,
    generated_by integer,
    generated_at timestamp with time zone,
    effective_date date,
    notes text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.memos OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 24622)
-- Name: memos_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.memos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.memos_id_seq OWNER TO postgres;

--
-- TOC entry 5665 (class 0 OID 0)
-- Dependencies: 293
-- Name: memos_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.memos_id_seq OWNED BY himatika_unpad.memos.id;


--
-- TOC entry 300 (class 1259 OID 24674)
-- Name: notulensi; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.notulensi (
    id integer NOT NULL,
    notulensi_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    meeting_title character varying(255) NOT NULL,
    meeting_date timestamp with time zone NOT NULL,
    meeting_location character varying(255),
    meeting_agenda text,
    content text NOT NULL,
    chairman_id integer,
    secretary_id integer,
    attachment_url character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    completed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    updated_by integer
);


ALTER TABLE himatika_unpad.notulensi OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 24673)
-- Name: notulensi_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.notulensi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.notulensi_id_seq OWNER TO postgres;

--
-- TOC entry 5666 (class 0 OID 0)
-- Dependencies: 299
-- Name: notulensi_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.notulensi_id_seq OWNED BY himatika_unpad.notulensi.id;


--
-- TOC entry 298 (class 1259 OID 24659)
-- Name: notulensi_templates; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.notulensi_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.notulensi_templates OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 24658)
-- Name: notulensi_templates_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.notulensi_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.notulensi_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5667 (class 0 OID 0)
-- Dependencies: 297
-- Name: notulensi_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.notulensi_templates_id_seq OWNED BY himatika_unpad.notulensi_templates.id;


--
-- TOC entry 288 (class 1259 OID 24578)
-- Name: outgoing_approval_flows; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.outgoing_approval_flows (
    id integer NOT NULL,
    outgoing_mail_id integer NOT NULL,
    approver_id integer NOT NULL,
    level_order integer NOT NULL,
    action character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.outgoing_approval_flows OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 24577)
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.outgoing_approval_flows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.outgoing_approval_flows_id_seq OWNER TO postgres;

--
-- TOC entry 5668 (class 0 OID 0)
-- Dependencies: 287
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.outgoing_approval_flows_id_seq OWNED BY himatika_unpad.outgoing_approval_flows.id;


--
-- TOC entry 284 (class 1259 OID 24543)
-- Name: outgoing_config_levels; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.outgoing_config_levels (
    id integer NOT NULL,
    template_id integer NOT NULL,
    user_id integer,
    division_id integer,
    department_id integer,
    level_order integer NOT NULL,
    action_type character varying(50) NOT NULL,
    is_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.outgoing_config_levels OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 24542)
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.outgoing_config_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.outgoing_config_levels_id_seq OWNER TO postgres;

--
-- TOC entry 5669 (class 0 OID 0)
-- Dependencies: 283
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.outgoing_config_levels_id_seq OWNED BY himatika_unpad.outgoing_config_levels.id;


--
-- TOC entry 286 (class 1259 OID 24557)
-- Name: outgoing_mails; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.outgoing_mails (
    id integer NOT NULL,
    mail_number character varying(100),
    template_id integer,
    category_id integer NOT NULL,
    subject text NOT NULL,
    recipient_name character varying(255) NOT NULL,
    recipient_address text,
    recipient_organization character varying(255),
    priority character varying(20) DEFAULT 'normal'::character varying,
    mail_path character varying(500),
    status character varying(50) DEFAULT 'draft'::character varying,
    current_approval_level integer DEFAULT 0,
    sent_date date,
    notes text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.outgoing_mails OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 24556)
-- Name: outgoing_mails_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.outgoing_mails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.outgoing_mails_id_seq OWNER TO postgres;

--
-- TOC entry 5670 (class 0 OID 0)
-- Dependencies: 285
-- Name: outgoing_mails_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.outgoing_mails_id_seq OWNED BY himatika_unpad.outgoing_mails.id;


--
-- TOC entry 282 (class 1259 OID 24528)
-- Name: outgoing_templates; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.outgoing_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    division_id integer,
    description text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.outgoing_templates OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 24527)
-- Name: outgoing_templates_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.outgoing_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.outgoing_templates_id_seq OWNER TO postgres;

--
-- TOC entry 5671 (class 0 OID 0)
-- Dependencies: 281
-- Name: outgoing_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.outgoing_templates_id_seq OWNED BY himatika_unpad.outgoing_templates.id;


--
-- TOC entry 304 (class 1259 OID 24707)
-- Name: participant_notes; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.participant_notes (
    id integer NOT NULL,
    notulensi_id integer NOT NULL,
    user_id integer NOT NULL,
    notes text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.participant_notes OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 24706)
-- Name: participant_notes_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.participant_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.participant_notes_id_seq OWNER TO postgres;

--
-- TOC entry 5672 (class 0 OID 0)
-- Dependencies: 303
-- Name: participant_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.participant_notes_id_seq OWNED BY himatika_unpad.participant_notes.id;


--
-- TOC entry 270 (class 1259 OID 24421)
-- Name: positions; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.positions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    level character varying(50),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE himatika_unpad.positions OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 24420)
-- Name: positions_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.positions_id_seq OWNER TO postgres;

--
-- TOC entry 5673 (class 0 OID 0)
-- Dependencies: 269
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.positions_id_seq OWNED BY himatika_unpad.positions.id;


--
-- TOC entry 272 (class 1259 OID 24435)
-- Name: users; Type: TABLE; Schema: himatika_unpad; Owner: postgres
--

CREATE TABLE himatika_unpad.users (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    division_id integer,
    department_id integer,
    position_id integer,
    role character varying(50) NOT NULL,
    tenant_name character varying(100) NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reset_token character varying(10),
    reset_token_expiry timestamp without time zone
);


ALTER TABLE himatika_unpad.users OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 24434)
-- Name: users_id_seq; Type: SEQUENCE; Schema: himatika_unpad; Owner: postgres
--

CREATE SEQUENCE himatika_unpad.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE himatika_unpad.users_id_seq OWNER TO postgres;

--
-- TOC entry 5674 (class 0 OID 0)
-- Dependencies: 271
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: himatika_unpad; Owner: postgres
--

ALTER SEQUENCE himatika_unpad.users_id_seq OWNED BY himatika_unpad.users.id;


--
-- TOC entry 222 (class 1259 OID 23747)
-- Name: admins; Type: TABLE; Schema: superadmin; Owner: postgres
--

CREATE TABLE superadmin.admins (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    company_name character varying(255),
    tenant_name character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE superadmin.admins OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 23746)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: superadmin; Owner: postgres
--

CREATE SEQUENCE superadmin.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE superadmin.admins_id_seq OWNER TO postgres;

--
-- TOC entry 5675 (class 0 OID 0)
-- Dependencies: 221
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: superadmin; Owner: postgres
--

ALTER SEQUENCE superadmin.admins_id_seq OWNED BY superadmin.admins.id;


--
-- TOC entry 308 (class 1259 OID 25020)
-- Name: superadmin; Type: TABLE; Schema: superadmin; Owner: postgres
--

CREATE TABLE superadmin.superadmin (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE superadmin.superadmin OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 25019)
-- Name: superadmin_id_seq; Type: SEQUENCE; Schema: superadmin; Owner: postgres
--

CREATE SEQUENCE superadmin.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE superadmin.superadmin_id_seq OWNER TO postgres;

--
-- TOC entry 5676 (class 0 OID 0)
-- Dependencies: 307
-- Name: superadmin_id_seq; Type: SEQUENCE OWNED BY; Schema: superadmin; Owner: postgres
--

ALTER SEQUENCE superadmin.superadmin_id_seq OWNED BY superadmin.superadmin.id;


--
-- TOC entry 5054 (class 2604 OID 24103)
-- Name: archived_documents id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.archived_documents ALTER COLUMN id SET DEFAULT nextval('himatif.archived_documents_id_seq'::regclass);


--
-- TOC entry 4992 (class 2604 OID 23839)
-- Name: categories id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.categories ALTER COLUMN id SET DEFAULT nextval('himatif.categories_id_seq'::regclass);


--
-- TOC entry 4980 (class 2604 OID 23786)
-- Name: departments id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.departments ALTER COLUMN id SET DEFAULT nextval('himatif.departments_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 23895)
-- Name: disposition_history id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.disposition_history ALTER COLUMN id SET DEFAULT nextval('himatif.disposition_history_id_seq'::regclass);


--
-- TOC entry 5000 (class 2604 OID 23878)
-- Name: dispositions id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions ALTER COLUMN id SET DEFAULT nextval('himatif.dispositions_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 23771)
-- Name: divisions id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.divisions ALTER COLUMN id SET DEFAULT nextval('himatif.divisions_id_seq'::regclass);


--
-- TOC entry 4995 (class 2604 OID 23856)
-- Name: incoming_mails id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.incoming_mails ALTER COLUMN id SET DEFAULT nextval('himatif.incoming_mails_id_seq'::regclass);


--
-- TOC entry 5048 (class 2604 OID 24075)
-- Name: meeting_participants id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants ALTER COLUMN id SET DEFAULT nextval('himatif.meeting_participants_id_seq'::regclass);


--
-- TOC entry 5038 (class 2604 OID 24025)
-- Name: memo_approval_flows id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_approval_flows ALTER COLUMN id SET DEFAULT nextval('himatif.memo_approval_flows_id_seq'::regclass);


--
-- TOC entry 5028 (class 2604 OID 23990)
-- Name: memo_config_levels id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels ALTER COLUMN id SET DEFAULT nextval('himatif.memo_config_levels_id_seq'::regclass);


--
-- TOC entry 5025 (class 2604 OID 23975)
-- Name: memo_templates id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_templates ALTER COLUMN id SET DEFAULT nextval('himatif.memo_templates_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 24004)
-- Name: memos id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos ALTER COLUMN id SET DEFAULT nextval('himatif.memos_id_seq'::regclass);


--
-- TOC entry 5044 (class 2604 OID 24055)
-- Name: notulensi id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi ALTER COLUMN id SET DEFAULT nextval('himatif.notulensi_id_seq'::regclass);


--
-- TOC entry 5041 (class 2604 OID 24040)
-- Name: notulensi_templates id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi_templates ALTER COLUMN id SET DEFAULT nextval('himatif.notulensi_templates_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 23959)
-- Name: outgoing_approval_flows id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_approval_flows ALTER COLUMN id SET DEFAULT nextval('himatif.outgoing_approval_flows_id_seq'::regclass);


--
-- TOC entry 5010 (class 2604 OID 23924)
-- Name: outgoing_config_levels id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels ALTER COLUMN id SET DEFAULT nextval('himatif.outgoing_config_levels_id_seq'::regclass);


--
-- TOC entry 5014 (class 2604 OID 23938)
-- Name: outgoing_mails id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails ALTER COLUMN id SET DEFAULT nextval('himatif.outgoing_mails_id_seq'::regclass);


--
-- TOC entry 5007 (class 2604 OID 23909)
-- Name: outgoing_templates id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_templates ALTER COLUMN id SET DEFAULT nextval('himatif.outgoing_templates_id_seq'::regclass);


--
-- TOC entry 5051 (class 2604 OID 24088)
-- Name: participant_notes id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.participant_notes ALTER COLUMN id SET DEFAULT nextval('himatif.participant_notes_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 23802)
-- Name: positions id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.positions ALTER COLUMN id SET DEFAULT nextval('himatif.positions_id_seq'::regclass);


--
-- TOC entry 4988 (class 2604 OID 23816)
-- Name: users id; Type: DEFAULT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users ALTER COLUMN id SET DEFAULT nextval('himatif.users_id_seq'::regclass);


--
-- TOC entry 5135 (class 2604 OID 24725)
-- Name: archived_documents id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.archived_documents ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.archived_documents_id_seq'::regclass);


--
-- TOC entry 5074 (class 2604 OID 24461)
-- Name: categories id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.categories ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.categories_id_seq'::regclass);


--
-- TOC entry 5062 (class 2604 OID 24408)
-- Name: departments id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.departments ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.departments_id_seq'::regclass);


--
-- TOC entry 5087 (class 2604 OID 24517)
-- Name: disposition_history id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.disposition_history ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.disposition_history_id_seq'::regclass);


--
-- TOC entry 5082 (class 2604 OID 24500)
-- Name: dispositions id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.dispositions_id_seq'::regclass);


--
-- TOC entry 5058 (class 2604 OID 24393)
-- Name: divisions id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.divisions ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.divisions_id_seq'::regclass);


--
-- TOC entry 5077 (class 2604 OID 24478)
-- Name: incoming_mails id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.incoming_mails ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.incoming_mails_id_seq'::regclass);


--
-- TOC entry 5129 (class 2604 OID 24697)
-- Name: meeting_participants id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.meeting_participants_id_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 24647)
-- Name: memo_approval_flows id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_approval_flows ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.memo_approval_flows_id_seq'::regclass);


--
-- TOC entry 5109 (class 2604 OID 24612)
-- Name: memo_config_levels id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.memo_config_levels_id_seq'::regclass);


--
-- TOC entry 5106 (class 2604 OID 24597)
-- Name: memo_templates id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_templates ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.memo_templates_id_seq'::regclass);


--
-- TOC entry 5113 (class 2604 OID 24626)
-- Name: memos id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.memos_id_seq'::regclass);


--
-- TOC entry 5125 (class 2604 OID 24677)
-- Name: notulensi id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.notulensi_id_seq'::regclass);


--
-- TOC entry 5122 (class 2604 OID 24662)
-- Name: notulensi_templates id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi_templates ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.notulensi_templates_id_seq'::regclass);


--
-- TOC entry 5102 (class 2604 OID 24581)
-- Name: outgoing_approval_flows id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_approval_flows ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.outgoing_approval_flows_id_seq'::regclass);


--
-- TOC entry 5092 (class 2604 OID 24546)
-- Name: outgoing_config_levels id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.outgoing_config_levels_id_seq'::regclass);


--
-- TOC entry 5096 (class 2604 OID 24560)
-- Name: outgoing_mails id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.outgoing_mails_id_seq'::regclass);


--
-- TOC entry 5089 (class 2604 OID 24531)
-- Name: outgoing_templates id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_templates ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.outgoing_templates_id_seq'::regclass);


--
-- TOC entry 5132 (class 2604 OID 24710)
-- Name: participant_notes id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.participant_notes ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.participant_notes_id_seq'::regclass);


--
-- TOC entry 5066 (class 2604 OID 24424)
-- Name: positions id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.positions ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.positions_id_seq'::regclass);


--
-- TOC entry 5070 (class 2604 OID 24438)
-- Name: users id; Type: DEFAULT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users ALTER COLUMN id SET DEFAULT nextval('himatika_unpad.users_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 23750)
-- Name: admins id; Type: DEFAULT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.admins ALTER COLUMN id SET DEFAULT nextval('superadmin.admins_id_seq'::regclass);


--
-- TOC entry 5139 (class 2604 OID 25023)
-- Name: superadmin id; Type: DEFAULT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.superadmin ALTER COLUMN id SET DEFAULT nextval('superadmin.superadmin_id_seq'::regclass);


--
-- TOC entry 5583 (class 0 OID 24100)
-- Dependencies: 264
-- Data for Name: archived_documents; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.archived_documents (id, document_id, document_type, document_number, title, content, category, division_id, department_id, document_date, archived_date, file_url, archived_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5551 (class 0 OID 23836)
-- Dependencies: 232
-- Data for Name: categories; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.categories (id, name, code, description, module_type, division_id, department_id, created_at, updated_at) FROM stdin;
1	Surat keluar umum	701	testing 	surat_keluar	1	\N	2026-02-05 13:40:20.972617+07	2026-02-05 13:40:20.972617+07
2	Surat keluar divisi internal	SK001	test	surat_keluar	2	5	2026-02-05 13:59:10.829727+07	2026-02-05 13:59:10.829727+07
\.


--
-- TOC entry 5545 (class 0 OID 23783)
-- Dependencies: 226
-- Data for Name: departments; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.departments (id, name, code, division_id, is_active, created_at, updated_at) FROM stdin;
1	Departemen Pengembangan Organisasi	2001	1	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
2	Departemen Kaderisasi	2002	1	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
3	Departemen Hubungan Internal	2003	1	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
4	Departemen Hubungan Eksternal	2004	2	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
5	Departemen Sosial	2005	2	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
6	Departemen Media Informasi	2006	2	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
7	Departemen Keilmuan	2007	3	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
8	Departemen Keprofesian	2008	3	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
9	Departemen Pengembangan Teknologi & Informasi	2009	3	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
11	Departemen Keuangan	2011	4	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
12	Departemen Kewirausahaan	2012	4	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
10	Departemen Minat Bakat	2010	3	t	2026-01-15 09:08:01.84326+07	2026-02-05 10:15:28.837061+07
\.


--
-- TOC entry 5557 (class 0 OID 23892)
-- Dependencies: 238
-- Data for Name: disposition_history; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.disposition_history (id, disposition_id, action, action_by, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5555 (class 0 OID 23875)
-- Dependencies: 236
-- Data for Name: dispositions; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.dispositions (id, incoming_mail_id, from_user_id, to_user_id, to_division_id, to_department_id, instruction, notes, due_date, priority, status, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5543 (class 0 OID 23768)
-- Dependencies: 224
-- Data for Name: divisions; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.divisions (id, name, code, is_active, created_at, updated_at) FROM stdin;
1	Divisi Administrasi dan Kesekretariatan	1001	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
2	Divisi Internal	1002	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
4	Divisi Akademik dan Profesi	1004	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
5	Divisi Ekonomi dan Bisnis	1005	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
3	Divisi Eksternal tes	1003	t	2026-01-15 09:08:01.84326+07	2026-01-15 17:44:36.391884+07
6	Divisi tes	123	t	2026-01-15 17:44:45.227271+07	2026-01-15 17:44:45.227271+07
\.


--
-- TOC entry 5553 (class 0 OID 23853)
-- Dependencies: 234
-- Data for Name: incoming_mails; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.incoming_mails (id, mail_number, mail_date, mail_path, sender_name, sender_address, sender_organization, subject, priority, notes, status, received_by, received_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5579 (class 0 OID 24072)
-- Dependencies: 260
-- Data for Name: meeting_participants; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.meeting_participants (id, notulensi_id, user_id, division_id, department_id, role, attendance_status, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5573 (class 0 OID 24022)
-- Dependencies: 254
-- Data for Name: memo_approval_flows; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.memo_approval_flows (id, memo_id, approver_id, level_order, action, notes, approved_at, created_at) FROM stdin;
\.


--
-- TOC entry 5569 (class 0 OID 23987)
-- Dependencies: 250
-- Data for Name: memo_config_levels; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.memo_config_levels (id, template_id, user_id, division_id, department_id, level_order, action_type, is_required, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5567 (class 0 OID 23972)
-- Dependencies: 248
-- Data for Name: memo_templates; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.memo_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5571 (class 0 OID 24001)
-- Dependencies: 252
-- Data for Name: memos; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.memos (id, memo_number, template_id, category_id, subject, content, to_division_id, to_department_id, to_users, priority, mail_path, status, current_approval_level, generated_by, generated_at, effective_date, notes, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5577 (class 0 OID 24052)
-- Dependencies: 258
-- Data for Name: notulensi; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.notulensi (id, notulensi_number, template_id, category_id, meeting_title, meeting_date, meeting_location, meeting_agenda, content, chairman_id, secretary_id, attachment_url, status, completed_at, notes, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- TOC entry 5575 (class 0 OID 24037)
-- Dependencies: 256
-- Data for Name: notulensi_templates; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.notulensi_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5565 (class 0 OID 23956)
-- Dependencies: 246
-- Data for Name: outgoing_approval_flows; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.outgoing_approval_flows (id, outgoing_mail_id, approver_id, level_order, action, notes, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5561 (class 0 OID 23921)
-- Dependencies: 242
-- Data for Name: outgoing_config_levels; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.outgoing_config_levels (id, template_id, user_id, division_id, department_id, level_order, action_type, is_required, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5563 (class 0 OID 23935)
-- Dependencies: 244
-- Data for Name: outgoing_mails; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.outgoing_mails (id, mail_number, template_id, category_id, subject, recipient_name, recipient_address, recipient_organization, priority, mail_path, status, current_approval_level, sent_date, notes, created_by, updated_by, created_at, updated_at, is_read) FROM stdin;
\.


--
-- TOC entry 5559 (class 0 OID 23906)
-- Dependencies: 240
-- Data for Name: outgoing_templates; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.outgoing_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
1	test	2	2	test template divisi internal	<p>judul</p>	2026-02-05 14:11:56.895039+07	2026-02-05 14:11:56.895039+07
2	Contoh template	2	\N	Contoh template	<p><span class="tag-template">{{judul_surat}}</span>&nbsp;</p>\n<p><span class="tag-template">{{no_surat}}</span>&nbsp;</p>\n<p>&nbsp;</p>\n<table style="border-collapse: collapse; width: 100.004%;" border="1"><colgroup><col style="width: 8.71731%;"><col style="width: 91.2827%;"></colgroup>\n<tbody>\n<tr>\n<td style="text-align: right;">1.</td>\n<td><span class="tag-custom">{{isi nama disini}}</span>&nbsp;</td>\n</tr>\n<tr>\n<td style="text-align: right;">2.</td>\n<td><span class="tag-custom">{{isi alamat disini}}</span>&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>	2026-02-05 15:33:06.037+07	2026-02-05 15:33:06.037+07
\.


--
-- TOC entry 5581 (class 0 OID 24085)
-- Dependencies: 262
-- Data for Name: participant_notes; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.participant_notes (id, notulensi_id, user_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5547 (class 0 OID 23799)
-- Dependencies: 228
-- Data for Name: positions; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.positions (id, name, level, description, is_active, created_at, updated_at) FROM stdin;
1	Ketua Himpunan	Struktural - tingkat 1	Pimpinan tertinggi organisasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
2	Wakil Ketua Himpunan	Struktural - tingkat 1	Membantu Ketua dalam koordinasi organisasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
3	Kepala Divisi Administrasi dan Kesekretariatan	Struktural - tingkat 2	Memimpin Divisi Administrasi dan Kesekretariatan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
4	Kepala Divisi Internal	Struktural - tingkat 2	Memimpin Divisi Internal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
5	Kepala Divisi Eksternal	Struktural - tingkat 2	Memimpin Divisi Eksternal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
6	Kepala Divisi Akademik dan Profesi	Struktural - tingkat 2	Memimpin Divisi Akademik dan Profesi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
7	Kepala Divisi Ekonomi dan Bisnis	Struktural - tingkat 2	Memimpin Divisi Ekonomi dan Bisnis	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
8	Kepala Departemen Pengembangan Organisasi	Struktural - tingkat 3	Memimpin Departemen Pengembangan Organisasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
9	Kepala Departemen Kaderisasi	Struktural - tingkat 3	Memimpin Departemen Kaderisasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
10	Kepala Departemen Hubungan Internal	Struktural - tingkat 3	Memimpin Departemen Hubungan Internal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
11	Kepala Departemen Hubungan Eksternal	Struktural - tingkat 3	Memimpin Departemen Hubungan Eksternal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
12	Kepala Departemen Sosial	Struktural - tingkat 3	Memimpin Departemen Sosial	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
13	Kepala Departemen Media Informasi	Struktural - tingkat 3	Memimpin Departemen Media Informasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
14	Kepala Departemen Keilmuan	Struktural - tingkat 3	Memimpin Departemen Keilmuan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
15	Kepala Departemen Keprofesian	Struktural - tingkat 3	Memimpin Departemen Keprofesian	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
16	Kepala Departemen Pengembangan Teknologi & Informasi	Struktural - tingkat 3	Memimpin Departemen PTI	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
17	Kepala Departemen Minat Bakat	Struktural - tingkat 3	Memimpin Departemen Minat Bakat	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
18	Kepala Departemen Keuangan	Struktural - tingkat 3	Memimpin Departemen Keuangan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
19	Kepala Departemen Kewirausahaan	Struktural - tingkat 3	Memimpin Departemen Kewirausahaan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
20	Anggota Departemen Pengembangan Organisasi	Non struktural	Pelaksana kegiatan departemen	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
21	Anggota Departemen Kaderisasi	Non struktural	Pelaksana kegiatan kaderisasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
22	Anggota Departemen Hubungan Internal	Non struktural	Pelaksana hubungan internal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
23	Anggota Departemen Hubungan Eksternal	Non struktural	Pelaksana hubungan eksternal	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
24	Anggota Departemen Sosial	Non struktural	Pelaksana kegiatan sosial	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
25	Anggota Departemen Media Informasi	Non struktural	Pengelola konten dan publikasi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
26	Anggota Departemen Keilmuan	Non struktural	Pelaksana kegiatan keilmuan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
27	Anggota Departemen Keprofesian	Non struktural	Pelaksana kegiatan profesi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
28	Anggota Departemen Pengembangan Teknologi & Informasi	Non struktural	Pengelola sistem dan teknologi	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
29	Anggota Departemen Minat Bakat	Non struktural	Pelaksana kegiatan minat dan bakat	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
30	Anggota Departemen Keuangan	Non struktural	Pengelola kas dan laporan	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
31	Anggota Departemen Kewirausahaan	Non struktural	Pelaksana kegiatan usaha	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
\.


--
-- TOC entry 5549 (class 0 OID 23813)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: himatif; Owner: postgres
--

COPY himatif.users (id, employee_id, full_name, email, password_hash, division_id, department_id, position_id, role, tenant_name, is_active, last_login, created_at, updated_at, reset_token, reset_token_expiry) FROM stdin;
2	110002	Rayhan	rayhan@mail.com	rayhan123	1	\N	3	secretary	himatif	t	\N	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07	\N	\N
3	110003	Candra	candra@mail.com	candra123	2	\N	4	approver	himatif	t	\N	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07	\N	\N
1	110001	Ilham	ilham@mail.com	ilham123	\N	\N	1	director	himatif	t	2026-02-05 12:53:31.945827+07	2026-01-15 09:08:01.84326+07	2026-02-05 13:09:38.280215+07	dfcd65ba866aacf310d2ce8d43d21af310a21784cd050e9006ecd5acfd6cb5be	2026-02-05 16:58:46.966
4	110004	M Yusuf	muhammadyusufadhi13@gmail.com	$2b$10$SUfI7Dqz0xXWt8Ga.mmmxuvW4LhjfwWy9NFdNixCVX5gs9Z/i.Jmy	2	1	8	approver	himatif	t	2026-02-05 13:07:12.453017+07	2026-01-15 09:08:01.84326+07	2026-02-05 15:59:54.830765+07	\N	\N
7	110005	Pegawai 1	pegawai@mail.com	pegawai123	2	1	20	general	himatif	t	2026-02-05 20:21:14.290157+07	2026-01-15 09:29:55.670181+07	2026-01-15 09:37:07.722265+07	\N	\N
11	110008	Pegawai 2	pegawai2@mail.com	pegawai2	1	1	3	secretary	himatif	t	\N	2026-01-15 10:42:13.102459+07	2026-01-15 12:49:49.785459+07	\N	\N
\.


--
-- TOC entry 5625 (class 0 OID 24722)
-- Dependencies: 306
-- Data for Name: archived_documents; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.archived_documents (id, document_id, document_type, document_number, title, content, category, division_id, department_id, document_date, archived_date, file_url, archived_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5593 (class 0 OID 24458)
-- Dependencies: 274
-- Data for Name: categories; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.categories (id, name, code, description, module_type, division_id, department_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5587 (class 0 OID 24405)
-- Dependencies: 268
-- Data for Name: departments; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.departments (id, name, code, division_id, is_active, created_at, updated_at) FROM stdin;
1	Departemen test	1001	1	t	2026-01-15 10:46:52.61765+07	2026-01-15 10:46:52.61765+07
\.


--
-- TOC entry 5599 (class 0 OID 24514)
-- Dependencies: 280
-- Data for Name: disposition_history; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.disposition_history (id, disposition_id, action, action_by, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5597 (class 0 OID 24497)
-- Dependencies: 278
-- Data for Name: dispositions; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.dispositions (id, incoming_mail_id, from_user_id, to_user_id, to_division_id, to_department_id, instruction, notes, due_date, priority, status, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5585 (class 0 OID 24390)
-- Dependencies: 266
-- Data for Name: divisions; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.divisions (id, name, code, is_active, created_at, updated_at) FROM stdin;
1	Divisi test	101	f	2026-01-15 10:46:32.335851+07	2026-02-05 11:20:13.821876+07
\.


--
-- TOC entry 5595 (class 0 OID 24475)
-- Dependencies: 276
-- Data for Name: incoming_mails; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.incoming_mails (id, mail_number, mail_date, mail_path, sender_name, sender_address, sender_organization, subject, priority, notes, status, received_by, received_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5621 (class 0 OID 24694)
-- Dependencies: 302
-- Data for Name: meeting_participants; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.meeting_participants (id, notulensi_id, user_id, division_id, department_id, role, attendance_status, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5615 (class 0 OID 24644)
-- Dependencies: 296
-- Data for Name: memo_approval_flows; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.memo_approval_flows (id, memo_id, approver_id, level_order, action, notes, approved_at, created_at) FROM stdin;
\.


--
-- TOC entry 5611 (class 0 OID 24609)
-- Dependencies: 292
-- Data for Name: memo_config_levels; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.memo_config_levels (id, template_id, user_id, division_id, department_id, level_order, action_type, is_required, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5609 (class 0 OID 24594)
-- Dependencies: 290
-- Data for Name: memo_templates; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.memo_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5613 (class 0 OID 24623)
-- Dependencies: 294
-- Data for Name: memos; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.memos (id, memo_number, template_id, category_id, subject, content, to_division_id, to_department_id, to_users, priority, mail_path, status, current_approval_level, generated_by, generated_at, effective_date, notes, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5619 (class 0 OID 24674)
-- Dependencies: 300
-- Data for Name: notulensi; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.notulensi (id, notulensi_number, template_id, category_id, meeting_title, meeting_date, meeting_location, meeting_agenda, content, chairman_id, secretary_id, attachment_url, status, completed_at, notes, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- TOC entry 5617 (class 0 OID 24659)
-- Dependencies: 298
-- Data for Name: notulensi_templates; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.notulensi_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5607 (class 0 OID 24578)
-- Dependencies: 288
-- Data for Name: outgoing_approval_flows; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.outgoing_approval_flows (id, outgoing_mail_id, approver_id, level_order, action, notes, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5603 (class 0 OID 24543)
-- Dependencies: 284
-- Data for Name: outgoing_config_levels; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.outgoing_config_levels (id, template_id, user_id, division_id, department_id, level_order, action_type, is_required, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5605 (class 0 OID 24557)
-- Dependencies: 286
-- Data for Name: outgoing_mails; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.outgoing_mails (id, mail_number, template_id, category_id, subject, recipient_name, recipient_address, recipient_organization, priority, mail_path, status, current_approval_level, sent_date, notes, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5601 (class 0 OID 24528)
-- Dependencies: 282
-- Data for Name: outgoing_templates; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.outgoing_templates (id, name, category_id, division_id, description, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5623 (class 0 OID 24707)
-- Dependencies: 304
-- Data for Name: participant_notes; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.participant_notes (id, notulensi_id, user_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5589 (class 0 OID 24421)
-- Dependencies: 270
-- Data for Name: positions; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.positions (id, name, level, description, is_active, created_at, updated_at) FROM stdin;
1	Jabatan test	Struktural - Tingkat 1		t	2026-01-15 10:47:32.889529+07	2026-01-15 10:47:32.889529+07
\.


--
-- TOC entry 5591 (class 0 OID 24435)
-- Dependencies: 272
-- Data for Name: users; Type: TABLE DATA; Schema: himatika_unpad; Owner: postgres
--

COPY himatika_unpad.users (id, employee_id, full_name, email, password_hash, division_id, department_id, position_id, role, tenant_name, is_active, last_login, created_at, updated_at, reset_token, reset_token_expiry) FROM stdin;
1	1002	test	test@mail.com	test	1	1	1	approver	himatika_unpad	t	\N	2026-01-15 10:48:03.514333+07	2026-01-15 10:48:03.514333+07	\N	\N
\.


--
-- TOC entry 5541 (class 0 OID 23747)
-- Dependencies: 222
-- Data for Name: admins; Type: TABLE DATA; Schema: superadmin; Owner: postgres
--

COPY superadmin.admins (id, name, email, password, company_name, tenant_name, role, is_active, created_at, updated_at) FROM stdin;
1	Admin Himatif	himatif@admin.com	himatif123	Himatif UNPAD	himatif	admin	t	2026-01-15 09:08:01.84326+07	2026-01-15 09:08:01.84326+07
2	Admin Himatika	himatika@admin.com	himatika123	Himatika UNPAD	himatika_unpad	admin	t	2026-01-15 09:16:25.717974+07	2026-01-15 09:16:25.717974+07
\.


--
-- TOC entry 5627 (class 0 OID 25020)
-- Dependencies: 308
-- Data for Name: superadmin; Type: TABLE DATA; Schema: superadmin; Owner: postgres
--

COPY superadmin.superadmin (id, email, password, name, created_at) FROM stdin;
1	superadmin@superadmin.com	superadmin	Super Administrator	2026-02-05 12:00:03.168084+07
\.


--
-- TOC entry 5677 (class 0 OID 0)
-- Dependencies: 263
-- Name: archived_documents_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.archived_documents_id_seq', 1, false);


--
-- TOC entry 5678 (class 0 OID 0)
-- Dependencies: 231
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.categories_id_seq', 2, true);


--
-- TOC entry 5679 (class 0 OID 0)
-- Dependencies: 225
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.departments_id_seq', 13, true);


--
-- TOC entry 5680 (class 0 OID 0)
-- Dependencies: 237
-- Name: disposition_history_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.disposition_history_id_seq', 1, false);


--
-- TOC entry 5681 (class 0 OID 0)
-- Dependencies: 235
-- Name: dispositions_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.dispositions_id_seq', 1, false);


--
-- TOC entry 5682 (class 0 OID 0)
-- Dependencies: 223
-- Name: divisions_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.divisions_id_seq', 6, true);


--
-- TOC entry 5683 (class 0 OID 0)
-- Dependencies: 233
-- Name: incoming_mails_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.incoming_mails_id_seq', 1, false);


--
-- TOC entry 5684 (class 0 OID 0)
-- Dependencies: 259
-- Name: meeting_participants_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.meeting_participants_id_seq', 1, false);


--
-- TOC entry 5685 (class 0 OID 0)
-- Dependencies: 253
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.memo_approval_flows_id_seq', 1, false);


--
-- TOC entry 5686 (class 0 OID 0)
-- Dependencies: 249
-- Name: memo_config_levels_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.memo_config_levels_id_seq', 1, false);


--
-- TOC entry 5687 (class 0 OID 0)
-- Dependencies: 247
-- Name: memo_templates_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.memo_templates_id_seq', 1, false);


--
-- TOC entry 5688 (class 0 OID 0)
-- Dependencies: 251
-- Name: memos_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.memos_id_seq', 1, false);


--
-- TOC entry 5689 (class 0 OID 0)
-- Dependencies: 257
-- Name: notulensi_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.notulensi_id_seq', 1, false);


--
-- TOC entry 5690 (class 0 OID 0)
-- Dependencies: 255
-- Name: notulensi_templates_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.notulensi_templates_id_seq', 1, false);


--
-- TOC entry 5691 (class 0 OID 0)
-- Dependencies: 245
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.outgoing_approval_flows_id_seq', 1, false);


--
-- TOC entry 5692 (class 0 OID 0)
-- Dependencies: 241
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.outgoing_config_levels_id_seq', 1, false);


--
-- TOC entry 5693 (class 0 OID 0)
-- Dependencies: 243
-- Name: outgoing_mails_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.outgoing_mails_id_seq', 1, false);


--
-- TOC entry 5694 (class 0 OID 0)
-- Dependencies: 239
-- Name: outgoing_templates_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.outgoing_templates_id_seq', 2, true);


--
-- TOC entry 5695 (class 0 OID 0)
-- Dependencies: 261
-- Name: participant_notes_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.participant_notes_id_seq', 1, false);


--
-- TOC entry 5696 (class 0 OID 0)
-- Dependencies: 227
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.positions_id_seq', 31, true);


--
-- TOC entry 5697 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: himatif; Owner: postgres
--

SELECT pg_catalog.setval('himatif.users_id_seq', 13, true);


--
-- TOC entry 5698 (class 0 OID 0)
-- Dependencies: 305
-- Name: archived_documents_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.archived_documents_id_seq', 1, false);


--
-- TOC entry 5699 (class 0 OID 0)
-- Dependencies: 273
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.categories_id_seq', 1, false);


--
-- TOC entry 5700 (class 0 OID 0)
-- Dependencies: 267
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.departments_id_seq', 1, true);


--
-- TOC entry 5701 (class 0 OID 0)
-- Dependencies: 279
-- Name: disposition_history_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.disposition_history_id_seq', 1, false);


--
-- TOC entry 5702 (class 0 OID 0)
-- Dependencies: 277
-- Name: dispositions_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.dispositions_id_seq', 1, false);


--
-- TOC entry 5703 (class 0 OID 0)
-- Dependencies: 265
-- Name: divisions_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.divisions_id_seq', 1, true);


--
-- TOC entry 5704 (class 0 OID 0)
-- Dependencies: 275
-- Name: incoming_mails_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.incoming_mails_id_seq', 1, false);


--
-- TOC entry 5705 (class 0 OID 0)
-- Dependencies: 301
-- Name: meeting_participants_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.meeting_participants_id_seq', 1, false);


--
-- TOC entry 5706 (class 0 OID 0)
-- Dependencies: 295
-- Name: memo_approval_flows_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.memo_approval_flows_id_seq', 1, false);


--
-- TOC entry 5707 (class 0 OID 0)
-- Dependencies: 291
-- Name: memo_config_levels_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.memo_config_levels_id_seq', 1, false);


--
-- TOC entry 5708 (class 0 OID 0)
-- Dependencies: 289
-- Name: memo_templates_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.memo_templates_id_seq', 1, false);


--
-- TOC entry 5709 (class 0 OID 0)
-- Dependencies: 293
-- Name: memos_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.memos_id_seq', 1, false);


--
-- TOC entry 5710 (class 0 OID 0)
-- Dependencies: 299
-- Name: notulensi_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.notulensi_id_seq', 1, false);


--
-- TOC entry 5711 (class 0 OID 0)
-- Dependencies: 297
-- Name: notulensi_templates_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.notulensi_templates_id_seq', 1, false);


--
-- TOC entry 5712 (class 0 OID 0)
-- Dependencies: 287
-- Name: outgoing_approval_flows_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.outgoing_approval_flows_id_seq', 1, false);


--
-- TOC entry 5713 (class 0 OID 0)
-- Dependencies: 283
-- Name: outgoing_config_levels_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.outgoing_config_levels_id_seq', 1, false);


--
-- TOC entry 5714 (class 0 OID 0)
-- Dependencies: 285
-- Name: outgoing_mails_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.outgoing_mails_id_seq', 1, false);


--
-- TOC entry 5715 (class 0 OID 0)
-- Dependencies: 281
-- Name: outgoing_templates_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.outgoing_templates_id_seq', 1, false);


--
-- TOC entry 5716 (class 0 OID 0)
-- Dependencies: 303
-- Name: participant_notes_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.participant_notes_id_seq', 1, false);


--
-- TOC entry 5717 (class 0 OID 0)
-- Dependencies: 269
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.positions_id_seq', 1, true);


--
-- TOC entry 5718 (class 0 OID 0)
-- Dependencies: 271
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: himatika_unpad; Owner: postgres
--

SELECT pg_catalog.setval('himatika_unpad.users_id_seq', 1, true);


--
-- TOC entry 5719 (class 0 OID 0)
-- Dependencies: 221
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: superadmin; Owner: postgres
--

SELECT pg_catalog.setval('superadmin.admins_id_seq', 2, true);


--
-- TOC entry 5720 (class 0 OID 0)
-- Dependencies: 307
-- Name: superadmin_id_seq; Type: SEQUENCE SET; Schema: superadmin; Owner: postgres
--

SELECT pg_catalog.setval('superadmin.superadmin_id_seq', 1, true);


--
-- TOC entry 5212 (class 2606 OID 24117)
-- Name: archived_documents archived_documents_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.archived_documents
    ADD CONSTRAINT archived_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5165 (class 2606 OID 23851)
-- Name: categories categories_code_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.categories
    ADD CONSTRAINT categories_code_key UNIQUE (code);


--
-- TOC entry 5167 (class 2606 OID 23849)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5150 (class 2606 OID 23797)
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- TOC entry 5152 (class 2606 OID 23795)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5178 (class 2606 OID 23904)
-- Name: disposition_history disposition_history_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.disposition_history
    ADD CONSTRAINT disposition_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5175 (class 2606 OID 23890)
-- Name: dispositions dispositions_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_pkey PRIMARY KEY (id);


--
-- TOC entry 5146 (class 2606 OID 23781)
-- Name: divisions divisions_code_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.divisions
    ADD CONSTRAINT divisions_code_key UNIQUE (code);


--
-- TOC entry 5148 (class 2606 OID 23779)
-- Name: divisions divisions_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.divisions
    ADD CONSTRAINT divisions_pkey PRIMARY KEY (id);


--
-- TOC entry 5171 (class 2606 OID 23873)
-- Name: incoming_mails incoming_mails_mail_number_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.incoming_mails
    ADD CONSTRAINT incoming_mails_mail_number_key UNIQUE (mail_number);


--
-- TOC entry 5173 (class 2606 OID 23871)
-- Name: incoming_mails incoming_mails_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.incoming_mails
    ADD CONSTRAINT incoming_mails_pkey PRIMARY KEY (id);


--
-- TOC entry 5208 (class 2606 OID 24083)
-- Name: meeting_participants meeting_participants_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants
    ADD CONSTRAINT meeting_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 5200 (class 2606 OID 24035)
-- Name: memo_approval_flows memo_approval_flows_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_pkey PRIMARY KEY (id);


--
-- TOC entry 5193 (class 2606 OID 23999)
-- Name: memo_config_levels memo_config_levels_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels
    ADD CONSTRAINT memo_config_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 5191 (class 2606 OID 23985)
-- Name: memo_templates memo_templates_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_templates
    ADD CONSTRAINT memo_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5196 (class 2606 OID 24020)
-- Name: memos memos_memo_number_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_memo_number_key UNIQUE (memo_number);


--
-- TOC entry 5198 (class 2606 OID 24018)
-- Name: memos memos_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_pkey PRIMARY KEY (id);


--
-- TOC entry 5204 (class 2606 OID 24070)
-- Name: notulensi notulensi_notulensi_number_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_notulensi_number_key UNIQUE (notulensi_number);


--
-- TOC entry 5206 (class 2606 OID 24068)
-- Name: notulensi notulensi_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_pkey PRIMARY KEY (id);


--
-- TOC entry 5202 (class 2606 OID 24050)
-- Name: notulensi_templates notulensi_templates_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi_templates
    ADD CONSTRAINT notulensi_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5189 (class 2606 OID 23970)
-- Name: outgoing_approval_flows outgoing_approval_flows_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_pkey PRIMARY KEY (id);


--
-- TOC entry 5182 (class 2606 OID 23933)
-- Name: outgoing_config_levels outgoing_config_levels_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 5185 (class 2606 OID 23954)
-- Name: outgoing_mails outgoing_mails_mail_number_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_mail_number_key UNIQUE (mail_number);


--
-- TOC entry 5187 (class 2606 OID 23952)
-- Name: outgoing_mails outgoing_mails_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_pkey PRIMARY KEY (id);


--
-- TOC entry 5180 (class 2606 OID 23919)
-- Name: outgoing_templates outgoing_templates_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_templates
    ADD CONSTRAINT outgoing_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5210 (class 2606 OID 24098)
-- Name: participant_notes participant_notes_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.participant_notes
    ADD CONSTRAINT participant_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 5154 (class 2606 OID 23811)
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- TOC entry 5159 (class 2606 OID 23834)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5161 (class 2606 OID 23832)
-- Name: users users_employee_id_key; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5163 (class 2606 OID 23830)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5282 (class 2606 OID 24739)
-- Name: archived_documents archived_documents_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.archived_documents
    ADD CONSTRAINT archived_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5235 (class 2606 OID 24473)
-- Name: categories categories_code_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.categories
    ADD CONSTRAINT categories_code_key UNIQUE (code);


--
-- TOC entry 5237 (class 2606 OID 24471)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5220 (class 2606 OID 24419)
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- TOC entry 5222 (class 2606 OID 24417)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5248 (class 2606 OID 24526)
-- Name: disposition_history disposition_history_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.disposition_history
    ADD CONSTRAINT disposition_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5245 (class 2606 OID 24512)
-- Name: dispositions dispositions_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_pkey PRIMARY KEY (id);


--
-- TOC entry 5216 (class 2606 OID 24403)
-- Name: divisions divisions_code_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.divisions
    ADD CONSTRAINT divisions_code_key UNIQUE (code);


--
-- TOC entry 5218 (class 2606 OID 24401)
-- Name: divisions divisions_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.divisions
    ADD CONSTRAINT divisions_pkey PRIMARY KEY (id);


--
-- TOC entry 5241 (class 2606 OID 24495)
-- Name: incoming_mails incoming_mails_mail_number_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.incoming_mails
    ADD CONSTRAINT incoming_mails_mail_number_key UNIQUE (mail_number);


--
-- TOC entry 5243 (class 2606 OID 24493)
-- Name: incoming_mails incoming_mails_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.incoming_mails
    ADD CONSTRAINT incoming_mails_pkey PRIMARY KEY (id);


--
-- TOC entry 5278 (class 2606 OID 24705)
-- Name: meeting_participants meeting_participants_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants
    ADD CONSTRAINT meeting_participants_pkey PRIMARY KEY (id);


--
-- TOC entry 5270 (class 2606 OID 24657)
-- Name: memo_approval_flows memo_approval_flows_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_pkey PRIMARY KEY (id);


--
-- TOC entry 5263 (class 2606 OID 24621)
-- Name: memo_config_levels memo_config_levels_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels
    ADD CONSTRAINT memo_config_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 5261 (class 2606 OID 24607)
-- Name: memo_templates memo_templates_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_templates
    ADD CONSTRAINT memo_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5266 (class 2606 OID 24642)
-- Name: memos memos_memo_number_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_memo_number_key UNIQUE (memo_number);


--
-- TOC entry 5268 (class 2606 OID 24640)
-- Name: memos memos_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_pkey PRIMARY KEY (id);


--
-- TOC entry 5274 (class 2606 OID 24692)
-- Name: notulensi notulensi_notulensi_number_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_notulensi_number_key UNIQUE (notulensi_number);


--
-- TOC entry 5276 (class 2606 OID 24690)
-- Name: notulensi notulensi_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_pkey PRIMARY KEY (id);


--
-- TOC entry 5272 (class 2606 OID 24672)
-- Name: notulensi_templates notulensi_templates_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi_templates
    ADD CONSTRAINT notulensi_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5259 (class 2606 OID 24592)
-- Name: outgoing_approval_flows outgoing_approval_flows_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_pkey PRIMARY KEY (id);


--
-- TOC entry 5252 (class 2606 OID 24555)
-- Name: outgoing_config_levels outgoing_config_levels_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 5255 (class 2606 OID 24576)
-- Name: outgoing_mails outgoing_mails_mail_number_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_mail_number_key UNIQUE (mail_number);


--
-- TOC entry 5257 (class 2606 OID 24574)
-- Name: outgoing_mails outgoing_mails_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_pkey PRIMARY KEY (id);


--
-- TOC entry 5250 (class 2606 OID 24541)
-- Name: outgoing_templates outgoing_templates_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_templates
    ADD CONSTRAINT outgoing_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 5280 (class 2606 OID 24720)
-- Name: participant_notes participant_notes_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.participant_notes
    ADD CONSTRAINT participant_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 5224 (class 2606 OID 24433)
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- TOC entry 5229 (class 2606 OID 24456)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5231 (class 2606 OID 24454)
-- Name: users users_employee_id_key; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 5233 (class 2606 OID 24452)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5142 (class 2606 OID 23765)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 5144 (class 2606 OID 23763)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 5286 (class 2606 OID 25033)
-- Name: superadmin superadmin_email_key; Type: CONSTRAINT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);


--
-- TOC entry 5288 (class 2606 OID 25031)
-- Name: superadmin superadmin_pkey; Type: CONSTRAINT; Schema: superadmin; Owner: postgres
--

ALTER TABLE ONLY superadmin.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);


--
-- TOC entry 5213 (class 1259 OID 24386)
-- Name: idx_archived_documents_date; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_archived_documents_date ON himatif.archived_documents USING btree (archived_date);


--
-- TOC entry 5214 (class 1259 OID 24385)
-- Name: idx_archived_documents_type; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_archived_documents_type ON himatif.archived_documents USING btree (document_type);


--
-- TOC entry 5176 (class 1259 OID 24382)
-- Name: idx_dispositions_status; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_dispositions_status ON himatif.dispositions USING btree (status);


--
-- TOC entry 5168 (class 1259 OID 24380)
-- Name: idx_incoming_mails_mail_number; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_incoming_mails_mail_number ON himatif.incoming_mails USING btree (mail_number);


--
-- TOC entry 5169 (class 1259 OID 24381)
-- Name: idx_incoming_mails_status; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_incoming_mails_status ON himatif.incoming_mails USING btree (status);


--
-- TOC entry 5194 (class 1259 OID 24384)
-- Name: idx_memos_status; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_memos_status ON himatif.memos USING btree (status);


--
-- TOC entry 5183 (class 1259 OID 24383)
-- Name: idx_outgoing_mails_status; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_outgoing_mails_status ON himatif.outgoing_mails USING btree (status);


--
-- TOC entry 5155 (class 1259 OID 24378)
-- Name: idx_users_email; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_users_email ON himatif.users USING btree (email);


--
-- TOC entry 5156 (class 1259 OID 24379)
-- Name: idx_users_employee_id; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_users_employee_id ON himatif.users USING btree (employee_id);


--
-- TOC entry 5157 (class 1259 OID 25034)
-- Name: idx_users_reset_token; Type: INDEX; Schema: himatif; Owner: postgres
--

CREATE INDEX idx_users_reset_token ON himatif.users USING btree (reset_token);


--
-- TOC entry 5283 (class 1259 OID 25008)
-- Name: idx_archived_documents_date; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_archived_documents_date ON himatika_unpad.archived_documents USING btree (archived_date);


--
-- TOC entry 5284 (class 1259 OID 25007)
-- Name: idx_archived_documents_type; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_archived_documents_type ON himatika_unpad.archived_documents USING btree (document_type);


--
-- TOC entry 5246 (class 1259 OID 25004)
-- Name: idx_dispositions_status; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_dispositions_status ON himatika_unpad.dispositions USING btree (status);


--
-- TOC entry 5238 (class 1259 OID 25002)
-- Name: idx_incoming_mails_mail_number; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_incoming_mails_mail_number ON himatika_unpad.incoming_mails USING btree (mail_number);


--
-- TOC entry 5239 (class 1259 OID 25003)
-- Name: idx_incoming_mails_status; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_incoming_mails_status ON himatika_unpad.incoming_mails USING btree (status);


--
-- TOC entry 5264 (class 1259 OID 25006)
-- Name: idx_memos_status; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_memos_status ON himatika_unpad.memos USING btree (status);


--
-- TOC entry 5253 (class 1259 OID 25005)
-- Name: idx_outgoing_mails_status; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_outgoing_mails_status ON himatika_unpad.outgoing_mails USING btree (status);


--
-- TOC entry 5225 (class 1259 OID 25000)
-- Name: idx_users_email; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_users_email ON himatika_unpad.users USING btree (email);


--
-- TOC entry 5226 (class 1259 OID 25001)
-- Name: idx_users_employee_id; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_users_employee_id ON himatika_unpad.users USING btree (employee_id);


--
-- TOC entry 5227 (class 1259 OID 25013)
-- Name: idx_users_reset_token; Type: INDEX; Schema: himatika_unpad; Owner: postgres
--

CREATE INDEX idx_users_reset_token ON himatika_unpad.users USING btree (reset_token);


--
-- TOC entry 5339 (class 2606 OID 24373)
-- Name: archived_documents archived_documents_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.archived_documents
    ADD CONSTRAINT archived_documents_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5340 (class 2606 OID 24368)
-- Name: archived_documents archived_documents_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.archived_documents
    ADD CONSTRAINT archived_documents_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5293 (class 2606 OID 24143)
-- Name: categories categories_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.categories
    ADD CONSTRAINT categories_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5294 (class 2606 OID 24138)
-- Name: categories categories_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.categories
    ADD CONSTRAINT categories_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5289 (class 2606 OID 24118)
-- Name: departments departments_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.departments
    ADD CONSTRAINT departments_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE RESTRICT;


--
-- TOC entry 5301 (class 2606 OID 24183)
-- Name: disposition_history disposition_history_action_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.disposition_history
    ADD CONSTRAINT disposition_history_action_by_fkey FOREIGN KEY (action_by) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5302 (class 2606 OID 24178)
-- Name: disposition_history disposition_history_disposition_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.disposition_history
    ADD CONSTRAINT disposition_history_disposition_id_fkey FOREIGN KEY (disposition_id) REFERENCES himatif.dispositions(id) ON DELETE CASCADE;


--
-- TOC entry 5296 (class 2606 OID 24158)
-- Name: dispositions dispositions_from_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5297 (class 2606 OID 24153)
-- Name: dispositions dispositions_incoming_mail_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_incoming_mail_id_fkey FOREIGN KEY (incoming_mail_id) REFERENCES himatif.incoming_mails(id) ON DELETE CASCADE;


--
-- TOC entry 5298 (class 2606 OID 24173)
-- Name: dispositions dispositions_to_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_to_department_id_fkey FOREIGN KEY (to_department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5299 (class 2606 OID 24168)
-- Name: dispositions dispositions_to_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_to_division_id_fkey FOREIGN KEY (to_division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5300 (class 2606 OID 24163)
-- Name: dispositions dispositions_to_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.dispositions
    ADD CONSTRAINT dispositions_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5295 (class 2606 OID 24148)
-- Name: incoming_mails incoming_mails_received_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.incoming_mails
    ADD CONSTRAINT incoming_mails_received_by_fkey FOREIGN KEY (received_by) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5333 (class 2606 OID 24353)
-- Name: meeting_participants meeting_participants_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants
    ADD CONSTRAINT meeting_participants_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5334 (class 2606 OID 24348)
-- Name: meeting_participants meeting_participants_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants
    ADD CONSTRAINT meeting_participants_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5335 (class 2606 OID 24338)
-- Name: meeting_participants meeting_participants_notulensi_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants
    ADD CONSTRAINT meeting_participants_notulensi_id_fkey FOREIGN KEY (notulensi_id) REFERENCES himatif.notulensi(id) ON DELETE CASCADE;


--
-- TOC entry 5336 (class 2606 OID 24343)
-- Name: meeting_participants meeting_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.meeting_participants
    ADD CONSTRAINT meeting_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5325 (class 2606 OID 24283)
-- Name: memo_approval_flows memo_approval_flows_approver_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5326 (class 2606 OID 24278)
-- Name: memo_approval_flows memo_approval_flows_memo_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_memo_id_fkey FOREIGN KEY (memo_id) REFERENCES himatif.memos(id) ON DELETE CASCADE;


--
-- TOC entry 5317 (class 2606 OID 24303)
-- Name: memo_config_levels memo_config_levels_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels
    ADD CONSTRAINT memo_config_levels_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5318 (class 2606 OID 24298)
-- Name: memo_config_levels memo_config_levels_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels
    ADD CONSTRAINT memo_config_levels_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5319 (class 2606 OID 24288)
-- Name: memo_config_levels memo_config_levels_template_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels
    ADD CONSTRAINT memo_config_levels_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatif.memo_templates(id) ON DELETE CASCADE;


--
-- TOC entry 5320 (class 2606 OID 24293)
-- Name: memo_config_levels memo_config_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_config_levels
    ADD CONSTRAINT memo_config_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5315 (class 2606 OID 24248)
-- Name: memo_templates memo_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_templates
    ADD CONSTRAINT memo_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5316 (class 2606 OID 24253)
-- Name: memo_templates memo_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memo_templates
    ADD CONSTRAINT memo_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5321 (class 2606 OID 24263)
-- Name: memos memos_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5322 (class 2606 OID 24268)
-- Name: memos memos_created_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5323 (class 2606 OID 24258)
-- Name: memos memos_template_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatif.memo_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5324 (class 2606 OID 24273)
-- Name: memos memos_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.memos
    ADD CONSTRAINT memos_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5329 (class 2606 OID 24323)
-- Name: notulensi notulensi_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5330 (class 2606 OID 24328)
-- Name: notulensi notulensi_created_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5331 (class 2606 OID 24318)
-- Name: notulensi notulensi_template_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatif.notulensi_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5327 (class 2606 OID 24308)
-- Name: notulensi_templates notulensi_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi_templates
    ADD CONSTRAINT notulensi_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5328 (class 2606 OID 24313)
-- Name: notulensi_templates notulensi_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi_templates
    ADD CONSTRAINT notulensi_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5332 (class 2606 OID 24333)
-- Name: notulensi notulensi_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.notulensi
    ADD CONSTRAINT notulensi_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5313 (class 2606 OID 24223)
-- Name: outgoing_approval_flows outgoing_approval_flows_approver_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5314 (class 2606 OID 24218)
-- Name: outgoing_approval_flows outgoing_approval_flows_outgoing_mail_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_outgoing_mail_id_fkey FOREIGN KEY (outgoing_mail_id) REFERENCES himatif.outgoing_mails(id) ON DELETE CASCADE;


--
-- TOC entry 5305 (class 2606 OID 24243)
-- Name: outgoing_config_levels outgoing_config_levels_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5306 (class 2606 OID 24238)
-- Name: outgoing_config_levels outgoing_config_levels_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5307 (class 2606 OID 24228)
-- Name: outgoing_config_levels outgoing_config_levels_template_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatif.outgoing_templates(id) ON DELETE CASCADE;


--
-- TOC entry 5308 (class 2606 OID 24233)
-- Name: outgoing_config_levels outgoing_config_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5309 (class 2606 OID 24203)
-- Name: outgoing_mails outgoing_mails_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5310 (class 2606 OID 24208)
-- Name: outgoing_mails outgoing_mails_created_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5311 (class 2606 OID 24198)
-- Name: outgoing_mails outgoing_mails_template_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatif.outgoing_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5312 (class 2606 OID 24213)
-- Name: outgoing_mails outgoing_mails_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_mails
    ADD CONSTRAINT outgoing_mails_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatif.users(id) ON DELETE SET NULL;


--
-- TOC entry 5303 (class 2606 OID 24188)
-- Name: outgoing_templates outgoing_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_templates
    ADD CONSTRAINT outgoing_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatif.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5304 (class 2606 OID 24193)
-- Name: outgoing_templates outgoing_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.outgoing_templates
    ADD CONSTRAINT outgoing_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5337 (class 2606 OID 24358)
-- Name: participant_notes participant_notes_notulensi_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.participant_notes
    ADD CONSTRAINT participant_notes_notulensi_id_fkey FOREIGN KEY (notulensi_id) REFERENCES himatif.notulensi(id) ON DELETE CASCADE;


--
-- TOC entry 5338 (class 2606 OID 24363)
-- Name: participant_notes participant_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.participant_notes
    ADD CONSTRAINT participant_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatif.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5290 (class 2606 OID 24128)
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatif.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5291 (class 2606 OID 24123)
-- Name: users users_division_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatif.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5292 (class 2606 OID 24133)
-- Name: users users_position_id_fkey; Type: FK CONSTRAINT; Schema: himatif; Owner: postgres
--

ALTER TABLE ONLY himatif.users
    ADD CONSTRAINT users_position_id_fkey FOREIGN KEY (position_id) REFERENCES himatif.positions(id) ON DELETE SET NULL;


--
-- TOC entry 5391 (class 2606 OID 24995)
-- Name: archived_documents archived_documents_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.archived_documents
    ADD CONSTRAINT archived_documents_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5392 (class 2606 OID 24990)
-- Name: archived_documents archived_documents_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.archived_documents
    ADD CONSTRAINT archived_documents_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5345 (class 2606 OID 24765)
-- Name: categories categories_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.categories
    ADD CONSTRAINT categories_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5346 (class 2606 OID 24760)
-- Name: categories categories_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.categories
    ADD CONSTRAINT categories_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5341 (class 2606 OID 24740)
-- Name: departments departments_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.departments
    ADD CONSTRAINT departments_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE RESTRICT;


--
-- TOC entry 5353 (class 2606 OID 24805)
-- Name: disposition_history disposition_history_action_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.disposition_history
    ADD CONSTRAINT disposition_history_action_by_fkey FOREIGN KEY (action_by) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5354 (class 2606 OID 24800)
-- Name: disposition_history disposition_history_disposition_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.disposition_history
    ADD CONSTRAINT disposition_history_disposition_id_fkey FOREIGN KEY (disposition_id) REFERENCES himatika_unpad.dispositions(id) ON DELETE CASCADE;


--
-- TOC entry 5348 (class 2606 OID 24780)
-- Name: dispositions dispositions_from_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5349 (class 2606 OID 24775)
-- Name: dispositions dispositions_incoming_mail_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_incoming_mail_id_fkey FOREIGN KEY (incoming_mail_id) REFERENCES himatika_unpad.incoming_mails(id) ON DELETE CASCADE;


--
-- TOC entry 5350 (class 2606 OID 24795)
-- Name: dispositions dispositions_to_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_to_department_id_fkey FOREIGN KEY (to_department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5351 (class 2606 OID 24790)
-- Name: dispositions dispositions_to_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_to_division_id_fkey FOREIGN KEY (to_division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5352 (class 2606 OID 24785)
-- Name: dispositions dispositions_to_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.dispositions
    ADD CONSTRAINT dispositions_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5347 (class 2606 OID 24770)
-- Name: incoming_mails incoming_mails_received_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.incoming_mails
    ADD CONSTRAINT incoming_mails_received_by_fkey FOREIGN KEY (received_by) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5385 (class 2606 OID 24975)
-- Name: meeting_participants meeting_participants_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants
    ADD CONSTRAINT meeting_participants_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5386 (class 2606 OID 24970)
-- Name: meeting_participants meeting_participants_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants
    ADD CONSTRAINT meeting_participants_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5387 (class 2606 OID 24960)
-- Name: meeting_participants meeting_participants_notulensi_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants
    ADD CONSTRAINT meeting_participants_notulensi_id_fkey FOREIGN KEY (notulensi_id) REFERENCES himatika_unpad.notulensi(id) ON DELETE CASCADE;


--
-- TOC entry 5388 (class 2606 OID 24965)
-- Name: meeting_participants meeting_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.meeting_participants
    ADD CONSTRAINT meeting_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5377 (class 2606 OID 24905)
-- Name: memo_approval_flows memo_approval_flows_approver_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5378 (class 2606 OID 24900)
-- Name: memo_approval_flows memo_approval_flows_memo_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_approval_flows
    ADD CONSTRAINT memo_approval_flows_memo_id_fkey FOREIGN KEY (memo_id) REFERENCES himatika_unpad.memos(id) ON DELETE CASCADE;


--
-- TOC entry 5369 (class 2606 OID 24925)
-- Name: memo_config_levels memo_config_levels_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels
    ADD CONSTRAINT memo_config_levels_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5370 (class 2606 OID 24920)
-- Name: memo_config_levels memo_config_levels_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels
    ADD CONSTRAINT memo_config_levels_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5371 (class 2606 OID 24910)
-- Name: memo_config_levels memo_config_levels_template_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels
    ADD CONSTRAINT memo_config_levels_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatika_unpad.memo_templates(id) ON DELETE CASCADE;


--
-- TOC entry 5372 (class 2606 OID 24915)
-- Name: memo_config_levels memo_config_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_config_levels
    ADD CONSTRAINT memo_config_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5367 (class 2606 OID 24870)
-- Name: memo_templates memo_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_templates
    ADD CONSTRAINT memo_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5368 (class 2606 OID 24875)
-- Name: memo_templates memo_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memo_templates
    ADD CONSTRAINT memo_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5373 (class 2606 OID 24885)
-- Name: memos memos_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5374 (class 2606 OID 24890)
-- Name: memos memos_created_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5375 (class 2606 OID 24880)
-- Name: memos memos_template_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatika_unpad.memo_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5376 (class 2606 OID 24895)
-- Name: memos memos_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.memos
    ADD CONSTRAINT memos_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5381 (class 2606 OID 24945)
-- Name: notulensi notulensi_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5382 (class 2606 OID 24950)
-- Name: notulensi notulensi_created_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5383 (class 2606 OID 24940)
-- Name: notulensi notulensi_template_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatika_unpad.notulensi_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5379 (class 2606 OID 24930)
-- Name: notulensi_templates notulensi_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi_templates
    ADD CONSTRAINT notulensi_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5380 (class 2606 OID 24935)
-- Name: notulensi_templates notulensi_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi_templates
    ADD CONSTRAINT notulensi_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5384 (class 2606 OID 24955)
-- Name: notulensi notulensi_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.notulensi
    ADD CONSTRAINT notulensi_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5365 (class 2606 OID 24845)
-- Name: outgoing_approval_flows outgoing_approval_flows_approver_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5366 (class 2606 OID 24840)
-- Name: outgoing_approval_flows outgoing_approval_flows_outgoing_mail_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_approval_flows
    ADD CONSTRAINT outgoing_approval_flows_outgoing_mail_id_fkey FOREIGN KEY (outgoing_mail_id) REFERENCES himatika_unpad.outgoing_mails(id) ON DELETE CASCADE;


--
-- TOC entry 5357 (class 2606 OID 24865)
-- Name: outgoing_config_levels outgoing_config_levels_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5358 (class 2606 OID 24860)
-- Name: outgoing_config_levels outgoing_config_levels_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5359 (class 2606 OID 24850)
-- Name: outgoing_config_levels outgoing_config_levels_template_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatika_unpad.outgoing_templates(id) ON DELETE CASCADE;


--
-- TOC entry 5360 (class 2606 OID 24855)
-- Name: outgoing_config_levels outgoing_config_levels_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_config_levels
    ADD CONSTRAINT outgoing_config_levels_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5361 (class 2606 OID 24825)
-- Name: outgoing_mails outgoing_mails_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5362 (class 2606 OID 24830)
-- Name: outgoing_mails outgoing_mails_created_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_created_by_fkey FOREIGN KEY (created_by) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5363 (class 2606 OID 24820)
-- Name: outgoing_mails outgoing_mails_template_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_template_id_fkey FOREIGN KEY (template_id) REFERENCES himatika_unpad.outgoing_templates(id) ON DELETE SET NULL;


--
-- TOC entry 5364 (class 2606 OID 24835)
-- Name: outgoing_mails outgoing_mails_updated_by_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_mails
    ADD CONSTRAINT outgoing_mails_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES himatika_unpad.users(id) ON DELETE SET NULL;


--
-- TOC entry 5355 (class 2606 OID 24810)
-- Name: outgoing_templates outgoing_templates_category_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_templates
    ADD CONSTRAINT outgoing_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES himatika_unpad.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 5356 (class 2606 OID 24815)
-- Name: outgoing_templates outgoing_templates_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.outgoing_templates
    ADD CONSTRAINT outgoing_templates_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5389 (class 2606 OID 24980)
-- Name: participant_notes participant_notes_notulensi_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.participant_notes
    ADD CONSTRAINT participant_notes_notulensi_id_fkey FOREIGN KEY (notulensi_id) REFERENCES himatika_unpad.notulensi(id) ON DELETE CASCADE;


--
-- TOC entry 5390 (class 2606 OID 24985)
-- Name: participant_notes participant_notes_user_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.participant_notes
    ADD CONSTRAINT participant_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES himatika_unpad.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5342 (class 2606 OID 24750)
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES himatika_unpad.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5343 (class 2606 OID 24745)
-- Name: users users_division_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_division_id_fkey FOREIGN KEY (division_id) REFERENCES himatika_unpad.divisions(id) ON DELETE SET NULL;


--
-- TOC entry 5344 (class 2606 OID 24755)
-- Name: users users_position_id_fkey; Type: FK CONSTRAINT; Schema: himatika_unpad; Owner: postgres
--

ALTER TABLE ONLY himatika_unpad.users
    ADD CONSTRAINT users_position_id_fkey FOREIGN KEY (position_id) REFERENCES himatika_unpad.positions(id) ON DELETE SET NULL;


-- Completed on 2026-02-05 21:24:21

--
-- PostgreSQL database dump complete
--

\unrestrict lARKHIzI9jjCJdrMlWOGzDrbqKSLrz36IaQQ8v4uqVneqUru8XfzHHLTDJPDDAg

