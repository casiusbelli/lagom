import { getHltbTimes } from "@/lib/hltb";
import { calculateKlartNog } from "@/lib/klart-nog";
import { mockGames } from "@/lib/mock-games";
import {
  fetchGlobalAchievementPercentages,
  fetchOwnedGames,
  fetchPlayerAchievements,
  getSteamApiKey,
  mapWithConcurrency,
  resolveSteamId,
  SteamApiError,
} from "@/lib/steam-api";
import type { GamesResponse, RawGame } from "@/lib/types";

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

async function enrichGame(
  steamId: string,
  game: { appId: number; title: string; playtimeMinutes: number },
): Promise<RawGame> {
  const [hltb, playerAchievements, globalPercentages] = await Promise.all([
    getHltbTimes(game.title),
    game.playtimeMinutes > 0
      ? fetchPlayerAchievements(steamId, game.appId)
      : Promise.resolve([]),
    game.playtimeMinutes > 0
      ? fetchGlobalAchievementPercentages(game.appId)
      : Promise.resolve({} as Record<string, number>),
  ]);

  const globalAchievementPercents = Object.values(globalPercentages);
  const unlockedAchievementCount = playerAchievements.filter(
    (achievement) => achievement.unlocked,
  ).length;

  const klartNog = calculateKlartNog({
    playtimeMinutes: game.playtimeMinutes,
    hltbMainHours: hltb?.mainHours ?? null,
    hltbExtraHours: hltb?.extraHours ?? null,
    globalAchievementPercents,
    unlockedAchievementCount,
  });

  return {
    appId: game.appId,
    title: game.title,
    playtimeMinutes: game.playtimeMinutes,
    coverUrl: steamCover(game.appId),
    klartNog,
  };
}

export async function getLibraryGames(
  steamInput?: string,
): Promise<GamesResponse> {
  const hasApiKey = Boolean(getSteamApiKey());
  const trimmedInput = steamInput?.trim();

  if (!trimmedInput || !hasApiKey) {
    return {
      source: "mock",
      games: mockGames.games,
      hasApiKey,
      message: !hasApiKey
        ? "Ingen Steam API-nyckel på servern — visar exempelbibliotek."
        : "Ange Steam-id eller vanity-URL i inställningarna för att synka.",
    };
  }

  try {
    const steamId = await resolveSteamId(trimmedInput);
    const ownedGames = await fetchOwnedGames(steamId);

    const sortedGames = ownedGames.sort((a, b) =>
      a.title.localeCompare(b.title, "sv"),
    );

    const enrichedGames = await mapWithConcurrency(
      sortedGames,
      4,
      (game) => enrichGame(steamId, game),
    );

    return {
      source: "steam",
      games: enrichedGames,
      steamId,
      hasApiKey: true,
    };
  } catch (error) {
    if (error instanceof SteamApiError) {
      return {
        source: "mock",
        games: mockGames.games,
        hasApiKey,
        error: error.message,
      };
    }

    return {
      source: "mock",
      games: mockGames.games,
      hasApiKey,
      error:
        "Kunde inte synka med Steam just nu. Kontrollera att profil och speldetaljer är offentliga och försök igen.",
    };
  }
}
