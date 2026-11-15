import sharp from "sharp";

export const maxPortraitSize = 5 * 1024 * 1024;
const maxPixels = 24_000_000;
const allowedFormats = new Set(["jpeg", "png", "webp"]);

export async function normalizePortrait(file: File) {
  if (file.size < 1 || file.size > maxPortraitSize) return null;
  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: maxPixels });
    const { format, width, height, pages } = await image.metadata();
    if (!format || !allowedFormats.has(format) || !width || !height || (pages ?? 1) > 1) {
      return null;
    }

    return await image.rotate()
      .resize(700, 700, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return null;
  }
}
