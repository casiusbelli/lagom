import { defaultStatus } from "@/lib/status";
import type { Game, GameStatus, RawGame } from "@/lib/types";

const STORAGE_KEY = "backlogger-game-statuses";

type StoredStatuses = Record<string, GameStatus>;

function readStatuses(): StoredStatuses {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredStatuses;
  } catch {
    return {};
  }
}

export function applyStoredStatuses(games: RawGame[]): Game[] {
  const stored = readStatuses();

  return games.map((game) => ({
    ...game,
    status: stored[String(game.appId)] ?? defaultStatus(game.playtimeMinutes),
  }));
}

export function saveGameStatus(appId: number, status: GameStatus): void {
  if (typeof window === "undefined") return;

  const stored = readStatuses();
  stored[String(appId)] = status;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
