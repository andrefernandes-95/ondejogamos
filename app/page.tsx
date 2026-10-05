import HomeClient from "@/app/components/home-client/home-client";
import { listLocations } from "@/app/services/locations";
import { cookies } from "next/headers";
import { connection } from "next/server";

export default async function Home() {
  await connection();

  const cookieStore = await cookies();
  const preferredArea = cookieStore.get("preferredArea")?.value ?? "";

  const data = await listLocations();

  const initialArea = data.some((entry) => entry.area === preferredArea)
    ? preferredArea
    : "";

  return <HomeClient data={data} initialArea={initialArea} />;
}
