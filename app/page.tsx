import Link from "next/link";
import { NavSticky } from "@/components/NavSticky";
import { YixiaoPanel } from "@/components/YixiaoPanel";
import { PlaceholderSection } from "@/components/PlaceholderSection";
import { GSB_SAMPLES, NAV_ROW1, NAV_ROW2 } from "@/data/predictionBlocks";

const KJ_IFRAME_SRC = "http://hk566kk.xyz/kj.asp";

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
              <a href="http://hk566kk.xyz/jl/jl.asp" target="_blank" rel="noreferrer">
                开奖记录
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="cgi-content">
        <div className="white-box">
          <iframe
            title="开奖直播"
            className="kjIframe"
            name="I1"
            marginWidth={1}
            marginHeight={0}
            height={220}
            width="100%"
            scrolling="no"
            frameBorder={0}
            src={KJ_IFRAME_SRC}
          />
        </div>

        <div className="white-box mt10" id="1x1m">
          <YixiaoPanel />
        </div>

        <PlaceholderSection id="24mzt" title="24码中特" />
        <PlaceholderSection id="jxzt" title="九肖中特" />
        <PlaceholderSection id="gpjx" title="五肖中特" />
        <PlaceholderSection id="xq4ie" title="家禽野兽" />
        <PlaceholderSection id="fslx" title="复式连肖" />
        <PlaceholderSection id="hdui" title="单双两头" />
        <PlaceholderSection id="ccih" title="综合绝杀" />
        <PlaceholderSection id="ujlh" title="合双六肖" />
        <PlaceholderSection id="jy4x" title="家野四肖" />

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
