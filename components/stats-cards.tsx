import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTotalPlaytime } from "@/lib/format";
import type { LibraryStats } from "@/lib/types";

type StatsCardsProps = {
  stats: LibraryStats;
};

const statItems = [
  { key: "owned", label: "Ägda spel" },
  { key: "neverPlayed", label: "Aldrig spelade" },
  { key: "playing", label: "Pågående" },
  { key: "finished", label: "Klara" },
  { key: "totalPlaytimeMinutes", label: "Total speltid" },
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statItems.map((item) => {
        const value =
          item.key === "totalPlaytimeMinutes"
            ? formatTotalPlaytime(stats[item.key])
            : stats[item.key];

        return (
          <Card
            key={item.key}
            className="border-white/10 bg-card/70 backdrop-blur-sm"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
