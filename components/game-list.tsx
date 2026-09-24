"use client";

import { GameCard } from "@/components/game-card";
import type { Game, GameFilter, GameStatus } from "@/lib/types";

type GameListProps = {
  games: Game[];
  filter: GameFilter;
  searchQuery: string;
  onStatusChange: (appId: number, status: GameStatus) => void;
};

export function GameList({
  games,
  filter,
  searchQuery,
  onStatusChange,
}: GameListProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGames = games.filter((game) => {
    const matchesFilter = filter === "all" || game.status === filter;
    const matchesSearch =
      normalizedQuery.length === 0 ||
      game.title.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesSearch;
  });

  if (filteredGames.length === 0) {
    const hasSearch = normalizedQuery.length > 0;
    const hasFilter = filter !== "all";

    return (
      <section className="rounded-xl border border-dashed border-white/15 bg-card/30 px-6 py-12 text-center">
        <h2 className="text-lg font-semibold">
          {hasSearch
            ? "Inga spel matchar din sökning"
            : hasFilter
              ? "Inga spel i det här filtret"
              : "Inga spel att visa"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasSearch
            ? "Prova ett annat sökord eller rensa sökfältet."
            : hasFilter
              ? "Byt filter för att se fler spel i biblioteket."
              : "Biblioteket är tomt just nu."}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {filteredGames.map((game) => (
        <GameCard key={game.appId} game={game} onStatusChange={onStatusChange} />
      ))}
    </section>
  );
}
