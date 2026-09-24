"use client";

import Image from "next/image";

import { KlartNogMeters } from "@/components/klart-nog-meters";
import { StatusBadge } from "@/components/status-badge";
import { StatusSelect } from "@/components/status-select";
import { formatPlaytime } from "@/lib/format";
import type { Game, GameStatus } from "@/lib/types";

type GameCardProps = {
  game: Game;
  onStatusChange: (appId: number, status: GameStatus) => void;
};

export function GameCard({ game, onStatusChange }: GameCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-white/10 bg-card/60 p-4 backdrop-blur-sm lg:grid-cols-[7.5rem_1fr_11rem] lg:items-start">
      <div className="relative aspect-[460/215] w-full overflow-hidden rounded-lg bg-muted lg:w-[7.5rem]">
        <Image
          src={game.coverUrl}
          alt={`Omslag för ${game.title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 120px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold sm:text-lg">
            {game.title}
          </h3>
          <StatusBadge status={game.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          Speltid: {formatPlaytime(game.playtimeMinutes)}
        </p>
        <KlartNogMeters scores={game.klartNog} compact />
      </div>

      <div className="lg:justify-self-end">
        <label className="mb-1 block text-xs text-muted-foreground lg:text-right">
          Status
        </label>
        <StatusSelect
          value={game.status}
          onChange={(status) => onStatusChange(game.appId, status)}
        />
      </div>
    </article>
  );
}
