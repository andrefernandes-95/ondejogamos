import assert from "node:assert/strict";
import test from "node:test";
import { matchShareMetadata, matchWhatsAppText } from "./match-share";

const match = {
  id: "42",
  format: "5x5" as const,
  starts_at: new Date("2030-07-01T22:30:00Z"),
  pitch: {
    name: "Rinque das Piscinas",
    municipality: "Chamusca",
    area: "Santarém",
    image_url: "https://images.example.com/pitch.jpg",
  },
};

test("generates a match-specific social preview with canonical URL and pitch photo", () => {
  const metadata = matchShareMetadata(match, "pt-PT");
  assert.match(metadata.title as string, /Rinque das Piscinas/);
  assert.match(metadata.description as string, /Chamusca, Santarém/);
  assert.match(metadata.description as string, /23:30/);
  assert.equal(metadata.alternates?.canonical, "https://ondejogamos.com/match/42");
  assert.equal(metadata.openGraph?.url, "https://ondejogamos.com/match/42");
  assert.deepEqual(metadata.openGraph?.images, [{
    url: "https://images.example.com/pitch.jpg",
    alt: "Rinque das Piscinas",
  }]);
  assert.deepEqual(metadata.twitter?.images, ["https://images.example.com/pitch.jpg"]);
});

test("uses the existing site image when a pitch has no safe public photo", () => {
  for (const image_url of [undefined, "", "javascript:alert(1)", "http://localhost/a.jpg", "/private.jpg"]) {
    const metadata = matchShareMetadata({ ...match, pitch: { ...match.pitch, image_url } }, "pt-PT");
    assert.deepEqual(metadata.openGraph?.images, [{ url: "/og-image.png", alt: "Rinque das Piscinas" }]);
    assert.deepEqual(metadata.twitter?.images, ["/og-image.png"]);
  }
});

test("localizes the invitation and includes match details rather than a generic message", () => {
  const pt = matchWhatsAppText(match, "pt-PT");
  const en = matchWhatsAppText(match, "en");
  assert.match(pt, /Futebol 5x5 no Rinque das Piscinas \(Chamusca, Santarém\)/);
  assert.match(pt, /23:30/);
  assert.match(pt, /Bora jogar\?/);
  assert.match(en, /Football 5x5 at Rinque das Piscinas/);
  assert.match(en, /Want to play\?/);
});
