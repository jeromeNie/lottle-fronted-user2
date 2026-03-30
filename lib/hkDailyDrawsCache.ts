import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";

const HK_DAILY = "hk_daily" as const;
const BASE_LIMIT = 19;
const CACHE_TTL_MS = 30000;

let cache: { expiresAt: number; draws: Draw[] } | null = null;
let inFlight: Promise<Draw[]> | null = null;

async function loadRecentDraws(): Promise<Draw[]> {
  const h = await fetchDrawHistory(HK_DAILY, 1, BASE_LIMIT);
  const briefs = h.items ?? [];
  const full = await Promise.all(
    briefs.map((b) => fetchDrawByIssue(HK_DAILY, b.issue_number).catch(() => null)),
  );
  return full.filter((x): x is Draw => x !== null);
}

export async function getRecentHkDailyDraws(limit: number): Promise<Draw[]> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.draws.slice(0, limit);
  }
  if (!inFlight) {
    inFlight = loadRecentDraws()
      .then((draws) => {
        cache = { expiresAt: Date.now() + CACHE_TTL_MS, draws };
        return draws;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  const draws = await inFlight;
  return draws.slice(0, limit);
}
