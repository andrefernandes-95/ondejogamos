import assert from "node:assert/strict";
import test from "node:test";
import { parsePlayerProfileResponse, serializePlayerProfileUpdate } from "@/app/utils/player-profile-api";

test("serializes only editable profile fields", () => {
  const fullProfile = {
    id: "player-1",
    name: "Alex",
    image: "https://example.test/avatar.png",
    age: 31,
    date_of_birth: "1995-02-03",
    preferred_area: "Lisbon",
    preferred_position: "midfielder" as const,
  };
  const body = serializePlayerProfileUpdate(fullProfile);

  assert.deepEqual(JSON.parse(body), {
    name: "Alex",
    date_of_birth: "1995-02-03",
    preferred_area: "Lisbon",
    preferred_position: "midfielder",
  });
});

test("parses the owner profile response and preserves server-calculated age", () => {
  const profile = {
    id: "player-1",
    name: "Alex",
    image: null,
    age: 31,
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
    date_of_birth: null,
    preferred_area: null,
    preferred_position: "striker",
  }), null);
});
