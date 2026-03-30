import { issueLabelForDraw, type JxztTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type JxztRow = {
  issueDisplay: string;
  zodiacs: string[];
  special: { zodiac: string; num: string } | null;
};

/**
 * 九肖中特：下一期(未开奖) + 最近19期(已开奖) 共20期。
 * 命中只按特码生肖判定。
 */
export function buildJxztRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: JxztTemplate[],
): JxztRow[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingIssueDisplay = issueLabelForDraw(
    recentDrawsNewestFirst[0].issue_number + 1,
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
