import type { CardBadge } from "@/app/models/player-card";

export const founderEligibility = `u."createdAt" < TIMESTAMPTZ '2027-01-01 00:00:00 Europe/Lisbon'`;

export function earnedCardBadges(isFounder: boolean): CardBadge[] {
  return isFounder ? ["founder"] : [];
}
