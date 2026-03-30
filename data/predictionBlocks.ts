/**
 * 一肖一码区：预测模板 + 香港百乐彩真实特码（见 lib/yixiaoFromDraws）合并后展示。
 * 未开奖行标题为「开:？00」；已开奖行标题与高亮仅按接口返回的特码生肖、号码计算。
 */

export type NumPart = { t: string; hit?: boolean };
export type PredLine =
  | { kind: "zodiac"; label: string; parts: Array<{ ch: string; hit?: boolean }> }
  | { kind: "nums"; label: string; nums: NumPart[] };

export type IssueBlock = {
  issue: string;
  /** 红底标题行 */
  title: string;
  lines: PredLine[];
};

export const NAV_ROW1: { href: string; label: string }[] = [
  { href: "#1x1m", label: "一肖一码" },
  { href: "#24mzt", label: "24码中特" },
  { href: "#jxzt", label: "九肖中特" },
  { href: "#gpjx", label: "五肖中特" },
  { href: "#xq4ie", label: "家禽野兽" },
];

export const NAV_ROW2: { href: string; label: string }[] = [
  { href: "#fslx", label: "复式连肖" },
  { href: "#hdui", label: "单双两头" },
  { href: "#ccih", label: "综合绝杀" },
  { href: "#ujlh", label: "合双六肖" },
  { href: "#jy4x", label: "家野四肖" },
];

/** 与后端 draws.issue_number 对应的展示期号（年内三位等） */
export function issueLabelForDraw(n: number): string {
  const x = n >= 1000 ? n % 1000 : n;
  return String(x).padStart(3, "0");
}

/** 单期预测内容（不含期号、不含开奖结果；由接口数据填入 special） */
export type YixiaoPredTemplate = {
  wuxiao: string[];
  sixiao: string[];
  sanxiao: string[];
  yixiao: string[];
  shima: string[];
  liuma: string[];
  yima: string[];
};

type RawYixiaoIssue = YixiaoPredTemplate & {
  issue: string;
  special: { zodiac: string; num: string } | null;
};

function normalizeNum(s: string): string {
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 0 || n > 49) return s.padStart(2, "0");
  return String(n).padStart(2, "0");
}

function headline(issue: string, special: RawYixiaoIssue["special"]): string {
  if (!special) {
    return `${issue}期: 愿望开彩特<开:？00>`;
  }
  const n = normalizeNum(special.num);
  return `${issue}期: 愿望开彩特<${special.zodiac}:${special.zodiac}${n}>`;
}

function toIssueBlock(raw: RawYixiaoIssue): IssueBlock {
  const zHit = raw.special?.zodiac ?? null;
  const nHit = raw.special ? normalizeNum(raw.special.num) : null;

  const zLine = (
    suffix: string,
    chars: string[],
  ): Extract<PredLine, { kind: "zodiac" }> => ({
    kind: "zodiac",
    label: `${raw.issue}期·${suffix}：`,
    parts: chars.map((ch) => ({
      ch,
      hit: zHit !== null && ch === zHit,
    })),
  });

  const nLine = (
    suffix: string,
    nums: string[],
  ): Extract<PredLine, { kind: "nums" }> => ({
    kind: "nums",
    label: `${raw.issue}期·${suffix}：`,
    nums: nums.map((t) => {
      const tNorm = normalizeNum(t);
      return {
        t: tNorm,
        hit: nHit !== null && tNorm === nHit,
      };
    }),
  });

  return {
    issue: raw.issue,
    title: headline(raw.issue, raw.special),
    lines: [
      zLine("五肖", raw.wuxiao),
      zLine("四肖", raw.sixiao),
      zLine("三肖", raw.sanxiao),
      zLine("一肖", raw.yixiao),
      nLine("十码", raw.shima),
      nLine("六码", raw.liuma),
      nLine("一码", raw.yima),
    ],
  };
}

function pickTemplate(templates: YixiaoPredTemplate[], index: number): YixiaoPredTemplate {
  return templates[Math.min(index, templates.length - 1)];
}

/**
 * @param upcomingIssueDisplay 下一期展示期号（未开奖）
 * @param completedSlots 已开奖期（新→旧），special 为接口特码；缺字段则为 null 不高亮
 */
export function composeYixiaoRows(
  upcomingIssueDisplay: string,
  completedSlots: Array<{
    issueDisplay: string;
    special: { zodiac: string; num: string };
  }>,
  templates: YixiaoPredTemplate[],
): IssueBlock[] {
  const raw: RawYixiaoIssue[] = [
    {
      issue: upcomingIssueDisplay,
      special: null,
      ...pickTemplate(templates, 0),
    },
    ...completedSlots.map((slot, i) => ({
      issue: slot.issueDisplay,
      special: slot.special,
      ...pickTemplate(templates, i + 1),
    })),
  ];
  return raw.map(toIssueBlock);
}

/** 十行预测模板（仅展示用；命中完全由真实特码决定） */
export const YIXIAO_PRED_TEMPLATES: YixiaoPredTemplate[] = [
  {
    wuxiao: ["牛", "虎", "兔", "龙", "马"],
    sixiao: ["牛", "虎", "兔", "马"],
    sanxiao: ["牛", "虎", "兔"],
    yixiao: ["牛"],
    shima: ["41", "24", "14", "01", "07", "40", "43", "39", "23", "05"],
    liuma: ["41", "24", "14", "01", "07", "40"],
    yima: ["41"],
  },
  {
    wuxiao: ["鼠", "牛", "虎", "兔", "龙"],
    sixiao: ["鼠", "牛", "虎", "兔"],
    sanxiao: ["鼠", "牛", "虎"],
    yixiao: ["鼠"],
    shima: ["34", "01", "31", "45", "36", "20", "49", "26", "21", "35"],
    liuma: ["34", "01", "31", "45", "36", "20"],
    yima: ["34"],
  },
  {
    wuxiao: ["蛇", "羊", "猴", "鸡", "狗"],
    sixiao: ["蛇", "羊", "猴", "鸡"],
    sanxiao: ["蛇", "羊", "猴"],
    yixiao: ["蛇"],
    shima: ["12", "08", "33", "19", "44", "02", "27", "15", "06", "38"],
    liuma: ["12", "08", "33", "19", "44", "02"],
    yima: ["12"],
  },
  {
    wuxiao: ["鸡", "狗", "猪", "鼠", "牛"],
    sixiao: ["狗", "猪", "鼠", "牛"],
    sanxiao: ["狗", "猪", "鼠"],
    yixiao: ["狗"],
    shima: ["22", "03", "18", "29", "41", "07", "33", "12", "45", "09"],
    liuma: ["03", "18", "29", "41", "07", "33"],
    yima: ["03"],
  },
  {
    wuxiao: ["虎", "兔", "龙", "蛇", "马"],
    sixiao: ["虎", "兔", "龙", "蛇"],
    sanxiao: ["虎", "兔", "龙"],
    yixiao: ["虎"],
    shima: ["11", "25", "08", "19", "42", "06", "31", "14", "27", "38"],
    liuma: ["11", "25", "19", "42", "06", "31"],
    yima: ["11"],
  },
  {
    wuxiao: ["猴", "鸡", "狗", "猪", "鼠"],
    sixiao: ["猴", "鸡", "狗", "猪"],
    sanxiao: ["猴", "鸡", "狗"],
    yixiao: ["猴"],
    shima: ["05", "12", "28", "41", "03", "19", "22", "35", "08", "46"],
    liuma: ["05", "12", "28", "03", "19", "22"],
    yima: ["05"],
  },
  {
    wuxiao: ["牛", "虎", "兔", "龙", "蛇"],
    sixiao: ["牛", "虎", "兔", "龙"],
    sanxiao: ["牛", "虎", "兔"],
    yixiao: ["牛"],
    shima: ["19", "02", "14", "27", "33", "06", "40", "11", "48", "21"],
    liuma: ["02", "14", "27", "33", "06", "40"],
    yima: ["02"],
  },
  {
    wuxiao: ["鼠", "牛", "虎", "兔", "龙"],
    sixiao: ["鼠", "牛", "兔", "龙"],
    sanxiao: ["鼠", "牛", "兔"],
    yixiao: ["鼠"],
    shima: ["09", "16", "27", "31", "04", "22", "38", "12", "45", "07"],
    liuma: ["09", "16", "31", "04", "22", "38"],
    yima: ["09"],
  },
  {
    wuxiao: ["马", "羊", "猴", "鸡", "狗"],
    sixiao: ["马", "羊", "猴", "鸡"],
    sanxiao: ["马", "羊", "猴"],
    yixiao: ["马"],
    shima: ["06", "13", "24", "35", "42", "18", "29", "01", "37", "44"],
    liuma: ["13", "24", "35", "42", "18", "29"],
    yima: ["13"],
  },
  {
    wuxiao: ["龙", "蛇", "马", "羊", "猴"],
    sixiao: ["龙", "蛇", "马", "羊"],
    sanxiao: ["龙", "蛇", "马"],
    yixiao: ["龙"],
    shima: ["33", "07", "12", "28", "41", "05", "19", "36", "08", "22"],
    liuma: ["33", "07", "28", "41", "05", "19"],
    yima: ["33"],
  },
];

export type M24Template = {
  nums: string[];
};

export const M24_PRED_TEMPLATES: M24Template[] = [
  { nums: ["31", "19", "07", "11", "28", "30", "21", "32", "33", "47", "25", "01", "17", "15", "20", "36", "42", "18", "24", "27", "44", "29", "43", "13"] },
  { nums: ["35", "12", "04", "08", "24", "47", "46", "01", "09", "11", "20", "02", "43", "07", "19", "33", "29", "23", "25", "22", "18", "41", "06", "36"] },
  { nums: ["22", "16", "24", "14", "44", "45", "15", "11", "23", "04", "20", "01", "21", "13", "48", "25", "36", "33", "28", "32", "30", "17", "35", "29"] },
  { nums: ["37", "30", "17", "26", "13", "46", "09", "39", "16", "12", "47", "29", "36", "40", "32", "33", "15", "49", "35", "38", "42", "25", "19", "41"] },
  { nums: ["07", "37", "47", "41", "35", "31", "34", "38", "23", "02", "21", "43", "01", "24", "45", "11", "05", "08", "10", "17", "42", "20", "28", "03"] },
  { nums: ["12", "16", "44", "17", "28", "33", "31", "43", "02", "18", "13", "22", "27", "48", "19", "26", "29", "47", "40", "37", "35", "08", "23", "15"] },
  { nums: ["15", "17", "48", "47", "41", "24", "31", "04", "26", "30", "46", "19", "13", "28", "02", "10", "09", "43", "23", "06", "12", "18", "14", "36"] },
  { nums: ["29", "27", "08", "04", "07", "16", "47", "46", "17", "33", "38", "48", "45", "34", "25", "40", "10", "28", "36", "30", "43", "13", "06", "24"] },
  { nums: ["45", "28", "18", "06", "05", "15", "21", "19", "35", "44", "14", "46", "20", "42", "22", "27", "23", "11", "34", "31", "29", "16", "08", "43"] },
  { nums: ["18", "06", "39", "43", "31", "02", "11", "49", "22", "09", "34", "21", "03", "35", "16", "40", "27", "44", "13", "30", "24", "07", "41", "28"] },
];

export const GSB_SAMPLES: { author: string; title: string; href: string }[] = [
  {
    author: "一鸣惊人",
    title: "088期【一鸣惊人】平特一尾【已公开】准",
    href: "#",
  },
  {
    author: "风云再起",
    title: "088期【风云再起】精品双波【已公开】准",
    href: "#",
  },
  {
    author: "沉默是金",
    title: "088期【沉默是金】四肖中特【已公开】准",
    href: "#",
  },
  {
    author: "天外飞仙",
    title: "088期【天外飞仙】家野中特【已公开】准",
    href: "#",
  },
  {
    author: "独孤求败",
    title: "088期【独孤求败】16码中特【已公开】准",
    href: "#",
  },
];
