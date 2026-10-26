-- migrate:up

DROP TABLE "player_profiles";

-- migrate:down

CREATE TABLE "player_profiles" (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  date_of_birth DATE,
  preferred_area TEXT,
  preferred_position TEXT,
  avatar_url TEXT,
  avatar_storage_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "player_profiles_preferred_area_idx"
  ON "player_profiles" (preferred_area)
  WHERE preferred_area IS NOT NULL;
