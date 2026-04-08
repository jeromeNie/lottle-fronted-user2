/**
 * 香港百乐彩站点级预测：优先读后端 Redis 缓存（/api/predictions/hk-daily/site/{module}），
 * 失败时由调用方回退本地算法。
 */
const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "https://nxglhc.xyz"
    : process.env.NEXT_PUBLIC_API_URL || "https://nxglhc.xyz";

export type HkDailySiteDoc<T = unknown> = {
  v: number;
  lottery_type_code: string;
  module: string;
  payload: T;
  updated_at?: string;
};

export async function fetchHkDailySitePayload<T>(
  moduleId: string,
): Promise<T | null> {
  const url = `${API_BASE}/api/predictions/hk-daily/site/${encodeURIComponent(moduleId)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const doc = (await res.json()) as HkDailySiteDoc<T>;
    if (doc && doc.payload != null) return doc.payload;
    return null;
  } catch {
    return null;
  }
}
