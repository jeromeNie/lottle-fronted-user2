import { issueLabelForDraw, type FslxTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";

export type FslxRow = {
  issueDisplay: string;
  zodiacs: string[];
  hitSet: Set<string>;
  result: "pending" | "hit" | "miss";
};

function zodiacSetFromDraw(draw: Draw): Set<string> {
  return new Set(
    draw.numbers
      .map((n) => (n.zodiac ?? "").trim())
      .filter((z) => z.length > 0),
  );
}

/**
 * 复式连肖：下一期(未开奖)+最近19期(已开奖)=20期。
 * 判定规则：命中生肖数>=1 => 中；0 => 错。
 */
export function buildFslxRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: FslxTemplate[],
): FslxRow[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingIssueDisplay = issueLabelForDraw(
    recentDrawsNewestFirst[0].issue_number + 1,
  );

  const completed = recentDrawsNewestFirst.slice(0, 19).map((d) => ({
    issueDisplay: issueLabelForDraw(d.issue_number),
    zset: zodiacSetFromDraw(d),
  }));

  const base: Array<{ issueDisplay: string; zset: Set<string> | null }> = [
    { issueDisplay: upcomingIssueDisplay, zset: null },
    ...completed,
  ];

  return base.map((x, i) => {
    const zodiacs = templates[Math.min(i, templates.length - 1)].zodiacs;
    if (!x.zset) {
      return {
        issueDisplay: x.issueDisplay,
        zodiacs,
        hitSet: new Set<string>(),
        result: "pending",
      };
    }
    const hitSet = new Set(zodiacs.filter((z) => x.zset?.has(z)));
    return {
      issueDisplay: x.issueDisplay,
      zodiacs,
      hitSet,
      result: hitSet.size >= 1 ? "hit" : "miss",
    };
  });
}
