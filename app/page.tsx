import Link from "next/link";
import dynamic from "next/dynamic";
import { NavSticky } from "@/components/NavSticky";
import { YixiaoPanel } from "@/components/YixiaoPanel";
import { LatestDrawPanel } from "@/components/LatestDrawPanel";
import { M24Panel } from "@/components/M24Panel";
import { JxztPanel } from "@/components/JxztPanel";
import { OnView } from "@/components/OnView";
import { GSB_SAMPLES, NAV_ROW1, NAV_ROW2 } from "@/data/predictionBlocks";

const QxztPanel = dynamic(
  () => import("@/components/QxztPanel").then((m) => m.QxztPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const WjsxPanel = dynamic(
  () => import("@/components/WjsxPanel").then((m) => m.WjsxPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const FslxPanel = dynamic(
  () => import("@/components/FslxPanel").then((m) => m.FslxPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const JxstPanel = dynamic(
  () => import("@/components/JxstPanel").then((m) => m.JxstPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const ZhjsPanel = dynamic(
  () => import("@/components/ZhjsPanel").then((m) => m.ZhjsPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const SssxPanel = dynamic(
  () => import("@/components/SssxPanel").then((m) => m.SssxPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);
const JysxPanel = dynamic(
  () => import("@/components/JysxPanel").then((m) => m.JysxPanel),
  { loading: () => <div className="section-skeleton mt10" aria-hidden /> },
);

export default function Home() {
  return (
    <div className="cgi-body">
      <header className="cgi-head-home" aria-hidden />

      <NavSticky>
        <ul>
          {NAV_ROW1.map((x) => (
            <li key={x.href}>
              <a href={x.href}>{x.label}</a>
            </li>
          ))}
        </ul>
        <ul>
          {NAV_ROW2.map((x) => (
            <li key={x.href}>
              <a href={x.href}>{x.label}</a>
            </li>
          ))}
        </ul>
      </NavSticky>

      <div className="cgi-wrapper">
        <div className="cgi-subNav">
          <ul className="clearfix">
            <li>
              <Link className="on" href="/">
                网站首页
              </Link>
            </li>
            <li>
              <Link href="/prediction/history?lottery_type_code=hk_daily">
                开奖记录
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="cgi-content">
        <div className="white-box">
          <LatestDrawPanel />
        </div>

        <div className="white-box mt10" id="1x1m">
          <YixiaoPanel />
        </div>

        <M24Panel />
        <div className="white-box mt10" aria-label="guanggao1">
          <img src="/guanggao1.gif" alt="广告1" className="gg-gif" />
        </div>
        <div className="white-box mt10" aria-label="guanggao2">
          <img src="/guanggao2.gif" alt="广告2" className="gg-gif" />
        </div>
        <JxztPanel />
        <OnView>
          <QxztPanel />
        </OnView>
        <OnView>
          <WjsxPanel />
        </OnView>
        <OnView>
          <FslxPanel />
        </OnView>
        <OnView>
          <JxstPanel />
        </OnView>
        <OnView>
          <ZhjsPanel />
        </OnView>
        <OnView>
          <SssxPanel />
        </OnView>
        <OnView>
          <JysxPanel />
        </OnView>

        <div className="white-box mt10" aria-hidden>
          <div
            style={{
              minHeight: 120,
              background: "#1a1a1a",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 14,
            }}
          >
            广告图位（原站 gsb.gif）
          </div>
        </div>

        <div className="white-box mt10">
          <div className="cgi-gsb">
            <ul>
              {GSB_SAMPLES.map((row, i) => (
                <li key={i}>
                  <span className="cgi-zuozhe">{row.author}</span>
                  <a href={row.href}>
                    <span className="cgi-gsb-tit">高手榜</span>
                    {row.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
