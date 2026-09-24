"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SteamSettingsProps = {
  value: string;
  hasApiKey: boolean;
  loading: boolean;
  onChange: (value: string) => void;
  onSave: (value: string) => void;
};

export function SteamSettings({
  value,
  hasApiKey,
  loading,
  onChange,
  onSave,
}: SteamSettingsProps) {

  return (
    <section className="rounded-xl border border-white/10 bg-card/60 p-4 backdrop-blur-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Steam-synk</h2>
        <p className="text-sm text-muted-foreground">
          Ange din vanity-URL eller steamid64. Ingen inloggning krävs — profilen
          måste vara offentlig.
        </p>
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(value);
        }}
      >
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="t.ex. gaben eller 76561197960265728"
          className="border-white/10 bg-background/60"
          aria-label="Steam vanity-URL eller steamid64"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Synkar..." : "Spara och synka"}
        </Button>
      </form>

      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        {!hasApiKey && (
          <p>
            Servern saknar <code className="rounded bg-white/5 px-1">STEAM_API_KEY</code>.
            Appen visar exempeldata tills nyckeln är satt på Vercel.
          </p>
        )}
        <p>
          Hämta en gratis API-nyckel på{" "}
          <a
            href="https://steamcommunity.com/dev/apikey"
            className="text-sky-300 underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            steamcommunity.com/dev/apikey
          </a>
          .
        </p>
      </div>
    </section>
  );
}
