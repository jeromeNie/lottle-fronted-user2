"use client";

import { useEffect, useState } from "react";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { JXZT_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildJxztRowsFromHkDaily } from "@/lib/jxztFromDraws";

const HK_DAILY = "hk_daily" as const;

export function JxztPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildJxztRowsFromHkDaily>>([]);
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
          setRows(buildJxztRowsFromHkDaily(draws, JXZT_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("九肖中特加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="jxzt">
      <table className="jxzt-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="jxzt-head">大赢家www.544122.xyz(九肖中特)</td>
          </tr>
          {loading ? (
            <tr>
              <td className="jxzt-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="jxzt-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="jxzt-cell">
                  <div className="jxzt-row">
                    <span className="jxzt-issue">{r.issueDisplay}期九肖</span>
                    <span className="jxzt-bracket">【</span>
                    <span className="jxzt-zodiacs">
                      {r.zodiacs.map((z, i) => (
                        <span key={`${r.issueDisplay}-${i}`} className={r.special?.zodiac === z ? "jxzt-hit" : undefined}>
                          {z}
                        </span>
                      ))}
                    </span>
                    <span className="jxzt-bracket">】</span>
                    <span className="jxzt-open-label">开</span>
                    <span className="jxzt-open">
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
