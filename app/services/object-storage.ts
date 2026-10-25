import { s3 } from "@/app/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

interface UploadPublicFileInput {
  file: File;
  storageKey: string;
}

export interface StoredPublicFile {
  url: string;
  storageKey: string;
}

export function isObjectStorageConfigured(): boolean {
  return Boolean(process.env.S3_BUCKET && process.env.PUBLIC_BUCKET_URL);
}

export async function uploadPublicFile({
  file,
  storageKey,
}: UploadPublicFileInput): Promise<StoredPublicFile> {
  const { bucket, publicUrl } = getObjectStorageConfig();

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: storageKey,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  }));

  return { url: `${publicUrl}/${storageKey}`, storageKey };
}

export async function deleteFile(storageKey: string): Promise<void> {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error("Object storage is not configured");
  }

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: storageKey }));
}

function getObjectStorageConfig(): { bucket: string; publicUrl: string } {
  const bucket = process.env.S3_BUCKET;
  const publicUrl = process.env.PUBLIC_BUCKET_URL;

  if (!bucket || !publicUrl) {
    throw new Error("Object storage is not configured");
  }

  return { bucket, publicUrl };
}
