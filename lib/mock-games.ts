import { calculateKlartNog } from "@/lib/klart-nog";
import type { GamesResponse, RawGame } from "@/lib/types";

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

function mockGame(
  appId: number,
  title: string,
  playtimeMinutes: number,
  hltbMainHours: number | null,
  hltbExtraHours: number | null,
  globalAchievementPercents: number[],
  unlockedAchievementCount: number,
): RawGame {
  return {
    appId,
    title,
    playtimeMinutes,
    coverUrl: steamCover(appId),
    klartNog: calculateKlartNog({
      playtimeMinutes,
      hltbMainHours,
      hltbExtraHours,
      globalAchievementPercents,
      unlockedAchievementCount,
    }),
  };
}

const eldenRingGlobals = [78, 62, 41, 28, 19, 8, 4, 3, 2, 1];
const cyberpunkGlobals = [72, 55, 31, 18, 6, 4, 2];
const rdr2Globals = [81, 67, 52, 39, 24, 17, 11, 8, 5];
const hadesGlobals = [88, 74, 58, 43, 21, 15, 9, 6];

export const mockGames: GamesResponse = {
  source: "mock",
  hasApiKey: false,
  games: [
    mockGame(1245620, "Elden Ring", 1860, 54, 89, eldenRingGlobals, 4),
    mockGame(1091500, "Cyberpunk 2077", 420, 23, 55, cyberpunkGlobals, 2),
    mockGame(
      1174180,
      "Red Dead Redemption 2",
      3120,
      48,
      76,
      rdr2Globals,
      6,
    ),
    mockGame(1145360, "Hades", 980, 12, 25, hadesGlobals, 4),
    mockGame(367520, "Hollow Knight", 0, 15, 28, [], 0),
    mockGame(413150, "Stardew Valley", 0, 52, 90, [], 0),
    mockGame(1086940, "Baldur's Gate 3", 0, 60, 103, [], 0),
    mockGame(1593500, "God of War", 45, 21, 35, [66, 29, 11, 5, 2], 1),
    mockGame(1817070, "Marvel's Spider-Man Remastered", 0, 17, 25, [], 0),
    mockGame(620, "Portal 2", 540, 8, 14, [92, 76, 61, 48, 33, 22], 5),
    mockGame(105600, "Terraria", 120, 45, 90, [70, 22, 9, 4, 2], 1),
    mockGame(271590, "Grand Theft Auto V", 90, 32, 48, [64, 18, 7, 3], 1),
  ],
};
