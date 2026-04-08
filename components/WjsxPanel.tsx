"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { fetchHkDailySitePayload } from "@/lib/hkDailySitePredictionApi";
import { WJSX_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildWjsxRowsFromHkDaily } from "@/lib/wjsxFromDraws";

const HK_DAILY = "hk_daily" as const;

export function WjsxPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildWjsxRowsFromHkDaily>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const remote = await fetchHkDailySitePayload<ReturnType<typeof buildWjsxRowsFromHkDaily>>("wjsx");
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
          setRows(buildWjsxRowsFromHkDaily(draws, WJSX_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("稳禁四肖加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="xq4ie">
      <table className="wjsx-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="wjsx-head">大赢家【 稳禁肆肖 】</td>
          </tr>
          {loading ? (
            <tr>
              <td className="wjsx-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="wjsx-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="wjsx-cell">
                  <div className="wjsx-row">
                    <span className="wjsx-issue">{r.issueDisplay}期稳禁肆肖</span>
                    <span className="wjsx-bracket">【</span>
                    <span className="wjsx-zodiacs">
                      {r.zodiacs.map((z, i) => (
                        <span key={`${r.issueDisplay}-${i}`} className={r.special?.zodiac === z ? "wjsx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="wjsx-bracket">】</span>
                    <span className="wjsx-open-label">开</span>
                    <span className="wjsx-open">
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
