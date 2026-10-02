"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GameList } from "@/components/game-list";
import { StatsCards } from "@/components/stats-cards";
import { SteamSettings } from "@/components/steam-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FILTER_LABELS } from "@/lib/status";
import { calculateStats } from "@/lib/stats";
import {
  applyStoredStatuses,
  getStoredSteamInput,
  saveGameStatus,
  saveSteamInput,
} from "@/lib/storage";
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
  const [steamInput, setSteamInput] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [filter, setFilter] = useState<GameFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const enrichScores = useCallback(
    async (input: string, library: Game[]) => {
      const played = library.filter((game) => game.playtimeMinutes > 0);
      const batchSize = 6;
      for (let index = 0; index < played.length; index += batchSize) {
        const batch = played.slice(index, index + batchSize);
        try {
          const response = await fetch("/api/games/enrich", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              steamInput: input,
              appIds: batch.map((game) => game.appId),
            }),
          });
          if (!response.ok) continue;
          const data = (await response.json()) as { games: Game[] };
          setGames((current) => {
            const scores = new Map(
              data.games.map((game) => [game.appId, game.klartNog]),
            );
            return current.map((game) => {
              const nextScore = scores.get(game.appId);
              return nextScore ? { ...game, klartNog: nextScore } : game;
            });
          });
        } catch {
          // Library stays visible if a score batch fails.
        }
      }
    },
    [],
  );

  const loadGames = useCallback(
    async (input?: string) => {
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      try {
        const storedInput = input ?? getStoredSteamInput();
        const query = storedInput
          ? `?steamInput=${encodeURIComponent(storedInput)}`
          : "";
        const response = await fetch(`/api/games${query}`);

        if (!response.ok) {
          throw new Error("Kunde inte hämta spellistan.");
        }

        const data = (await response.json()) as GamesResponse;
        const resolvedInput = storedInput || data.defaultSteamInput || "";
        setSource(data.source);
        setHasApiKey(data.hasApiKey);
        setGames(applyStoredStatuses(data.games));
        if (resolvedInput) {
          setSteamInput(resolvedInput);
        }

        if (data.error) {
          setError(data.error);
        } else if (data.message) {
          setInfoMessage(data.message);
        }

        if (data.source === "steam" && resolvedInput) {
          void enrichScores(
            resolvedInput,
            applyStoredStatuses(data.games),
          );
        }
      } catch {
        setError(
          "Något gick fel när biblioteket skulle laddas. Försök igen om en stund.",
        );
      } finally {
        setLoading(false);
      }
    },
    [enrichScores],
  );

  useEffect(() => {
    const stored = getStoredSteamInput();
    setSteamInput(stored);
    void loadGames(stored);
  }, [loadGames]);

  const handleStatusChange = useCallback((appId: number, status: GameStatus) => {
    saveGameStatus(appId, status);
    setGames((current) =>
      current.map((game) =>
        game.appId === appId ? { ...game, status } : game,
      ),
    );
  }, []);

  const handleSteamSave = useCallback(
    (value: string) => {
      saveSteamInput(value);
      setSteamInput(value);
      void loadGames(value);
    },
    [loadGames],
  );

  const stats = useMemo(() => calculateStats(games), [games]);

  return (
    <div className="space-y-8">
      <SteamSettings
        value={steamInput}
        hasApiKey={hasApiKey}
        loading={loading}
        onChange={setSteamInput}
        onSave={handleSteamSave}
      />

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-11 w-full max-w-md rounded-lg" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {error && (
            <section className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-4 sm:px-6">
              <h2 className="text-base font-semibold">Kunde inte synka Steam</h2>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => void loadGames()}
              >
                Försök igen
              </Button>
            </section>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {source === "steam"
                ? "Visar ditt Steam-bibliotek med klart nog-poäng."
                : "Visar exempelbibliotek (mockdata)."}
            </p>
            {infoMessage && (
              <p className="text-sm text-amber-200/90">{infoMessage}</p>
            )}
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
                    <TabsTrigger
                      key={item}
                      value={item}
                      className="text-xs sm:text-sm"
                    >
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
        </>
      )}
    </div>
  );
}
