import { defaultStatus } from "@/lib/status";
import type { Game, GameStatus, RawGame } from "@/lib/types";

const STATUS_STORAGE_KEY = "backlogger-game-statuses";
const STEAM_STORAGE_KEY = "backlogger-steam-input";

type StoredStatuses = Record<string, GameStatus>;

function readStatuses(): StoredStatuses {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STATUS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredStatuses;
  } catch {
    return {};
  }
}

export function getStoredSteamInput(): string {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(STEAM_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveSteamInput(value: string): void {
  if (typeof window === "undefined") return;

  const trimmed = value.trim();
  if (!trimmed) {
    window.localStorage.removeItem(STEAM_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STEAM_STORAGE_KEY, trimmed);
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
  window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(stored));
}
