"use client";

import { useEffect } from "react";
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
   Catholic Saint Stories — Support  (v5, cinematic, no video hosting)

   Videos play straight from Facebook/Instagram — nothing to upload.
   Only two small images live in /public/saint-stories/:
     banner.jpg    your Facebook cover art (hero + story break)
     damian.jpg    one still from the Damián film (mission section)
   Keep each under ~2MB. Everything degrades gracefully if missing.
------------------------------------------------------------ */

const A = "/saint-stories";
const ASSETS = {
  banner: `${A}/banner.jpg`,
  still: `${A}/damian.jpg`,
};

const CONTACT = "team@catholicprojects.org";
const STRIPE_LINK = "https://buy.stripe.com/your-stripe-link"; // TODO
const PAYPAL_LINK = "https://paypal.me/catholicsaintstories"; // TODO
const FACEBOOK_URL = "https://www.facebook.com/people/Catholicsaintstories/61592672761916/";
const INSTAGRAM_URL = "https://instagram.com/catholicsaintstories";

/* Films.  `fb` = Facebook reel URL → autoplays muted in the card.
   No `fb` yet → the Instagram embed is used instead (thumbnail, click to play).
   Paste the Facebook reel URL for each as you have it. */
type Film = {
  slug: string;
  title: string;
  lang: "English" | "Español";
  logline: string;
  proof: string;
  ig: string;
  fb?: string;
};

const FILMS: Film[] = [
  {
    slug: "damian",
    title: "San Damián de Molokai",
    lang: "Español",
    logline: "Eligió vivir con los enviados lejos por la lepra — sabiendo que quizá nunca volvería.",
    proof: "56K+ views",
    ig: "https://www.instagram.com/reel/DeAb99UBwNT/",
    fb: "https://www.facebook.com/reel/2563206477478130",
  },
  {
    slug: "sheen",
    title: "Blessed Fulton Sheen",
    lang: "English",
    logline: "A bishop, a chalkboard, and a television camera — and thirty million people listening.",
    proof: "19K+ views",
    ig: "https://www.instagram.com/reel/DduZyldBW9M/",
    fb: "https://fb.watch/v/6tDwOkXld/",
  },
  {
    slug: "alacoque",
    title: "Santa Margarita María de Alacoque",
    lang: "Español",
    logline: "Jesús le mostró Su Corazón ardiendo de amor — y le confió una misión para toda la Iglesia.",
    proof: "3.6K reactions · 400+ shares",
    ig: "https://www.instagram.com/reel/Dd4tluZBbbc/",
    fb: "https://fb.watch/v/84XezVsW2/",
  },
  {
    slug: "gines",
    title: "San Ginés de Roma",
    lang: "Español",
    logline: "Un actor que se burlaba de los cristianos en escena — hasta que, a mitad de la obra, creyó.",
    proof: "Latest release",
    ig: INSTAGRAM_URL, // TODO: direct Instagram reel link
    fb: "https://fb.watch/v/7WGZBbZ1Q/",
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
  { n: "01", title: "Research", text: "Every story begins in trusted Catholic sources — hagiographies, letters, papal writings — so the saints are portrayed faithfully." },
  { n: "02", title: "Script & Production", text: "Cinematic visuals, careful writing, and editing worthy of the lives being told." },
  { n: "03", title: "Narration", text: "Voice performances in English and Spanish that carry reverence, not noise." },
  { n: "04", title: "Translation & Captions", text: "Every story crosses languages — subtitled, translated, accessible." },
  { n: "05", title: "Distribution", text: "Published where people actually are — Instagram, Facebook, TikTok, YouTube — pointing hearts toward Christ." },
];

const TIERS = [
  { amount: 5, name: "Friend", line: "Keeps the research going." },
  { amount: 15, name: "Patron", line: "Helps carry a story through production.", featured: true },
  { amount: 25, name: "Benefactor", line: "Funds narration and translation — both languages." },
  { amount: 50, name: "Founding Patron", line: "Sustains the whole slate, month after month." },
];

/* ── icons ── */
function Svg({ children, sw = 1.6, className }: { children: ReactNode; sw?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const I = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  down: (<><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>),
  play: (<><polygon points="6 4 20 12 6 20 6 4" /></>),
};

/* ── scroll reveal ── */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ── film card: Facebook reel autoplaying muted, or Instagram embed as fallback ── */
function embedSrc(film: Film) {
  if (film.fb) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(film.fb)}&autoplay=true&mute=true&show_text=false&allowfullscreen=true`;
  }
  const id = film.ig.match(/\/(?:reel|p)\/([^/?#]+)/)?.[1] ?? "";
  return `https://www.instagram.com/reel/${id}/embed/`;
}

function FilmCard({ film }: { film: Film }) {
  return (
    <article className="cst-film" data-reveal>
      <div className={`cst-poster ${film.fb ? "" : "is-ig"}`}>
        <iframe
          className="cst-posterFrame"
          src={embedSrc(film)}
          title={film.title}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
        <span className="cst-lang">{film.lang}</span>
      </div>
      <div className="cst-filmBody">
        <h3 className="cst-filmTitle">{film.title}</h3>
        <p className="cst-filmLogline">{film.logline}</p>
        <div className="cst-filmFoot">
          <span className="cst-filmProof">{film.proof}</span>
          <a className="cst-filmWatch" href={film.ig} target="_blank" rel="noopener noreferrer">
            Watch on Instagram <Svg sw={2.2}>{I.arrow}</Svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function SupportPage() {
  useReveal();

  return (
    <div className={`cst ${ui.variable} ${serif.variable}`}>
      <style>{CSS}</style>
      <div className="cst-grain" aria-hidden="true" />

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
        {/* ═══════════ HERO ═══════════ */}
        <section className="cst-hero">
          <div className="cst-heroArt" style={{ backgroundImage: `url(${ASSETS.banner})` }} aria-hidden="true" />
          <div className="cst-heroDawn" aria-hidden="true" />
          <div className="cst-heroRays" aria-hidden="true" />
          <div className="cst-heroShade" aria-hidden="true" />

          <div className="cst-heroInner">
            <p className="cst-kicker">Real saints · True stories · Eternal inspiration</p>
            <h1 className="cst-h1">
              Stories of the Saints.
              <em>Made for a new generation.</em>
            </h1>
            <p className="cst-heroSub">
              Cinematic films about the men and women who gave everything to Christ —
              released free, every week, in English and Spanish, on the feeds where this
              generation actually lives.
            </p>
            <div className="cst-heroCtas">
              <a className="cst-cta" href="#support">Help bring the next story to life <Svg sw={2}>{I.arrow}</Svg></a>
              <a className="cst-ghost" href="#films"><Svg sw={2} className="cst-ghostIcon">{I.play}</Svg>Watch the stories</a>
            </div>
          </div>

          <a className="cst-scrollCue" href="#films" aria-label="Scroll"><Svg sw={1.6}>{I.down}</Svg></a>
        </section>

        {/* ═══════════ NUMBERS ═══════════ */}
        <dl className="cst-band" data-reveal>
          <div><dt>435K</dt><dd>monthly views</dd></div>
          <div><dt>14K</dt><dd>followers</dd></div>
          <div><dt>102</dt><dd>stories released</dd></div>
          <div><dt>EN · ES</dt><dd>two languages</dd></div>
        </dl>

        {/* ═══════════ NOW SHOWING ═══════════ */}
        <section className="cst-section" id="films">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">Now showing</p>
            <h2 className="cst-h2">Stories people can't stop sharing</h2>
            <p className="cst-lede">Every film is free to watch. These are the ones traveling furthest right now.</p>
          </div>
          <div className="cst-films">
            {FILMS.map((f) => <FilmCard key={f.slug} film={f} />)}
          </div>
          <p className="cst-seeAll" data-reveal>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">All 102 stories, free, on Instagram & Facebook →</a>
          </p>
        </section>

        {/* ═══════════ STORY BREAK (full-bleed banner + quote) ═══════════ */}
        <section className="cst-break" style={{ backgroundImage: `url(${ASSETS.banner})` }}>
          <div className="cst-breakShade" aria-hidden="true" />
          <figure className="cst-quote" data-reveal>
            <blockquote>“I make myself a leper with the lepers, to gain all to Jesus&nbsp;Christ.”</blockquote>
            <figcaption>St. Damien of Molokai</figcaption>
          </figure>
        </section>

        {/* ═══════════ MISSION (split) ═══════════ */}
        <section className="cst-section cst-mission">
          <div className="cst-missionStill" data-reveal style={{ backgroundImage: `url(${ASSETS.still})` }}>
            <span className="cst-missionCap">San Damián de Molokai — from the film</span>
          </div>
          <div className="cst-missionCopy" data-reveal>
            <p className="cst-eyebrow">The mission</p>
            <h2 className="cst-h2">The saints belong in every feed</h2>
            <p>
              The lives of the saints — their courage, their sacrifice, their encounter with
              Christ — are the greatest stories the Church has. But most people will never
              open a hagiography. They're on Instagram at midnight. They're scrolling TikTok
              on the bus.
            </p>
            <p>
              So we bring the saints there. Not instead of the Church — <em>toward</em> it.
              Every film is researched in trusted Catholic sources, told with reverence, and
              released free, so that a lapsed Catholic, a curious seeker, or a kid who has
              never heard of Molokai might stop scrolling — and meet a saint.
            </p>
            {/* Optional — delete this line if you'd rather stay unnamed. */}
            <p className="cst-missionSig">— Antonio, <span>catechist · founder, CatholicProjects.org</span></p>
          </div>
        </section>

        {/* ═══════════ LEDGER ═══════════ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">Where every dollar goes</p>
            <h2 className="cst-h2">What your support pays for</h2>
            <p className="cst-lede">Each story costs real money to make. Support goes to the work — no overhead, no middlemen.</p>
          </div>
          <ol className="cst-ledger">
            {LEDGER.map((r) => (
              <li key={r.n} className="cst-row" data-reveal>
                <span className="cst-rowN">{r.n}</span>
                <span className="cst-rowTitle">{r.title}</span>
                <span className="cst-rowText">{r.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ═══════════ SLATE ═══════════ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">On the slate</p>
            <h2 className="cst-h2">The stories we're preparing</h2>
            <p className="cst-lede">Six saints in the pipeline. Your support decides how fast they arrive.</p>
          </div>
          <ul className="cst-slate">
            {SLATE.map((s, i) => (
              <li key={s.name} className="cst-saint" data-reveal>
                <span className="cst-saintN">{String(i + 1).padStart(2, "0")}</span>
                <span className="cst-saintBody">
                  <span className="cst-saintName">{s.name}</span>
                  <span className="cst-saintEpithet">{s.epithet}</span>
                </span>
                <span className={`cst-status ${s.status === "In production" ? "is-active" : s.status === "Coming soon" ? "is-next" : ""}`}>{s.status}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ═══════════ SUPPORT ═══════════ */}
        <section className="cst-section cst-support" id="support">
          <div className="cst-head cst-headCenter" data-reveal>
            <p className="cst-eyebrow">Become a patron</p>
            <h2 className="cst-h2">Help bring the next saint story to life</h2>
            <p className="cst-lede">If these films have moved you, you can help make the next one.</p>
          </div>

          <div className="cst-tiers">
            {TIERS.map((t) => (
              <a key={t.amount} className={`cst-tier ${t.featured ? "is-featured" : ""}`} href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" data-reveal>
                {t.featured && <span className="cst-tierFlag">Most common</span>}
                <span className="cst-tierName">{t.name}</span>
                <span className="cst-tierAmt"><sup>$</sup>{t.amount}<span className="cst-tierPer">/mo{t.amount === 50 ? "+" : ""}</span></span>
                <span className="cst-tierLine">{t.line}</span>
                <span className="cst-tierGo">Support <Svg sw={2.2}>{I.arrow}</Svg></span>
              </a>
            ))}
          </div>

          <p className="cst-noPerks" data-reveal>
            Support is a voluntary gift to the creator of this work. It earns our deep gratitude and our
            prayers — but no rewards, ownership, or exclusive access. The films remain free, for everyone, always.
          </p>
          <div className="cst-alt" data-reveal>
            <a className="cst-altBtn" href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">Give once</a>
            <a className="cst-altBtn" href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">PayPal</a>
            <a className="cst-altBtn" href={`mailto:${CONTACT}`}>Questions? Write to us</a>
          </div>
          <div className="cst-fine" data-reveal>
            <h3>Transparency about your gift</h3>
            <p>
              CatholicProjects is not a tax-exempt charitable organization, and contributions are{" "}
              <strong>not tax-deductible</strong>. Your support is voluntary creator support — received as
              ordinary income, reported properly, and spent on the work described above. No contribution funds
              a specific film, and no outcome is promised beyond this: more stories of the saints, made well,
              released free.
            </p>
          </div>
        </section>
      </main>

      <footer className="cst-foot">
        <span className="cst-footCross" aria-hidden="true">✠</span>
        <p className="cst-footLine">Ad maiorem Dei gloriam.</p>
        <p className="cst-footMeta">
          A project of <a href="https://catholicprojects.org">CatholicProjects.org</a> · <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}
        </p>
        <p className="cst-footFine">CatholicProjects is an independent Catholic project and does not imply parish, diocesan, or ecclesial endorsement unless specifically stated.</p>
      </footer>
    </div>
  );
}

/* -----------------------------------------------------------
   Styles — candlelit palette, scoped under .cst
------------------------------------------------------------ */
const CSS = `
.cst{
  --bg:#120D09;--bg2:#1A130D;--panel:#1F1710;--panel2:#261D14;
  --gold:#C9A356;--gold-bright:#E6C97F;--gold-dim:rgba(201,163,86,.4);
  --hair:rgba(201,163,86,.18);--hair-soft:rgba(243,234,218,.08);
  --text:#F4ECDD;--muted:#BBAB94;--faint:#8F8069;
  --serif:var(--cst-serif),"Cormorant Garamond",Georgia,serif;
  --sans:var(--cst-ui),Inter,system-ui,sans-serif;
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:clip;
  background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;-webkit-font-smoothing:antialiased;
}
.cst,.cst *,.cst *::before,.cst *::after{box-sizing:border-box;}
.cst :where(a){color:inherit;text-decoration:none;}
.cst :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;}
.cst a:focus-visible,.cst button:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px;}
.cst ::selection{background:rgba(201,163,86,.3);}
.cst-grain{position:fixed;inset:0;z-index:40;pointer-events:none;opacity:.055;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");}

/* reveal */
[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity 900ms cubic-bezier(.2,.65,.2,1),transform 900ms cubic-bezier(.2,.65,.2,1);}
[data-reveal].is-in{opacity:1;transform:none;}

/* bar */
.cst-bar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding:14px clamp(20px,4vw,44px);background:linear-gradient(180deg,rgba(18,13,9,.85),rgba(18,13,9,0));}
.cst-mark{display:inline-flex;align-items:center;gap:10px;}
.cst-markCross{color:var(--gold);font-size:17px;}
.cst-markText{font-family:var(--serif);font-weight:600;font-size:17px;letter-spacing:.14em;text-transform:uppercase;}
.cst-barNav{display:flex;align-items:center;gap:22px;}
.cst-barLink{color:var(--muted);font-size:13px;font-weight:600;transition:color 150ms;}
.cst-barLink:hover{color:var(--text);}
.cst-barCta{padding:9px 18px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:background 160ms,color 160ms;}
.cst-barCta:hover{background:var(--gold);color:#17110A;}

/* hero — golden dawn: light pours in from above, like the sky in the banner */
.cst-hero{position:relative;min-height:min(88svh,820px);display:flex;align-items:center;justify-content:center;overflow:hidden;
  background:linear-gradient(180deg,#3A2A14 0%,#24190F 45%,var(--bg) 100%);}
.cst-heroArt{position:absolute;inset:-4%;z-index:0;background-size:cover;background-position:center 28%;
  filter:saturate(1.05) brightness(.95);animation:cst-kb 36s ease-in-out infinite alternate;}
@keyframes cst-kb{from{transform:scale(1)}to{transform:scale(1.07)}}
.cst-heroDawn{position:absolute;inset:0;z-index:1;mix-blend-mode:screen;
  background:
    radial-gradient(55% 48% at 50% 0%,rgba(255,220,140,.55),rgba(230,180,90,.22) 40%,transparent 72%),
    radial-gradient(35% 30% at 50% 8%,rgba(255,240,200,.45),transparent 70%);
  animation:cst-breathe 9s ease-in-out infinite alternate;}
@keyframes cst-breathe{from{opacity:.85}to{opacity:1}}
.cst-heroRays{position:absolute;inset:-20% 0 0;z-index:1;mix-blend-mode:screen;opacity:.35;pointer-events:none;
  background:conic-gradient(from 180deg at 50% 0%,
    transparent 0 8%, rgba(255,225,160,.18) 10%, transparent 12%,
    transparent 20%, rgba(255,225,160,.14) 22%, transparent 24%,
    transparent 30%, rgba(255,225,160,.2) 32%, transparent 34%,
    transparent 40%, rgba(255,225,160,.12) 42%, transparent 44%,
    transparent 56%, rgba(255,225,160,.12) 58%, transparent 60%,
    transparent 66%, rgba(255,225,160,.2) 68%, transparent 70%,
    transparent 76%, rgba(255,225,160,.14) 78%, transparent 80%,
    transparent 88%, rgba(255,225,160,.18) 90%, transparent 92%);
  -webkit-mask-image:radial-gradient(70% 90% at 50% 0%,#000 30%,transparent 100%);mask-image:radial-gradient(70% 90% at 50% 0%,#000 30%,transparent 100%);}
.cst-heroShade{position:absolute;inset:0;z-index:2;
  background:
    radial-gradient(60% 55% at 50% 60%,rgba(18,13,9,.35),rgba(18,13,9,.55) 100%),
    linear-gradient(180deg,rgba(18,13,9,.05) 0%,rgba(18,13,9,.2) 45%,rgba(18,13,9,.6) 80%,var(--bg) 100%);}
.cst-heroInner{position:relative;z-index:3;max-width:900px;padding:110px 20px 96px;text-align:center;}
.cst-kicker{margin:0 0 26px;color:var(--gold-bright);font-size:12px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;text-shadow:0 2px 24px rgba(0,0,0,.7);}
.cst-h1{margin:0 auto 24px;font-family:var(--serif);font-weight:600;font-size:clamp(3rem,7.6vw,5.8rem);line-height:1.02;letter-spacing:-.015em;color:#FBF4E6;text-shadow:0 2px 6px rgba(0,0,0,.35),0 10px 50px rgba(0,0,0,.7);}
.cst-h1 em{display:block;margin-top:10px;font-style:italic;font-weight:500;font-size:.56em;
  background:linear-gradient(100deg,#E6C97F 10%,#FFF0C8 45%,#E6C97F 90%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 14px rgba(0,0,0,.55));}
.cst-heroSub{margin:0 auto;max-width:56ch;color:#E9DEC8;font-size:clamp(1rem,1.5vw,1.15rem);line-height:1.75;text-shadow:0 2px 20px rgba(0,0,0,.8);}
.cst-heroCtas{margin:38px auto 0;display:flex;justify-content:center;flex-wrap:wrap;gap:14px;}
.cst-cta{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 26px;border-radius:999px;
  background:linear-gradient(135deg,#E6C97F,#C9A356 55%,#A8823C);color:#17110A;font-size:15px;font-weight:800;box-shadow:0 10px 36px -10px rgba(201,163,86,.6);transition:transform 160ms,box-shadow 160ms;}
.cst-cta:hover{transform:translateY(-2px);box-shadow:0 16px 44px -10px rgba(201,163,86,.7);}
.cst-cta svg{width:17px;height:17px;}
.cst-ghost{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 24px;border:1px solid rgba(243,234,218,.28);border-radius:999px;
  background:rgba(18,13,9,.35);backdrop-filter:blur(8px);font-size:15px;font-weight:700;transition:border-color 160ms,background 160ms;}
.cst-ghost:hover{border-color:var(--gold-dim);background:rgba(201,163,86,.12);}
.cst-ghostIcon{width:14px;height:14px;color:var(--gold-bright);}
.cst-scrollCue{position:absolute;left:50%;bottom:clamp(28px,5vh,44px);transform:translateX(-50%);z-index:4;color:var(--gold-bright);opacity:.7;animation:cst-cue 2.4s ease-in-out infinite;}
.cst-scrollCue svg{width:22px;height:22px;}
@keyframes cst-cue{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,8px)}}

/* band */
.cst-band{width:min(840px,calc(100% - 40px));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);}
.cst-band>div{padding:20px 10px;display:flex;flex-direction:column;gap:5px;text-align:center;}
.cst-band>div+div{border-left:1px solid var(--hair-soft);}
.cst-band dt{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(1.6rem,2.8vw,2.2rem);color:var(--gold-bright);line-height:1;}
.cst-band dd{margin:0;color:var(--faint);font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;}

/* sections */
.cst-section{width:min(1200px,calc(100% - 40px));margin:0 auto;padding:clamp(48px,7vh,80px) 0 0;scroll-margin-top:40px;}
.cst-head{max-width:660px;margin-bottom:clamp(24px,4vh,36px);}
.cst-headCenter{margin-left:auto;margin-right:auto;text-align:center;}
.cst-eyebrow{margin:0 0 14px;color:var(--gold);font-size:11.5px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;}
.cst-h2{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(2.1rem,4.4vw,3.4rem);line-height:1.08;letter-spacing:-.01em;}
.cst-lede{margin:16px 0 0;color:var(--muted);font-size:16.5px;line-height:1.7;}

/* films */
.cst-films{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.cst-film{display:flex;flex-direction:column;border:1px solid var(--hair-soft);border-radius:20px;overflow:hidden;background:var(--panel);transition:transform 260ms ease,border-color 260ms,box-shadow 260ms;}
.cst-film:hover{transform:translateY(-6px);border-color:var(--gold-dim);box-shadow:0 36px 70px -34px rgba(0,0,0,.95),0 0 0 1px rgba(201,163,86,.08);}
.cst-poster{position:relative;display:block;width:100%;aspect-ratio:9/16;background:#000;overflow:hidden;}
.cst-posterFrame{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000;}
/* Instagram fallback: crop its white header/footer so only the video shows */
.cst-poster.is-ig .cst-posterFrame{top:-54px;height:calc(100% + 54px + 140px);}
.cst-lang{position:absolute;top:14px;left:14px;z-index:2;pointer-events:none;padding:5px 11px;border:1px solid rgba(230,201,127,.4);border-radius:999px;background:rgba(18,13,9,.6);backdrop-filter:blur(6px);color:var(--gold-bright);font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;}
.cst-filmBody{display:flex;flex-direction:column;flex:1;padding:18px 18px 16px;}
.cst-filmTitle{margin:0;font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.15;}
.cst-filmLogline{margin:8px 0 0;color:var(--muted);font-family:var(--serif);font-style:italic;font-size:16px;line-height:1.5;}
.cst-filmFoot{margin-top:18px;padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--hair-soft);}
.cst-filmProof{color:var(--faint);font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
.cst-filmWatch{display:inline-flex;align-items:center;gap:6px;padding:0;color:var(--gold-bright);font-size:13px;font-weight:700;}
.cst-filmWatch svg{width:14px;height:14px;transition:transform 160ms;}
.cst-film:hover .cst-filmWatch svg{transform:translateX(3px);}
.cst-seeAll{margin:28px 0 0;text-align:center;}
.cst-seeAll a{color:var(--muted);font-size:14px;font-weight:600;border-bottom:1px solid var(--hair);padding-bottom:3px;transition:color 150ms,border-color 150ms;}
.cst-seeAll a:hover{color:var(--gold-bright);border-color:var(--gold-dim);}

/* story break */
.cst-break{position:relative;margin-top:clamp(48px,7vh,80px);min-height:min(56svh,520px);display:flex;align-items:center;justify-content:center;
  background-size:cover;background-position:center 35%;background-attachment:fixed;background-color:var(--bg2);}
.cst-breakShade{position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0%,rgba(18,13,9,.45) 25%,rgba(18,13,9,.55) 75%,var(--bg) 100%);}
.cst-quote{position:relative;width:min(860px,calc(100% - 40px));margin:0;padding:32px 0;text-align:center;}
.cst-quote blockquote{margin:0;font-family:var(--serif);font-style:italic;font-weight:500;color:var(--gold-bright);font-size:clamp(1.8rem,4vw,3rem);line-height:1.3;text-shadow:0 4px 40px rgba(0,0,0,.8);}
.cst-quote figcaption{margin-top:20px;color:var(--text);font-size:12px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;opacity:.8;}
.cst-quote::before,.cst-quote::after{content:"";display:block;width:56px;height:1px;margin:0 auto;background:var(--gold-dim);}
.cst-quote::before{margin-bottom:36px}.cst-quote::after{margin-top:36px}

/* mission split */
.cst-mission{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:clamp(32px,5vw,72px);align-items:center;}
.cst-missionStill{position:relative;aspect-ratio:4/5;border-radius:22px;background-size:cover;background-position:center 20%;background-color:var(--panel2);
  box-shadow:0 40px 80px -40px rgba(0,0,0,.95);overflow:hidden;}
.cst-missionStill::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(18,13,9,.85));}
.cst-missionCap{position:absolute;left:18px;bottom:16px;z-index:1;color:var(--muted);font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;}
.cst-missionCopy p:not(.cst-eyebrow){margin:18px 0 0;color:var(--muted);font-size:17px;line-height:1.85;}
.cst-missionCopy em{color:var(--text);}
.cst-missionCopy .cst-missionSig{margin-top:24px;font-family:var(--serif);font-style:italic;font-size:19px;color:var(--gold-bright);line-height:1.4;}
.cst-missionSig span{font-style:normal;font-family:var(--sans);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-left:8px;}

/* ledger */
.cst-ledger{margin:0;padding:0;list-style:none;border-top:1px solid var(--hair);}
.cst-row{display:grid;grid-template-columns:72px 260px 1fr;gap:20px;align-items:baseline;padding:20px 6px;border-bottom:1px solid var(--hair-soft);transition:background 160ms;}
.cst-row:hover{background:rgba(201,163,86,.03);}
.cst-rowN{font-family:var(--serif);font-size:15px;color:var(--gold);letter-spacing:.1em;}
.cst-rowTitle{font-family:var(--serif);font-weight:600;font-size:24px;}
.cst-rowText{color:var(--muted);font-size:15px;line-height:1.7;max-width:58ch;}

/* slate */
.cst-slate{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 clamp(28px,5vw,72px);border-top:1px solid var(--hair);}
.cst-saint{display:flex;align-items:center;gap:18px;padding:16px 6px;border-bottom:1px solid var(--hair-soft);}
.cst-saintN{font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.08em;}
.cst-saintBody{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cst-saintName{font-family:var(--serif);font-weight:600;font-size:20px;line-height:1.2;}
.cst-saintEpithet{color:var(--faint);font-family:var(--serif);font-style:italic;font-size:15px;}
.cst-status{flex:0 0 auto;padding:5px 11px;border:1px solid var(--hair-soft);border-radius:999px;color:var(--faint);font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;}
.cst-status.is-active{border-color:var(--gold-dim);color:var(--gold-bright);background:rgba(201,163,86,.08);}
.cst-status.is-next{border-color:rgba(243,234,218,.22);color:var(--muted);}

/* support */
.cst-support{padding-bottom:clamp(56px,8vh,88px);}
.cst-tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.cst-tier{position:relative;display:flex;flex-direction:column;gap:10px;padding:30px 24px 24px;border:1px solid var(--hair-soft);border-radius:20px;background:linear-gradient(180deg,var(--panel),var(--bg2));transition:transform 180ms,border-color 180ms,box-shadow 180ms;}
.cst-tier:hover{transform:translateY(-4px);border-color:var(--gold-dim);box-shadow:0 26px 54px -28px rgba(0,0,0,.95);}
.cst-tier.is-featured{border-color:var(--gold-dim);background:linear-gradient(180deg,rgba(201,163,86,.14),var(--panel) 60%);}
.cst-tierFlag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:4px 12px;border-radius:999px;background:var(--gold);color:#17110A;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;}
.cst-tierName{color:var(--gold-bright);font-size:11.5px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;}
.cst-tierAmt{font-family:var(--serif);font-weight:600;font-size:46px;line-height:1;}
.cst-tierAmt sup{font-size:.45em;vertical-align:.7em;margin-right:2px;color:var(--gold-bright);}
.cst-tierPer{margin-left:4px;font-family:var(--sans);font-size:13px;font-weight:500;color:var(--faint);}
.cst-tierLine{color:var(--muted);font-size:13.5px;line-height:1.55;min-height:3.1em;}
.cst-tierGo{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:13px;font-weight:800;transition:background 160ms,color 160ms;}
.cst-tier:hover .cst-tierGo,.cst-tier.is-featured .cst-tierGo{background:var(--gold);color:#17110A;border-color:var(--gold);}
.cst-tierGo svg{width:14px;height:14px;}
.cst-noPerks{max-width:62ch;margin:30px auto 0;text-align:center;color:var(--faint);font-size:13px;line-height:1.7;}
.cst-alt{margin:26px auto 0;display:flex;justify-content:center;flex-wrap:wrap;gap:10px;}
.cst-altBtn{padding:10px 18px;border:1px solid var(--hair-soft);border-radius:999px;color:var(--muted);font-size:13px;font-weight:700;transition:border-color 150ms,color 150ms,background 150ms;}
.cst-altBtn:hover{border-color:var(--gold-dim);color:var(--gold-bright);background:rgba(201,163,86,.05);}
.cst-fine{max-width:720px;margin:40px auto 0;padding:26px 28px;border:1px solid var(--hair-soft);border-radius:16px;background:rgba(243,234,218,.025);}
.cst-fine h3{margin:0 0 10px;font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;}
.cst-fine p{margin:0;color:var(--faint);font-size:13.5px;line-height:1.75;}
.cst-fine strong{color:var(--muted);}

/* footer */
.cst-foot{margin-top:auto;padding:56px 20px 60px;border-top:1px solid var(--hair-soft);text-align:center;background:linear-gradient(180deg,transparent,rgba(201,163,86,.05));}
.cst-footCross{display:block;color:var(--gold);font-size:22px;margin-bottom:12px;}
.cst-footLine{margin:0 0 14px;font-family:var(--serif);font-style:italic;font-size:19px;color:var(--muted);}
.cst-footMeta{margin:0 0 8px;color:var(--faint);font-size:13px;}
.cst-footMeta a{color:var(--muted);font-weight:650;}
.cst-footMeta a:hover{color:var(--gold-bright);}
.cst-footFine{margin:0 auto;max-width:60ch;color:#6E6250;font-size:11.5px;line-height:1.6;}

/* responsive */
@media (max-width:1040px){
  .cst-films{grid-template-columns:repeat(2,1fr);}
  .cst-tiers{grid-template-columns:repeat(2,1fr);}
  .cst-row{grid-template-columns:52px 1fr;}
  .cst-rowText{grid-column:2;}
}
@media (max-width:800px){
  .cst-mission{grid-template-columns:1fr;}
  .cst-missionStill{aspect-ratio:16/10;}
  .cst-slate{grid-template-columns:1fr;}
  .cst-band{grid-template-columns:repeat(2,1fr);}
  .cst-band>div:nth-child(3){border-left:0;}
  .cst-band>div:nth-child(n+3){border-top:1px solid var(--hair-soft);}
  .cst-break{background-attachment:scroll;min-height:44svh;}
}
@media (max-width:600px){
  .cst-barLink{display:none;}
  .cst-markText{font-size:14px;letter-spacing:.1em;}
  .cst-heroInner{padding:100px 16px 120px;}
  .cst-kicker{letter-spacing:.22em;font-size:11px;}
  .cst-heroCtas{flex-direction:column;align-items:stretch;}
  .cst-cta,.cst-ghost{justify-content:center;width:100%;}
  .cst-films{grid-template-columns:1fr;}
  .cst-tiers{grid-template-columns:1fr;gap:14px;}
  .cst-tierLine{min-height:0;}
  .cst-row{padding:20px 2px;}
  .cst-fine{padding:20px;}
}
@media (prefers-reduced-motion:reduce){
  .cst *{transition:none!important;animation:none!important;}
  [data-reveal]{opacity:1;transform:none;}
}
`;
