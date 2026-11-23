-- migrate:up
ALTER TABLE matches ADD COLUMN played_confirmed_at timestamptz;

-- migrate:down
ALTER TABLE matches DROP COLUMN played_confirmed_at;
