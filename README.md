# Lagom

**Svenska:** Lagom är en dashboard för ditt Steam-spelbibliotek. Synka utan inloggning, se statistik, klart nog-poäng och markera status per spel. Allt sparas i webbläsaren.

**English:** Lagom is a dashboard for your Steam game library. Sync without login, view stats, “done enough” scores, and track status per game. Everything is saved in your browser.

Repo: [github.com/casiusbelli/lagom](https://github.com/casiusbelli/lagom)

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

Utan nyckel visas exempeldata. Om nyckeln är skapad på **ditt** Steam-konto kan API:t läsa **ditt** bibliotek även om profilen är privat.

## Publicera på Vercel / Deploy to Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in med GitHub.
2. Klicka **Add New → Project**.
3. Välj **casiusbelli/lagom** och klicka **Deploy**.
4. (Valfritt) **Project → Settings → Environment Variables** → `STEAM_API_KEY`.
5. **Redeploy** om du lägger till nyckeln efter första deploy.

Användare anger sedan sitt Steam-id i appen — ingen OAuth eller databas krävs.

## Klart nog-poäng

**Poäng = Par (%) + HLTB (%)**

- **HLTB:** speltid / HowLongToBeat Main, max 100 %
- **Par:** din andel upplåsta achievements jämfört med Steam globalt snitt i procent (medel unlock-%). 100 % = du ligger på snittet.
- **Kombinerat:** summan av de två procenten; grönt ljus vid ≥ 100

## Teknik

Next.js, TypeScript, Tailwind CSS, shadcn/ui. Status och Steam-id sparas i `localStorage`. API-nyckel bara på servern.
