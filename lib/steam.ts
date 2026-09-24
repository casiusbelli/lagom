import { mockGames } from "@/lib/mock-games";
import type { GamesResponse, RawGame } from "@/lib/types";

type SteamOwnedGame = {
  appid: number;
  name?: string;
  playtime_forever?: number;
};

type SteamOwnedGamesResponse = {
  response?: {
    game_count?: number;
    games?: SteamOwnedGame[];
  };
};

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

function mapSteamGames(games: SteamOwnedGame[]): RawGame[] {
  return games
    .filter((game) => Boolean(game.name))
    .map((game) => ({
      appId: game.appid,
      title: game.name ?? "Okänt spel",
      playtimeMinutes: game.playtime_forever ?? 0,
      coverUrl: steamCover(game.appid),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "sv"));
}

export async function getLibraryGames(): Promise<GamesResponse> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;

  if (!apiKey || !steamId) {
    return {
      source: "mock",
      games: mockGames.games,
    };
  }

  try {
    const url = new URL(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
    );
    url.searchParams.set("key", apiKey);
    url.searchParams.set("steamid", steamId);
    url.searchParams.set("include_appinfo", "1");
    url.searchParams.set("include_played_free_games", "1");
    url.searchParams.set("format", "json");

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Steam API returned ${response.status}`);
    }

    const data = (await response.json()) as SteamOwnedGamesResponse;
    const games = data.response?.games ?? [];

    if (games.length === 0) {
      return {
        source: "mock",
        games: mockGames.games,
      };
    }

    return {
      source: "steam",
      games: mapSteamGames(games),
    };
  } catch {
    return {
      source: "mock",
      games: mockGames.games,
    };
  }
}
