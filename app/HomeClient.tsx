"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Grade bands ───────────────────────────────────────────── */

const BANDS = [
  { key: "prek", label: "Pre-K – K", short: "Pre-K–K", ages: "Ages 4–6", from: "Pre-K", to: "K" },
  { key: "early", label: "Grades 1–2", short: "1–2", ages: "Ages 6–8", from: "Grade 1", to: "Grade 2" },
  { key: "middle", label: "Grades 3–5", short: "3–5", ages: "Ages 8–11", from: "Grade 3", to: "Grade 5" },
  { key: "upper", label: "Grades 6–8", short: "6–8", ages: "Ages 11–14", from: "Grade 6", to: "Grade 8" },
] as const;

type BandKey = (typeof BANDS)[number]["key"];
type Format = "coloring" | "craft" | "worksheet" | "activity";

const FORMAT_LABEL: Record<Format, string> = { coloring: "Coloring pages", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };
const FORMAT_SHORT: Record<Format, string> = { coloring: "Coloring", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };

/* ── Edit your categories here ─────────────────────────────── */

type Kind = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";

type Category = {
  slug: string;
  name: string;
  kind: Kind;
  description: string;
  bands: BandKey[];
  formats: Format[];
  topics: string[];
  verse: string;
  reference: string;
  worksheets: number;
};

const CATEGORIES: Category[] = [
  {
    slug: "saints", name: "Saints", kind: "saints", worksheets: 0,
    description: "Four-panel coloring stories and stand-up saints that bring the heroes of the faith to life.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Four-panel stories", "Stand-up saints", "Feast day pages", "Patron saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", kind: "bible", worksheets: 0,
    description: "Scripture stories children can color, put in order, and retell, from Creation to the Resurrection.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "worksheet", "activity"],
    topics: ["Creation", "Noah’s Ark", "Parables of Jesus", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", kind: "mass", worksheets: 0,
    description: "Help children understand what happens at Mass, and why every part of it matters.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Parts of the Mass", "Sacred vessels", "Liturgical colors", "Mass responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", kind: "sacraments", worksheets: 0,
    description: "Preparation pages for First Reconciliation, First Communion, and Confirmation.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "craft"],
    topics: ["Baptism", "First Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", kind: "prayers", worksheets: 0,
    description: "Tracing pages and line-by-line guides for learning the prayers of the Church by heart.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "activity", "worksheet"],
    topics: ["Sign of the Cross", "Our Father", "Hail Mary", "Guardian Angel Prayer"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", kind: "seasons", worksheets: 0,
    description: "Advent wreaths, Lenten calendars, and Easter crafts for every season of the Church year.",
    bands: ["prek", "early", "middle", "upper"], formats: ["craft", "coloring", "activity"],
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", kind: "rosary", worksheets: 0,
    description: "Bead-by-bead coloring and mystery pages that teach children how to pray the Rosary.",
    bands: ["early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Kindness", kind: "virtues", worksheets: 0,
    description: "Everyday lessons in kindness, honesty, and mercy, rooted in the Commandments.",
    bands: ["prek", "early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Ten Commandments", "Fruits of the Spirit", "Works of mercy", "Loving our neighbor"],
    verse: "And now there remain faith, hope, and charity, these three.", reference: "1 Corinthians 13:13",
  },
];

/* ── Coming up on the calendar (edit as the year moves) ────── */

const COMING_UP = [
  { label: "St. Francis · Oct 4", slug: "saints" },
  { label: "Month of the Rosary", slug: "the-rosary" },
  { label: "All Saints · Nov 1", slug: "saints" },
  { label: "Advent", slug: "liturgical-seasons" },
];

/* ──────────────────────────────────────────────────────────── */

const FORMAT_ICON: Record<Format, ReactNode> = {
  coloring: (<><path d="M4 20c2.5 0 4-1.3 4-3.5a2.5 2.5 0 0 0-5 0" /><path d="m8.5 14.5 10-10a1.8 1.8 0 0 1 2.5 2.5l-10 10" /></>),
  craft: (<><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8.2 20 18M8 15.8 20 6" /></>),
  worksheet: (<><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6M9 15.5h6" /></>),
  activity: (<><path d="M5 4h6v2.5a1.5 1.5 0 1 0 3 0V4h5v6h-2.5a1.5 1.5 0 1 0 0 3H19v7h-6v-2.5a1.5 1.5 0 1 0-3 0V20H5v-6h2.5a1.5 1.5 0 1 0 0-3H5Z" /></>),
};

const UI: Record<string, ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 8h16M4 16h16" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  heart: (<><path d="M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z" /></>),
  print: (<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="1.5" /><path d="M7 14h10v6H7z" /></>),
  book: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /></>),
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
};

function Svg({ children, className, sw = 1.7 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const bySlug = (slug: string | null) => CATEGORIES.find((c) => c.slug === slug);
const bandByKey = (k: string | null) => BANDS.find((b) => b.key === k);

function gradeRange(c: Category) {
  const first = BANDS.find((b) => c.bands.includes(b.key));
  const last = [...BANDS].reverse().find((b) => c.bands.includes(b.key));
  if (!first || !last) return "";
  const end = last.to === "K" ? "K" : last.to.replace("Grade ", "");
  if (first.key === "prek") return end === "K" ? "Pre-K – K" : `Pre-K – ${end}`;
  return `Grades ${first.from.replace("Grade ", "")}–${end}`;
}

const jump = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ── Illustrations (drawn, on-brand) ───────────────────────── */

const LINE = { fill: "none", stroke: "#8a5d3b", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const TINT = { fill: "#f8ecd3", stroke: "#8a5d3b", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const GOLD = { fill: "none", stroke: "#c8943a", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Motif({ kind }: { kind: Kind }) {
  switch (kind) {
    case "saints":
      return (
        <g>
          <ellipse cx="60" cy="44" rx="15" ry="4.5" {...GOLD} />
          <circle cx="60" cy="57" r="9" {...TINT} />
          <path d="M41 112Q43 74 60 70Q77 74 79 112Z" {...TINT} />
          <path d="M60 84v14M54 89h12" {...GOLD} />
        </g>
      );
    case "bible":
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={60 + 10 * Math.cos((a * Math.PI) / 180)} y1={46 + 10 * Math.sin((a * Math.PI) / 180)} x2={60 + 15 * Math.cos((a * Math.PI) / 180)} y2={46 + 15 * Math.sin((a * Math.PI) / 180)} {...GOLD} />
          ))}
          <circle cx="60" cy="46" r="5" fill="#d9a84e" stroke="#c8943a" strokeWidth="1.5" />
          <path d="M22 108Q41 99 60 108Q79 99 98 108V72Q79 63 60 72Q41 63 22 72Z" {...TINT} />
          <path d="M60 72V108" {...LINE} />
        </g>
      );
    case "mass":
      return (
        <g>
          <circle cx="60" cy="46" r="9" fill="#fff" stroke="#c8943a" strokeWidth="2" />
          <path d="M60 41v10M55 46h10" {...GOLD} strokeWidth={1.6} />
          <path d="M40 62H80Q80 88 60 90Q40 88 40 62Z" {...TINT} />
          <path d="M60 90V104" {...LINE} />
          <path d="M46 112Q60 98 74 112Z" {...TINT} />
        </g>
      );
    case "sacraments":
      return (
        <g>
          <path d="M60 38C60 38 84 68 84 88A24 24 0 0 1 36 88C36 68 60 38 60 38Z" {...TINT} />
          <path d="M60 74v26M48 87h24" {...GOLD} />
        </g>
      );
    case "prayers":
      return (
        <g>
          <path d="M60 38V104M38 58H82" {...LINE} strokeWidth={3.4} />
          <path d="M24 112H96" stroke="#c8943a" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "seasons":
      return (
        <g>
          {[32, 48, 64, 80].map((x) => (
            <g key={x}>
              <rect x={x} y="64" width="10" height="34" rx="2" fill="#fff" stroke="#8a5d3b" strokeWidth="2" />
              <path d={`M${x + 5} 50q5 6 0 12q-5 -6 0 -12z`} fill="#d9a84e" stroke="#c8943a" strokeWidth="1.4" />
            </g>
          ))}
          <ellipse cx="60" cy="102" rx="38" ry="11" {...TINT} />
        </g>
      );
    case "rosary":
      return (
        <g>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={60 + 24 * Math.cos(a)} cy={62 + 22 * Math.sin(a)} r="3.6" {...TINT} strokeWidth={1.6} />;
          })}
          <circle cx="60" cy="92" r="3.4" {...TINT} strokeWidth={1.6} />
          <path d="M60 96V116M53 103h14" {...LINE} />
        </g>
      );
    case "virtues":
      return (
        <g>
          <path d="M60 108C30 88 32 56 50 52C57 50.5 60 58 60 58C60 58 63 50.5 70 52C88 56 90 88 60 108Z" {...TINT} />
          <path d="M88 38v12M82 44h12" {...GOLD} />
        </g>
      );
  }
}

function Illustration({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 180" aria-hidden="true">
      <g className="cpSheetA"><rect x="60" y="14" width="120" height="152" rx="9" fill="#f3e2bd" stroke="rgba(111,67,39,.25)" /></g>
      <g className="cpSheetB"><rect x="60" y="14" width="120" height="152" rx="9" fill="#fbf1dc" stroke="rgba(111,67,39,.25)" /></g>
      <g className="cpSheetFront">
        <rect x="60" y="14" width="120" height="152" rx="9" fill="#fffefb" stroke="rgba(111,67,39,.3)" />
        <g transform="translate(60 14)">
          <rect x="14" y="12" width="46" height="5" rx="2.5" fill="#c8943a" opacity=".85" />
          <rect x="14" y="21" width="30" height="4" rx="2" fill="#8a5d3b" opacity=".2" />
          <Motif kind={kind} />
          <rect x="14" y="126" width="92" height="4" rx="2" fill="#8a5d3b" opacity=".16" />
          <rect x="14" y="135" width="66" height="4" rx="2" fill="#8a5d3b" opacity=".16" />
        </g>
      </g>
    </svg>
  );
}

/* ── Header ────────────────────────────────────────────────── */

function Header({ onHome, onSearch, onJump }: { onHome: () => void; onSearch: () => void; onJump: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <header className={scrolled ? "cpHead cpHeadOn" : "cpHead"}>
      <div className="cpBar">
        <button className="cpBrand" onClick={go(onHome)} aria-label="CatholicProjects library home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
        </button>

        <nav className="cpNav" aria-label="Primary">
          <button className="cpLink" onClick={go(() => onJump("topics"))}>Topics</button>
          <button className="cpLink" onClick={go(() => onJump("finder"))}>Grades</button>
          <button className="cpLink" onClick={go(() => onJump("ask"))}>Request a worksheet</button>
          <a className="cpLink" href="https://catholicprojects.org">About us</a>
        </nav>

        <div className="cpActions">
          <button className="cpSearchPill" onClick={go(onSearch)} aria-label="Search topics">
            <Svg className="cpSearchPillIcon">{UI.search}</Svg>
            <span>Search topics</span>
            <kbd>/</kbd>
          </button>
          <button className="cpBurger" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <Svg>{open ? UI.close : UI.menu}</Svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="cpSheet">
          <button className="cpSheetRow" onClick={go(onSearch)}>Search topics</button>
          <button className="cpSheetRow" onClick={go(() => onJump("topics"))}>Topics</button>
          <button className="cpSheetRow" onClick={go(() => onJump("finder"))}>Grades</button>
          <button className="cpSheetRow" onClick={go(() => onJump("ask"))}>Request a worksheet</button>
          <a className="cpSheetRow" href="https://catholicprojects.org">About us</a>
        </div>
      )}
    </header>
  );
}

/* ── Category card ─────────────────────────────────────────── */

function CategoryCard({ c, onOpen }: { c: Category; onOpen: (slug: string) => void }) {
  return (
    <button className="cpCat" onClick={() => onOpen(c.slug)} aria-label={`Open ${c.name}`}>
      <span className="cpArt">
        <span className="cpArtBadge cpArtGrade">{gradeRange(c)}</span>
        <span className="cpArtBadge cpArtCount">{c.formats.length} formats</span>
        <Illustration kind={c.kind} className="cpArtSvg" />
      </span>

      <span className="cpCatBody">
        <span className="cpCatName">{c.name}</span>
        <span className="cpCatDesc">{c.description}</span>

        <span className="cpInsideLabel">What’s inside</span>
        <span className="cpInside">
          {c.topics.map((t) => <span key={t} className="cpInsideItem">{t}</span>)}
        </span>

        <span className="cpFormats">
          {c.formats.map((f) => (
            <span key={f} className="cpFormat">
              <Svg className="cpFormatIcon">{FORMAT_ICON[f]}</Svg>{FORMAT_SHORT[f]}
            </span>
          ))}
        </span>
      </span>

      <span className="cpCatFoot">
        <span className="cpStatus">
          <span className="cpStatusDot" />
          {c.worksheets > 0 ? `${c.worksheets} ready to print` : "Arriving soon"}
        </span>
        <span className="cpGo" aria-hidden="true"><Svg sw={2}>{UI.arrow}</Svg></span>
      </span>
    </button>
  );
}

/* ── Library home ──────────────────────────────────────────── */

function LibraryHome({ query, onQuery, band, onBand, onOpen }: {
  query: string; onQuery: (q: string) => void;
  band: BandKey | null; onBand: (b: BandKey | null) => void; onOpen: (slug: string) => void;
}) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.filter((c) => {
      if (band && !c.bands.includes(band)) return false;
      if (!q) return true;
      return [c.name, c.description, ...c.topics].join(" ").toLowerCase().includes(q);
    });
  }, [query, band]);

  const activeBand = bandByKey(band);

  return (
    <>
      <section className="cpIntro">
        <span className="cpWelcome"><Svg className="cpWelcomeIcon" sw={1.8}>{UI.heart}</Svg> Welcome, teachers, parents, and catechists</span>
        <h1 className="cpH1">Everything you need for <em>your next class.</em></h1>
        <p className="cpLead">Free, print-ready Catholic activities for children, made by a catechist for catechists.</p>

        <div className="cpFinder" id="finder">
          <label className="cpFinderSearch">
            <Svg className="cpFinderIcon">{UI.search}</Svg>
            <input id="cp-search" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="What are you teaching? Try “Advent” or “Hail Mary”" aria-label="Search topics" autoComplete="off" />
          </label>
          <div className="cpFinderGrades" role="group" aria-label="Grade level">
            <span className="cpFinderLabel">Grade</span>
            <button className={!band ? "cpPill cpPillOn" : "cpPill"} onClick={() => onBand(null)}>All</button>
            {BANDS.map((b) => (
              <button key={b.key} className={band === b.key ? "cpPill cpPillOn" : "cpPill"} aria-pressed={band === b.key} onClick={() => onBand(band === b.key ? null : b.key)}>
                {b.short}
              </button>
            ))}
          </div>
        </div>

        <ul className="cpPromises">
          <li><Svg sw={2}>{UI.check}</Svg> Free forever</li>
          <li><Svg sw={2}>{UI.print}</Svg> Print-ready</li>
          <li><Svg sw={2}>{UI.book}</Svg> Built from Catholic sources</li>
        </ul>
      </section>

      <section className="cpTopics" id="topics">
        <div className="cpTopicsHead">
          <div>
            <h2 className="cpH2">
              {activeBand ? <>Topics for <em>{activeBand.label}</em></> : <>Choose a topic</>}
            </h2>
            <p className="cpCount">{results.length} {results.length === 1 ? "topic" : "topics"}{query ? ` matching “${query}”` : ""}</p>
          </div>
          <div className="cpComing">
            <span className="cpComingLabel">Coming up</span>
            {COMING_UP.map((x) => (
              <button key={x.label} className="cpComingChip" onClick={() => onOpen(x.slug)}>{x.label}</button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="cpEmpty">
            <span className="cpEmptyMark">✠</span>
            <p className="cpEmptyTitle">We don’t have that yet.</p>
            <p>Tell us what you’re teaching and we’ll make it a priority.</p>
            <a className="cpBtn cpBtnPrimary" href={`mailto:team@catholicprojects.org?subject=${encodeURIComponent("Worksheet idea: " + query)}`}>Request “{query || "a topic"}”</a>
            <button className="cpTextBtn" onClick={() => { onBand(null); onQuery(""); }}>Show all topics</button>
          </div>
        ) : (
          <div className="cpGrid">
            {results.map((c) => <CategoryCard key={c.slug} c={c} onOpen={onOpen} />)}
          </div>
        )}
      </section>

      <section className="cpAsk" id="ask">
        <span className="cpAskIcon"><Svg sw={1.5}>{UI.mail}</Svg></span>
        <div className="cpAskText">
          <h3>Teaching something we don’t have yet?</h3>
          <p>Tell us the lesson, the grade, and the date you need it. Real classroom requests decide what gets made next.</p>
        </div>
        <a className="cpBtn cpBtnPrimary" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Request a worksheet</a>
      </section>
    </>
  );
}

/* ── Category page ─────────────────────────────────────────── */

function CategoryPage({ c, onHome, onOpen }: { c: Category; onHome: () => void; onOpen: (slug: string) => void }) {
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  const suggest = `mailto:team@catholicprojects.org?subject=${encodeURIComponent(`Worksheet idea: ${c.name}`)}`;

  return (
    <div>
      <button className="cpBack" onClick={onHome}>
        <Svg sw={2}>{UI.back}</Svg> All topics
      </button>

      <section className="cpHero">
        <div className="cpHeroArt"><Illustration kind={c.kind} className="cpHeroSvg" /></div>
        <div className="cpHeroBody">
          <span className="cpEyebrow">Topic</span>
          <h1 className="cpHeroTitle">{c.name}</h1>
          <p className="cpHeroDesc">{c.description}</p>

          <div className="cpSpecs">
            <div><span>Grades</span><b>{gradeRange(c)}</b></div>
            <div><span>You’ll find</span>
              <div className="cpFormats">
                {c.formats.map((f) => (
                  <span key={f} className="cpFormat"><Svg className="cpFormatIcon">{FORMAT_ICON[f]}</Svg>{FORMAT_LABEL[f]}</span>
                ))}
              </div>
            </div>
          </div>

          <blockquote className="cpVerse">
            <p>{c.verse}</p>
            <cite>{c.reference}</cite>
          </blockquote>
        </div>
      </section>

      <section className="cpSection">
        <div className="cpSectionHead">
          <span className="cpEyebrow">Coming to this topic</span>
          <h2 className="cpH2">What we’re preparing</h2>
        </div>
        <div className="cpTopicGrid">
          {c.topics.map((t) => (
            <div key={t} className="cpTopicCard">
              <span className="cpTopicName">{t}</span>
              <span className="cpStatus"><span className="cpStatusDot" /> In preparation</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cpAsk">
        <span className="cpAskIcon"><Svg sw={1.5}>{UI.mail}</Svg></span>
        <div className="cpAskText">
          <h3>Need {c.name.toLowerCase()} activities for your class?</h3>
          <p>Tell us the lesson, the grade, and when you need it. We build what teachers ask for first.</p>
        </div>
        <a className="cpBtn cpBtnPrimary" href={suggest}>Tell us what you need</a>
      </section>

      <section className="cpSection">
        <div className="cpSectionHead">
          <span className="cpEyebrow">Keep browsing</span>
          <h2 className="cpH2">Other topics</h2>
        </div>
        <div className="cpMini">
          {others.map((o) => (
            <button key={o.slug} className="cpMiniCard" onClick={() => onOpen(o.slug)}>
              <Illustration kind={o.kind} className="cpMiniArt" />
              <span className="cpMiniText">
                <span className="cpMiniName">{o.name}</span>
                <span className="cpMiniSub">{gradeRange(o)}</span>
              </span>
              <Svg className="cpMiniArrow" sw={2}>{UI.arrow}</Svg>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── App ───────────────────────────────────────────────────── */

export default function HomeClient() {
  const [slug, setSlug] = useState<string | null>(null);
  const [band, setBand] = useState<BandKey | null>(null);
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("category");
      const a = bandByKey(p.get("grade"));
      setSlug(bySlug(c) ? c : null);
      setBand(a ? a.key : null);
    };
    read();
    setReady(true);
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const push = (s: string | null, b: BandKey | null) => {
    const p = new URLSearchParams();
    if (s) p.set("category", s);
    if (b) p.set("grade", b);
    const qs = p.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const focusSearch = () => {
    window.setTimeout(() => {
      const el = document.getElementById("cp-search") as HTMLInputElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        if (slug) {
          setSlug(null);
          push(null, band);
        }
        focusSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [slug, band]);

  const openCategory = (s: string) => {
    setSlug(s);
    setQuery("");
    push(s, band);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setSlug(null);
    push(null, band);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseBand = (b: BandKey | null) => {
    setBand(b);
    push(null, b);
  };

  const onJump = (id: string) => {
    if (slug) {
      setSlug(null);
      push(null, band);
      window.setTimeout(() => jump(id), 80);
    } else {
      jump(id);
    }
  };

  const onSearch = () => {
    if (slug) {
      setSlug(null);
      push(null, band);
    }
    focusSearch();
  };

  const active = bySlug(slug);

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <div className="cpGlow" aria-hidden="true" />

      <Header onHome={goHome} onSearch={onSearch} onJump={onJump} />

      <main className={ready ? "cpMain cpReady" : "cpMain"}>
        {active ? (
          <CategoryPage key={active.slug} c={active} onHome={goHome} onOpen={openCategory} />
        ) : (
          <LibraryHome query={query} onQuery={setQuery} band={band} onBand={chooseBand} onOpen={openCategory} />
        )}
      </main>

      <footer className="cpFoot">
        <div className="cpFootInner">
          <span className="cpFootMark">✠</span>
          <p className="cpFootText">Free Catholic activities, built from the sources, for the children in your care.</p>
          <p className="cpFootFine">
            CatholicProjects is an independent supplemental resource and does not claim parish, diocesan, or other ecclesial endorsement unless specifically stated.
          </p>
          <p className="cpFootFine">
            <a href="https://catholicprojects.org">CatholicProjects.org</a> · <a href="mailto:team@catholicprojects.org">team@catholicprojects.org</a> · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.cpRoot{
  --chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d9a84e;--tint:#f8ecd3;--ink:#2b211a;--sub:#6a5d52;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--line:rgba(111,67,39,.13);--line-strong:rgba(200,148,58,.42);
  --r-sm:12px;--r-md:20px;--r-lg:28px;
  --sh-1:0 1px 2px rgba(74,43,22,.06),0 8px 20px rgba(74,43,22,.06);
  --sh-2:0 2px 4px rgba(74,43,22,.05),0 22px 48px rgba(74,43,22,.11);
  --sh-3:0 4px 8px rgba(74,43,22,.06),0 40px 80px rgba(74,43,22,.16);
  --ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  position:relative;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;font-family:var(--ui);font-size:16px;color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fdf8ef 55%,#fbf4e8 100%);-webkit-font-smoothing:antialiased;
}
.cpRoot *{box-sizing:border-box;}
.cpRoot :where(button){font-family:inherit;color:inherit;}
.cpRoot :where(a){color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:12px;}
.cpRoot kbd{font-family:var(--ui);}
.cpGlow{position:absolute;top:-420px;left:50%;width:1100px;height:1100px;transform:translateX(-50%);border-radius:999px;pointer-events:none;background:radial-gradient(circle,rgba(200,148,58,.16),rgba(200,148,58,.045) 45%,transparent 70%);}

/* Header */
.cpHead{position:sticky;top:0;z-index:50;background:rgba(255,253,249,.9);backdrop-filter:saturate(1.3) blur(14px);-webkit-backdrop-filter:saturate(1.3) blur(14px);border-bottom:1px solid transparent;transition:border-color 200ms ease,box-shadow 200ms ease;}
.cpHeadOn{border-bottom-color:var(--line);box-shadow:0 8px 28px rgba(46,29,16,.06);}
.cpBar{max-width:1320px;height:76px;margin:0 auto;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:32px;}
.cpBrand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cpLogo{height:54px;width:auto;display:block;}
.cpNav{display:flex;align-items:center;gap:2px;}
.cpLink{display:inline-flex;align-items:center;height:40px;padding:0 14px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:15px;font-weight:600;color:#5b4535;text-decoration:none;white-space:nowrap;transition:background 150ms ease,color 150ms ease;}
.cpLink:hover{background:var(--tint);color:var(--ink);}
.cpActions{margin-left:auto;display:flex;align-items:center;gap:10px;}
.cpSearchPill{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 10px 0 16px;min-width:230px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:550;color:var(--mute);transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpSearchPill:hover{border-color:var(--line-strong);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cpSearchPill span{flex:1;text-align:left;}
.cpSearchPillIcon{width:18px;height:18px;color:var(--chestnut);}
.cpSearchPill kbd{min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:6px;background:var(--cream);font-size:12px;font-weight:600;color:var(--mute);}
.cpBurger{display:none;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;}
.cpBurger svg{width:21px;height:21px;}
.cpSheet{display:none;}

/* Buttons */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 28px;border-radius:999px;font-size:15px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 24px rgba(168,116,37,.26);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 14px 30px rgba(168,116,37,.34);}
.cpTextBtn{margin-top:14px;border:none;background:none;cursor:pointer;font-size:14.5px;font-weight:650;color:var(--chestnut);text-decoration:underline;}

/* Layout */
.cpMain{position:relative;z-index:1;flex:1;width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,3vw,40px) 96px;}
.cpReady{animation:cpFade 320ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}
.cpEyebrow{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpH2{margin:0;font-family:var(--serif);font-size:clamp(32px,3.2vw,44px);font-weight:600;line-height:1.05;color:var(--ink);}
.cpH2 em{font-style:italic;font-weight:500;color:var(--chestnut);}

/* Intro */
.cpIntro{padding:44px 0 0;display:flex;flex-direction:column;align-items:center;text-align:center;}
.cpWelcome{display:inline-flex;align-items:center;gap:9px;padding:8px 16px;border:1px solid var(--line-strong);border-radius:999px;background:rgba(255,255,255,.8);font-size:13.5px;font-weight:650;color:var(--chestnut-deep);}
.cpWelcomeIcon{width:16px;height:16px;color:var(--gold);fill:rgba(200,148,58,.28);}
.cpH1{margin:20px 0 0;max-width:980px;font-family:var(--serif);font-weight:600;font-size:clamp(38px,4.8vw,66px);line-height:1;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;}
.cpH1 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpLead{margin:16px 0 0;max-width:600px;font-size:clamp(16px,1.3vw,18px);line-height:1.6;color:var(--sub);}

.cpFinder{width:min(100%,760px);margin-top:28px;padding:10px;display:flex;flex-direction:column;gap:6px;border:1px solid var(--line-strong);border-radius:32px;background:#fff;box-shadow:var(--sh-2);}
.cpFinderSearch{position:relative;display:flex;align-items:center;}
.cpFinderIcon{position:absolute;left:20px;width:22px;height:22px;color:var(--chestnut);pointer-events:none;}
.cpFinderSearch input{width:100%;height:56px;padding:0 20px 0 54px;border:none;border-radius:24px;background:var(--cream);color:var(--ink);font-family:var(--ui);font-size:16.5px;outline:none;transition:box-shadow 150ms ease,background 150ms ease;}
.cpFinderSearch input::placeholder{color:var(--mute);}
.cpFinderSearch input:focus{background:#fff;box-shadow:inset 0 0 0 2px var(--gold);}
.cpFinderGrades{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:6px 8px 4px;}
.cpFinderLabel{margin-right:6px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpPill{height:38px;padding:0 18px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:650;color:#5b4535;transition:background 150ms ease,border-color 150ms ease,color 150ms ease;}
.cpPill:hover{border-color:var(--line-strong);background:var(--cream);}
.cpPillOn,.cpPillOn:hover{background:var(--ink);border-color:var(--ink);color:#fff8ec;}

.cpPromises{margin:20px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:8px 24px;font-size:14px;font-weight:600;color:var(--sub);}
.cpPromises li{display:inline-flex;align-items:center;gap:7px;}
.cpPromises svg{width:17px;height:17px;color:var(--gold);}

/* Topics */
.cpTopics{margin-top:56px;scroll-margin-top:96px;}
.cpTopicsHead{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px;}
.cpCount{margin:8px 0 0;font-size:14px;color:var(--mute);}
.cpComing{display:flex;align-items:center;flex-wrap:wrap;gap:8px;}
.cpComingLabel{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-right:2px;}
.cpComingChip{height:36px;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.85);cursor:pointer;font-size:13.5px;font-weight:600;color:var(--chestnut-deep);transition:border-color 150ms ease,background 150ms ease;}
.cpComingChip:hover{border-color:var(--line-strong);background:var(--tint);}

.cpGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px;}

/* Category card */
.cpCat{display:flex;flex-direction:column;padding:0;border:1px solid var(--line);border-radius:var(--r-lg);background:#fff;cursor:pointer;text-align:left;overflow:hidden;box-shadow:var(--sh-1);transition:transform 260ms cubic-bezier(.2,.8,.2,1),box-shadow 260ms ease,border-color 260ms ease;}
.cpCat:hover{transform:translateY(-6px);border-color:var(--line-strong);box-shadow:var(--sh-3);}
.cpArt{position:relative;display:block;height:204px;background:radial-gradient(120% 90% at 50% 0%,#fff6e0,#f6e7c8 70%,#f0dcb6);border-bottom:1px solid var(--line);overflow:hidden;}
.cpArt::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(138,93,59,.14) 1px,transparent 1px);background-size:16px 16px;opacity:.5;}
.cpArtSvg{position:absolute;left:50%;bottom:-12px;width:230px;height:172px;transform:translateX(-50%);overflow:visible;filter:drop-shadow(0 12px 18px rgba(74,43,22,.18));}
.cpSheetA,.cpSheetB{transform-origin:120px 168px;transition:transform 420ms cubic-bezier(.2,.8,.2,1);}
.cpSheetA{transform:rotate(-8deg);}
.cpSheetB{transform:rotate(6deg);}
.cpSheetFront{transition:transform 420ms cubic-bezier(.2,.8,.2,1);transform-origin:120px 168px;}
.cpCat:hover .cpSheetA{transform:rotate(-15deg) translateX(-8px);}
.cpCat:hover .cpSheetB{transform:rotate(12deg) translateX(8px);}
.cpCat:hover .cpSheetFront{transform:translateY(-6px);}
.cpArtBadge{position:absolute;top:14px;z-index:2;height:26px;padding:0 11px;display:inline-flex;align-items:center;border-radius:999px;font-size:11.5px;font-weight:700;letter-spacing:.04em;}
.cpArtGrade{left:14px;background:var(--ink);color:#fff3da;}
.cpArtCount{right:14px;background:rgba(255,255,255,.9);color:var(--chestnut-deep);border:1px solid var(--line);}

.cpCatBody{display:flex;flex-direction:column;flex:1;padding:22px 22px 4px;}
.cpCatName{font-family:var(--serif);font-size:29px;font-weight:600;line-height:1.02;letter-spacing:-.01em;color:var(--ink);}
.cpCatDesc{margin-top:10px;font-size:14.5px;line-height:1.55;color:var(--sub);}
.cpInsideLabel{margin-top:18px;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpInside{margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;}
.cpInsideItem{position:relative;padding-left:14px;font-size:13.5px;font-weight:550;line-height:1.35;color:var(--ink);}
.cpInsideItem::before{content:"";position:absolute;left:0;top:6px;width:6px;height:6px;background:var(--gold);transform:rotate(45deg);}
.cpFormats{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px;}
.cpFormat{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;white-space:nowrap;border-radius:999px;background:var(--tint);font-size:12.5px;font-weight:650;color:var(--chestnut-deep);}
.cpFormatIcon{width:14px;height:14px;flex:0 0 auto;}
.cpCatFoot{margin-top:auto;padding:18px 22px 20px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.cpStatus{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:650;color:var(--sub);}
.cpStatusDot{width:8px;height:8px;border-radius:999px;background:var(--gold);flex:0 0 auto;animation:cpPulse 2.4s ease-out infinite;}
@keyframes cpPulse{0%{box-shadow:0 0 0 0 rgba(200,148,58,.5);}70%{box-shadow:0 0 0 8px rgba(200,148,58,0);}100%{box-shadow:0 0 0 0 rgba(200,148,58,0);}}
.cpGo{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:var(--tint);color:var(--chestnut);transition:background 200ms ease,color 200ms ease,transform 200ms ease;}
.cpGo svg{width:18px;height:18px;}
.cpCat:hover .cpGo{background:var(--gold);color:#2e1f12;transform:translateX(2px);}

.cpEmpty{margin:0 auto;max-width:560px;padding:52px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;color:var(--sub);border:1px solid var(--line);border-radius:var(--r-lg);background:rgba(255,255,255,.8);}
.cpEmptyMark{font-size:28px;color:var(--gold);}
.cpEmptyTitle{margin:10px 0 4px;font-family:var(--serif);font-size:32px;font-weight:600;color:var(--ink);}
.cpEmpty .cpBtn{margin-top:20px;}

/* Ask band */
.cpAsk{margin-top:64px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px;padding:30px 36px;border:1px solid var(--line-strong);border-radius:var(--r-lg);background:radial-gradient(90% 160% at 0% 0%,rgba(200,148,58,.2),transparent 62%),#fff8ea;}
.cpAskIcon{width:64px;height:64px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#fff;color:var(--chestnut);box-shadow:inset 0 0 0 1px var(--line-strong),0 10px 22px rgba(168,116,37,.14);}
.cpAskIcon svg{width:29px;height:29px;}
.cpAskText h3{margin:0;font-family:var(--serif);font-size:30px;font-weight:600;line-height:1.05;color:var(--ink);}
.cpAskText p{margin:8px 0 0;max-width:560px;font-size:15.5px;line-height:1.6;color:var(--sub);}

/* Category page */
.cpBack{margin:30px 0 16px;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 20px 0 14px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:650;color:var(--chestnut-deep);}
.cpBack svg{width:16px;height:16px;}
.cpBack:hover{border-color:var(--line-strong);}
.cpHero{display:grid;grid-template-columns:340px 1fr;gap:48px;align-items:center;padding:36px 44px;border:1px solid var(--line-strong);border-radius:36px;background:linear-gradient(180deg,#fffefb,#fdf6e8);box-shadow:var(--sh-2);}
.cpHeroArt{position:relative;height:320px;border-radius:var(--r-lg);background:radial-gradient(120% 90% at 50% 0%,#fff6e0,#f6e7c8 70%,#f0dcb6);border:1px solid var(--line);overflow:hidden;}
.cpHeroArt::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(138,93,59,.14) 1px,transparent 1px);background-size:16px 16px;opacity:.5;}
.cpHeroSvg{position:absolute;left:50%;bottom:-10px;width:340px;height:255px;transform:translateX(-50%);overflow:visible;filter:drop-shadow(0 16px 24px rgba(74,43,22,.2));}
.cpHeroTitle{margin:8px 0 0;font-family:var(--serif);font-size:clamp(46px,5vw,72px);font-weight:600;line-height:.98;letter-spacing:-.02em;color:var(--ink);}
.cpHeroDesc{margin:14px 0 0;max-width:560px;font-size:17.5px;line-height:1.65;color:var(--sub);}
.cpSpecs{margin:22px 0 0;display:flex;flex-wrap:wrap;gap:14px 32px;}
.cpSpecs > div{display:flex;flex-direction:column;gap:6px;}
.cpSpecs span:first-child{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpSpecs b{font-family:var(--serif);font-size:24px;font-weight:600;color:var(--chestnut-deep);}
.cpVerse{margin:24px 0 0;padding:4px 0 4px 20px;border-left:3px solid var(--gold);}
.cpVerse p{margin:0;font-family:var(--serif);font-style:italic;font-size:24px;line-height:1.3;color:var(--ink);}
.cpVerse cite{display:block;margin-top:8px;font-style:normal;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}

.cpSection{margin-top:64px;}
.cpSectionHead{margin-bottom:24px;text-align:center;}
.cpSectionHead .cpH2{margin-top:8px;}
.cpTopicGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}
.cpTopicCard{display:flex;flex-direction:column;justify-content:space-between;gap:26px;min-height:150px;padding:24px 22px 20px;border:1px solid var(--line);border-radius:var(--r-md);background:#fff;box-shadow:var(--sh-1);}
.cpTopicName{font-family:var(--serif);font-size:26px;font-weight:600;line-height:1.08;color:var(--ink);}

.cpMini{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.cpMiniCard{position:relative;display:flex;align-items:center;gap:14px;padding:10px 16px 10px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:#fff;cursor:pointer;text-align:left;transition:transform 200ms ease,box-shadow 200ms ease,border-color 200ms ease;}
.cpMiniCard:hover{transform:translateY(-3px);border-color:var(--line-strong);box-shadow:var(--sh-2);}
.cpMiniArt{flex:0 0 auto;width:76px;height:62px;border-radius:14px;background:linear-gradient(180deg,#fff6e0,#f3e2bd);}
.cpMiniText{display:flex;flex-direction:column;flex:1;min-width:0;}
.cpMiniName{font-family:var(--serif);font-size:20px;font-weight:600;line-height:1.1;color:var(--ink);}
.cpMiniSub{margin-top:2px;font-size:12.5px;color:var(--mute);}
.cpMiniArrow{width:16px;height:16px;color:var(--gold);flex:0 0 auto;}

/* Footer */
.cpFoot{position:relative;z-index:1;border-top:1px solid var(--line);background:rgba(255,253,249,.8);}
.cpFootInner{max-width:760px;margin:0 auto;padding:40px clamp(16px,3vw,40px) 44px;text-align:center;}
.cpFootMark{font-size:20px;color:var(--gold);}
.cpFootText{margin:10px 0 0;font-family:var(--serif);font-size:22px;font-style:italic;color:var(--chestnut-deep);}
.cpFootFine{margin:12px 0 0;font-size:12.5px;line-height:1.65;color:var(--mute);}
.cpFootFine a{color:var(--chestnut)!important;text-decoration:none;}
.cpFootFine a:hover{text-decoration:underline;}

/* Responsive */
@media (max-width:1240px){
  .cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpSearchPill{min-width:0;width:42px;padding:0;justify-content:center;}
  .cpSearchPill span,.cpSearchPill kbd{display:none;}
  .cpMini{grid-template-columns:repeat(3,minmax(0,1fr));}
}
@media (max-width:1040px){
  .cpNav{display:none;}
  .cpBurger{display:inline-flex;}
  .cpBar{height:68px;}
  .cpLogo{height:46px;}
  .cpSheet{display:flex;flex-direction:column;padding:6px clamp(16px,3vw,40px) 16px;border-top:1px solid var(--line);background:var(--ivory);animation:cpFade 160ms ease;}
  .cpSheetRow{padding:14px 4px;border:none;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left;font-family:var(--serif);font-size:24px;font-weight:600;color:var(--ink);text-decoration:none;}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .cpAsk{grid-template-columns:auto 1fr;}
  .cpAsk .cpBtn{grid-column:1 / -1;}
  .cpHero{grid-template-columns:1fr;gap:26px;padding:26px 24px 32px;text-align:center;}
  .cpHeroArt{height:280px;}
  .cpHeroDesc{margin-left:auto;margin-right:auto;}
  .cpSpecs{justify-content:center;}
  .cpSpecs .cpFormats{justify-content:center;}
  .cpVerse{text-align:left;}
  .cpTopicGrid,.cpMini{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  .cpIntro{padding-top:30px;}
  .cpFinder{border-radius:26px;}
  .cpFinderSearch input{height:52px;font-size:16px;}
  .cpFinderLabel{width:100%;margin-bottom:2px;}
  .cpTopicsHead{flex-direction:column;align-items:flex-start;}
  .cpGrid{grid-template-columns:1fr;gap:18px;}
  .cpAsk{grid-template-columns:1fr;padding:26px 22px;}
  .cpAskText h3{font-size:27px;}
  .cpHeroArt{height:240px;}
  .cpHeroSvg{width:290px;height:218px;}
  .cpVerse p{font-size:21px;}
  .cpTopicGrid{grid-template-columns:1fr 1fr;gap:12px;}
  .cpTopicCard{min-height:130px;padding:20px 16px 16px;}
  .cpTopicName{font-size:21px;}
  .cpMini{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
