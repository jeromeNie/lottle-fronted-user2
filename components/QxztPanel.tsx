"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { fetchHkDailySitePayload } from "@/lib/hkDailySitePredictionApi";
import { QXZT_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildQxztRowsFromHkDaily } from "@/lib/qxztFromDraws";

const HK_DAILY = "hk_daily" as const;

export function QxztPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildQxztRowsFromHkDaily>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const remote = await fetchHkDailySitePayload<ReturnType<typeof buildQxztRowsFromHkDaily>>("qxzt");
        if (!cancelled && remote && remote.length > 0) {
          setRows(remote);
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
          setRows(buildQxztRowsFromHkDaily(draws, QXZT_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("七肖中特加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="gpjx">
      <table className="qxzt-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="qxzt-head">大赢家www.544122.xyz(七肖中特)</td>
          </tr>
          {loading ? (
            <tr>
              <td className="qxzt-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="qxzt-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="qxzt-cell">
                  <div className="qxzt-row">
                    <span className="qxzt-issue">{r.issueDisplay}期:</span>
                    <span className="qxzt-zodiacs">
                      {r.zodiacs.map((z, i) => (
                        <span key={`${r.issueDisplay}-${i}`} className={r.special?.zodiac === z ? "qxzt-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="qxzt-open-label">开</span>
                    <span className="qxzt-open">
                      {r.special ? `${r.special.num}${r.special.zodiac}` : "? 00"}
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
