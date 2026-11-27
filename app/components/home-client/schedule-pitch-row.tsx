import PitchRow from "@/app/components/pitch-list/pitch-row";
import { brandBlueLight } from "@/app/design/brand-colors";
import { softEntrance } from "@/app/design/motion";
import { ExpandMoreRounded } from "@mui/icons-material";
import type { PitchWithSlots } from "@/app/services/pitch-availability";
import { Button, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function SchedulePitchRow({ pitch, onSelect }: { pitch: PitchWithSlots; onSelect: (time: string) => void }) {
  const t = useTranslations("App.HomeSchedule");
  const [expanded, setExpanded] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const eveningTimes = pitch.times.filter((time) => time >= "17:00" && time.endsWith(":00"));
  const featured = (eveningTimes.length ? eveningTimes : pitch.times).slice(0, 4);

  return (
    <PitchRow name={pitch.name} locality={pitch.municipality} image={pitch.image_url} actions={<>
        {featured.map((time) => (
          <Button key={time} onClick={() => onSelect(time)}
            aria-label={t("select_time", { name: pitch.name, time })}
            sx={{
              border: 1, borderColor: "transparent", bgcolor: brandBlueLight, fontVariantNumeric: "tabular-nums",
              minWidth: { xs: 54, sm: 64 }, px: { xs: 0.75, sm: 1.25 },
              "&:hover": { borderColor: "primary.main" },
            }}>
            {time}
          </Button>
        ))}
        <Button aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}
          endIcon={<ExpandMoreRounded sx={{
            transform: expanded ? "rotate(180deg)" : "none",
            "@media (prefers-reduced-motion: no-preference)": { transition: "transform 160ms ease" },
          }} />}>
          {t("more_times")}
        </Button>
      </>}>
      {expanded && (
        <Stack direction="row" sx={{ ...softEntrance, gridColumn: "1 / -1", alignItems: "center", gap: 1, flexWrap: "wrap", pt: 1 }}>
          <TextField select label={t("free_times")} value="" size="small" slotProps={{ select: { native: true } }}
            onChange={(event) => onSelect(event.target.value)} sx={{ minWidth: 155 }}>
            <option value="" />
            {pitch.times.map((time) => <option key={time}>{time}</option>)}
          </TextField>
          <TextField type="time" label={t("custom_time")} value={customTime} size="small"
            onChange={(event) => setCustomTime(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <Button disabled={!customTime} onClick={() => onSelect(customTime)}>{t("select")}</Button>
        </Stack>
      )}
    </PitchRow>
  );
}
