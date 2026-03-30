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

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
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
