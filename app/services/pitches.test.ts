import assert from "node:assert/strict";
import test from "node:test";
import { pool } from "@/app/lib/db";
import { savePitch, type SavePitchInput } from "./pitches";

const input: SavePitchInput = {
  name: "Campo Municipal",
  area: "Santarém",
  municipality: "Chamusca",
  maps_url: "https://maps.google.com/",
  image_url: "https://images.example.com/pitch.png",
  created_by: "player-b",
};

test("creation is insert-only, never an update of somebody else's pitch", async (t) => {
  let statement = "";
  t.mock.method(pool, "query", (async (sql: string) => {
    statement = sql;
    return { rows: [] };
  }) as unknown as typeof pool.query);

  await assert.rejects(savePitch(input), { message: "PITCH_ALREADY_EXISTS" });
  assert.match(statement, /ON CONFLICT \(area, municipality, name\) DO NOTHING/);
  assert.doesNotMatch(statement, /DO UPDATE/);
});

test("creation returns the new pitch when there is no duplicate", async (t) => {
  const created = { ...input, id: 123 };
  t.mock.method(pool, "query", (async () => ({ rows: [created] })) as unknown as typeof pool.query);

  assert.deepEqual(await savePitch(input), created);
});
