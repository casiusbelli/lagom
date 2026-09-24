import { parseSteamInput } from "@/lib/steam-id";

const STEAM_API = "https://api.steampowered.com";

export class SteamApiError extends Error {
  constructor(
    message: string,
    public readonly code: "missing_key" | "invalid_input" | "private_profile" | "not_found" | "api_error",
  ) {
    super(message);
    this.name = "SteamApiError";
  }
}

type ResolveVanityResponse = {
  response?: {
    success?: number;
    steamid?: string;
    message?: string;
  };
};

type OwnedGamesResponse = {
  response?: {
    game_count?: number;
    games?: Array<{
      appid: number;
      name?: string;
      playtime_forever?: number;
    }>;
  };
};

type PlayerAchievementsResponse = {
  playerstats?: {
    success?: boolean;
    error?: string;
    achievements?: Array<{
      apiname: string;
      achieved: number;
    }>;
  };
};

type GlobalAchievementResponse = {
  achievementpercentages?: {
    achievements?: Array<{
      name: string;
      percent: number;
    }>;
  };
};

export function getSteamApiKey(): string | undefined {
  return process.env.STEAM_API_KEY;
}

export async function resolveSteamId(steamInput: string): Promise<string> {
  const apiKey = getSteamApiKey();
  if (!apiKey) {
    throw new SteamApiError(
      "Steam API-nyckel saknas på servern.",
      "missing_key",
    );
  }

  const parsed = parseSteamInput(steamInput);
  if (!parsed) {
    throw new SteamApiError(
      "Ogiltigt Steam-id eller vanity-URL.",
      "invalid_input",
    );
  }

  if (parsed.type === "steamid") {
    return parsed.value;
  }

  const url = new URL(`${STEAM_API}/ISteamUser/ResolveVanityURL/v0001/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("vanityurl", parsed.value);
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new SteamApiError("Steam API svarade inte.", "api_error");
  }

  const data = (await response.json()) as ResolveVanityResponse;
  if (data.response?.success !== 1 || !data.response.steamid) {
    throw new SteamApiError(
      "Kunde inte hitta Steam-profilen. Kontrollera vanity-URL eller steamid64.",
      "not_found",
    );
  }

  return data.response.steamid;
}

export async function fetchOwnedGames(steamId: string) {
  const apiKey = getSteamApiKey();
  if (!apiKey) {
    throw new SteamApiError(
      "Steam API-nyckel saknas på servern.",
      "missing_key",
    );
  }

  const url = new URL(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "1");
  url.searchParams.set("include_played_free_games", "1");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new SteamApiError("Kunde inte hämta spelbiblioteket.", "api_error");
  }

  const data = (await response.json()) as OwnedGamesResponse;
  const games = data.response?.games ?? [];

  if (games.length === 0) {
    throw new SteamApiError(
      "Profilen är privat eller speldetaljer är dolda. Gå till Steam → Inställningar → Integritet och sätt både profil och speldetaljer till Offentlig.",
      "private_profile",
    );
  }

  return games
    .filter((game) => Boolean(game.name))
    .map((game) => ({
      appId: game.appid,
      title: game.name ?? "Okänt spel",
      playtimeMinutes: game.playtime_forever ?? 0,
    }));
}

export async function fetchPlayerAchievements(
  steamId: string,
  appId: number,
): Promise<Array<{ apiname: string; unlocked: boolean }>> {
  const apiKey = getSteamApiKey();
  if (!apiKey) return [];

  const url = new URL(
    `${STEAM_API}/ISteamUserStats/GetPlayerAchievements/v0001/`,
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("appid", String(appId));
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) return [];

  const data = (await response.json()) as PlayerAchievementsResponse;
  if (!data.playerstats?.success) return [];

  return (data.playerstats.achievements ?? []).map((achievement) => ({
    apiname: achievement.apiname,
    unlocked: achievement.achieved === 1,
  }));
}

export async function fetchGlobalAchievementPercentages(
  appId: number,
): Promise<Record<string, number>> {
  const url = new URL(
    `${STEAM_API}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/`,
  );
  url.searchParams.set("gameid", String(appId));
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) return {};

  const data = (await response.json()) as GlobalAchievementResponse;
  const percentages: Record<string, number> = {};

  for (const achievement of data.achievementpercentages?.achievements ?? []) {
    percentages[achievement.name] = Number(achievement.percent);
  }

  return percentages;
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );

  return results;
}
