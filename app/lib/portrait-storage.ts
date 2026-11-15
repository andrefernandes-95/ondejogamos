import { s3 } from "@/app/lib/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export class PortraitStorageUnavailable extends Error {}

function storageLocation(key: string) {
  if (!/^player-portraits\/[a-f0-9-]{36}\.webp$/.test(key)) {
    throw new Error("Invalid portrait storage key");
  }
  const bucket = process.env.PLAYER_PORTRAIT_BUCKET;
  if (bucket) return { bucket, path: null };
  if (process.env.NODE_ENV === "production") throw new PortraitStorageUnavailable();
  return { bucket: null, path: join(process.cwd(), ".local", key) };
}

export async function storePortrait(key: string, bytes: Buffer) {
  const place = storageLocation(key);
  if (place.bucket) {
    await s3.send(new PutObjectCommand({
      Bucket: place.bucket, Key: key, Body: bytes, ContentType: "image/webp",
    }));
  } else {
    await mkdir(join(process.cwd(), ".local", "player-portraits"), { recursive: true });
    await writeFile(place.path!, bytes, { flag: "wx" });
  }
}

export async function readPortrait(key: string) {
  const place = storageLocation(key);
  if (!place.bucket) return readFile(place.path!);
  const object = await s3.send(new GetObjectCommand({ Bucket: place.bucket, Key: key }));
  return Buffer.from(await object.Body!.transformToByteArray());
}

export async function deletePortrait(key: string) {
  const place = storageLocation(key);
  if (!place.bucket) return rm(place.path!, { force: true });
  await s3.send(new DeleteObjectCommand({ Bucket: place.bucket, Key: key }));
}
