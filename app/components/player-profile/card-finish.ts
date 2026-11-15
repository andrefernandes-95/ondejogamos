import { brandBlue, brandGreen } from "@/app/design/brand-colors";

const standard = {
  highlight: "#81bcff",
  trim: "#d6edff",
  metal: "#3979c9",
  halo: brandBlue,
  face: "#123675",
  depth: "#091e45",
  accent: "#e0f1ff",
};

const founder = {
  highlight: "#ebd58b",
  trim: "#fff1bd",
  metal: "#a47731",
  halo: brandGreen,
  face: "#0d513d",
  depth: "#092e26",
  accent: "#f6e2a5",
};

export type CardFinish = typeof standard;
export const cardFinish = (isFounder: boolean): CardFinish => isFounder ? founder : standard;

export const cardFrameFilename = (isFounder: boolean) => isFounder ? "founder.webp" : "standard.webp";
