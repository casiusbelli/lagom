export type GameStatus = "backlog" | "playing" | "finished" | "dropped";

export type RawGame = {
  appId: number;
  title: string;
  playtimeMinutes: number;
  coverUrl: string;
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
};

export type DataSource = "mock" | "steam";

export type GamesResponse = {
  games: RawGame[];
  source: DataSource;
};
