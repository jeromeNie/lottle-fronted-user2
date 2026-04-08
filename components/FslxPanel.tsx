"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { fetchHkDailySitePayload } from "@/lib/hkDailySitePredictionApi";
import { FSLX_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildFslxRowsFromHkDaily } from "@/lib/fslxFromDraws";

const HK_DAILY = "hk_daily" as const;

function fslxHitSet(r: { hitSet: Set<string> | string[] }): Set<string> {
  return r.hitSet instanceof Set ? r.hitSet : new Set(r.hitSet);
}

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
        const remote = await fetchHkDailySitePayload<ReturnType<typeof buildFslxRowsFromHkDaily>>("fslx");
        if (!cancelled && remote && remote.length > 0) {
          setRows(remote as ReturnType<typeof buildFslxRowsFromHkDaily>);
          setLoading(false);
          return;
        }

        const draws = await getRecentHkDailyDraws(19);
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
                        <span
                          key={`${r.issueDisplay}-${i}`}
                          className={fslxHitSet(r).has(z) ? "fslx-hit" : undefined}
                        >
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
