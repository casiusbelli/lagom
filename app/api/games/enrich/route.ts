import { NextRequest, NextResponse } from "next/server";

import { enrichLibraryGames, getDefaultSteamInput } from "@/lib/steam";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    steamInput?: string;
    appIds?: number[];
  };

  const steamInput =
    body.steamInput?.trim() || getDefaultSteamInput() || "";
  const appIds = (body.appIds ?? []).slice(0, 8);

  if (!steamInput || appIds.length === 0) {
    return NextResponse.json({ games: [] });
  }

  try {
    const games = await enrichLibraryGames(steamInput, appIds);
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] }, { status: 200 });
  }
}
