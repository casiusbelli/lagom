import { NextResponse } from "next/server";

import { getLibraryGames } from "@/lib/steam";

export async function GET() {
  const library = await getLibraryGames();
  return NextResponse.json(library);
}
