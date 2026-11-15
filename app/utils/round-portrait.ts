import sharp from "sharp";

const size = 512;

function circularMask() {
  const channels = 4;
  const mask = Buffer.alloc(size * size * channels, 255);
  const radius = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const distance = Math.hypot(x + 0.5 - radius, y + 0.5 - radius);
      mask[(y * size + x) * channels + 3] =
        Math.round(255 * Math.max(0, Math.min(1, radius + 0.5 - distance)));
    }
  }
  return { input: mask, raw: { width: size, height: size, channels } as const, blend: "dest-in" as const };
}

const mask = circularMask();

export function renderRoundPortrait(photo: Buffer) {
  return sharp(photo)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .composite([mask])
    .png()
    .toBuffer();
}
