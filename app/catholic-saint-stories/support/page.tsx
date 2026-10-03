"use client";

import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cst-ui", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--cst-serif",
  display: "swap",
});

/* -----------------------------------------------------------
   Catholic Saint Stories — Support
   Cinematic dark theme drawn from the brand itself:
   gold on near-black, serif display, film grain, vignette.

   REAL SAINTS. TRUE STORIES. ETERNAL INSPIRATION.

   This page is intentionally self-contained (no SiteNav):
   it is a film-series landing page, not a library page.
------------------------------------------------------------ */

const CONTACT = "team@catholicprojects.org";
const STRIPE_LINK = "https://buy.stripe.com/your-stripe-link"; // TODO: real link
const PAYPAL_LINK = "https://paypal.me/catholicsaintstories"; // TODO: real link
const FACEBOOK_URL = "https://www.facebook.com/people/Catholicsaintstories/61592672761916/";
const INSTAGRAM_URL = "https://instagram.com/catholicsaintstories";

/* Real films, real links, real numbers. Drop film stills into
   /public/saint-stories/ (e.g. damian.jpg) — the gradient
   poster underneath remains as the fallback until you do. */
const FILMS = [
  {
    title: "San Damián de Molokai",
    lang: "Español",
    logline:
      "Eligió vivir con los enviados lejos por la lepra — sabiendo que quizá nunca volvería.",
    proof: "56K+ views across platforms",
    href: "https://www.facebook.com/reel/2563206477478130",
    still: "/saint-stories/damian.jpg",
    hue: "160deg",
  },
  {
    title: "Saint Vincent de Paul",
    lang: "English",
    logline:
      "He wanted to rise above poverty — then God led him back to the poor.",
    proof: "3.5K reactions · 600+ shares",
    href: "https://www.facebook.com/reel/958525383998552",
    still: "/saint-stories/vincent.jpg",
    hue: "20deg",
  },
  {
    title: "The Sacred Heart",
    lang: "Español",
    logline:
      "Jesús le mostró Su Corazón ardiendo de amor — y le confió una misión para toda la Iglesia.",
    proof: "3.6K reactions · 400+ shares",
    href: FACEBOOK_URL,
    still: "/saint-stories/sacred-heart.jpg",
    hue: "320deg",
  },
];

const SLATE = [
  { name: "St. Thérèse of Lisieux", epithet: "The Little Way", status: "Coming soon" },
  { name: "St. Francis of Assisi", epithet: "The Poverello", status: "In production" },
  { name: "St. Joan of Arc", epithet: "The Maid of Orléans", status: "In research" },
  { name: "St. Benedict", epithet: "Father of Western Monasticism", status: "In research" },
  { name: "St. Catherine of Siena", epithet: "Mystic & Doctor of the Church", status: "In research" },
  { name: "St. Augustine", epithet: "Doctor of Grace", status: "In research" },
];

const LEDGER = [
  {
    n: "01",
    title: "Research",
    text: "Every story begins in trusted Catholic sources — hagiographies, letters, papal writings — so the saints are portrayed faithfully.",
  },
  {
    n: "02",
    title: "Script & Production",
    text: "Cinematic visuals, careful writing, and editing worthy of the lives being told. We don't cut corners on beauty.",
  },
  {
    n: "03",
    title: "Narration",
    text: "Voice performances in English and Spanish that carry reverence, not noise.",
  },
  {
    n: "04",
    title: "Translation & Captions",
    text: "Every story crosses languages — subtitled, translated, and accessible.",
  },
  {
    n: "05",
    title: "Distribution",
    text: "Published where people actually are: Instagram, Facebook, TikTok, YouTube — in everyday feeds, pointing hearts toward Christ.",
  },
];

const TIERS = [
  { amount: 5, name: "Friend", line: "Keeps the research going." },
  { amount: 15, name: "Patron", line: "Helps carry a story through production.", featured: true },
  { amount: 25, name: "Benefactor", line: "Funds narration and translation — both languages." },
  { amount: 50, name: "Founding Patron", line: "Sustains the whole slate, month after month." },
];

function Svg({ children, sw = 1.6, className }: { children: ReactNode; sw?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const I = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  play: (<><polygon points="6 4 20 12 6 20 6 4" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
};

export default function SupportPage() {
  return (
    <div className={`cst ${ui.variable} ${serif.variable}`}>
      <style>{CSS}</style>
      <div className="cst-grain" aria-hidden="true" />

      {/* ───────── top bar ───────── */}
      <header className="cst-bar">
        <a className="cst-mark" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          <span className="cst-markCross" aria-hidden="true">✠</span>
          <span className="cst-markText">Catholic Saint Stories</span>
        </a>
        <nav className="cst-barNav">
          <a className="cst-barLink" href="https://catholicprojects.org">CatholicProjects.org</a>
          <a className="cst-barCta" href="#support">Support</a>
        </nav>
      </header>

      <main>
        {/* ───────── hero ───────── */}
        <section className="cst-hero">
          <div className="cst-heroGlow" aria-hidden="true" />
          <p className="cst-kicker">Real saints · True stories · Eternal inspiration</p>
          <h1 className="cst-h1">
            Stories of the Saints.
            <em>Made for a new generation.</em>
          </h1>
          <p className="cst-heroSub">
            Cinematic films about the men and women who gave everything to Christ —
            released free, every week, in English and Spanish, on the feeds where
            this generation actually lives.
          </p>
          <div className="cst-heroCtas">
            <a className="cst-cta" href="#support">
              Help bring the next story to life
              <Svg sw={2}>{I.arrow}</Svg>
            </a>
            <a className="cst-ghost" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
              <Svg sw={2} className="cst-ghostPlay">{I.play}</Svg>
              Watch the stories
            </a>
          </div>

          <dl className="cst-band">
            <div><dt>435K</dt><dd>monthly views</dd></div>
            <div><dt>14K</dt><dd>followers</dd></div>
            <div><dt>102</dt><dd>stories released</dd></div>
            <div><dt>EN · ES</dt><dd>two languages</dd></div>
          </dl>
        </section>

        {/* ───────── now showing ───────── */}
        <section className="cst-section">
          <div className="cst-head">
            <p className="cst-eyebrow">Now showing</p>
            <h2 className="cst-h2">Stories people can't stop sharing</h2>
            <p className="cst-lede">
              Every film is free to watch. These are the ones traveling furthest right now.
            </p>
          </div>

          <div className="cst-films">
            {FILMS.map((f) => (
              <a key={f.title} className="cst-film" href={f.href} target="_blank" rel="noopener noreferrer" style={{ "--hue": f.hue } as React.CSSProperties}>
                <span
                  className="cst-poster"
                  style={{ backgroundImage: `linear-gradient(170deg, rgba(13,10,7,0) 38%, rgba(13,10,7,.92) 86%), url(${f.still})` }}
                >
                  <span className="cst-posterCross" aria-hidden="true">✠</span>
                  <span className="cst-lang">{f.lang}</span>
                  <span className="cst-playBtn" aria-hidden="true"><Svg sw={1.8}>{I.play}</Svg></span>
                </span>
                <span className="cst-filmBody">
                  <span className="cst-filmTitle">{f.title}</span>
                  <span className="cst-filmLogline">{f.logline}</span>
                  <span className="cst-filmFoot">
                    <span className="cst-filmProof">{f.proof}</span>
                    <span className="cst-filmWatch">Watch <Svg sw={2.2}>{I.arrow}</Svg></span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          <p className="cst-seeAll">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">All 102 stories, free, on Instagram & Facebook →</a>
          </p>
        </section>

        {/* ───────── quote ───────── */}
        <figure className="cst-quote">
          <blockquote>
            “I make myself a leper with the lepers, to gain all to Jesus&nbsp;Christ.”
          </blockquote>
          <figcaption>— St. Damien of Molokai</figcaption>
        </figure>

        {/* ───────── mission ───────── */}
        <section className="cst-section cst-mission">
          <div className="cst-head">
            <p className="cst-eyebrow">The mission</p>
            <h2 className="cst-h2">The saints belong in every feed</h2>
          </div>
          <div className="cst-missionCols">
            <p>
              The lives of the saints — their courage, their sacrifice, their encounter
              with Christ — are the greatest stories the Church has. But most people
              will never open a hagiography. They're on Instagram at midnight. They're
              scrolling TikTok on the bus.
            </p>
            <p>
              So we bring the saints there. Not instead of the Church — <em>toward</em> it.
              Every film is researched in trusted Catholic sources, told with reverence,
              and released free, so that a lapsed Catholic, a curious seeker, or a kid
              who has never heard of Molokai might stop scrolling — and meet a saint.
            </p>
          </div>
        </section>

        {/* ───────── ledger ───────── */}
        <section className="cst-section">
          <div className="cst-head">
            <p className="cst-eyebrow">Where every dollar goes</p>
            <h2 className="cst-h2">What your support pays for</h2>
            <p className="cst-lede">
              Each story costs real money to make — roughly $500–700 of production every
              month. Support goes to the work. No overhead, no middlemen.
            </p>
          </div>
          <ol className="cst-ledger">
            {LEDGER.map((row) => (
              <li key={row.n} className="cst-row">
                <span className="cst-rowN">{row.n}</span>
                <span className="cst-rowTitle">{row.title}</span>
                <span className="cst-rowText">{row.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ───────── slate ───────── */}
        <section className="cst-section">
          <div className="cst-head">
            <p className="cst-eyebrow">On the slate</p>
            <h2 className="cst-h2">The stories we're preparing</h2>
            <p className="cst-lede">Six saints in the pipeline. Your support decides how fast they arrive.</p>
          </div>
          <ul className="cst-slate">
            {SLATE.map((s, idx) => (
              <li key={s.name} className="cst-saint">
                <span className="cst-saintN">{String(idx + 1).padStart(2, "0")}</span>
                <span className="cst-saintBody">
                  <span className="cst-saintName">{s.name}</span>
                  <span className="cst-saintEpithet">{s.epithet}</span>
                </span>
                <span className={`cst-status ${s.status === "In production" ? "is-active" : s.status === "Coming soon" ? "is-next" : ""}`}>
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── support ───────── */}
        <section className="cst-section cst-support" id="support">
          <div className="cst-head cst-headCenter">
            <p className="cst-eyebrow">Become a patron</p>
            <h2 className="cst-h2">Help bring the next saint story to life</h2>
            <p className="cst-lede">
              If these films have moved you, you can help make the next one. Monthly
              support is what lets this work continue — about forty patrons covers an
              entire month of production.
            </p>
          </div>

          <div className="cst-tiers">
            {TIERS.map((t) => (
              <a
                key={t.amount}
                className={`cst-tier ${t.featured ? "is-featured" : ""}`}
                href={STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.featured && <span className="cst-tierFlag">Most common</span>}
                <span className="cst-tierName">{t.name}</span>
                <span className="cst-tierAmt">
                  <sup>$</sup>{t.amount}
                  <span className="cst-tierPer">/mo{t.amount === 50 ? "+" : ""}</span>
                </span>
                <span className="cst-tierLine">{t.line}</span>
                <span className="cst-tierGo">Support <Svg sw={2.2}>{I.arrow}</Svg></span>
              </a>
            ))}
          </div>

          <p className="cst-noPerks">
            Support is a voluntary gift to the creator of this work. It earns our deep
            gratitude and our prayers — but no rewards, ownership, or exclusive access.
            The films themselves remain free, for everyone, always.
          </p>

          <div className="cst-alt">
            <a className="cst-altBtn" href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">Give once</a>
            <a className="cst-altBtn" href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">PayPal</a>
            <a className="cst-altBtn" href={`mailto:${CONTACT}`}>Questions? Write to us</a>
          </div>

          <div className="cst-fine">
            <h3>Transparency about your gift</h3>
            <p>
              CatholicProjects is not a tax-exempt charitable organization, and
              contributions are <strong>not tax-deductible</strong>. Your support is
              voluntary creator support — it is received as ordinary income, reported
              properly, and spent on the work described above. No contribution funds a
              specific film, and no outcome is promised beyond this: more stories of
              the saints, made well, released free.
            </p>
          </div>
        </section>
      </main>

      {/* ───────── footer ───────── */}
      <footer className="cst-foot">
        <span className="cst-footCross" aria-hidden="true">✠</span>
        <p className="cst-footLine">Ad maiorem Dei gloriam.</p>
        <p className="cst-footMeta">
          A project of <a href="https://catholicprojects.org">CatholicProjects.org</a> ·{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}
        </p>
        <p className="cst-footFine">
          CatholicProjects is an independent Catholic project and does not imply parish,
          diocesan, or ecclesial endorsement unless specifically stated.
        </p>
      </footer>
    </div>
  );
}

/* -----------------------------------------------------------
   Styles — scoped under .cst
------------------------------------------------------------ */

const CSS = `
.cst{
  --bg:#0D0A07;
  --bg2:#15100A;
  --panel:#1A140C;
  --panel2:#201810;
  --gold:#C9A356;
  --gold-bright:#E3C57E;
  --gold-dim:rgba(201,163,86,.38);
  --hairline:rgba(201,163,86,.18);
  --hairline-soft:rgba(243,234,218,.08);
  --text:#F3EADA;
  --muted:#B5A58E;
  --faint:#8A7B64;
  --serif:var(--cst-serif),Cormorant Garamond,Georgia,"Times New Roman",serif;
  --sans:var(--cst-ui),Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:clip;
  background:var(--bg);color:var(--text);
  font-family:var(--sans);font-size:16px;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
}
.cst,.cst *,.cst *::before,.cst *::after{box-sizing:border-box;}
.cst :where(a){color:inherit;text-decoration:none;}
.cst a:focus-visible,.cst button:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px;}
.cst ::selection{background:rgba(201,163,86,.3);}

/* film grain */
.cst-grain{position:fixed;inset:0;z-index:40;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");}

/* ───── top bar ───── */
.cst-bar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding:14px clamp(20px,4vw,44px);border-bottom:1px solid var(--hairline-soft);
  background:rgba(13,10,7,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
.cst-mark{display:inline-flex;align-items:center;gap:10px;}
.cst-markCross{color:var(--gold);font-size:17px;}
.cst-markText{font-family:var(--serif);font-weight:600;font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:var(--text);}
.cst-barNav{display:flex;align-items:center;gap:22px;}
.cst-barLink{color:var(--muted);font-size:13px;font-weight:600;letter-spacing:.02em;transition:color 150ms ease;}
.cst-barLink:hover{color:var(--text);}
.cst-barCta{padding:9px 18px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;transition:background 160ms ease,border-color 160ms ease,color 160ms ease;}
.cst-barCta:hover{background:var(--gold);border-color:var(--gold);color:#17110A;}

/* ───── hero ───── */
.cst-hero{position:relative;max-width:980px;margin:0 auto;padding:clamp(84px,12vh,150px) 20px 72px;text-align:center;}
.cst-heroGlow{position:absolute;inset:-40% -30% auto;height:150%;z-index:-1;pointer-events:none;
  background:
    radial-gradient(52% 44% at 50% 30%, rgba(201,163,86,.17), transparent 70%),
    radial-gradient(30% 26% at 50% 16%, rgba(227,197,126,.12), transparent 70%);}
.cst-kicker{margin:0 0 26px;color:var(--gold);font-size:12px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;}
.cst-h1{margin:0 auto 24px;max-width:17ch;font-family:var(--serif);font-weight:600;color:var(--text);
  font-size:clamp(2.9rem,7.2vw,5.4rem);line-height:1.04;letter-spacing:-.015em;}
.cst-h1 em{display:block;margin-top:10px;font-style:italic;font-weight:500;font-size:.58em;letter-spacing:0;
  background:linear-gradient(100deg,var(--gold) 10%,var(--gold-bright) 45%,var(--gold) 90%);
  -webkit-background-clip:text;background-clip:text;color:transparent;}
.cst-heroSub{margin:0 auto;max-width:56ch;color:var(--muted);font-size:clamp(1rem,1.5vw,1.14rem);line-height:1.75;}
.cst-heroCtas{margin:38px auto 0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:14px;}
.cst-cta{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 26px;border-radius:999px;
  background:linear-gradient(135deg,#E3C57E 0%,#C9A356 55%,#A8823C 100%);color:#17110A;
  font-size:15px;font-weight:800;letter-spacing:.01em;box-shadow:0 10px 36px -10px rgba(201,163,86,.5);
  transition:transform 160ms ease,box-shadow 160ms ease;}
.cst-cta:hover{transform:translateY(-2px);box-shadow:0 16px 44px -10px rgba(201,163,86,.62);}
.cst-cta svg{width:17px;height:17px;}
.cst-ghost{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 24px;border:1px solid var(--hairline);border-radius:999px;
  color:var(--text);font-size:15px;font-weight:700;transition:border-color 160ms ease,background 160ms ease;}
.cst-ghost:hover{border-color:var(--gold-dim);background:rgba(201,163,86,.07);}
.cst-ghostPlay{width:15px;height:15px;color:var(--gold-bright);}

.cst-band{margin:64px auto 0;max-width:760px;display:grid;grid-template-columns:repeat(4,1fr);
  border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);}
.cst-band>div{padding:22px 10px;display:flex;flex-direction:column;gap:5px;}
.cst-band>div+div{border-left:1px solid var(--hairline-soft);}
.cst-band dt{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(1.5rem,2.6vw,2rem);color:var(--gold-bright);line-height:1;}
.cst-band dd{margin:0;color:var(--faint);font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;}

/* ───── sections ───── */
.cst-section{width:min(1120px,calc(100% - 40px));margin:0 auto;padding:clamp(56px,9vh,104px) 0 0;}
.cst-head{max-width:640px;margin-bottom:clamp(32px,5vh,48px);}
.cst-headCenter{margin-left:auto;margin-right:auto;text-align:center;}
.cst-eyebrow{margin:0 0 14px;color:var(--gold);font-size:11.5px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;}
.cst-h2{margin:0;font-family:var(--serif);font-weight:600;color:var(--text);font-size:clamp(2rem,4vw,3rem);line-height:1.1;letter-spacing:-.01em;}
.cst-lede{margin:16px 0 0;color:var(--muted);font-size:16px;line-height:1.7;}

/* ───── films ───── */
.cst-films{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.cst-film{display:flex;flex-direction:column;border:1px solid var(--hairline-soft);border-radius:18px;overflow:hidden;background:var(--panel);
  transition:transform 200ms ease,border-color 200ms ease,box-shadow 200ms ease;}
.cst-film:hover{transform:translateY(-5px);border-color:var(--gold-dim);box-shadow:0 30px 60px -30px rgba(0,0,0,.9),0 0 0 1px rgba(201,163,86,.08);}
.cst-poster{position:relative;display:block;aspect-ratio:4/5;background-size:cover;background-position:center 20%;
  background-color:var(--panel2);}
.cst-poster::before{content:"";position:absolute;inset:0;z-index:0;
  background:
    radial-gradient(90% 70% at 50% 24%, hsl(var(--hue,40deg) 28% 24% / .55), transparent 72%),
    radial-gradient(120% 90% at 50% 110%, rgba(13,10,7,.95), transparent 60%);}
.cst-posterCross{position:absolute;top:50%;left:50%;transform:translate(-50%,-62%);z-index:0;
  font-family:var(--serif);font-size:72px;color:rgba(201,163,86,.2);}
.cst-lang{position:absolute;top:14px;left:14px;z-index:2;padding:5px 11px;border:1px solid rgba(227,197,126,.4);border-radius:999px;
  background:rgba(13,10,7,.55);backdrop-filter:blur(6px);color:var(--gold-bright);font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;}
.cst-playBtn{position:absolute;right:16px;bottom:16px;z-index:2;width:46px;height:46px;display:flex;align-items:center;justify-content:center;
  border:1px solid rgba(227,197,126,.5);border-radius:50%;background:rgba(13,10,7,.6);backdrop-filter:blur(6px);color:var(--gold-bright);
  transition:background 180ms ease,color 180ms ease,transform 180ms ease;}
.cst-playBtn svg{width:16px;height:16px;margin-left:2px;}
.cst-film:hover .cst-playBtn{background:var(--gold);color:#17110A;transform:scale(1.06);}
.cst-filmBody{display:flex;flex-direction:column;flex:1;padding:20px 20px 18px;}
.cst-filmTitle{font-family:var(--serif);font-weight:600;font-size:24px;line-height:1.15;color:var(--text);}
.cst-filmLogline{margin-top:9px;color:var(--muted);font-size:14px;line-height:1.6;font-style:italic;font-family:var(--serif);font-size:16.5px;}
.cst-filmFoot{margin-top:auto;padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--hairline-soft);margin-top:18px;}
.cst-filmProof{color:var(--faint);font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
.cst-filmWatch{display:inline-flex;align-items:center;gap:6px;color:var(--gold-bright);font-size:13px;font-weight:700;}
.cst-filmWatch svg{width:14px;height:14px;transition:transform 160ms ease;}
.cst-film:hover .cst-filmWatch svg{transform:translateX(3px);}
.cst-seeAll{margin:26px 0 0;text-align:center;}
.cst-seeAll a{color:var(--muted);font-size:14px;font-weight:600;border-bottom:1px solid var(--hairline);padding-bottom:3px;transition:color 150ms ease,border-color 150ms ease;}
.cst-seeAll a:hover{color:var(--gold-bright);border-color:var(--gold-dim);}

/* ───── quote ───── */
.cst-quote{width:min(820px,calc(100% - 40px));margin:clamp(72px,11vh,120px) auto 0;text-align:center;}
.cst-quote blockquote{margin:0;font-family:var(--serif);font-style:italic;font-weight:500;color:var(--gold-bright);
  font-size:clamp(1.6rem,3.4vw,2.5rem);line-height:1.35;}
.cst-quote figcaption{margin-top:18px;color:var(--faint);font-size:12px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;}
.cst-quote::before{content:"";display:block;width:52px;height:1px;margin:0 auto 34px;background:var(--gold-dim);}
.cst-quote::after{content:"";display:block;width:52px;height:1px;margin:34px auto 0;background:var(--gold-dim);}

/* ───── mission ───── */
.cst-missionCols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,56px);}
.cst-missionCols p{margin:0;color:var(--muted);font-size:16.5px;line-height:1.85;}
.cst-missionCols em{color:var(--text);font-style:italic;}
.cst-missionCols p::first-letter{color:var(--gold-bright);}

/* ───── ledger ───── */
.cst-ledger{margin:0;padding:0;list-style:none;border-top:1px solid var(--hairline);}
.cst-row{display:grid;grid-template-columns:72px 240px 1fr;gap:20px;align-items:baseline;
  padding:26px 6px;border-bottom:1px solid var(--hairline-soft);transition:background 160ms ease;}
.cst-row:hover{background:rgba(201,163,86,.03);}
.cst-rowN{font-family:var(--serif);font-size:15px;color:var(--gold);letter-spacing:.1em;}
.cst-rowTitle{font-family:var(--serif);font-weight:600;font-size:23px;color:var(--text);}
.cst-rowText{color:var(--muted);font-size:14.5px;line-height:1.7;max-width:56ch;}

/* ───── slate ───── */
.cst-slate{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 clamp(28px,5vw,72px);border-top:1px solid var(--hairline);}
.cst-saint{display:flex;align-items:center;gap:18px;padding:20px 6px;border-bottom:1px solid var(--hairline-soft);}
.cst-saintN{font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.08em;}
.cst-saintBody{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cst-saintName{font-family:var(--serif);font-weight:600;font-size:19px;color:var(--text);line-height:1.2;}
.cst-saintEpithet{color:var(--faint);font-size:12.5px;font-style:italic;font-family:var(--serif);font-size:14px;}
.cst-status{flex:0 0 auto;padding:5px 11px;border:1px solid var(--hairline-soft);border-radius:999px;color:var(--faint);
  font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;}
.cst-status.is-active{border-color:var(--gold-dim);color:var(--gold-bright);background:rgba(201,163,86,.08);}
.cst-status.is-next{border-color:rgba(243,234,218,.22);color:var(--muted);}

/* ───── support ───── */
.cst-support{padding-bottom:clamp(64px,10vh,110px);}
.cst-tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.cst-tier{position:relative;display:flex;flex-direction:column;gap:10px;padding:28px 24px 24px;border:1px solid var(--hairline-soft);border-radius:18px;
  background:linear-gradient(180deg,var(--panel) 0%,var(--bg2) 100%);
  transition:transform 180ms ease,border-color 180ms ease,box-shadow 180ms ease;}
.cst-tier:hover{transform:translateY(-4px);border-color:var(--gold-dim);box-shadow:0 26px 54px -28px rgba(0,0,0,.9);}
.cst-tier.is-featured{border-color:var(--gold-dim);background:linear-gradient(180deg,rgba(201,163,86,.12) 0%,var(--panel) 60%);}
.cst-tierFlag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:4px 12px;border-radius:999px;
  background:var(--gold);color:#17110A;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;}
.cst-tierName{color:var(--gold-bright);font-size:11.5px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;}
.cst-tierAmt{font-family:var(--serif);font-weight:600;font-size:44px;line-height:1;color:var(--text);}
.cst-tierAmt sup{font-size:.45em;vertical-align:.7em;margin-right:2px;color:var(--gold-bright);}
.cst-tierPer{margin-left:4px;font-family:var(--sans);font-size:13px;font-weight:500;color:var(--faint);}
.cst-tierLine{color:var(--muted);font-size:13.5px;line-height:1.55;min-height:3.1em;}
.cst-tierGo{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border:1px solid var(--gold-dim);border-radius:999px;
  color:var(--gold-bright);font-size:13px;font-weight:800;letter-spacing:.04em;transition:background 160ms ease,color 160ms ease;}
.cst-tier:hover .cst-tierGo{background:var(--gold);color:#17110A;border-color:var(--gold);}
.cst-tierGo svg{width:14px;height:14px;}
.cst-tier.is-featured .cst-tierGo{background:var(--gold);color:#17110A;border-color:var(--gold);}
.cst-tier.is-featured:hover .cst-tierGo{background:var(--gold-bright);border-color:var(--gold-bright);}

.cst-noPerks{max-width:62ch;margin:30px auto 0;text-align:center;color:var(--faint);font-size:13px;line-height:1.7;}
.cst-alt{margin:26px auto 0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;}
.cst-altBtn{padding:10px 18px;border:1px solid var(--hairline-soft);border-radius:999px;color:var(--muted);font-size:13px;font-weight:700;
  transition:border-color 150ms ease,color 150ms ease,background 150ms ease;}
.cst-altBtn:hover{border-color:var(--gold-dim);color:var(--gold-bright);background:rgba(201,163,86,.05);}

.cst-fine{max-width:720px;margin:56px auto 0;padding:26px 28px;border:1px solid var(--hairline-soft);border-radius:16px;background:rgba(243,234,218,.025);}
.cst-fine h3{margin:0 0 10px;color:var(--text);font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;}
.cst-fine p{margin:0;color:var(--faint);font-size:13.5px;line-height:1.75;}
.cst-fine strong{color:var(--muted);font-weight:700;}

/* ───── footer ───── */
.cst-foot{margin-top:auto;padding:52px 20px 58px;border-top:1px solid var(--hairline-soft);text-align:center;background:linear-gradient(180deg,transparent,rgba(201,163,86,.04));}
.cst-footCross{display:block;color:var(--gold);font-size:22px;margin-bottom:12px;}
.cst-footLine{margin:0 0 14px;font-family:var(--serif);font-style:italic;font-size:19px;color:var(--muted);}
.cst-footMeta{margin:0 0 8px;color:var(--faint);font-size:13px;}
.cst-footMeta a{color:var(--muted);font-weight:650;border-bottom:1px solid transparent;transition:color 150ms,border-color 150ms;}
.cst-footMeta a:hover{color:var(--gold-bright);border-color:var(--gold-dim);}
.cst-footFine{margin:0 auto;max-width:60ch;color:#6A5E4C;font-size:11.5px;line-height:1.6;}

/* ───── responsive ───── */
@media (max-width:1000px){
  .cst-films{grid-template-columns:repeat(2,1fr);}
  .cst-film:last-child{display:none;}
  .cst-tiers{grid-template-columns:repeat(2,1fr);}
  .cst-row{grid-template-columns:52px 1fr;grid-template-rows:auto auto;}
  .cst-rowText{grid-column:2;}
}
@media (max-width:780px){
  .cst-missionCols{grid-template-columns:1fr;}
  .cst-slate{grid-template-columns:1fr;}
  .cst-band{grid-template-columns:repeat(2,1fr);}
  .cst-band>div:nth-child(3){border-left:0;}
  .cst-band>div:nth-child(n+3){border-top:1px solid var(--hairline-soft);}
}
@media (max-width:600px){
  .cst-barLink{display:none;}
  .cst-markText{font-size:14px;letter-spacing:.1em;}
  .cst-hero{padding-top:64px;}
  .cst-kicker{letter-spacing:.22em;font-size:11px;}
  .cst-heroCtas{flex-direction:column;align-items:stretch;}
  .cst-cta,.cst-ghost{justify-content:center;width:100%;}
  .cst-films{grid-template-columns:1fr;}
  .cst-film:last-child{display:flex;}
  .cst-tiers{grid-template-columns:1fr;gap:14px;}
  .cst-tierLine{min-height:0;}
  .cst-row{padding:20px 2px;}
  .cst-fine{padding:20px;}
}
@media (prefers-reduced-motion:reduce){
  .cst *{transition:none!important;}
  .cst-film:hover,.cst-tier:hover,.cst-cta:hover{transform:none;}
}
`;
