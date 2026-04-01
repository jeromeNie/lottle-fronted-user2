import { issueLabelForDraw, type WjsxTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { computeGsbIssueNumber } from "@/lib/gsbIssue";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type WjsxRow = {
  issueDisplay: string;
  zodiacs: string[];
  special: { zodiac: string; num: string } | null;
};

/**
 * 稳禁四肖：下一期(未开奖) + 最近19期(已开奖) 共20期。
 * 命中仅按特码生肖（命中时四肖中对应字黄底高亮）。
 */
export function buildWjsxRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: WjsxTemplate[],
): WjsxRow[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingIssueDisplay = issueLabelForDraw(
    computeGsbIssueNumber(
      recentDrawsNewestFirst[0].issue_number,
      recentDrawsNewestFirst[0].draw_date,
      recentDrawsNewestFirst[0].draw_time,
    ),
  );
  const completed = recentDrawsNewestFirst.slice(0, 19).map((d) => ({
    issueDisplay: issueLabelForDraw(d.issue_number),
    special: specialFromDraw(d),
  }));

  const rows: Array<{ issueDisplay: string; special: { zodiac: string; num: string } | null }> = [
    { issueDisplay: upcomingIssueDisplay, special: null },
    ...completed,
  ];

  return rows.map((r, i) => ({
    issueDisplay: r.issueDisplay,
    zodiacs: templates[Math.min(i, templates.length - 1)].zodiacs,
    special: r.special,
  }));
}
