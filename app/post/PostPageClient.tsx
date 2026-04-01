"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { computeGsbIssueNumber, issueLabelForDisplay } from "@/lib/gsbIssue";
import styles from "./page.module.css";

const HK_DAILY = "hk_daily" as const;

function hashSeed(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeFourTails(seedText: string): string[] {
  const used = new Set<string>();
  const seed = hashSeed(seedText);
  let x = seed || 12345;
  while (used.size < 4) {
    x = (x * 1664525 + 1013904223) >>> 0;
    used.add(String(x % 10));
  }
  return Array.from(used);
}

type Row = {
  issueDisplay: string;
  tails: string[];
  special: { zodiac: string; num: string } | null;
};

export function PostPageClient({
  issue,
  author,
  topic,
}: {
  issue: string;
  author: string;
  topic: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const h = await fetchDrawHistory(HK_DAILY, 1, 14);
        const briefs = h.items ?? [];
        const full = await Promise.all(
          briefs.map((b) => fetchDrawByIssue(HK_DAILY, b.issue_number).catch(() => null)),
        );
        const draws = full.filter((d): d is Draw => d !== null);
        if (draws.length === 0) {
          if (!cancelled) setRows([]);
          return;
        }
        const computedIssue = issueLabelForDisplay(
          computeGsbIssueNumber(
            draws[0].issue_number,
            draws[0].draw_date,
            draws[0].draw_time,
          ),
        );
        const baseRows: Row[] = [
          {
            issueDisplay: issue || computedIssue,
            tails: makeFourTails(`${author}-${topic}-${issue || computedIssue}`),
            special: null,
          },
          ...draws.map((d) => {
            const n = d.numbers.find((x) => x.is_special)?.number;
            const z = d.numbers.find((x) => x.is_special)?.zodiac ?? "?";
            const issueDisplay = issueLabelForDisplay(d.issue_number);
            return {
              issueDisplay,
              tails: makeFourTails(`${author}-${topic}-${issueDisplay}`),
              special:
                typeof n === "number"
                  ? { zodiac: z, num: String(n).padStart(2, "0") }
                  : { zodiac: "?", num: "00" },
            };
          }),
        ];
        if (!cancelled) setRows(baseRows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [author, topic, issue]);

  const headTitle = useMemo(
    () => `${issue || (rows[0]?.issueDisplay ?? "--")}期：${author}【${topic}】已经公开`,
    [issue, rows, author, topic],
  );

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.back}>
          ← 返回
        </Link>
      </div>

      <section className={styles.card}>
        <div className={styles.headline}>{headTitle}</div>
        <div className={styles.authorLine}>
          <span className={styles.authorName}>— {author}</span>
        </div>

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          rows.map((r) => {
            const hitTail = r.special ? r.special.num.charAt(1) : null;
            return (
              <div key={r.issueDisplay} className={styles.row}>
                <span className={styles.issue}>{r.issueDisplay}期:</span>
                <span className={styles.topic}>{topic}</span>
                <span className={styles.bracket}>【</span>
                <span className={styles.tails}>
                  {r.tails.map((d, i) => (
                    <span key={`${r.issueDisplay}-${i}`} className={hitTail === d ? styles.hit : ""}>
                      {d}
                    </span>
                  ))}
                </span>
                <span className={styles.bracket}>】</span>
                <span className={styles.open}>开:</span>
                <span className={styles.result}>
                  {r.special ? `${r.special.zodiac}${r.special.num}` : "? 00"}
                </span>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
