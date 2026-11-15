"use client";

import type { CardSettings, PlayerCardEditorData } from "@/app/models/player-card";
import { playerName, playerUsername } from "@/app/schemas/player-card";
import { readApiErrorCodeFromResponse, type ApiErrorCode } from "@/app/utils/api-error";
import { useEffect, useState } from "react";

export function useCardDraft(data: PlayerCardEditorData) {
  const [settings, setSettings] = useState(data.settings);
  const [photo, setPhoto] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiErrorCode | null>(null);

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function choosePhoto(file: File | null) {
    setError(null);
    setPreview(file ? URL.createObjectURL(file) : null);
    setPhoto(file);
    setRemoved(!file);
    if (file) {
      setSettings((current) => current.visible.includes("photo")
        ? current : { ...current, visible: [...current.visible, "photo"] });
    }
  }

  async function save(): Promise<PlayerCardEditorData | null> {
    const name = playerName.safeParse(settings.name);
    if (!name.success) {
      setError("INVALID_PLAYER_NAME");
      return null;
    }
    const username = playerUsername.safeParse(settings.username);
    if (!username.success) {
      setError("INVALID_USERNAME");
      return null;
    }
    setBusy(true);
    setError(null);
    const normalized: CardSettings = {
      ...settings,
      name: name.data,
      username: username.data,
      area: settings.area?.trim() || null,
      position: settings.position?.trim() || null,
    };
    const photoAction = photo ? "replace" : removed ? "remove" : "keep";
    const form = new FormData();
    form.append("settings", JSON.stringify({ ...normalized, photoAction }));
    if (photo) form.append("photo", photo);

    try {
      const response = await fetch("/api/player-card", { method: "PUT", body: form });
      if (!response.ok) {
        setError(await readApiErrorCodeFromResponse(response));
        return null;
      }
      const { name: savedName, username: savedUsername } = await response.json();
      return {
        ...data,
        settings: { ...normalized, name: savedName, username: savedUsername },
        portrait: photo ? `/api/player-card/portrait?v=${Date.now()}` : removed ? null : data.portrait,
      };
    } catch {
      setError("PROFILE_UPDATE_FAILED");
      return null;
    } finally {
      setBusy(false);
    }
  }

  return {
    settings, setSettings, choosePhoto, pendingPhoto: photo !== null, save, busy, error,
    portrait: removed ? null : photo ? preview : data.portrait,
  };
}
