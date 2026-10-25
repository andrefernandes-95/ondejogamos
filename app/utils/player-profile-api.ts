import { PlayerProfileEditingPayload, playerPositions } from "@/app/models/player-profile";
import { readApiErrorCode } from "@/app/utils/api-error";
import { z } from "zod";

const ownerProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  age: z.number().int().nonnegative().nullable(),
  matches_played: z.number().int().nonnegative(),
  preferred_area: z.string().nullable(),
  preferred_position: z.enum(playerPositions).nullable(),
  date_of_birth: z.string().nullable(),
});

export type PlayerProfileUpdateInput = Pick<
  PlayerProfileEditingPayload,
  "name" | "date_of_birth" | "preferred_area" | "preferred_position"
>;

export type UpdatePlayerProfileResult =
  | { ok: true; profile: PlayerProfileEditingPayload }
  | { ok: false; errorCode: string };

export function serializePlayerProfileUpdate(input: PlayerProfileUpdateInput, avatar: File | null = null): FormData {
  const formData = new FormData();
  formData.set("name", input.name);
  formData.set("date_of_birth", input.date_of_birth || "");
  formData.set("preferred_area", input.preferred_area ?? "");
  formData.set("preferred_position", input.preferred_position ?? "");
  if (avatar) {
    formData.set("avatar", avatar);
  }
  return formData;
}

export function parsePlayerProfileResponse(payload: unknown): PlayerProfileEditingPayload | null {
  const parsed = ownerProfileResponseSchema.safeParse(payload);
  if (!parsed.success) {
    return null;
  }
  return parsed.data;
}

export async function updatePlayerProfile(input: PlayerProfileUpdateInput, avatar: File | null = null): Promise<UpdatePlayerProfileResult> {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      body: serializePlayerProfileUpdate(input, avatar),
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      return { ok: false, errorCode: readApiErrorCode(payload) };
    }
    const profile = parsePlayerProfileResponse(payload);
    if (!profile) {
      return { ok: false, errorCode: "INTERNAL_ERROR" };
    }
    return { ok: true, profile };
  } catch {
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}
