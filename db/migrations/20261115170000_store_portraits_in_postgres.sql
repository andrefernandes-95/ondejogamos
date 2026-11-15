-- migrate:up
ALTER TABLE player_profiles ADD COLUMN avatar_bytes BYTEA;

CREATE UNIQUE INDEX player_profiles_database_portrait_idx
  ON player_profiles (avatar_storage_key)
  WHERE avatar_bytes IS NOT NULL;

-- migrate:down
DROP INDEX player_profiles_database_portrait_idx;
ALTER TABLE player_profiles DROP COLUMN avatar_bytes;
