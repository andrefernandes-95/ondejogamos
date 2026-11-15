import { pool } from "@/app/lib/db";
import { s3 } from "@/app/lib/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";

export function isDatabasePortrait(key: string) {
  return /^player-portraits\/db-[a-f0-9-]{36}\.webp$/.test(key);
}

export function createPortraitKey() {
  const prefix = process.env.PLAYER_PORTRAIT_BUCKET ? "" : "db-";
  return `player-portraits/${prefix}${randomUUID()}.webp`;
}

function legacyStorageLocation(key: string) {
  if (!/^player-portraits\/[a-f0-9-]{36}\.webp$/.test(key)) {
    throw new Error("Invalid portrait storage key");
  }
  const bucket = process.env.PLAYER_PORTRAIT_BUCKET;
  if (bucket) return { bucket, path: null };
  if (process.env.NODE_ENV === "production") throw new Error("Legacy portrait bucket is missing");
  return { bucket: null, path: join(process.cwd(), ".local", key) };
}

export async function storeExternalPortrait(key: string, bytes: Buffer) {
  const { bucket } = legacyStorageLocation(key);
  if (!bucket) throw new Error("Portrait bucket is missing");
  await s3.send(new PutObjectCommand({
    Bucket: bucket, Key: key, Body: bytes, ContentType: "image/webp",
  }));
}

export async function readPortrait(key: string) {
  if (isDatabasePortrait(key)) {
    const { rows } = await pool.query<{ avatar_bytes: Buffer }>(
      "SELECT avatar_bytes FROM player_profiles WHERE avatar_storage_key = $1 AND avatar_bytes IS NOT NULL",
      [key],
    );
    return rows[0]?.avatar_bytes ?? null;
  }

  const place = legacyStorageLocation(key);
  if (!place.bucket) return readFile(place.path!);
  const object = await s3.send(new GetObjectCommand({ Bucket: place.bucket, Key: key }));
  return Buffer.from(await object.Body!.transformToByteArray());
}

export async function deletePortrait(key: string) {
  const place = legacyStorageLocation(key);
  if (!place.bucket) return rm(place.path!, { force: true });
  await s3.send(new DeleteObjectCommand({ Bucket: place.bucket, Key: key }));
}
