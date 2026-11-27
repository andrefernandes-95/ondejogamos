import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import pt from "@/app/messages/pt-PT.json";
import type { FullMatch } from "@/app/models/match";
import MatchCard from "./match-card";

const match: FullMatch = {
  id: "218",
  creator: { name: "Marta", publicSlug: "marta", hasPublicPhoto: false },
  pitch: { name: "Ringue da Chamusca", municipality: "Chamusca", area: "Santarém" },
  format: "5x5",
  created_at: new Date("2026-11-25T12:00:00Z"),
  starts_at: new Date("2026-11-28T16:00:00Z"),
  duration_in_minutes: 60,
  attendanceCount: 1,
  min_attendance: 10,
  cancelled_at: null,
  description: "",
  accepts_attendance: true,
  attendances: [],
  is_attending: false,
  is_creator: false,
};

test("offers match details alongside the viewer's participation action", () => {
  for (const isCreator of [false, true]) {
    const html = renderToStaticMarkup(
      <NextIntlClientProvider locale="pt-PT" messages={pt} timeZone="Europe/Lisbon">
        <MatchCard match={{ ...match, is_creator: isCreator }} onAttendanceChanged={() => {}} />
      </NextIntlClientProvider>,
    );

    assert.match(html, /<a [^>]*href="\/match\/218"[^>]*>Ver detalhes/);
    assert.match(html, /Faltam 9 jogadores/);
    if (isCreator) {
      assert.match(html, /Agendaste este jogo/);
      assert.doesNotMatch(html, />Participar</);
    } else {
      assert.match(html, />Participar</);
    }
  }
});

test("uses the organizer's shield as the avatar and honors photo visibility", () => {
  for (const hasPublicPhoto of [false, true]) {
    const html = renderToStaticMarkup(
      <NextIntlClientProvider locale="pt-PT" messages={pt} timeZone="Europe/Lisbon">
        <MatchCard match={{ ...match, creator: { ...match.creator, hasPublicPhoto, isFounderCard: true } }}
          onAttendanceChanged={() => {}} />
      </NextIntlClientProvider>,
    );

    assert.match(html, /<a [^>]*href="\/players\/marta"[^>]*>[^]*card-frames\/founder\.webp/);
    assert.equal(html.includes('src="/players/marta/portrait"'), hasPublicPhoto);
  }
});
