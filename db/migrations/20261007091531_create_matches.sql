-- migrate:up
CREATE TABLE "matches"(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_by TEXT NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    starts_at TIMESTAMPTZ NOT NULL,

    duration_in_minutes INT NOT NULL DEFAULT 60
        CHECK (duration_in_minutes > 0),

    format TEXT NOT NULL
        CHECK (format IN ('5x5', '7x7', '11x11')),

    max_attendance INT NOT NULL
        CHECK (max_attendance > 0),

    cancelled_at TIMESTAMPTZ,
    pitch_id BIGINT NOT NULL REFERENCES "pitches"(id)
);

--Go directly to the pitch and search dates within its group
CREATE INDEX "matches_pitch_starts_at_idx"
    ON "matches" ("pitch_id", "starts_at");

CREATE INDEX "matches_starts_at_idx"
    ON "matches" ("starts_at");

-- migrate:down

DROP TABLE "matches";
