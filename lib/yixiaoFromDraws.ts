import type { Draw } from "@/lib/api";
import {
  composeYixiaoRows,
  issueLabelForDraw,
  type IssueBlock,
  type YixiaoPredTemplate,
} from "@/data/predictionBlocks";

/** 从开奖记录取特码（用于与预测比对，仅特码命中才高亮） */
export function specialFromDraw(draw: Draw): { zodiac: string; num: string } {
  const s = draw.numbers.find((n) => n.is_special);
  if (!s) return { zodiac: "？", num: "00" };
  const z = (s.zodiac && s.zodiac.trim()) || "？";
  const n = Number.isFinite(s.number)
    ? String(s.number).padStart(2, "0")
    : "00";
  return { zodiac: z, num: n };
}

/**
 * 最近 9 期完整开奖（新→旧）+ 模板 → 一肖一码区块。
 * 首行为下一期（未开），其后每期标题与高亮均按真实特码计算。
 */
export function buildYixiaoBlocksFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: YixiaoPredTemplate[],
): IssueBlock[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingDisplay = issueLabelForDraw(
    recentDrawsNewestFirst[0].issue_number + 1,
  );

  const completedSlots = recentDrawsNewestFirst.map((d) => ({
    issueDisplay: issueLabelForDraw(d.issue_number),
    special: specialFromDraw(d),
  }));

  return composeYixiaoRows(upcomingDisplay, completedSlots, templates);
}
