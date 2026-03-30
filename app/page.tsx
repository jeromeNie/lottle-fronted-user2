import Link from "next/link";
import { NavSticky } from "@/components/NavSticky";
import { YixiaoPanel } from "@/components/YixiaoPanel";
import { LatestDrawPanel } from "@/components/LatestDrawPanel";
import { M24Panel } from "@/components/M24Panel";
import { JxztPanel } from "@/components/JxztPanel";
import { QxztPanel } from "@/components/QxztPanel";
import { WjsxPanel } from "@/components/WjsxPanel";
import { FslxPanel } from "@/components/FslxPanel";
import { JxstPanel } from "@/components/JxstPanel";
import { ZhjsPanel } from "@/components/ZhjsPanel";
import { SssxPanel } from "@/components/SssxPanel";
import { JysxPanel } from "@/components/JysxPanel";
import { GSB_SAMPLES, NAV_ROW1, NAV_ROW2 } from "@/data/predictionBlocks";

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
        <QxztPanel />
        <WjsxPanel />
        <FslxPanel />
        <JxstPanel />
        <ZhjsPanel />
        <SssxPanel />
        <JysxPanel />

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
