CREATE DATABASE reports;

\connect reports

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS reports (
                                       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name    TEXT NOT NULL,
    title         TEXT,
    params        JSONB,
    config        JSONB,
    status        TEXT DEFAULT 'В ожидании...',
    result_path   TEXT,
    filter        JSONB,
    mime          TEXT,
    error         TEXT,
    source_db_id  TEXT,
    created_at    TIMESTAMPTZ DEFAULT now(),
    finished_at   TIMESTAMPTZ,
    columns     JSONB,
    count       TEXT,
    avg         TEXT,
    group_by    TEXT,
    order_by    TEXT,
    order_dir   TEXT
    );

CREATE INDEX IF NOT EXISTS reports_source_idx ON reports (source_db_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);