-- migrate:up
-- Remove the signup allocation from databases that ran the earlier development schema.
DROP TRIGGER IF EXISTS player_founder_after_signup ON "user";
DROP FUNCTION IF EXISTS award_founder_on_signup();
DROP FUNCTION IF EXISTS activate_founder_awards(TEXT[]);
DROP TABLE IF EXISTS founder_slots, founder_config;

-- migrate:down
-- The former signup allocation was a pre-release experiment.
SELECT 1;
