import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import MatchDescription from "./match-description";

test("shows the organizer's description as text, including line breaks", () => {
  const html = renderToStaticMarkup(
    createElement(MatchDescription, {
      title: "Indicações do organizador",
      description: "Chegar às 18h\nTrazer <colete> & água",
    }),
  );

  assert.match(html, /Indicações do organizador/);
  assert.match(html, /Chegar às 18h\nTrazer &lt;colete&gt; &amp; água/);
  assert.doesNotMatch(html, /<colete>/);
});

test("hides the entire section when the description is missing or blank", () => {
  for (const description of [undefined, null, "", " \n "]) {
    const html = renderToStaticMarkup(
      createElement(MatchDescription, {
        title: "Indicações do organizador",
        description,
      }),
    );
    assert.equal(html, "");
  }
});
