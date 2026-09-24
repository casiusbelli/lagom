import { Progress } from "@/components/ui/progress";
import type { KlartNogScores } from "@/lib/types";
import { cn } from "@/lib/utils";

type KlartNogMetersProps = {
  scores: KlartNogScores;
  compact?: boolean;
};

function meterValue(score: number | null): number {
  if (score === null) return 0;
  return Math.min(score, 100);
}

function formatScore(score: number | null): string {
  if (score === null) return "—";
  return `${Math.round(score)}`;
}

export function KlartNogMeters({ scores, compact = false }: KlartNogMetersProps) {
  const readyClass = scores.readyToDrop
    ? "border-emerald-400/40 bg-emerald-500/10"
    : "border-white/10 bg-background/40";

  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        readyClass,
        compact ? "space-y-2" : "space-y-3",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Klart nog
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatScore(scores.combinedScore)}
          </span>
          {scores.readyToDrop && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-200">
              Okej att släppa
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tid</span>
            <span>{formatScore(scores.timeScore)}</span>
          </div>
          <Progress value={meterValue(scores.timeScore)} className="h-2" />
          {scores.hltbMainHours && (
            <p className="text-[11px] text-muted-foreground">
              HLTB Main: {scores.hltbMainHours} h
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Achievement-par</span>
            <span>{formatScore(scores.achievementScore)}</span>
          </div>
          <Progress
            value={meterValue(scores.achievementScore)}
            className="h-2 [&>div]:bg-sky-400"
          />
          {scores.achievementPar && (
            <p className="text-[11px] text-muted-foreground">
              {scores.achievementPar.unlocked} upplåsta · globalt snitt{" "}
              {scores.achievementPar.parCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
