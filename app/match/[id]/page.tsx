import MatchDetailsPage from "@/app/components/match-details-page/match-details-page";
import auth from "@/app/lib/auth";
import { getFullMatchById } from "@/app/services/matches";
import { matchShareMetadata } from "@/app/utils/match-share";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const match = await getFullMatchById(Number(id));
  if (!match) notFound();

  return matchShareMetadata(match, await getLocale());
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
