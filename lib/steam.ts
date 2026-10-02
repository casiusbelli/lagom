import { getHltbTimes } from "@/lib/hltb";
import { calculateKlartNog, emptyKlartNog } from "@/lib/klart-nog";
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

export function getDefaultSteamInput(): string | undefined {
  const fromEnv =
    process.env.STEAM_VANITY?.trim() || process.env.STEAM_ID?.trim();
  return fromEnv || undefined;
}

export async function getLibraryGames(
  steamInput?: string,
): Promise<GamesResponse> {
  const hasApiKey = Boolean(getSteamApiKey());
  const defaultSteamInput = getDefaultSteamInput();
  const trimmedInput = steamInput?.trim() || defaultSteamInput;

  if (!trimmedInput || !hasApiKey) {
    return {
      source: "mock",
      games: mockGames.games,
      hasApiKey,
      defaultSteamInput,
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

    // Return the full library immediately. Klart-nog is filled in later in
    // batches so a 1000+ game account does not time out on Vercel.
    const games = sortedGames.map((game) => ({
      appId: game.appId,
      title: game.title,
      playtimeMinutes: game.playtimeMinutes,
      coverUrl: steamCover(game.appId),
      klartNog: emptyKlartNog(),
    }));

    return {
      source: "steam",
      games,
      steamId,
      hasApiKey: true,
      defaultSteamInput,
    };
  } catch (error) {
    if (error instanceof SteamApiError) {
      return {
        source: "mock",
        games: mockGames.games,
        hasApiKey,
        defaultSteamInput,
        error: error.message,
      };
    }

    return {
      source: "mock",
      games: mockGames.games,
      hasApiKey,
      defaultSteamInput,
      error:
        "Kunde inte synka med Steam just nu. Kontrollera att profil och speldetaljer är offentliga och försök igen.",
    };
  }
}

export async function enrichLibraryGames(
  steamInput: string,
  appIds: number[],
): Promise<RawGame[]> {
  const steamId = await resolveSteamId(steamInput);
  const ownedGames = await fetchOwnedGames(steamId);
  const wanted = new Set(appIds);
  const selected = ownedGames.filter((game) => wanted.has(game.appId));

  return mapWithConcurrency(selected, 3, (game) => enrichGame(steamId, game));
}
