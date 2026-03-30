"use client";

import { useEffect, useState } from "react";
import { fetchLatestDraw, type Draw } from "@/lib/api";

const HK_DAILY = "hk_daily" as const;

function issueLabel(n: number) {
  const x = n >= 1000 ? n % 1000 : n;
  return String(x).padStart(3, "0");
}

function waveClass(wave: string): string {
  if (wave === "red") return "draw-ball-red";
  if (wave === "blue") return "draw-ball-blue";
  if (wave === "green") return "draw-ball-green";
  return "draw-ball-gray";
}

export function LatestDrawPanel() {
  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchLatestDraw(HK_DAILY)
      .then((d) => {
        if (cancelled) return;
        setDraw(d);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("最新开奖加载失败，请稍后刷新");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="draw-panel-status">加载最新开奖中...</div>;
  }
  if (error || !draw) {
    return <div className="draw-panel-error">{error || "暂无开奖数据"}</div>;
  }

  const main = draw.numbers.filter((n) => !n.is_special).slice(0, 6);
  const special = draw.numbers.find((n) => n.is_special) ?? null;

  return (
    <section className="draw-panel" aria-label="最新开奖">
      <div className="draw-panel-head">
        <span className="draw-panel-title">香港百乐彩</span>
        <span className="draw-panel-issue">第{issueLabel(draw.issue_number)}期</span>
      </div>
      <div className="draw-panel-balls">
        {main.map((n, i) => (
          <div key={`m-${draw.issue_number}-${i}`} className="draw-ball-item">
            <span className={`draw-ball ${waveClass(n.wave_color)}`}>{n.number}</span>
            <span className="draw-ball-zodiac">{n.zodiac ?? "?"}</span>
          </div>
        ))}
        <span className="draw-ball-plus">+</span>
        {special ? (
          <div className="draw-ball-item">
            <span className={`draw-ball ${waveClass(special.wave_color)}`}>
              {special.number}
            </span>
            <span className="draw-ball-zodiac">{special.zodiac ?? "?"}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
