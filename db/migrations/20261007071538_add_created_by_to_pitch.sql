-- migrate:up
ALTER TABLE pitches ADD COLUMN created_by TEXT REFERENCES "user"(id);

-- migrate:down
ALTER TABLE pitches DROP COLUMN created_by;
