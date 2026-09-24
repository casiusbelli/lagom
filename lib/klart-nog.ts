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
    unlocked: number;
    parCount: number;
  } | null;
};

export function calculateTimeScore(
  playtimeMinutes: number,
  hltbMainHours: number | null,
): number | null {
  if (!hltbMainHours || hltbMainHours <= 0) return null;

  const playtimeHours = playtimeMinutes / 60;
  return Math.round((playtimeHours / hltbMainHours) * 1000) / 10;
}

export function calculateAchievementScore(
  globalAchievementPercents: number[],
  unlockedAchievementCount: number,
): {
  score: number | null;
  par: { unlocked: number; parCount: number } | null;
} {
  if (globalAchievementPercents.length === 0) {
    return { score: null, par: null };
  }

  const parCount = globalAchievementPercents.reduce(
    (sum, percent) => sum + percent / 100,
    0,
  );

  if (parCount <= 0) {
    return { score: null, par: null };
  }

  const score = (unlockedAchievementCount / parCount) * 100;

  return {
    score: Math.round(score * 10) / 10,
    par: {
      unlocked: unlockedAchievementCount,
      parCount: Math.round(parCount * 10) / 10,
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

  let combinedScore = 0;

  if (timeScore !== null && achievementScore !== null) {
    combinedScore = timeScore * 0.5 + achievementScore * 0.5;
  } else if (timeScore !== null) {
    combinedScore = timeScore;
  } else if (achievementScore !== null) {
    combinedScore = achievementScore;
  }

  const readyToDrop = combinedScore >= 100;

  return {
    timeScore,
    achievementScore,
    combinedScore: Math.round(combinedScore * 10) / 10,
    readyToDrop,
    hltbMainHours: input.hltbMainHours,
    hltbExtraHours: input.hltbExtraHours,
    achievementPar: par,
  };
}
