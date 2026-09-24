# Backlogger

**Svenska:** Backlogger är en enkel dashboard för ditt Steam-spelbibliotek. Du ser statistik, söker bland spel och markerar status (backlog, spelar, klart, släppt). Allt sparas i webbläsaren — inget konto behövs.

**English:** Backlogger is a simple dashboard for your Steam game library. View stats, search games, and track status (backlog, playing, finished, dropped). Everything is saved in your browser — no account needed.

## Köra lokalt / Run locally

1. Öppna terminalen i projektmappen.
2. Kör:

```bash
npm install
npm run dev
```

3. Öppna i webbläsaren: [http://localhost:4318](http://localhost:4318)

Utan Steam-nyckel används inbyggd exempeldata.

## Publicera på Vercel / Deploy to Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in.
2. Klicka **Add New… → Project**.
3. Välj det här Git-repot och klicka **Deploy**.
4. Vercel känner av Next.js automatiskt — inga extra inställningar krävs.

### Valfritt: riktigt Steam-bibliotek

I Vercel under **Project → Settings → Environment Variables**, lägg till:

- `STEAM_API_KEY` — din Steam Web API-nyckel
- `STEAM_ID` — ditt Steam-ID (64-bit)

Saknas dessa variabler används exempeldata.

## Teknik

Next.js, TypeScript, Tailwind CSS, shadcn/ui. Status sparas i `localStorage`.
