"use client";

import { useEffect, useState } from "react";
import { IssueTables } from "@/components/IssueTables";
import {
  type IssueBlock,
  YIXIAO_PRED_TEMPLATES,
} from "@/data/predictionBlocks";
import { fetchDrawByIssue, fetchDrawHistory, type Draw } from "@/lib/api";
import { buildYixiaoBlocksFromHkDaily } from "@/lib/yixiaoFromDraws";

const HK_DAILY = "hk_daily" as const;

export function YixiaoPanel() {
  const [blocks, setBlocks] = useState<IssueBlock[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError("");
    setBlocks(null);

    (async () => {
      try {
        const h = await fetchDrawHistory(HK_DAILY, 1, 9);
        const briefs = h.items ?? [];
        if (briefs.length === 0) {
          if (!cancelled) {
            setError("暂无香港百乐彩开奖数据");
            setBlocks([]);
          }
          return;
        }

        const full = await Promise.all(
          briefs.map((b) =>
            fetchDrawByIssue(HK_DAILY, b.issue_number).catch(() => null),
          ),
        );

        const draws: Draw[] = [];
        for (let i = 0; i < briefs.length; i++) {
          const d = full[i];
          if (d) draws.push(d);
        }

        if (draws.length === 0) {
          if (!cancelled) {
            setError("开奖详情加载失败");
            setBlocks([]);
          }
          return;
        }

        const next = buildYixiaoBlocksFromHkDaily(draws, YIXIAO_PRED_TEMPLATES);
        if (!cancelled) {
          setBlocks(next);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("接口暂不可用，请稍后刷新");
          setBlocks([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 12, color: "#b91c1c" }} role="status">
        {error}
      </div>
    );
  }

  if (blocks === null) {
    return (
      <div style={{ padding: 12, color: "#666" }} role="status">
        加载香港百乐彩预测对照…
      </div>
    );
  }

  if (blocks.length === 0) {
    return null;
  }

  return <IssueTables blocks={blocks} />;
}
