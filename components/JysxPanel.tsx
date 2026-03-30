"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { JYSX_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildJysxRowsFromHkDaily } from "@/lib/jysxFromDraws";

const HK_DAILY = "hk_daily" as const;

export function JysxPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildJysxRowsFromHkDaily>>([]);
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
          setRows(buildJysxRowsFromHkDaily(draws, JYSX_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("家野四肖加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="jy4x">
      <table className="jysx-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="jysx-head">大赢家www.544122.xyz(家野四肖)</td>
          </tr>
          {loading ? (
            <tr>
              <td className="jysx-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="jysx-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="jysx-cell">
                  <div className="jysx-row">
                    <span className="jysx-issue">{r.issueDisplay}期:</span>
                    <span className="jysx-label">家</span>
                    <span className="jysx-bracket">（</span>
                    <span className="jysx-zodiacs">
                      {r.jia.map((z, i) => (
                        <span key={`${r.issueDisplay}-j-${i}`} className={r.hitJia === z ? "jysx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="jysx-bracket">）</span>
                    <span className="jysx-label">野</span>
                    <span className="jysx-bracket">（</span>
                    <span className="jysx-zodiacs">
                      {r.ye.map((z, i) => (
                        <span key={`${r.issueDisplay}-y-${i}`} className={r.hitYe === z ? "jysx-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="jysx-bracket">）</span>
                    <span className="jysx-open-label">开</span>
                    <span className="jysx-open">
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
