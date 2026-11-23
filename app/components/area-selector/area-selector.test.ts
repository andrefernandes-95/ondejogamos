import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { GameCount } from "./area-selector";

const messages = {
  App: {
    Agenda: {
      game_count: "{count, plural, one {# jogo} other {# jogos}}",
    },
  },
};

function renderCount(count: number) {
  return renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      {
        locale: "pt-PT",
        messages,
        children: createElement(GameCount, { count }),
      },
    ),
  );
}

test("displays the correctly pluralized game count", () => {
  assert.match(renderCount(1), /1 jogo/);
  assert.match(renderCount(2), /2 jogos/);
});

test("does not show a counter for locations with no games", () => {
  assert.equal(renderCount(0), "");
});
