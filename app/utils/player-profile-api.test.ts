import assert from "node:assert/strict";
import test from "node:test";
import { parsePlayerProfileResponse, serializePlayerProfileUpdate } from "@/app/utils/player-profile-api";

test("serializes editable fields and an optional avatar as multipart form data", () => {
  const fullProfile = {
    id: "player-1",
    name: "Alex",
    image: "https://example.test/avatar.png",
    age: 31,
    matches_played: 4,
    date_of_birth: "1995-02-03",
    preferred_area: "Lisbon",
    preferred_position: "midfielder" as const,
  };
  const body = serializePlayerProfileUpdate(fullProfile);
  assert.equal(body.get("name"), "Alex");
  assert.equal(body.get("date_of_birth"), "1995-02-03");
  assert.equal(body.get("preferred_area"), "Lisbon");
  assert.equal(body.get("preferred_position"), "midfielder");
  assert.equal(body.has("avatar"), false);
});

test("includes the selected avatar file without changing the editable fields", () => {
  const input = {
    name: "Alex",
    date_of_birth: null,
    preferred_area: null,
    preferred_position: null,
  };
  const avatar = new File(["image"], "avatar.webp", { type: "image/webp" });
  const body = serializePlayerProfileUpdate(input, avatar);
  assert.equal(body.get("avatar"), avatar);
});

test("parses the owner profile response and preserves server-calculated age", () => {
  const profile = {
    id: "player-1",
    name: "Alex",
    image: null,
    age: 31,
    matches_played: 4,
    date_of_birth: "1995-02-03",
    preferred_area: null,
    preferred_position: "midfielder",
  };

  assert.deepEqual(parsePlayerProfileResponse(profile), profile);
});

test("rejects malformed owner profile responses", () => {
  assert.equal(parsePlayerProfileResponse({
    id: "player-1",
    name: "Alex",
    image: null,
    age: "31",
    matches_played: -1,
    date_of_birth: null,
    preferred_area: null,
    preferred_position: "striker",
  }), null);
});

test("rejects negative matches played counts", () => {
  assert.equal(parsePlayerProfileResponse({
    id: "player-1",
    name: "Alex",
    image: null,
    age: 31,
    matches_played: -1,
    date_of_birth: null,
    preferred_area: null,
    preferred_position: null,
  }), null);
});
