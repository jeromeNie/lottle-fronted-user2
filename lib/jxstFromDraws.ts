import { issueLabelForDraw, type JxstTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type JxstRow = {
  issueDisplay: string;
  digits: [string, string, string];
  special: { zodiac: string; num: string } | null;
  hitDigit: string | null;
};

/**
 * 精选三头：下一期(未开奖) + 最近19期(已开奖) 共20期。
 * 命中规则：若特码两位数（如 01/35）的第一位与所选数字相同，则该数字高亮。
 */
export function buildJxstRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: JxstTemplate[],
): JxstRow[] {
  if (recentDrawsNewestFirst.length === 0) return [];

  const upcomingIssueDisplay = issueLabelForDraw(
    recentDrawsNewestFirst[0].issue_number + 1,
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
    const digits = templates[Math.min(i, templates.length - 1)].digits;
    const firstDigit = r.special?.num?.padStart(2, "0").charAt(0) ?? null;
    const hitDigit = firstDigit && digits.includes(firstDigit) ? firstDigit : null;
    return {
      issueDisplay: r.issueDisplay,
      digits,
      special: r.special,
      hitDigit,
    };
  });
}
