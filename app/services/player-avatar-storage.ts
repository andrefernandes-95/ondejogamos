import {
  deleteFile,
  type StoredPublicFile,
  uploadPublicFile,
} from "@/app/services/object-storage";
import { randomUUID } from "node:crypto";

export const MAX_PLAYER_AVATAR_SIZE = 5 * 1024 * 1024;

const avatarExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function getAvatarExtension(contentType: string): string | null {
  return avatarExtensions[contentType] ?? null;
}

export function validatePlayerAvatar(file: File): string | null {
  const extension = getAvatarExtension(file.type);
  if (!extension || file.size === 0 || file.size > MAX_PLAYER_AVATAR_SIZE) {
    return null;
  }
  return extension;
}

export async function uploadPlayerAvatar(
  file: File,
  extension: string,
): Promise<StoredPublicFile> {
  const storageKey = `avatars/${randomUUID()}.${extension}`;
  return uploadPublicFile({ file, storageKey });
}

export async function deletePlayerAvatar(storageKey: string): Promise<void> {
  try {
    await deleteFile(storageKey);
  } catch (error) {
    console.error("Could not delete replaced player avatar", { storageKey, error });
  }
}
