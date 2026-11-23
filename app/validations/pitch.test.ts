import assert from "node:assert/strict";
import test from "node:test";
import { MAX_IMAGE_SIZE } from "@/app/utils/image";
import { safeParseFormData, safeUpdateParseFormData } from "./pitch";

function pitchForm(image?: File | string) {
  const form = new FormData();
  form.set("name", "Campo Municipal");
  form.set("area", "Santarém");
  form.set("municipality", "Chamusca");
  form.set("maps_url", "https://maps.google.com/");
  if (image !== undefined) form.set("image", image);
  return form;
}

test("creation requires a valid image", () => {
  assert.equal(safeParseFormData(pitchForm()).success, false);
  assert.equal(safeParseFormData(pitchForm(new File(["ok"], "pitch.png", {
    type: "image/png",
  }))).success, true);
});

test("editing can retain the current image without uploading another", () => {
  assert.equal(safeUpdateParseFormData(pitchForm()).success, true);
});

test("editing rejects unsupported image types and non-file values", () => {
  assert.equal(safeUpdateParseFormData(pitchForm(new File(["x"], "test.svg", {
    type: "image/svg+xml",
  }))).success, false);
  assert.equal(safeUpdateParseFormData(pitchForm("not a file")).success, false);
});

test("editing rejects oversized or empty image files", () => {
  assert.equal(safeUpdateParseFormData(pitchForm(new File([], "empty.png", {
    type: "image/png",
  }))).success, false);
  assert.equal(safeUpdateParseFormData(pitchForm(new File([
    new Uint8Array(MAX_IMAGE_SIZE + 1),
  ], "large.png", { type: "image/png" }))).success, false);
});
