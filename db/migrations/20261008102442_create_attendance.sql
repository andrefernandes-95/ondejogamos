-- migrate:up

CREATE TABLE "attendance" (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id),
  match_id BIGINT NOT NULL REFERENCES "matches"(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Works as an index -> filter users by match
  UNIQUE (match_id, user_id)
);

-- migrate:down
DROP TABLE "attendance";
