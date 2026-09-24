import { HowLongToBeatService } from "howlongtobeat";
import { unstable_cache } from "next/cache";

export type HltbTimes = {
  mainHours: number | null;
  extraHours: number | null;
};

const hltbService = new HowLongToBeatService();

async function searchHltb(title: string): Promise<HltbTimes | null> {
  try {
    const results = await hltbService.search(title);
    if (!results.length) return null;

    const bestMatch =
      results.find((result) => result.similarity >= 0.6) ?? results[0];

    if (!bestMatch || bestMatch.similarity < 0.35) {
      return null;
    }

    return {
      mainHours: bestMatch.gameplayMain > 0 ? bestMatch.gameplayMain : null,
      extraHours:
        bestMatch.gameplayMainExtra > 0 ? bestMatch.gameplayMainExtra : null,
    };
  } catch {
    return null;
  }
}

export const getHltbTimes = unstable_cache(
  async (title: string) => searchHltb(title),
  ["hltb-times"],
  { revalidate: 60 * 60 * 24 * 7 },
);
