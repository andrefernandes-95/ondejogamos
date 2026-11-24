import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import en from "@/app/messages/en.json";
import pt from "@/app/messages/pt-PT.json";
import type { FullMatch } from "@/app/models/match";
import MatchAttendanceStatus from "./match-attendance-status";

function renderStatus(locale: "en" | "pt-PT", guestCount: number) {
  const attendances: FullMatch["attendances"] = Array.from({ length: guestCount }, (_, index) => ({
    user_id: String(index),
    user_name: "Guest",
    created_at: "2026-11-24T10:00:00Z",
    player: { name: "Guest", publicSlug: `guest-${index}`, hasPublicPhoto: false },
  }));

  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={locale === "en" ? en : pt} timeZone="Europe/Lisbon">
      <MatchAttendanceStatus match={{ min_attendance: 10, attendances }} />
    </NextIntlClientProvider>,
  );
}

test("counts the organizer and uses the singular when one more player is needed", () => {
  assert.match(renderStatus("en", 0), />9 players needed</);
  assert.match(renderStatus("en", 8), />1 player needed</);
  assert.match(renderStatus("pt-PT", 8), />Falta 1 jogador</);
});

test("reaching or exceeding the minimum shows enough signups", () => {
  for (const guestCount of [9, 10]) {
    assert.match(renderStatus("en", guestCount), />Enough players signed up</);
    assert.match(renderStatus("pt-PT", guestCount), />Já há jogadores suficientes</);
  }
});
