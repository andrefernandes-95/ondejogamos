-- migrate:up
ALTER TABLE "matches" DROP COLUMN max_attendance;

ALTER TABLE "matches" ADD COLUMN min_attendance INT NOT NULL DEFAULT 10
        CHECK (min_attendance > 0);

ALTER TABLE "matches" ADD COLUMN "description" TEXT;

-- migrate:down

ALTER TABLE "matches" DROP COLUMN "description";
ALTER TABLE "matches" DROP COLUMN "min_attendance";
ALTER TABLE "matches" ADD COLUMN "max_attendance" INT NOT NULL DEFAULT 10
    CHECK (max_attendance > 0);
