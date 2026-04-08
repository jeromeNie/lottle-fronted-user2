/**
 * 将 predictionBlocks 中的模板导出为 JSON，供 lottle-backend Python 复用。
 * 运行：pnpm exec tsx scripts/dump-hk-daily-templates.mts
 */
import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PB = await import(pathToFileURL(resolve(__dirname, "../data/predictionBlocks.ts")).href);
const outPath = resolve(
  __dirname,
  "../../lottle-backend/app/data/hk_daily_prediction_templates.json",
);

const doc = {
  YIXIAO_PRED_TEMPLATES: PB.YIXIAO_PRED_TEMPLATES,
  M24_PRED_TEMPLATES: PB.M24_PRED_TEMPLATES,
  JXZT_PRED_TEMPLATES: PB.JXZT_PRED_TEMPLATES,
  QXZT_PRED_TEMPLATES: PB.QXZT_PRED_TEMPLATES,
  WJSX_PRED_TEMPLATES: PB.WJSX_PRED_TEMPLATES,
  FSLX_PRED_TEMPLATES: PB.FSLX_PRED_TEMPLATES,
  JXST_PRED_TEMPLATES: PB.JXST_PRED_TEMPLATES,
  ZHJS_PRED_TEMPLATES: PB.ZHJS_PRED_TEMPLATES,
  SSSX_PRED_TEMPLATES: PB.SSSX_PRED_TEMPLATES,
  JYSX_PRED_TEMPLATES: PB.JYSX_PRED_TEMPLATES,
};

writeFileSync(outPath, JSON.stringify(doc, null, 2), "utf-8");
console.log("written:", outPath);
