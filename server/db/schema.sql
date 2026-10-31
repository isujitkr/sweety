CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password      TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS readings (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reading_date DATE        NOT NULL,
  slot         TEXT        NOT NULL
               CHECK (slot IN ('morning', 'after_breakfast', 'after_lunch', 'after_dinner')),
  value        INTEGER     NOT NULL CHECK (value BETWEEN 40 AND 600),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, reading_date, slot)
);

CREATE INDEX IF NOT EXISTS idx_readings_user_date ON readings (user_id, reading_date);
