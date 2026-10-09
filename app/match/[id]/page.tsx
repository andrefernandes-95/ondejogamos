"use server";

import MatchDetailsPage from "@/app/components/match-details-page/match-details-page";
import auth from "@/app/lib/auth";
import { getFullMatchById } from "@/app/services/matches";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });

  const match = await getFullMatchById(Number(id), session?.user?.id);

  if (!match) {
    notFound();
  }

  return <MatchDetailsPage match={match} />;
}
