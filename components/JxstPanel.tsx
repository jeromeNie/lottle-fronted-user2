"use client";

import { useEffect, useState } from "react";
import { getRecentHkDailyDraws } from "@/lib/hkDailyDrawsCache";
import { JXST_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildJxstRowsFromHkDaily } from "@/lib/jxstFromDraws";

const HK_DAILY = "hk_daily" as const;

export function JxstPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildJxstRowsFromHkDaily>>([]);
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
          setRows(buildJxstRowsFromHkDaily(draws, JXST_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("精选三头加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="hdui">
      <table className="jxst-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="jxst-head">大赢家【 精选三头 】</td>
          </tr>
          {loading ? (
            <tr>
              <td className="jxst-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="jxst-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="jxst-cell">
                  <div className="jxst-row">
                    <span className="jxst-issue">{r.issueDisplay}期</span>
                    <span className="jxst-label">精选三头</span>
                    <span className="jxst-bracket">【</span>
                    <span className="jxst-digits">
                      {r.digits.map((d, i) => (
                        <span key={`${r.issueDisplay}-${i}`} className={r.hitDigit === d ? "jxst-hit" : undefined}>
                          {d}
                        </span>
                      ))}
                    </span>
                    <span className="jxst-bracket">】</span>
                    <span className="jxst-open-label">开:</span>
                    <span className="jxst-open">
                      {r.special ? `${r.special.zodiac}${r.special.num}` : "? 00"}
                    </span>
                    <span className="jxst-tail">发</span>
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
