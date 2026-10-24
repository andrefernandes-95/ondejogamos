import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const english = JSON.parse(
  readFileSync(new URL("../messages/en.json", import.meta.url), "utf8"),
);
const portuguese = JSON.parse(
  readFileSync(new URL("../messages/pt-PT.json", import.meta.url), "utf8"),
);

function keyTree(value: unknown): unknown {
  if (typeof value !== "object" || value === null) {
    return typeof value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, keyTree(child)]),
  );
}

test("English and Portuguese message catalogs have matching key structures", () => {
  assert.deepEqual(keyTree(english), keyTree(portuguese));
});
