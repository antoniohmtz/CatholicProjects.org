"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import SiteNav from "../../../components/SiteNav";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });

const T = {
  gold: "#C8943A",
  goldDark: "#A87425",
  goldSoft: "#E8C77E",
  espresso: "#4A2B16",
  ink: "#211A14",
  sub: "#5E5349",
  ivory: "#FFFDF9",
  cream: "#FAF7F0",
  line: "rgba(74,43,22,.11)",
  goldLine: "rgba(200,148,58,.22)",
};

const CONTACT = "team@catholicprojects.org";
const STRIPE_LINK = "https://buy.stripe.com/your-stripe-link";
const PAYPAL_LINK = "https://paypal.me/catholicsaintstories";

function Svg({ children, className, sw = 1.8 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const UI: Record<string, ReactNode> = {
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  play: (<><polygon points="5 3 19 12 5 21 5 3" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  book: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /></>),
};

const UPCOMING_SAINTS = [
  { name: "St. Thérèse of Lisieux", status: "coming-soon" as const, order: 1 },
  { name: "St. Francis of Assisi", status: "in-progress" as const, order: 2 },
  { name: "St. Joan of Arc", status: "research" as const, order: 3 },
  { name: "St. Benedict", status: "research" as const, order: 4 },
  { name: "St. Catherine of Siena", status: "research" as const, order: 5 },
  { name: "St. Augustine", status: "research" as const, order: 6 },
];

const SUPPORT_TIERS = [
  { amount: "$5", period: "/month", description: "Help with research & sourcing" },
  { amount: "$15", period: "/month", description: "Help with production & editing" },
  { amount: "$25", period: "/month", description: "Help with narration & translation" },
  { amount: "$50", period: "/month", description: "Support the full pipeline" },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"mission" | "videos">("mission");

  return (
    <div className={`cp ${ui.variable}`}>
      <style>{CSS}</style>
      <div className="cp-bg" aria-hidden="true" />

      <SiteNav onHome={() => (window.location.href = "/")} onSearch={() => {}} onJump={() => {}} />

      <main className="cp-main">
        {/* HERO */}
        <div className="support-hero">
          <div className="support-heroContent">
            <div className="support-eyebrow">
              <span aria-hidden="true">✝️</span> Help Bring the Next Saint Story to Life
            </div>
            <h1 className="support-title">Stories of the Saints.</h1>
            <h2 className="support-subtitle">Made for a new generation.</h2>
            <p className="support-desc">
              Each week, we create cinematic stories of the saints—faithful, beautiful, and made for the people and platforms where faith happens today. Your support helps us keep making them.
            </p>
            <div className="support-lang">
              <span className="support-langItem">🇺🇸 English</span>
              <span className="support-langItem">🇪🇸 Español</span>
            </div>
          </div>

          <div className="support-stats">
            <div className="support-stat">
              <span className="support-statValue">14K</span>
              <span className="support-statLabel">Followers</span>
            </div>
            <div className="support-stat">
              <span className="support-statValue">435K</span>
              <span className="support-statLabel">Monthly views</span>
            </div>
            <div className="support-stat">
              <span className="support-statValue">102</span>
              <span className="support-statLabel">Episodes</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="support-section">
          <div className="support-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "mission"}
              onClick={() => setActiveTab("mission")}
              className={`support-tab ${activeTab === "mission" ? "support-tabActive" : ""}`}
            >
              The Mission
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "videos"}
              onClick={() => setActiveTab("videos")}
              className={`support-tab ${activeTab === "videos" ? "support-tabActive" : ""}`}
            >
              Recent Stories
            </button>
          </div>

          {activeTab === "mission" && (
            <div className="support-tabContent">
              <h3 className="support-contentTitle">Why This Matters</h3>
              <p className="support-contentText">
                The lives of the saints teach us what it means to follow Christ. But most people encounter faith in the spaces they already use—Instagram, TikTok, YouTube. We make stories of the saints for those spaces, so their witness reaches everyday feeds and hearts that might not otherwise hear them.
              </p>
              <p className="support-contentText">
                Every video takes time: research in trusted Catholic sources, scriptwriting, professional production, narration, translation to Spanish, and distribution across platforms. That work costs money, and your support makes it happen.
              </p>

              <div className="support-subsection">
                <h4 className="support-subheading">What Your Support Funds</h4>
                <ul className="support-list">
                  <li>
                    <Svg sw={2.2}>{UI.check}</Svg>
                    <span>Research in Tier 1 & Tier 2 Catholic sources</span>
                  </li>
                  <li>
                    <Svg sw={2.2}>{UI.check}</Svg>
                    <span>Professional scriptwriting & production</span>
                  </li>
                  <li>
                    <Svg sw={2.2}>{UI.check}</Svg>
                    <span>Narration (English & Spanish)</span>
                  </li>
                  <li>
                    <Svg sw={2.2}>{UI.check}</Svg>
                    <span>Translation & closed captions</span>
                  </li>
                  <li>
                    <Svg sw={2.2}>{UI.check}</Svg>
                    <span>Distribution across platforms</span>
                  </li>
                </ul>
              </div>

              <div className="support-pipeline">
                <h4 className="support-subheading">What's Coming Next</h4>
                <div className="support-saintsList">
                  {UPCOMING_SAINTS.map((saint) => (
                    <div key={saint.name} className="support-saint">
                      <span className="support-saintOrder">{saint.order}</span>
                      <div className="support-saintInfo">
                        <span className="support-saintName">{saint.name}</span>
                        <span className={`support-saintStatus support-status-${saint.status}`}>
                          {saint.status === "coming-soon" && "Coming soon"}
                          {saint.status === "in-progress" && "In production"}
                          {saint.status === "research" && "In research"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="support-tabContent">
              <h3 className="support-contentTitle">Recently Released</h3>
              <p className="support-contentText" style={{ marginBottom: "28px" }}>
                Here are some of our most-watched stories. These are free to watch, share, and enjoy. Your support helps us keep making them.
              </p>
            </div>
          )}
        </div>

        {/* SUPPORT TIERS */}
        <div className="support-section">
          <h3 className="support-sectionTitle">Ways to Support</h3>
          <p className="support-sectionDesc">
            Choose the support level that works for you. Every contribution, no matter the size, helps us create better stories and reach more people.
          </p>

          <div className="support-tiers">
            {SUPPORT_TIERS.map((tier) => (
              <div key={tier.amount} className="support-tier">
                <div className="support-tierAmount">
                  {tier.amount}
                  <span className="support-tierPeriod">{tier.period}</span>
                </div>
                <p className="support-tierDesc">{tier.description}</p>
                <a href={STRIPE_LINK} className="support-tierCta">
                  Support
                  <Svg sw={2.2}>{UI.arrow}</Svg>
                </a>
              </div>
            ))}
          </div>

          <div className="support-paymentMethods">
            <p className="support-paymentLabel">Or support one-time:</p>
            <div className="support-paymentButtons">
              <a href={STRIPE_LINK} className="support-methodBtn">
                Pay with Card
              </a>
              <a href={PAYPAL_LINK} className="support-methodBtn">
                Pay with PayPal
              </a>
            </div>
          </div>
        </div>

        {/* TAX CLARITY */}
        <div className="support-clarity">
          <div className="support-clarityIcon">
            <Svg sw={1.8}>{UI.book}</Svg>
          </div>
          <div className="support-clarityContent">
            <h4>A Note on Taxes</h4>
            <p>
              <strong>Contributions to CatholicSaintStories are NOT tax-deductible.</strong> Your support is voluntary creator income, not a charitable donation. CatholicProjects.org is not currently a tax-exempt charitable organization. You'll receive a record of your transaction for your records, but it does not qualify for tax deduction. We handle all contributions transparently and report them as creator income.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="support-section support-sectionAsk">
          <span className="support-askIcon">
            <Svg sw={1.7}>{UI.mail}</Svg>
          </span>
          <div className="support-askText">
            <h3>Questions?</h3>
            <p>Reach out. We read every message and love hearing what the stories mean to you.</p>
          </div>
          <a className="support-askCta" href={`mailto:${CONTACT}`}>
            Get in touch
            <Svg sw={2.2}>{UI.arrow}</Svg>
          </a>
        </div>
      </main>

      <footer className="cp-foot">
        <div className="cp-footInner">
          <span className="cp-footMark" aria-hidden="true">✠</span>
          <p className="cp-footText">Stories of the saints, made for a new generation.</p>
          <p className="cp-footFine">
            <a href="https://catholicprojects.org">CatholicProjects.org</a> · <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.cp{
  --cp-gold:${T.gold};--cp-gold-dark:${T.goldDark};--cp-gold-soft:${T.goldSoft};
  --cp-espresso:${T.espresso};--cp-ink:${T.ink};--cp-sub:${T.sub};
  --cp-ivory:${T.ivory};--cp-cream:${T.cream};--cp-line:${T.line};--cp-gold-line:${T.goldLine};
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:clip;
  color:var(--cp-ink);background:linear-gradient(180deg,#FFFDF9 0%,#FCF8F0 100%);
  font-family:var(--cp-ui),Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;-webkit-font-smoothing:antialiased;
}
.cp,.cp *,.cp *::before,.cp *::after{box-sizing:border-box;}
.cp :where(button){font-family:inherit;color:inherit;}
.cp :where(a){color:inherit;}
.cp a:focus-visible,.cp button:focus-visible,.cp input:focus-visible{outline:2px solid var(--cp-gold-dark);outline-offset:3px;}
.cp-main{flex:1;}
.cp-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;height:900px;background:radial-gradient(720px 430px at 80% 24%,rgba(200,148,58,.14),transparent 67%),radial-gradient(520px 300px at 7% 17%,rgba(200,148,58,.055),transparent 72%);}

.support-hero{width:min(1180px,calc(100% - 40px));margin:52px auto 64px;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center;}
.support-heroContent{position:relative;z-index:2;}
.support-eyebrow{width:fit-content;margin-bottom:18px;padding:8px 14px;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--cp-gold-line);border-radius:999px;background:rgba(255,255,255,.7);box-shadow:0 4px 16px rgba(74,43,22,.035);color:var(--cp-gold-dark);font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;}
.support-title{max-width:640px;margin:0 0 2px;color:var(--cp-ink);font-family:Georgia,"Times New Roman",serif;font-size:clamp(3rem,5vw,4.3rem);line-height:1.02;letter-spacing:-.04em;font-weight:600;}
.support-subtitle{max-width:640px;margin:0 0 24px;color:var(--cp-gold-dark);font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.8rem,3.2vw,2.6rem);line-height:1.1;letter-spacing:-.02em;font-weight:500;}
.support-desc{max-width:560px;margin:0 0 20px;color:var(--cp-sub);font-size:clamp(1rem,1.4vw,1.12rem);line-height:1.65;font-weight:450;}
.support-lang{display:flex;gap:16px;margin-top:24px;}
.support-langItem{padding:6px 12px;border-radius:8px;background:rgba(200,148,58,.1);color:var(--cp-gold-dark);font-size:13px;font-weight:700;}

.support-stats{display:flex;gap:32px;flex-wrap:wrap;}
.support-stat{display:flex;flex-direction:column;}
.support-statValue{display:block;color:var(--cp-espresso);font-size:26px;font-weight:900;letter-spacing:-.01em;}
.support-statLabel{display:block;margin-top:4px;color:var(--cp-sub);font-size:13px;font-weight:650;}

.support-section{width:min(1180px,calc(100% - 40px));margin:0 auto 64px;}
.support-tabs{display:flex;gap:0;border-bottom:1px solid var(--cp-line);margin-bottom:28px;padding:0;}
.support-tab{padding:14px 0;margin-right:32px;border:0;background:none;cursor:pointer;color:var(--cp-sub);font-size:15px;font-weight:700;position:relative;transition:color 150ms ease;}
.support-tab:hover{color:var(--cp-espresso);}
.support-tab.support-tabActive{color:var(--cp-espresso);}
.support-tab.support-tabActive::after{content:"";position:absolute;bottom:-1px;left:0;right:0;height:3px;background:var(--cp-gold-dark);}
.support-tabContent{animation:fadeIn 180ms ease;}
@keyframes fadeIn{from{opacity:.8}to{opacity:1}}

.support-contentTitle{margin:0 0 16px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:28px;line-height:1.05;letter-spacing:-.02em;font-weight:600;}
.support-contentText{margin:0 0 18px;color:var(--cp-sub);font-size:16px;line-height:1.68;max-width:720px;}

.support-subsection{margin-top:32px;padding-top:32px;border-top:1px solid var(--cp-line);}
.support-subheading{margin:0 0 18px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:20px;line-height:1.1;letter-spacing:-.01em;font-weight:600;}
.support-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
.support-list li{display:flex;align-items:flex-start;gap:12px;color:var(--cp-sub);font-size:15.5px;line-height:1.55;}
.support-list svg{width:18px;height:18px;color:var(--cp-gold-dark);flex:0 0 auto;margin-top:2px;}

.support-pipeline{margin-top:28px;}
.support-saintsList{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;}
.support-saint{display:flex;align-items:flex-start;gap:16px;padding:14px 16px;border:1px solid rgba(74,43,22,.08);border-radius:14px;background:#fff;}
.support-saintOrder{flex:0 0 auto;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(200,148,58,.15);color:var(--cp-gold-dark);font-weight:800;font-size:13px;}
.support-saintInfo{flex:1;min-width:0;}
.support-saintName{display:block;color:var(--cp-espresso);font-size:15px;font-weight:700;line-height:1.3;}
.support-saintStatus{display:inline-block;margin-top:5px;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
.support-status-coming-soon{background:rgba(200,148,58,.2);color:var(--cp-gold-dark);}
.support-status-in-progress{background:rgba(79,143,184,.2);color:#3B5A7D;}
.support-status-research{background:rgba(123,94,167,.2);color:#5B4080;}

.support-sectionTitle{margin:0 0 8px;color:var(--cp-ink);font-family:Georgia,serif;font-size:32px;line-height:1.1;letter-spacing:-.02em;font-weight:600;}
.support-sectionDesc{margin:0 0 32px;color:var(--cp-sub);font-size:16.5px;line-height:1.6;max-width:640px;}

.support-tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:40px;}
.support-tier{padding:24px;border:1px solid rgba(200,148,58,.25);border-radius:18px;background:linear-gradient(135deg,rgba(200,148,58,.06),rgba(200,148,58,.03));display:flex;flex-direction:column;gap:16px;transition:transform 150ms ease,box-shadow 150ms ease;cursor:pointer;}
.support-tier:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(200,148,58,.15);border-color:rgba(200,148,58,.35);}
.support-tierAmount{color:var(--cp-espresso);font-family:Georgia,serif;font-size:28px;font-weight:600;line-height:1.1;}
.support-tierPeriod{display:block;font-size:14px;color:var(--cp-sub);font-family:var(--cp-ui),Inter;font-weight:500;margin-top:2px;}
.support-tierDesc{margin:0;color:var(--cp-sub);font-size:14px;line-height:1.5;}
.support-tierCta{margin-top:auto;padding:12px 16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(200,148,58,.3);border-radius:12px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);color:#2E1E10;font-size:14px;font-weight:800;text-decoration:none;transition:transform 150ms ease,box-shadow 150ms ease;}
.support-tierCta:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(168,116,37,.2);}
.support-tierCta svg{width:16px;height:16px;}

.support-paymentMethods{margin-top:32px;padding-top:32px;border-top:1px solid var(--cp-line);text-align:center;}
.support-paymentLabel{margin:0 0 16px;color:var(--cp-sub);font-size:14px;font-weight:650;}
.support-paymentButtons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.support-methodBtn{padding:12px 24px;border:1px solid rgba(74,43,22,.15);border-radius:12px;background:#fff;text-decoration:none;font-size:14px;font-weight:700;color:var(--cp-espresso);transition:background 150ms ease,border-color 150ms ease;}
.support-methodBtn:hover{background:rgba(200,148,58,.08);border-color:rgba(200,148,58,.35);}

.support-clarity{width:min(820px,calc(100% - 40px));margin:0 auto 64px;padding:24px 28px;border:1px solid rgba(200,148,58,.25);border-radius:20px;background:linear-gradient(135deg,rgba(200,148,58,.06),rgba(200,148,58,.03));display:flex;align-items:flex-start;gap:18px;}
.support-clarityIcon{flex:0 0 auto;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(200,148,58,.12);color:var(--cp-gold-dark);}
.support-clarityIcon svg{width:20px;height:20px;}
.support-clarityContent h4{margin:0 0 8px;color:var(--cp-espresso);font-size:16px;font-weight:800;}
.support-clarityContent p{margin:0;color:var(--cp-sub);font-size:14.5px;line-height:1.6;}
.support-clarityContent strong{color:var(--cp-espresso);font-weight:700;}

.support-sectionAsk{width:min(1080px,calc(100% - 40px));margin:0 auto 64px;padding:26px 30px;display:flex;align-items:center;gap:22px;border:1px solid rgba(200,148,58,.28);border-radius:24px;background:linear-gradient(135deg,#FFF9EC 0%,#FBF0D8 100%);box-shadow:0 24px 50px -32px rgba(74,43,22,.45);}
.support-askIcon{flex:0 0 auto;width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#fff;color:var(--cp-gold-dark);box-shadow:0 8px 18px -10px rgba(74,43,22,.4);}
.support-askIcon svg{width:26px;height:26px;}
.support-askText{flex:1;min-width:0;}
.support-askText h3{margin:0;color:var(--cp-espresso);font-family:Georgia,serif;font-size:24px;line-height:1.1;letter-spacing:-.01em;font-weight:600;}
.support-askText p{margin:6px 0 0;color:var(--cp-sub);font-size:15px;line-height:1.5;}
.support-askCta{flex:0 0 auto;padding:13px 22px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(168,116,37,.2);border-radius:13px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 24px rgba(168,116,37,.18);color:#2E1E10;text-decoration:none;font-size:14px;font-weight:800;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease;}
.support-askCta:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(168,116,37,.24);}
.support-askCta svg{width:16px;height:16px;}

.cp-foot{border-top:1px solid var(--cp-line);background:rgba(255,255,255,.55);}
.cp-footInner{width:min(760px,calc(100% - 40px));margin:0 auto;padding:38px 0 44px;text-align:center;}
.cp-footMark{color:var(--cp-gold);font-size:22px;}
.cp-footText{margin:8px 0 12px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:20px;font-weight:600;}
.cp-footFine{margin:0 0 6px;color:#8A7867;font-size:13px;line-height:1.55;}
.cp-footFine a{color:var(--cp-espresso);font-weight:650;text-decoration:none;}
.cp-footFine a:hover{text-decoration:underline;}

@media (max-width:940px){
  .support-hero{grid-template-columns:1fr;gap:32px;}
  .support-stats{gap:24px;}
  .support-section{width:calc(100% - 32px);}
  .support-tiers{grid-template-columns:repeat(2,1fr);}
  .support-sectionAsk{flex-direction:column;text-align:center;}
  .support-askCta{width:100%;}
}
@media (max-width:620px){
  .support-hero{width:calc(100% - 32px);margin:32px auto 44px;}
  .support-title{font-size:clamp(2.3rem,10vw,3.1rem);}
  .support-subtitle{font-size:clamp(1.4rem,7vw,2.2rem);}
  .support-section{width:calc(100% - 32px);margin:0 auto 44px;}
  .support-sectionTitle{font-size:24px;}
  .support-tabs{margin-bottom:20px;}
  .support-tab{margin-right:20px;padding:12px 0;font-size:14px;}
  .support-tiers{grid-template-columns:1fr;gap:14px;}
  .support-clarity{gap:14px;padding:18px;flex-direction:column;text-align:center;}
  .support-clarityIcon{width:40px;height:40px;}
  .support-saintsList{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){
  .support-tabContent,.support-tier,.support-tierCta,.support-askCta{transition:none;}
  .support-tier:hover{transform:none;}
}
`;
