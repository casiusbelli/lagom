import type { GamesResponse } from "@/lib/types";

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

export const mockGames: GamesResponse = {
  source: "mock",
  games: [
    {
      appId: 1245620,
      title: "Elden Ring",
      playtimeMinutes: 1860,
      coverUrl: steamCover(1245620),
    },
    {
      appId: 1091500,
      title: "Cyberpunk 2077",
      playtimeMinutes: 420,
      coverUrl: steamCover(1091500),
    },
    {
      appId: 1174180,
      title: "Red Dead Redemption 2",
      playtimeMinutes: 3120,
      coverUrl: steamCover(1174180),
    },
    {
      appId: 1145360,
      title: "Hades",
      playtimeMinutes: 980,
      coverUrl: steamCover(1145360),
    },
    {
      appId: 367520,
      title: "Hollow Knight",
      playtimeMinutes: 0,
      coverUrl: steamCover(367520),
    },
    {
      appId: 413150,
      title: "Stardew Valley",
      playtimeMinutes: 0,
      coverUrl: steamCover(413150),
    },
    {
      appId: 1086940,
      title: "Baldur's Gate 3",
      playtimeMinutes: 0,
      coverUrl: steamCover(1086940),
    },
    {
      appId: 1593500,
      title: "God of War",
      playtimeMinutes: 45,
      coverUrl: steamCover(1593500),
    },
    {
      appId: 1817070,
      title: "Marvel's Spider-Man Remastered",
      playtimeMinutes: 0,
      coverUrl: steamCover(1817070),
    },
    {
      appId: 620,
      title: "Portal 2",
      playtimeMinutes: 540,
      coverUrl: steamCover(620),
    },
    {
      appId: 105600,
      title: "Terraria",
      playtimeMinutes: 120,
      coverUrl: steamCover(105600),
    },
    {
      appId: 271590,
      title: "Grand Theft Auto V",
      playtimeMinutes: 90,
      coverUrl: steamCover(271590),
    },
  ],
};
