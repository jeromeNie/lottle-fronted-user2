"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchDrawByIssue,
  fetchDrawHistory,
  type Draw,
  type LotteryCode,
} from "@/lib/api";
import styles from "./page.module.css";

const CODE_LABEL: Record<LotteryCode, string> = {
  hk_daily: "香港百乐彩",
  macau_mark_six: "澳门彩",
  hk_mark_six: "香港彩",
};

function issueLabel(n: number) {
  const x = n >= 1000 ? n % 1000 : n;
  return String(x).padStart(3, "0");
}

function waveClass(wave: string) {
  if (wave === "red") return styles.red;
  if (wave === "blue") return styles.blue;
  if (wave === "green") return styles.green;
  return styles.gray;
}

function PredictionHistoryPage() {
  const searchParams = useSearchParams();
  const rawCode = searchParams.get("lottery_type_code");
  const code: LotteryCode =
    rawCode === "macau_mark_six" || rawCode === "hk_mark_six" || rawCode === "hk_daily"
      ? rawCode
      : "hk_daily";

  const [rows, setRows] = useState<Draw[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [jumpInput, setJumpInput] = useState("1");
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDrawHistory(code, page, pageSize)
      .then(async (h) => {
        const briefs = h.items ?? [];
        const full = await Promise.all(
          briefs.map((x) => fetchDrawByIssue(code, x.issue_number).catch(() => null)),
        );
        if (!cancelled) {
          setRows(full.filter((x): x is Draw => x !== null));
          setError("");
          setHasMore(briefs.length === pageSize);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
          setError("历史开奖加载失败");
          setHasMore(false);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [code, page]);

  useEffect(() => {
    setPage(1);
    setJumpInput("1");
  }, [code]);

  const title = useMemo(() => `${CODE_LABEL[code]} 历史开奖记录`, [code]);
  const canPrev = page > 1 && !loading;
  const canNext = hasMore && !loading;

  function jumpToPage() {
    const x = Number.parseInt(jumpInput, 10);
    if (!Number.isFinite(x) || x < 1) return;
    setPage(x);
  }

  return (
    <main className={styles.page}>
      <section className={styles.head}>
        <Link href="/" className={styles.back}>
          ← 返回首页
        </Link>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.sub}>第{page}页（每页{pageSize}期）</div>
        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            上一页
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => p + 1)}
            disabled={!canNext}
          >
            下一页
          </button>
          <span className={styles.jumpLabel}>跳转到</span>
          <input
            className={styles.jumpInput}
            inputMode="numeric"
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value.replace(/[^\d]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") jumpToPage();
            }}
          />
          <button type="button" className={styles.pagerBtn} onClick={jumpToPage}>
            确定
          </button>
        </div>
      </section>

      {error ? (
        <div className={styles.error}>{error}</div>
      ) : loading ? (
        <div className={styles.error}>加载中...</div>
      ) : (
        <section className={styles.list}>
          {rows.map((d) => {
            const main = d.numbers.filter((n) => !n.is_special).slice(0, 6);
            const special = d.numbers.find((n) => n.is_special) ?? null;
            return (
              <article key={d.issue_number} className={styles.card}>
                <div className={styles.issue}>第{issueLabel(d.issue_number)}期</div>
                <div className={styles.balls}>
                  {main.map((n, i) => (
                    <div key={`${d.issue_number}-m-${i}`} className={styles.ballItem}>
                      <span className={`${styles.ball} ${waveClass(n.wave_color)}`}>{n.number}</span>
                      <span className={styles.zodiac}>{n.zodiac ?? "?"}</span>
                    </div>
                  ))}
                  <span className={styles.plus}>+</span>
                  {special ? (
                    <div className={styles.ballItem}>
                      <span className={`${styles.ball} ${waveClass(special.wave_color)}`}>
                        {special.number}
                      </span>
                      <span className={styles.zodiac}>{special.zodiac ?? "?"}</span>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default function PredictionHistoryPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className={styles.error}>加载中...</div>
        </main>
      }
    >
      <PredictionHistoryPage />
    </Suspense>
  );
}
