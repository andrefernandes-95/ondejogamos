-- migrate:up
ALTER TABLE player_profiles ADD COLUMN username TEXT;
ALTER TABLE player_profiles ADD CONSTRAINT player_profiles_username_key UNIQUE (username);
ALTER TABLE player_profiles ADD CONSTRAINT player_profiles_username_format
  CHECK (username ~ '^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$');

CREATE TABLE player_username_claims (
  username TEXT PRIMARY KEY,
  user_id TEXT REFERENCES "user" (id) ON DELETE SET NULL
);

CREATE FUNCTION ensure_player_username(owner_id TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  current_username TEXT;
  base TEXT;
  candidate TEXT;
  attempt INTEGER := 1;
BEGIN
  INSERT INTO player_profiles (user_id) VALUES (owner_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT username INTO current_username FROM player_profiles
  WHERE user_id = owner_id FOR UPDATE;
  IF current_username IS NOT NULL THEN
    RETURN current_username;
  END IF;

  SELECT trim(BOTH '-' FROM regexp_replace(lower(split_part(email, '@', 1)), '[^a-z0-9]+', '-', 'g'))
    INTO base FROM "user" WHERE id = owner_id;
  base := rtrim(left(base, 30), '-');
  IF length(base) < 3 THEN
    base := 'jogador' || CASE WHEN base = '' THEN '' ELSE '-' || base END;
  END IF;

  candidate := base;
  LOOP
    INSERT INTO player_username_claims (username, user_id)
    VALUES (candidate, owner_id)
    ON CONFLICT (username) DO NOTHING;
    IF FOUND THEN
      UPDATE player_profiles SET username = candidate WHERE user_id = owner_id;
      RETURN candidate;
    END IF;
    attempt := attempt + 1;
    candidate := rtrim(left(base, 29 - length(attempt::text)), '-')
      || '-' || attempt::text;
  END LOOP;
END;
$$;

DO $$
DECLARE
  owner RECORD;
BEGIN
  FOR owner IN SELECT id FROM "user" ORDER BY "createdAt", id LOOP
    PERFORM ensure_player_username(owner.id);
  END LOOP;
END;
$$;

-- migrate:down
DROP FUNCTION ensure_player_username(TEXT);
DROP TABLE player_username_claims;
ALTER TABLE player_profiles DROP COLUMN username;
