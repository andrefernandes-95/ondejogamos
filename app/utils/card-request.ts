import { cardSettingsSchema } from "@/app/schemas/player-card";
import { maxPortraitSize } from "@/app/utils/portrait-image";

const maxBody = maxPortraitSize + 64 * 1024;

export async function readCardRequest(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let length = 0;

  while (true) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.byteLength;
    if (length > maxBody) {
      await reader.cancel();
      return null;
    }
    parts.push(new Uint8Array(part.value));
  }

  try {
    const body = new Response(new Blob(parts), { headers: request.headers });
    const form = await body.formData();
    const settings = cardSettingsSchema.safeParse(JSON.parse(String(form.get("settings"))));
    const photo = form.get("photo");
    if (!settings.success) return null;
    if (settings.data.photoAction === "replace" ? !(photo instanceof File) : photo !== null) {
      return null;
    }
    return { settings: settings.data, photo: photo instanceof File ? photo : null };
  } catch {
    return null;
  }
}
