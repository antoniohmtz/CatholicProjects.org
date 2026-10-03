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
  arrowDown: (<><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>),
  play: (<><polygon points="5 3 19 12 5 21 5 3" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  book: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /></>),
  spark: (<><path d="M13 2 L15.46 8.54 L22 10.46 L17.23 15.23 L18.46 22 L13 18.54 L7.54 22 L8.77 15.23 L4 10.46 L10.54 8.54 Z" /></>),
  heart: (<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>),
};

const UPCOMING_SAINTS = [
  { name: "St. Thérèse of Lisieux", status: "coming-soon" as const, desc: "The Little Way" },
  { name: "St. Francis of Assisi", status: "in-progress" as const, desc: "Mystic of Creation" },
  { name: "St. Joan of Arc", status: "research" as const, desc: "The Fearless Maid" },
  { name: "St. Benedict", status: "research" as const, desc: "Father of Western Monks" },
  { name: "St. Catherine of Siena", status: "research" as const, desc: "Mystic & Scholar" },
  { name: "St. Augustine", status: "research" as const, desc: "Doctor of Grace" },
];

const SUPPORT_TIERS = [
  {
    amount: "$5",
    period: "/month",
    title: "Believer",
    description: "Help us research and discover the saints",
    includes: ["Access to the supporter community", "Monthly behind-the-scenes update"]
  },
  {
    amount: "$15",
    period: "/month",
    title: "Advocate",
    description: "Fund production and bring stories to life",
    includes: ["Early access to new episodes", "Monthly production update", "Your name in credits (if you'd like)"]
  },
  {
    amount: "$25",
    period: "/month",
    title: "Champion",
    description: "Support narration, translation, and reach",
    includes: ["All Advocate benefits", "Exclusive quarterly call", "Vote on which saint comes next"]
  },
  {
    amount: "$50+",
    period: "/month",
    title: "Partner",
    description: "Build this mission together",
    includes: ["All Champion benefits", "Monthly one-on-one update", "Your name in series intro"]
  },
];

const TESTIMONIALS = [
  {
    quote: "These videos have reawakened my faith. Finally, stories told the way my kids actually watch—beautiful, reverent, and true.",
    author: "Maria, Texas",
  },
  {
    quote: "I use these in my catechism class every week. My students ask about the saints now instead of scrolling.",
    author: "Fr. Michael, California",
  },
  {
    quote: "My teenage daughter watched one and it sparked the deepest faith conversation we've had in years.",
    author: "James, Michigan",
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"mission" | "impact">("mission");

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
              <span aria-hidden="true">✝️</span> A Growing Movement
            </div>
            <h1 className="support-title">
              The saints<br />belong in every feed.
            </h1>
            <p className="support-desc">
              Catholic Saint Stories are reaching people where they actually are—on Instagram, TikTok, YouTube. Cinematic. Faithful. Designed for a generation that encounters faith in everyday feeds, not just sanctuaries.
            </p>
            <p className="support-desc support-descSmall">
              Every story takes weeks of research in trusted Catholic sources, professional production, narration in English and Spanish, and careful translation. That work costs money. Your support keeps it happening.
            </p>

            <div className="support-ctas">
              <a href="#support" className="support-cta">
                Support the Mission
                <Svg sw={2.2}>{UI.arrow}</Svg>
              </a>
              <button className="support-secondary" onClick={() => setActiveTab("impact")}>
                See the Impact
              </button>
            </div>

            <div className="support-lang">
              <span className="support-langItem">🇺🇸 English</span>
              <span className="support-langItem">🇪🇸 Español</span>
              <span className="support-langItem">New stories every week</span>
            </div>
          </div>

          <div className="support-stats">
            <div className="support-stat">
              <span className="support-statValue">14K</span>
              <span className="support-statLabel">Followers</span>
              <span className="support-statSub">Growing weekly</span>
            </div>
            <div className="support-stat">
              <span className="support-statValue">435K</span>
              <span className="support-statLabel">Monthly views</span>
              <span className="support-statSub">Real engagement</span>
            </div>
            <div className="support-stat">
              <span className="support-statValue">102</span>
              <span className="support-statLabel">Episodes</span>
              <span className="support-statSub">Since July 2026</span>
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
              aria-selected={activeTab === "impact"}
              onClick={() => setActiveTab("impact")}
              className={`support-tab ${activeTab === "impact" ? "support-tabActive" : ""}`}
            >
              What We're Building
            </button>
          </div>

          {activeTab === "mission" && (
            <div className="support-tabContent">
              <div className="support-statement">
                <div className="support-statementIcon"><Svg sw={1.8}>{UI.heart}</Svg></div>
                <div className="support-statementText">
                  <h3>Why This Work Matters</h3>
                  <p>
                    The lives of the saints—their sacrifice, their courage, their encounter with Christ—teach us what it means to truly follow. But most people never hear these stories. They're lost in a sea of other voices, other feeds, other narratives about what matters.
                  </p>
                  <p>
                    We make stories of the saints for the platforms where faith actually happens today. Not instead of the Church, but *alongside* it. Instagram, TikTok, YouTube—where young people, lapsed Catholics, and curious seekers actually spend their time. We meet them there with beauty, fidelity, and the witness of people who gave everything to Christ.
                  </p>
                </div>
              </div>

              <div className="support-subsection">
                <h4 className="support-subheading">Every Dollar Funds</h4>
                <div className="support-fundingGrid">
                  <div className="support-fundingItem">
                    <div className="support-fundingIcon">📚</div>
                    <div className="support-fundingText">
                      <strong>Research</strong>
                      <span>Deep dives into Tier 1 Catholic sources—everything from papal documents to hagiographies.</span>
                    </div>
                  </div>
                  <div className="support-fundingItem">
                    <div className="support-fundingIcon">🎬</div>
                    <div className="support-fundingText">
                      <strong>Production</strong>
                      <span>Professional cinematography, scriptwriting, editing. We don't cut corners on quality.</span>
                    </div>
                  </div>
                  <div className="support-fundingItem">
                    <div className="support-fundingIcon">🎙️</div>
                    <div className="support-fundingText">
                      <strong>Narration</strong>
                      <span>English and Spanish voiceovers that bring reverence and life to each story.</span>
                    </div>
                  </div>
                  <div className="support-fundingItem">
                    <div className="support-fundingIcon">🌐</div>
                    <div className="support-fundingText">
                      <strong>Translation & Distribution</strong>
                      <span>Captions, translations, and platform optimization so stories reach more hearts.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="support-pipeline">
                <h4 className="support-subheading">What's Coming</h4>
                <p className="support-pipelineDesc">The saints we're preparing stories about. This is just the beginning.</p>
                <div className="support-saintsList">
                  {UPCOMING_SAINTS.map((saint, i) => (
                    <div key={saint.name} className="support-saint">
                      <div className="support-saintNumber">{i + 1}</div>
                      <div className="support-saintInfo">
                        <span className="support-saintName">{saint.name}</span>
                        <span className="support-saintDesc">{saint.desc}</span>
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

          {activeTab === "impact" && (
            <div className="support-tabContent">
              <div className="support-impactStatement">
                <h3>What Supporters Are Telling Us</h3>
                <p>These are real messages from people your support reaches.</p>
              </div>

              <div className="support-testimonials">
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="support-testimonial">
                    <Svg className="support-testimonialIcon" sw={2}>{UI.spark}</Svg>
                    <p className="support-testimonialQuote">"{t.quote}"</p>
                    <span className="support-testimonialAuthor">— {t.author}</span>
                  </div>
                ))}
              </div>

              <div className="support-impactMetrics">
                <h4 className="support-subheading">The Work So Far</h4>
                <div className="support-metrics">
                  <div className="support-metric">
                    <span className="support-metricNumber">435K</span>
                    <span className="support-metricLabel">Views in 3 months</span>
                  </div>
                  <div className="support-metric">
                    <span className="support-metricNumber">14K</span>
                    <span className="support-metricLabel">People watching weekly</span>
                  </div>
                  <div className="support-metric">
                    <span className="support-metricNumber">6</span>
                    <span className="support-metricLabel">Videos above 30K views</span>
                  </div>
                  <div className="support-metric">
                    <span className="support-metricNumber">2</span>
                    <span className="support-metricLabel">Languages</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUPPORT TIERS */}
        <div className="support-section" id="support">
          <div className="support-tierHeader">
            <h3 className="support-sectionTitle">Join This Mission</h3>
            <p className="support-sectionDesc">
              Choose how you want to help. Every level makes a real difference.
            </p>
          </div>

          <div className="support-tiers">
            {SUPPORT_TIERS.map((tier, i) => (
              <div key={tier.amount} className={`support-tier ${i >= 2 ? "support-tierHighlight" : ""}`}>
                <div className="support-tierBadge">{tier.title}</div>
                <div className="support-tierAmount">
                  {tier.amount}
                  <span className="support-tierPeriod">{tier.period}</span>
                </div>
                <p className="support-tierDesc">{tier.description}</p>

                <div className="support-tierIncludes">
                  <span className="support-includesLabel">You get:</span>
                  <ul className="support-includesList">
                    {tier.includes.map((item) => (
                      <li key={item}>
                        <Svg sw={2}>{UI.check}</Svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href={STRIPE_LINK} className={`support-tierCta ${i >= 2 ? "support-tierCtaPrimary" : ""}`}>
                  Support at ${tier.amount.slice(1)}
                  <Svg sw={2.2}>{UI.arrow}</Svg>
                </a>
              </div>
            ))}
          </div>

          <div className="support-altOptions">
            <h4>Other ways to support</h4>
            <div className="support-altButtons">
              <a href={STRIPE_LINK} className="support-altBtn">
                One-time gift
              </a>
              <a href={PAYPAL_LINK} className="support-altBtn">
                PayPal
              </a>
              <a href={`mailto:${CONTACT}`} className="support-altBtn">
                Ask about other ways
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
            <h4>Transparency About Your Gift</h4>
            <p>
              <strong>Your support is not tax-deductible.</strong> You're funding a creator's work, not a charitable organization. CatholicProjects.org is not currently a tax-exempt nonprofit. That said, we handle every contribution with integrity, report it properly, and make sure every dollar reaches the mission it funds. No overhead, no middleman. Just the work.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="support-section support-sectionAsk">
          <span className="support-askIcon">
            <Svg sw={1.7}>{UI.mail}</Svg>
          </span>
          <div className="support-askText">
            <h3>Let's Talk</h3>
            <p>Questions about what you're funding? Want to understand the work better? We read every message.</p>
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
          <p className="cp-footText">Stories of the saints. For a new generation.</p>
          <p className="cp-footFine">
            Made with faith and precision. Learn more at <a href="https://catholicprojects.org">CatholicProjects.org</a> · <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}
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
.cp-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;height:1000px;background:radial-gradient(720px 430px at 80% 24%,rgba(200,148,58,.14),transparent 67%),radial-gradient(520px 300px at 7% 17%,rgba(200,148,58,.055),transparent 72%);}

.support-hero{width:min(1180px,calc(100% - 40px));margin:64px auto 72px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
.support-heroContent{position:relative;z-index:2;}
.support-eyebrow{width:fit-content;margin-bottom:18px;padding:8px 14px;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--cp-gold-line);border-radius:999px;background:rgba(255,255,255,.7);box-shadow:0 4px 16px rgba(74,43,22,.035);color:var(--cp-gold-dark);font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;}
.support-title{max-width:640px;margin:0 0 16px;color:var(--cp-ink);font-family:Georgia,"Times New Roman",serif;font-size:clamp(3rem,5.5vw,4.5rem);line-height:1.08;letter-spacing:-.04em;font-weight:600;}
.support-desc{max-width:560px;margin:0 0 20px;color:var(--cp-sub);font-size:clamp(1rem,1.4vw,1.125rem);line-height:1.7;font-weight:450;}
.support-descSmall{font-size:15px;color:var(--cp-sub);line-height:1.65;}

.support-ctas{margin:28px 0 24px;display:flex;align-items:center;flex-wrap:wrap;gap:12px;}
.support-cta{min-height:52px;padding:13px 22px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(168,116,37,.2);border-radius:13px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 24px rgba(168,116,37,.18);color:#2E1E10;text-decoration:none;font-size:16px;font-weight:800;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease;}
.support-cta:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(168,116,37,.24);}
.support-cta svg{width:18px;height:18px;}
.support-secondary{min-height:52px;padding:12px 18px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(74,43,22,.1);border-radius:13px;background:rgba(255,255,255,.64);color:var(--cp-espresso);font-size:15px;font-weight:700;cursor:pointer;transition:background 150ms ease,border-color 150ms ease;}
.support-secondary:hover{background:#fff;border-color:rgba(200,148,58,.25);}

.support-lang{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;}
.support-langItem{padding:6px 12px;border-radius:8px;background:rgba(200,148,58,.1);color:var(--cp-gold-dark);font-size:12px;font-weight:700;}

.support-stats{display:flex;flex-direction:column;gap:24px;}
.support-stat{display:flex;flex-direction:column;}
.support-statValue{display:block;color:var(--cp-espresso);font-size:32px;font-weight:900;letter-spacing:-.01em;}
.support-statLabel{display:block;margin-top:4px;color:var(--cp-sub);font-size:13px;font-weight:650;}
.support-statSub{display:block;margin-top:2px;font-size:12px;color:#9B8F83;font-weight:500;}

.support-section{width:min(1180px,calc(100% - 40px));margin:0 auto 64px;}
.support-tabs{display:flex;gap:0;border-bottom:1px solid var(--cp-line);margin-bottom:32px;padding:0;}
.support-tab{padding:14px 0;margin-right:40px;border:0;background:none;cursor:pointer;color:var(--cp-sub);font-size:15px;font-weight:700;position:relative;transition:color 150ms ease;}
.support-tab:hover{color:var(--cp-espresso);}
.support-tab.support-tabActive{color:var(--cp-espresso);}
.support-tab.support-tabActive::after{content:"";position:absolute;bottom:-1px;left:0;right:0;height:3px;background:var(--cp-gold-dark);}
.support-tabContent{animation:fadeIn 200ms ease;}
@keyframes fadeIn{from{opacity:.6}to{opacity:1}}

.support-statement{display:flex;gap:20px;padding:28px;border:1px solid rgba(200,148,58,.18);border-radius:20px;background:linear-gradient(135deg,rgba(200,148,58,.04),rgba(200,148,58,.02));}
.support-statementIcon{flex:0 0 auto;width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(200,148,58,.15);color:var(--cp-gold-dark);}
.support-statementIcon svg{width:24px;height:24px;}
.support-statementText h3{margin:0 0 12px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:24px;font-weight:600;}
.support-statementText p{margin:0 0 12px;color:var(--cp-sub);font-size:15.5px;line-height:1.7;}
.support-statementText p:last-child{margin-bottom:0;}

.support-subsection{margin-top:40px;padding-top:40px;border-top:1px solid var(--cp-line);}
.support-subheading{margin:0 0 20px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:22px;line-height:1.1;letter-spacing:-.01em;font-weight:600;}

.support-fundingGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;}
.support-fundingItem{padding:20px;border:1px solid rgba(74,43,22,.08);border-radius:16px;background:#fff;display:flex;gap:14px;}
.support-fundingIcon{flex:0 0 auto;font-size:28px;}
.support-fundingText{flex:1;}
.support-fundingText strong{display:block;color:var(--cp-espresso);font-size:15px;font-weight:800;margin-bottom:6px;}
.support-fundingText span{display:block;color:var(--cp-sub);font-size:14px;line-height:1.55;}

.support-pipeline{margin-top:36px;}
.support-pipelineDesc{color:var(--cp-sub);font-size:15px;margin:0 0 18px;}
.support-saintsList{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;margin-top:16px;}
.support-saint{display:flex;align-items:center;gap:16px;padding:18px 18px;border:1px solid rgba(74,43,22,.08);border-radius:16px;background:#fff;transition:background 150ms ease,border-color 150ms ease;}
.support-saint:hover{background:rgba(200,148,58,.02);border-color:rgba(200,148,58,.15);}
.support-saintNumber{flex:0 0 auto;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(200,148,58,.15);color:var(--cp-gold-dark);font-weight:900;font-size:14px;}
.support-saintInfo{flex:1;min-width:0;}
.support-saintName{display:block;color:var(--cp-espresso);font-size:15px;font-weight:700;line-height:1.3;}
.support-saintDesc{display:block;font-size:13px;color:var(--cp-gold-dark);font-weight:600;margin:3px 0 6px;}
.support-saintStatus{display:inline-block;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
.support-status-coming-soon{background:rgba(200,148,58,.2);color:var(--cp-gold-dark);}
.support-status-in-progress{background:rgba(79,143,184,.2);color:#3B5A7D;}
.support-status-research{background:rgba(123,94,167,.2);color:#5B4080;}

.support-impactStatement{margin-bottom:28px;}
.support-impactStatement h3{margin:0 0 8px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:28px;font-weight:600;}
.support-impactStatement p{margin:0;color:var(--cp-sub);font-size:15px;}

.support-testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-bottom:40px;}
.support-testimonial{padding:24px;border:1px solid rgba(200,148,58,.2);border-radius:18px;background:linear-gradient(135deg,rgba(200,148,58,.06),rgba(200,148,58,.02));position:relative;}
.support-testimonialIcon{color:var(--cp-gold);margin-bottom:12px;opacity:.7;}
.support-testimonialQuote{margin:0 0 12px;color:var(--cp-ink);font-size:15.5px;line-height:1.7;font-style:italic;}
.support-testimonialAuthor{display:block;color:var(--cp-gold-dark);font-size:13px;font-weight:700;}

.support-impactMetrics{margin-top:32px;padding-top:32px;border-top:1px solid var(--cp-line);}
.support-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;}
.support-metric{padding:18px;text-align:center;border:1px solid rgba(74,43,22,.08);border-radius:14px;background:#fff;}
.support-metricNumber{display:block;color:var(--cp-espresso);font-size:28px;font-weight:900;margin-bottom:4px;}
.support-metricLabel{display:block;color:var(--cp-sub);font-size:13px;font-weight:650;}

.support-tierHeader{margin-bottom:36px;}
.support-sectionTitle{margin:0 0 12px;color:var(--cp-ink);font-family:Georgia,serif;font-size:36px;line-height:1.1;letter-spacing:-.02em;font-weight:600;}
.support-sectionDesc{margin:0;color:var(--cp-sub);font-size:17px;line-height:1.6;max-width:680px;}

.support-tiers{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-bottom:44px;}
.support-tier{padding:26px;border:1px solid rgba(200,148,58,.2);border-radius:18px;background:linear-gradient(135deg,rgba(200,148,58,.04),rgba(200,148,58,.01));display:flex;flex-direction:column;gap:16px;transition:transform 150ms ease,box-shadow 150ms ease,border-color 150ms ease;}
.support-tier:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.35);box-shadow:0 12px 32px rgba(200,148,58,.12);}
.support-tierHighlight{border-color:rgba(200,148,58,.4);background:linear-gradient(135deg,rgba(200,148,58,.08),rgba(200,148,58,.04));box-shadow:0 8px 24px rgba(200,148,58,.08);}
.support-tierBadge{display:inline-flex;align-items:center;justify-content:center;width:fit-content;padding:6px 12px;border-radius:8px;background:rgba(200,148,58,.15);color:var(--cp-gold-dark);font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;}
.support-tierAmount{color:var(--cp-espresso);font-family:Georgia,serif;font-size:32px;font-weight:600;line-height:1;}
.support-tierPeriod{display:block;font-size:14px;color:var(--cp-sub);font-family:var(--cp-ui),Inter;font-weight:500;margin-top:2px;}
.support-tierDesc{margin:0;color:var(--cp-sub);font-size:15px;line-height:1.55;}
.support-tierIncludes{padding:16px 0;border-top:1px solid rgba(74,43,22,.08);border-bottom:1px solid rgba(74,43,22,.08);}
.support-includesLabel{display:block;color:var(--cp-espresso);font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;margin-bottom:10px;}
.support-includesList{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;}
.support-includesList li{display:flex;align-items:flex-start;gap:8px;color:var(--cp-sub);font-size:14px;line-height:1.5;}
.support-includesList svg{width:16px;height:16px;color:var(--cp-gold-dark);flex:0 0 auto;margin-top:2px;}

.support-tierCta{margin-top:auto;padding:12px 16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(200,148,58,.3);border-radius:12px;background:linear-gradient(135deg,rgba(200,148,58,.08),rgba(200,148,58,.04));color:var(--cp-espresso);font-size:14px;font-weight:800;text-decoration:none;transition:transform 150ms ease,box-shadow 150ms ease,background 150ms ease;}
.support-tierCta:hover{transform:translateY(-1px);background:linear-gradient(135deg,rgba(200,148,58,.15),rgba(200,148,58,.08));}
.support-tierCtaPrimary{background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);color:#2E1E10;border:none;box-shadow:0 4px 12px rgba(168,116,37,.15);}
.support-tierCtaPrimary:hover{box-shadow:0 6px 16px rgba(168,116,37,.2);}
.support-tierCta svg{width:16px;height:16px;}

.support-altOptions{margin-top:28px;padding-top:28px;border-top:1px solid var(--cp-line);text-align:center;}
.support-altOptions h4{margin:0 0 14px;color:var(--cp-sub);font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
.support-altButtons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.support-altBtn{padding:10px 16px;border:1px solid rgba(74,43,22,.15);border-radius:10px;background:#fff;text-decoration:none;font-size:13px;font-weight:700;color:var(--cp-espresso);transition:background 150ms ease,border-color 150ms ease;}
.support-altBtn:hover{background:rgba(200,148,58,.08);border-color:rgba(200,148,58,.35);}

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
.support-askText h3{margin:0;color:var(--cp-espresso);font-family:Georgia,serif;font-size:24px;line-height:1.1;font-weight:600;}
.support-askText p{margin:6px 0 0;color:var(--cp-sub);font-size:15px;line-height:1.5;}
.support-askCta{flex:0 0 auto;padding:13px 22px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(168,116,37,.2);border-radius:13px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 24px rgba(168,116,37,.18);color:#2E1E10;text-decoration:none;font-size:14px;font-weight:800;transition:transform 160ms ease,box-shadow 160ms ease;}
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
  .support-hero{grid-template-columns:1fr;gap:36px;}
  .support-stats{flex-direction:row;gap:20px;flex-wrap:wrap;}
  .support-section{width:calc(100% - 32px);}
  .support-tiers{grid-template-columns:repeat(2,1fr);gap:14px;}
  .support-sectionAsk{flex-direction:column;text-align:center;}
  .support-askCta{width:100%;}
  .support-statement{flex-direction:column;text-align:center;}
  .support-statementIcon{margin:0 auto;}
}
@media (max-width:620px){
  .support-hero{width:calc(100% - 32px);margin:40px auto 52px;}
  .support-title{font-size:clamp(2.5rem,10vw,3.2rem);}
  .support-desc{font-size:15px;margin:0 0 14px;}
  .support-ctas{flex-direction:column;gap:10px;width:100%;}
  .support-cta,.support-secondary{width:100%;}
  .support-section{width:calc(100% - 32px);margin:0 auto 52px;}
  .support-sectionTitle{font-size:28px;}
  .support-tabs{margin-bottom:20px;}
  .support-tab{margin-right:20px;padding:12px 0;font-size:14px;}
  .support-fundingGrid{grid-template-columns:1fr;}
  .support-tiers{grid-template-columns:1fr;gap:12px;}
  .support-testimonials{grid-template-columns:1fr;}
  .support-metrics{grid-template-columns:repeat(2,1fr);}
  .support-clarity{gap:14px;padding:18px;flex-direction:column;text-align:center;}
  .support-clarityIcon{width:40px;height:40px;}
  .support-saintsList{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){
  .support-tabContent,.support-tier,.support-tierCta,.support-askCta{transition:none;}
  .support-tier:hover{transform:none;}
}
`;
