"use client";

import { useEffect, useState } from "react";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { M24_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildM24RowsFromHkDaily } from "@/lib/m24FromDraws";

const HK_DAILY = "hk_daily" as const;

export function M24Panel() {
  const [rows, setRows] = useState<ReturnType<typeof buildM24RowsFromHkDaily>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const h = await fetchDrawHistory(HK_DAILY, 1, 9);
        const briefs = h.items ?? [];
        const full = await Promise.all(
          briefs.map((b) => fetchDrawByIssue(HK_DAILY, b.issue_number).catch(() => null)),
        );
        const draws = full.filter((x): x is Draw => x !== null);
        if (draws.length === 0) {
          if (!cancelled) {
            setError("暂无香港百乐彩开奖数据");
            setLoading(false);
          }
          return;
        }
        if (!cancelled) {
          setRows(buildM24RowsFromHkDaily(draws, M24_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("24码中特加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="24mzt">
      <table className="m24-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="m24-head">大赢家www.544122.xyz(二十四码)</td>
          </tr>
          {loading ? (
            <tr>
              <td className="m24-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="m24-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => {
              const hit = r.special?.num ?? null;
              const line1 = r.nums.slice(0, 12);
              const line2 = r.nums.slice(12, 24);
              return (
                <tr key={r.issueDisplay}>
                  <td className="m24-cell">
                    <div className="m24-issue">{r.issueDisplay}期</div>
                    <div className="m24-line">
                      {line1.map((n, i) => (
                        <span key={`${r.issueDisplay}-1-${i}`}>
                          {i > 0 ? "." : ""}
                          <span className={hit === n ? "m24-hit" : undefined}>{n}</span>
                        </span>
                      ))}
                    </div>
                    <div className="m24-line">
                      {line2.map((n, i) => (
                        <span key={`${r.issueDisplay}-2-${i}`}>
                          {i > 0 ? "." : ""}
                          <span className={hit === n ? "m24-hit" : undefined}>{n}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
