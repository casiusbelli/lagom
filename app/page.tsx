import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.14),_transparent_30%),linear-gradient(180deg,#0b1220_0%,#0f172a_45%,#111827_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300/80">
            Lagom
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ditt spelbibliotek
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Synka Steam utan inloggning, se klart nog-poäng och håll koll på vad
            du spelar, vad som är klart och vad som ligger i backlogen.
          </p>
        </header>

        <main className="flex-1">
          <Dashboard />
        </main>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          Status sparas i din webbläsare. Inget konto krävs.
        </footer>
      </div>
    </div>
  );
}
