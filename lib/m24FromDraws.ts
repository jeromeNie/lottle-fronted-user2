import type { Draw } from "@/lib/api";
import { issueLabelForDraw, type M24Template } from "@/data/predictionBlocks";
import { computeGsbIssueNumber } from "@/lib/gsbIssue";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type M24Row = {
  issueDisplay: string;
  nums: string[];
  special: { num: string } | null;
};

/**
 * 下一期（未开奖）+ 最近9期（已开奖）= 10期二十四码。
 * 已开奖期仅按特码数字命中高亮；未开奖期不高亮。
 */
export function buildM24RowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: M24Template[],
): M24Row[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingIssueDisplay = issueLabelForDraw(
    computeGsbIssueNumber(
      recentDrawsNewestFirst[0].issue_number,
      recentDrawsNewestFirst[0].draw_date,
      recentDrawsNewestFirst[0].draw_time,
    ),
  );
  const completed = recentDrawsNewestFirst.slice(0, 9).map((d) => ({
    issueDisplay: issueLabelForDraw(d.issue_number),
    special: { num: specialFromDraw(d).num },
  }));

  const base: Array<{ issueDisplay: string; special: { num: string } | null }> = [
    { issueDisplay: upcomingIssueDisplay, special: null },
    ...completed,
  ];

  return base.map((x, i) => ({
    issueDisplay: x.issueDisplay,
    nums: templates[Math.min(i, templates.length - 1)].nums,
    special: x.special,
  }));
}
