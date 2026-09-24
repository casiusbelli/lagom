import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/status";
import type { GameStatus } from "@/lib/types";

const statusStyles: Record<GameStatus, string> = {
  backlog: "bg-slate-500/20 text-slate-200 border-slate-400/30",
  playing: "bg-sky-500/20 text-sky-100 border-sky-400/30",
  finished: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
  dropped: "bg-rose-500/20 text-rose-100 border-rose-400/30",
};

type StatusBadgeProps = {
  status: GameStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
