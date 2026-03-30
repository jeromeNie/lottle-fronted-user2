export type LotteryCode = "hk_mark_six" | "macau_mark_six" | "hk_daily";

const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "https://nxglhc.xyz"
    : process.env.NEXT_PUBLIC_API_URL || "https://nxglhc.xyz";

export interface DrawNumber {
  number: number;
  is_special: boolean;
  zodiac: string | null;
  wuxing?: string | null;
  wave_color: "red" | "blue" | "green" | string;
}

export interface Draw {
  id?: number;
  issue_number: number;
  draw_date: string;
  draw_time: string | null;
  numbers: DrawNumber[];
}

export interface DrawBrief {
  issue_number: number;
}

export interface DrawHistoryResponse {
  items: DrawBrief[];
  total?: number;
  page?: number;
  page_size?: number;
}

const CACHE_TTL_MS = 15000;
const responseCache = new Map<string, { expiresAt: number; data: unknown }>();
const inFlight = new Map<string, Promise<unknown>>();

async function getJson<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const now = Date.now();
  const cached = responseCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const pending = inFlight.get(url);
  if (pending) {
    return pending as Promise<T>;
  }

  const req = (async () => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = (await res.json()) as T;
    responseCache.set(url, { expiresAt: Date.now() + CACHE_TTL_MS, data });
    return data;
  })();

  inFlight.set(url, req as Promise<unknown>);
  try {
    return await req;
  } finally {
    inFlight.delete(url);
  }
}

export function fetchDrawHistory(
  code: LotteryCode,
  page = 1,
  pageSize = 10,
): Promise<DrawHistoryResponse> {
  return getJson(
    `/api/draws/history?lottery_type_code=${encodeURIComponent(code)}&page=${page}&page_size=${pageSize}`,
  );
}

export function fetchDrawByIssue(
  code: LotteryCode,
  issue: number,
): Promise<Draw> {
  return getJson(
    `/api/draws/by-issue?lottery_type_code=${encodeURIComponent(code)}&issue=${issue}`,
  );
}

export function fetchLatestDraw(code: LotteryCode): Promise<Draw> {
  return getJson(
    `/api/draws/latest?lottery_type_code=${encodeURIComponent(code)}`,
  );
}
