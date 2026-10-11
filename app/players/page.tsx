import PlayerList from "@/app/components/player-list/player-list";
import { listUsers } from "@/app/services/user";
import { connection } from "next/server";

export default async function PlayersPage() {
  await connection();
  const data = await listUsers();

  return <PlayerList data={data} />;
}
