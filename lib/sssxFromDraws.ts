import { issueLabelForDraw, type SssxTemplate } from "@/data/predictionBlocks";
import type { Draw } from "@/lib/api";
import { specialFromDraw } from "@/lib/yixiaoFromDraws";

export type SssxRow = {
  issueDisplay: string;
  dan: [string, string, string, string];
  shuang: [string, string, string, string];
  special: { zodiac: string; num: string } | null;
  isEven: boolean | null;
  hitDan: string | null;
  hitShuang: string | null;
};

/**
 * 单双四肖：下一期(未开奖)+最近19期(已开奖)=20期。
 * 若特码为单数，则在“单四肖”里判生肖命中；若特码为双数，则在“双四肖”里判命中。
 */
export function buildSssxRowsFromHkDaily(
  recentDrawsNewestFirst: Draw[],
  templates: SssxTemplate[],
): SssxRow[] {
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
    const tpl = templates[Math.min(i, templates.length - 1)];
    if (!r.special) {
      return {
        issueDisplay: r.issueDisplay,
        dan: tpl.dan,
        shuang: tpl.shuang,
        special: null,
        isEven: null,
        hitDan: null,
        hitShuang: null,
      };
    }
    const n = Number.parseInt(r.special.num, 10);
    const isEven = Number.isFinite(n) ? n % 2 === 0 : null;
    const hitDan =
      isEven === false && tpl.dan.includes(r.special.zodiac)
        ? r.special.zodiac
        : null;
    const hitShuang =
      isEven === true && tpl.shuang.includes(r.special.zodiac)
        ? r.special.zodiac
        : null;
    return {
      issueDisplay: r.issueDisplay,
      dan: tpl.dan,
      shuang: tpl.shuang,
      special: r.special,
      isEven,
      hitDan,
      hitShuang,
    };
  });
}
