"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS } from "@/lib/status";
import type { GameStatus } from "@/lib/types";

const statuses: GameStatus[] = ["backlog", "playing", "finished", "dropped"];

type StatusSelectProps = {
  value: GameStatus;
  onChange: (status: GameStatus) => void;
};

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as GameStatus)}>
      <SelectTrigger className="w-full min-w-[9rem] border-white/10 bg-background/60 sm:w-[10rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
