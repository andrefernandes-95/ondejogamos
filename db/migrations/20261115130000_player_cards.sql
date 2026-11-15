-- migrate:up
ALTER TABLE player_profiles
  ADD COLUMN public_id UUID UNIQUE DEFAULT gen_random_uuid(),
  ADD COLUMN published BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN visible_fields TEXT[] NOT NULL DEFAULT ARRAY['position','area','played'],
  ADD COLUMN selected_badges TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE player_profiles ALTER COLUMN public_id SET NOT NULL;

CREATE TABLE player_portrait_cleanup (
  storage_key TEXT PRIMARY KEY,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE player_portrait_cleanup;
ALTER TABLE player_profiles DROP COLUMN public_id, DROP COLUMN published,
  DROP COLUMN visible_fields, DROP COLUMN selected_badges;
