import PlayerIdentity from "@/app/components/player-identity/player-identity";
import type { PlayerIdentity as Player } from "@/app/models/player-identity";
import { useTranslations } from "next-intl";

export default function MatchOrganizer({ player }: { player: Player }) {
  const t = useTranslations("App.MatchDetailsPage");
  return <PlayerIdentity player={player} label={t("organized_by")} />;
}
