import { NextRequest, NextResponse } from "next/server";

import { getLibraryGames } from "@/lib/steam";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const steamInput = request.nextUrl.searchParams.get("steamInput") ?? undefined;
  const library = await getLibraryGames(steamInput);
  return NextResponse.json(library);
}
