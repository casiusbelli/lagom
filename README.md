# Backlogger

**Svenska:** Backlogger är en dashboard för ditt Steam-spelbibliotek. Synka utan inloggning, se statistik, klart nog-poäng och markera status per spel. Allt sparas i webbläsaren.

**English:** Backlogger is a dashboard for your Steam game library. Sync without login, view stats, “done enough” scores, and track status per game. Everything is saved in your browser.

## Köra lokalt / Run locally

1. Öppna terminalen i projektmappen.
2. Kör:

```bash
npm install
npm run dev
```

3. Öppna [http://localhost:4318](http://localhost:4318)
4. Ange din Steam vanity-URL eller steamid64 i inställningarna.

### Steam API-nyckel (valfritt men rekommenderat)

1. Gå till [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) och skapa en gratis nyckel.
2. Skapa en fil som heter `.env.local` i projektmappen med:

```bash
STEAM_API_KEY=din_nyckel_här
```

3. Starta om dev-servern.

Utan nyckel visas exempeldata. Din Steam-profil måste vara **offentlig**, inklusive speldetaljer.

## Publicera på Vercel / Deploy to Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in.
2. Klicka **Add New… → Project**.
3. Välj det här Git-repot och klicka **Deploy**.
4. Gå till **Project → Settings → Environment Variables**.
5. Lägg till `STEAM_API_KEY` med din nyckel från [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey).
6. Klicka **Redeploy** om projektet redan är publicerat.

Användare anger sedan sitt Steam-id i appen — ingen OAuth eller databas krävs.

## Klart nog-poäng

**Poäng = Par (%) + HLTB (%)**

- **HLTB:** speltid / HowLongToBeat Main, max 100 %
- **Par:** din andel upplåsta achievements jämfört med Steam globalt snitt i procent (medel unlock-%). 100 % = du ligger på snittet.
- **Kombinerat:** summan av de två procenten; grönt ljus vid ≥ 100

## Teknik

Next.js, TypeScript, Tailwind CSS, shadcn/ui. Status och Steam-id sparas i `localStorage`. API-nyckel bara på servern.
