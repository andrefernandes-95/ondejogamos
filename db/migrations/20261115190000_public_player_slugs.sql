-- migrate:up
ALTER TABLE player_profiles ADD COLUMN public_slug TEXT UNIQUE;
ALTER TABLE player_username_claims ADD COLUMN redirect_enabled BOOLEAN NOT NULL DEFAULT false;

UPDATE player_username_claims AS claim
SET redirect_enabled = true
FROM player_profiles AS profile
WHERE profile.user_id = claim.user_id AND profile.published
  AND claim.username = profile.username;

-- Preserve portrait privacy when an existing card becomes public.
UPDATE player_profiles SET visible_fields = array_remove(visible_fields, 'photo')
WHERE NOT published;

CREATE FUNCTION assign_player_slug(owner_id TEXT, display_name TEXT) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  base TEXT;
  candidate TEXT;
  suffix TEXT := '';
  attempt INTEGER := 1;
BEGIN
  base := regexp_replace(lower(normalize(display_name, NFKD)), U&'[\0300-\036f]', '', 'g');
  base := trim(BOTH '-' FROM regexp_replace(base, '[^a-z0-9]+', '-', 'g'));
  base := COALESCE(NULLIF(base, ''), 'jogador');

  LOOP
    candidate := rtrim(left(base, 60 - length(suffix)), '-') || suffix;
    IF candidate ~ '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$' THEN
      candidate := 'jogador-' || candidate;
    END IF;
    INSERT INTO player_username_claims (username, user_id, redirect_enabled)
    VALUES (candidate, owner_id, true)
    ON CONFLICT (username) DO NOTHING;
    IF FOUND THEN EXIT; END IF;

    UPDATE player_username_claims SET redirect_enabled = true
    WHERE username = candidate AND user_id = owner_id;
    IF FOUND THEN EXIT; END IF;

    attempt := attempt + 1;
    suffix := '-' || attempt;
  END LOOP;

  INSERT INTO player_profiles (user_id, public_slug) VALUES (owner_id, candidate)
  ON CONFLICT (user_id) DO UPDATE SET public_slug = EXCLUDED.public_slug;
END;
$$;

CREATE FUNCTION sync_player_slug() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM assign_player_slug(NEW.id, NEW.name);
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_player_slug_on_insert AFTER INSERT ON "user"
FOR EACH ROW EXECUTE FUNCTION sync_player_slug();

CREATE TRIGGER sync_player_slug_on_rename AFTER UPDATE OF name ON "user"
FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name) EXECUTE FUNCTION sync_player_slug();

SELECT assign_player_slug(id, name) FROM "user" ORDER BY "createdAt", id;

-- migrate:down
DROP TRIGGER sync_player_slug_on_rename ON "user";
DROP TRIGGER sync_player_slug_on_insert ON "user";
DROP FUNCTION sync_player_slug();
DROP FUNCTION assign_player_slug(TEXT, TEXT);
ALTER TABLE player_profiles DROP COLUMN public_slug;
ALTER TABLE player_username_claims DROP COLUMN redirect_enabled;
