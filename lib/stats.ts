import type { Game, LibraryStats } from "@/lib/types";

export function calculateStats(games: Game[]): LibraryStats {
  return {
    owned: games.length,
    neverPlayed: games.filter((game) => game.status === "backlog").length,
    playing: games.filter((game) => game.status === "playing").length,
    finished: games.filter((game) => game.status === "finished").length,
    totalPlaytimeMinutes: games.reduce(
      (total, game) => total + game.playtimeMinutes,
      0,
    ),
  };
}
