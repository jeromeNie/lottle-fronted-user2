"use client";

import { useEffect, useState } from "react";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { ZHJS_PRED_TEMPLATES } from "@/data/predictionBlocks";
import { buildZhjsRowsFromHkDaily } from "@/lib/zhjsFromDraws";

const HK_DAILY = "hk_daily" as const;

export function ZhjsPanel() {
  const [rows, setRows] = useState<ReturnType<typeof buildZhjsRowsFromHkDaily>>([]);
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
          setRows(buildZhjsRowsFromHkDaily(draws, ZHJS_PRED_TEMPLATES));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("综合绝杀加载失败，请稍后刷新");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="white-box mt10" id="ccih">
      <table className="zhjs-table" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td className="zhjs-head">大赢家【 综合绝杀 】</td>
          </tr>
          {loading ? (
            <tr>
              <td className="zhjs-loading">加载中...</td>
            </tr>
          ) : error ? (
            <tr>
              <td className="zhjs-error">{error}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.issueDisplay}>
                <td className="zhjs-cell">
                  <div className="zhjs-row">
                    <span className="zhjs-issue">{r.issueDisplay}期绝杀中特</span>
                    <span className="zhjs-bracket">【</span>
                    <span className={r.hit.zodiac ? "zhjs-hit" : undefined}>{r.pred.zodiac}</span>
                    <span>肖-</span>
                    <span className={r.hit.head ? "zhjs-hit" : undefined}>{r.pred.head}</span>
                    <span>头-</span>
                    <span className={r.hit.tail ? "zhjs-hit" : undefined}>{r.pred.tail}</span>
                    <span>尾-</span>
                    <span className={r.hit.parity ? "zhjs-hit" : undefined}>{r.pred.parity}</span>
                    <span className="zhjs-bracket">】</span>
                    <span className="zhjs-open-label">开</span>
                    <span className="zhjs-open">
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
