import type { GameStatus } from "@/lib/types";

export const STATUS_LABELS: Record<GameStatus, string> = {
  backlog: "Backlog",
  playing: "Spelar",
  finished: "Klart",
  dropped: "Släppt",
};

export const FILTER_LABELS: Record<"all" | GameStatus, string> = {
  all: "Alla",
  backlog: "Aldrig spelade",
  playing: "Spelar",
  finished: "Klara",
  dropped: "Släppta",
};

export function defaultStatus(playtimeMinutes: number): GameStatus {
  if (playtimeMinutes === 0) return "backlog";
  return "playing";
}
