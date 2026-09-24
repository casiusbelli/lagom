"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GameList } from "@/components/game-list";
import { StatsCards } from "@/components/stats-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FILTER_LABELS } from "@/lib/status";
import { calculateStats } from "@/lib/stats";
import { applyStoredStatuses, saveGameStatus } from "@/lib/storage";
import type {
  DataSource,
  Game,
  GameFilter,
  GameStatus,
  GamesResponse,
} from "@/lib/types";

const filters: GameFilter[] = [
  "all",
  "backlog",
  "playing",
  "finished",
  "dropped",
];

export function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [filter, setFilter] = useState<GameFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/games");

      if (!response.ok) {
        throw new Error("Kunde inte hämta spellistan.");
      }

      const data = (await response.json()) as GamesResponse;
      setSource(data.source);
      setGames(applyStoredStatuses(data.games));
    } catch {
      setError(
        "Något gick fel när biblioteket skulle laddas. Försök igen om en stund.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGames();
  }, [loadGames]);

  const handleStatusChange = useCallback((appId: number, status: GameStatus) => {
    saveGameStatus(appId, status);
    setGames((current) =>
      current.map((game) =>
        game.appId === appId ? { ...game, status } : game,
      ),
    );
  }, []);

  const stats = useMemo(() => calculateStats(games), [games]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-11 w-full max-w-md rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-10 text-center">
        <h2 className="text-lg font-semibold">Kunde inte ladda biblioteket</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-6" onClick={() => void loadGames()}>
          Försök igen
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {source === "steam"
              ? "Visar ditt Steam-bibliotek"
              : "Visar exempelbibliotek (mockdata)"}
          </p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as GameFilter)}
            className="w-full lg:w-auto"
          >
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-background/50 p-1 sm:grid-cols-3 lg:inline-flex lg:w-auto">
              {filters.map((item) => (
                <TabsTrigger key={item} value={item} className="text-xs sm:text-sm">
                  {FILTER_LABELS[item]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Sök på speltitel..."
            className="w-full border-white/10 bg-background/60 lg:max-w-sm"
            aria-label="Sök på speltitel"
          />
        </div>

        <GameList
          games={games}
          filter={filter}
          searchQuery={searchQuery}
          onStatusChange={handleStatusChange}
        />
      </section>
    </div>
  );
}
