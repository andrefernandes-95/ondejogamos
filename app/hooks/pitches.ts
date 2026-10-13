import { useTranslations } from "next-intl";
import { Pitch } from "@/app/services/pitches";
import { useEffect, useState } from "react";

export function useListPitchesForArea(area: string): Pitch[] {
  const t = useTranslations();
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    const fetchPitchesForArea = async () => {
      const response = await fetch(
        `/api/pitches?area=${encodeURIComponent(area)}`,
      );

      if (!response.ok) {
        throw new Error(t("Common.loadPitchesError"));
      }

      const pitchesForArea = await response.json();

      setPitches(pitchesForArea);
    };
    fetchPitchesForArea();
  }, [area, t]);

  return pitches;
}
