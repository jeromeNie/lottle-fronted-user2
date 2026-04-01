import { issueLabelForDraw, type ZhjsTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { computeGsbIssueNumber } from "@/lib/gsbIssue";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type ZhjsRow = {
  issueDisplay: string;
  pred: ZhjsTemplate;
  special: { zodiac: string; num: string } | null;
  hit: {
    zodiac: boolean;
    head: boolean;
    tail: boolean;
    parity: boolean;
  };
};

function parityOf(num2: string): "单数" | "双数" {
  const n = Number.parseInt(num2, 10);
  return n % 2 === 0 ? "双数" : "单数";
}

/**
 * 综合绝杀：下一期(未开奖)+最近19期(已开奖)=20期。
 * 命中分别按：生肖 / 头号(特码首位) / 尾号(特码末位) / 单双。
 */
export function buildZhjsRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: ZhjsTemplate[],
): ZhjsRow[] {
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
    const pred = templates[Math.min(i, templates.length - 1)];
    if (!r.special) {
      return {
        issueDisplay: r.issueDisplay,
        pred,
        special: null,
        hit: { zodiac: false, head: false, tail: false, parity: false },
      };
    }
    const num2 = r.special.num.padStart(2, "0");
    const head = num2.charAt(0);
    const tail = num2.charAt(1);
    const p = parityOf(num2);
    return {
      issueDisplay: r.issueDisplay,
      pred,
      special: r.special,
      hit: {
        zodiac: r.special.zodiac === pred.zodiac,
        head: head === pred.head,
        tail: tail === pred.tail,
        parity: p === pred.parity,
      },
    };
  });
}
