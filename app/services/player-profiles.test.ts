import assert from "node:assert/strict";
import test from "node:test";
import { isValidBirthDate, playerProfileSchema } from "@/app/validations/player-profile";
import { getAvatarExtension, MAX_PLAYER_AVATAR_SIZE, validatePlayerAvatar } from "@/app/services/player-avatar-storage";

test("validates optional birth dates and finite football positions", () => {
  const base = {
    name: "  Alex  ",
    date_of_birth: "2000-02-29",
    preferred_area: "Lisboa",
    preferred_position: "midfielder",
  };
  assert.equal(playerProfileSchema.safeParse(base).success, true);
  assert.equal(playerProfileSchema.safeParse({ ...base, preferred_position: "winger" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "2001-02-29" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "2027-01-01" }).success, false);
  assert.equal(playerProfileSchema.safeParse({ ...base, date_of_birth: "1900-01-01" }).success, false);
  assert.equal(isValidBirthDate("2026-10-25", new Date("2026-10-24T12:00:00Z")), false);
  assert.equal(isValidBirthDate("1900-01-01", new Date("2026-10-24T12:00:00Z")), false);
  assert.equal(isValidBirthDate(null), true);
});

test("accepts only non-empty JPEG, PNG and WebP avatars up to 5 MB", () => {
  assert.equal(getAvatarExtension("image/jpeg"), "jpg");
  assert.equal(getAvatarExtension("image/png"), "png");
  assert.equal(getAvatarExtension("image/webp"), "webp");
  assert.equal(getAvatarExtension("image/gif"), null);
  assert.equal(validatePlayerAvatar(new File([new Uint8Array(MAX_PLAYER_AVATAR_SIZE)], "x.png", { type: "image/png" })), "png");
  assert.equal(validatePlayerAvatar(new File([], "x.png", { type: "image/png" })), null);
  assert.equal(validatePlayerAvatar(new File([new Uint8Array(MAX_PLAYER_AVATAR_SIZE + 1)], "x.png", { type: "image/png" })), null);
});
