"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { SSSX_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildSssxRowsFromHkDaily } from "@/lib/sssxFromDraws";

const HK_DAILY = "hk_daily" as const;

export function SssxPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildSssxRowsFromHkDaily>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const draws = await getRecentHkDailyDraws(19);
        if (draws.length === 0) {
          if (!cancelled) {
            setError("暂无香港百乐彩开奖数据");
            setLoading(false);
          }
          return;
        }
        if (!cancelled) {
          setRows(buildSssxRowsFromHkDaily(draws, SSSX_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("单双四肖加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="ujlh">
      <table className="sssx-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="sssx-head">大赢家【 单双四肖 】</td>
          </tr>
          {loading ? (
            <tr>
              <td className="sssx-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="sssx-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="sssx-cell">
                  <div className="sssx-row">
                    <span className="sssx-issue">{r.issueDisplay}期:</span>
                    <span className="sssx-label">单</span>
                    <span className="sssx-bracket">【</span>
                    <span className="sssx-zodiacs">
                      {r.dan.map((z, i) => (
                        <span key={`${r.issueDisplay}-d-${i}`} className={r.hitDan === z ? "sssx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="sssx-bracket">】</span>
                    <span className="sssx-label">双</span>
                    <span className="sssx-bracket">【</span>
                    <span className="sssx-zodiacs">
                      {r.shuang.map((z, i) => (
                        <span key={`${r.issueDisplay}-s-${i}`} className={r.hitShuang === z ? "sssx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="sssx-bracket">】</span>
                    <span className="sssx-open-label">开:</span>
                    <span className="sssx-open">
                      {r.special ? `${r.special.zodiac}${r.special.num}` : "? 00"}
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
