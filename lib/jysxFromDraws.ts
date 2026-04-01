import { issueLabelForDraw, type JysxTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { computeGsbIssueNumber } from "@/lib/gsbIssue";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type JysxRow = {
  issueDisplay: string;
  jia: [string, string, string, string];
  ye: [string, string, string, string];
  special: { zodiac: string; num: string } | null;
  hitJia: string | null;
  hitYe: string | null;
};

/**
 * 家野四肖：下一期(未开奖)+最近19期(已开奖)=20期。
 * 命中规则：特码生肖在“家”或“野”分组内则该生肖黄底高亮。
 */
export function buildJysxRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: JysxTemplate[],
): JysxRow[] {
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

  const base: Array<{ issueDisplay: string; special: { zodiac: string; num: string } | null }> = [
    { issueDisplay: upcomingIssueDisplay, special: null },
    ...completed,
  ];

  return base.map((r, i) => {
    const tpl = templates[Math.min(i, templates.length - 1)];
    const hitJia =
      r.special && tpl.jia.includes(r.special.zodiac) ? r.special.zodiac : null;
    const hitYe =
      r.special && tpl.ye.includes(r.special.zodiac) ? r.special.zodiac : null;
    return {
      issueDisplay: r.issueDisplay,
      jia: tpl.jia,
      ye: tpl.ye,
      special: r.special,
      hitJia,
      hitYe,
    };
  });
}
