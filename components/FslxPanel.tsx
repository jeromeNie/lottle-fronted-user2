"use client";

import { useEffect, useState } from "react";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { FSLX_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildFslxRowsFromHkDaily } from "@/lib/fslxFromDraws";

const HK_DAILY = "hk_daily" as const;

export function FslxPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildFslxRowsFromHkDaily>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const h = await fetchDrawHistory(HK_DAILY, 1, 19);
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
          setRows(buildFslxRowsFromHkDaily(draws, FSLX_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("复式连肖加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="fslx">
      <table className="fslx-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="fslx-head">大赢家www.544122.xyz(复式连肖)</td>
          </tr>
          {loading ? (
            <tr>
              <td className="fslx-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="fslx-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="fslx-cell">
                  <div className="fslx-row">
                    <span className="fslx-issue">{r.issueDisplay}期:</span>
                    <span className="fslx-label">复式连肖</span>
                    <span className="fslx-bracket">【</span>
                    <span className="fslx-zodiacs">
                      {r.zodiacs.map((z, i) => (
                        <span key={`${r.issueDisplay}-${i}`} className={r.hitSet.has(z) ? "fslx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="fslx-bracket">】</span>
                    <span className={`fslx-status ${r.result === "hit" ? "fslx-status-hit" : r.result === "miss" ? "fslx-status-miss" : ""}`}>
                      {r.result === "pending" ? "?" : r.result === "hit" ? "中" : "错"}
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
