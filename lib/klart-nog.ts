export type KlartNogInput = {
  playtimeMinutes: number;
  hltbMainHours: number | null;
  hltbExtraHours: number | null;
  globalAchievementPercents: number[];
  unlockedAchievementCount: number;
};

export type KlartNogResult = {
  timeScore: number | null;
  achievementScore: number | null;
  combinedScore: number;
  readyToDrop: boolean;
  hltbMainHours: number | null;
  hltbExtraHours: number | null;
  achievementPar: {
    playerPercent: number;
    globalParPercent: number;
  } | null;
};

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateGlobalParPercent(
  globalAchievementPercents: number[],
): number | null {
  if (globalAchievementPercents.length === 0) return null;

  const mean =
    globalAchievementPercents.reduce((sum, percent) => sum + percent, 0) /
    globalAchievementPercents.length;

  return mean > 0 ? mean : null;
}

export function calculateTimeScore(
  playtimeMinutes: number,
  hltbMainHours: number | null,
): number | null {
  if (!hltbMainHours || hltbMainHours <= 0) return null;

  const playtimeHours = playtimeMinutes / 60;
  const rawScore = (playtimeHours / hltbMainHours) * 100;
  return roundScore(Math.min(rawScore, 100));
}

export function calculateAchievementScore(
  globalAchievementPercents: number[],
  unlockedAchievementCount: number,
): {
  score: number | null;
  par: { playerPercent: number; globalParPercent: number } | null;
} {
  const globalParPercent = calculateGlobalParPercent(globalAchievementPercents);
  if (!globalParPercent) {
    return { score: null, par: null };
  }

  const totalAchievements = globalAchievementPercents.length;
  const playerPercent = (unlockedAchievementCount / totalAchievements) * 100;
  const score = (playerPercent / globalParPercent) * 100;

  return {
    score: roundScore(score),
    par: {
      playerPercent: roundScore(playerPercent),
      globalParPercent: roundScore(globalParPercent),
    },
  };
}

export function calculateKlartNog(input: KlartNogInput): KlartNogResult {
  const timeScore = calculateTimeScore(
    input.playtimeMinutes,
    input.hltbMainHours,
  );
  const { score: achievementScore, par } = calculateAchievementScore(
    input.globalAchievementPercents,
    input.unlockedAchievementCount,
  );

  const combinedScore = (timeScore ?? 0) + (achievementScore ?? 0);
  const readyToDrop = combinedScore >= 100;

  return {
    timeScore,
    achievementScore,
    combinedScore: roundScore(combinedScore),
    readyToDrop,
    hltbMainHours: input.hltbMainHours,
    hltbExtraHours: input.hltbExtraHours,
    achievementPar: par,
  };
}
