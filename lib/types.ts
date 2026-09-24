export type GameStatus = "backlog" | "playing" | "finished" | "dropped";

export type KlartNogScores = {
  timeScore: number | null;
  achievementScore: number | null;
  combinedScore: number;
  readyToDrop: boolean;
  hltbMainHours: number | null;
  hltbExtraHours: number | null;
  achievementPar: {
    unlocked: number;
    parCount: number;
  } | null;
};

export type RawGame = {
  appId: number;
  title: string;
  playtimeMinutes: number;
  coverUrl: string;
  klartNog: KlartNogScores;
};

export type Game = RawGame & {
  status: GameStatus;
};

export type GameFilter = "all" | GameStatus;

export type LibraryStats = {
  owned: number;
  neverPlayed: number;
  playing: number;
  finished: number;
  totalPlaytimeMinutes: number;
  readyToDrop: number;
};

export type DataSource = "mock" | "steam";

export type GamesResponse = {
  games: RawGame[];
  source: DataSource;
  steamId?: string;
  hasApiKey: boolean;
  message?: string;
  error?: string;
};
