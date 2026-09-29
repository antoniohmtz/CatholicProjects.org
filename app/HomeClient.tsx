"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Grade bands ───────────────────────────────────────────── */

const BANDS = [
  { key: "prek", label: "Pre-K – K", ages: "Ages 4–6", from: "Pre-K", to: "K" },
  { key: "early", label: "Grades 1–2", ages: "Ages 6–8", from: "Grade 1", to: "Grade 2" },
  { key: "middle", label: "Grades 3–5", ages: "Ages 8–11", from: "Grade 3", to: "Grade 5" },
  { key: "upper", label: "Grades 6–8", ages: "Ages 11–14", from: "Grade 6", to: "Grade 8" },
] as const;

type BandKey = (typeof BANDS)[number]["key"];

type Format = "coloring" | "craft" | "worksheet" | "activity";

const FORMAT_LABEL: Record<Format, string> = { coloring: "Coloring pages", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };

/* ── Edit your categories here ─────────────────────────────── */

type IconKey = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";

type Category = {
  slug: string;
  name: string;
  description: string;
  bands: BandKey[];
  formats: Format[];
  topics: string[];
  verse: string;
  reference: string;
  icon: IconKey;
  worksheets: number;
};

const CATEGORIES: Category[] = [
  {
    slug: "saints", name: "Saints", icon: "saints", worksheets: 0,
    description: "Four-panel coloring stories and stand-up saints that bring the heroes of the faith to life.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Four-panel stories", "Stand-up saints", "Feast day pages", "Patron saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", icon: "bible", worksheets: 0,
    description: "Scripture stories children can color, put in order, and retell, from Creation to the Resurrection.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "worksheet", "activity"],
    topics: ["Creation", "Noah’s Ark", "Parables of Jesus", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", icon: "mass", worksheets: 0,
    description: "Help children understand what happens at Mass, and why every part of it matters.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Parts of the Mass", "Sacred vessels", "Liturgical colors", "Mass responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", icon: "sacraments", worksheets: 0,
    description: "Preparation pages for First Reconciliation, First Communion, and Confirmation.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "craft"],
    topics: ["Baptism", "First Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", icon: "prayers", worksheets: 0,
    description: "Tracing pages and line-by-line guides for learning the prayers of the Church by heart.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "activity", "worksheet"],
    topics: ["Sign of the Cross", "Our Father", "Hail Mary", "Guardian Angel Prayer"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", icon: "seasons", worksheets: 0,
    description: "Advent wreaths, Lenten calendars, and Easter crafts for every season of the Church year.",
    bands: ["prek", "early", "middle", "upper"], formats: ["craft", "coloring", "activity"],
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", icon: "rosary", worksheets: 0,
    description: "Bead-by-bead coloring and mystery pages that teach children how to pray the Rosary.",
    bands: ["early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Kindness", icon: "virtues", worksheets: 0,
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

const ICONS: Record<IconKey, ReactNode> = {
  saints: (<><path d="M8 5.2a6 6 0 0 1 8 0" /><circle cx="12" cy="9.2" r="2.8" /><path d="M6.5 20.5c.4-3.6 2.6-6 5.5-6s5.1 2.4 5.5 6" /></>),
  bible: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /><path d="M11 7.5v5M9 9.5h4" /></>),
  mass: (<><circle cx="12" cy="4.2" r="1.7" /><path d="M7 7.5h10c0 4-2.2 6.5-5 6.5s-5-2.5-5-6.5Z" /><path d="M12 14v4" /><path d="M8.5 20.5c.6-1.6 1.9-2.5 3.5-2.5s2.9.9 3.5 2.5Z" /></>),
  sacraments: (<><path d="M12 3.5s5.5 6 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5Z" /><path d="M12 11v5.5M9.8 13.2h4.4" /></>),
  prayers: (<><path d="M12 3v18" /><path d="M7 8.5h10" /></>),
  seasons: (<><path d="M12 3.2c1.4 1.7 2.1 2.8 2.1 4a2.1 2.1 0 0 1-4.2 0c0-1.2.7-2.3 2.1-4Z" /><rect x="9.2" y="10.5" width="5.6" height="7.5" rx="1" /><path d="M5.5 20.5h13" /></>),
  rosary: (<><circle cx="17.5" cy="9" r="1.1" /><circle cx="15.9" cy="12.9" r="1.1" /><circle cx="8.1" cy="12.9" r="1.1" /><circle cx="6.5" cy="9" r="1.1" /><circle cx="8.1" cy="5.1" r="1.1" /><circle cx="12" cy="3.5" r="1.1" /><circle cx="15.9" cy="5.1" r="1.1" /><path d="M12 14.2v7M10.2 17.6h3.6" /></>),
  virtues: (<><path d="M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z" /><path d="M12 3v3M10.5 4.5h3" /></>),
};

const UI: Record<string, ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 8h16M4 16h16" /></>),
  caret: (<><path d="m7 10 5 5 5-5" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  enter: (<><path d="M20 5v7a3 3 0 0 1-3 3H5" /><path d="m9 11-4 4 4 4" /></>),
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
  return first && last ? `${first.from} – ${last.to}` : "";
}

function Ornament() {
  return (
    <div className="cpOrnament" aria-hidden="true">
      <span className="cpOrnLine" />
      <span className="cpOrnCross">✠</span>
      <span className="cpOrnLine" />
    </div>
  );
}

/* ── Search palette ────────────────────────────────────────── */

type Hit = { id: string; label: string; sub: string; cat: Category };

function Palette({ onClose, onOpen }: { onClose: () => void; onOpen: (slug: string) => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    const cats: Hit[] = CATEGORIES.filter((c) => !s || [c.name, c.description].join(" ").toLowerCase().includes(s)).map((c) => ({
      id: `c-${c.slug}`, label: c.name, sub: gradeRange(c), cat: c,
    }));
    const topics: Hit[] = !s ? [] : CATEGORIES.flatMap((c) =>
      c.topics.filter((t) => t.toLowerCase().includes(s)).map((t) => ({ id: `t-${c.slug}-${t}`, label: t, sub: `in ${c.name}`, cat: c }))
    );
    return [...cats, ...topics];
  }, [q]);

  useEffect(() => setIdx(0), [q]);

  const choose = (h: Hit | undefined) => {
    if (!h) return;
    onOpen(h.cat.slug);
    onClose();
  };

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, hits.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); choose(hits[idx]); }
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  return (
    <div className="cpPaletteBg" onMouseDown={onClose}>
      <div className="cpPalette" role="dialog" aria-modal="true" aria-label="Search the library" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cpPaletteTop">
          <Svg className="cpPaletteIcon">{UI.search}</Svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="What are you teaching? Try “Hail Mary” or “Advent”" aria-label="Search the library" />
          <kbd>esc</kbd>
        </div>
        <div className="cpPaletteList">
          {hits.length === 0 && <div className="cpPaletteEmpty">Nothing yet for “{q}”. Try a saint, a prayer, or a season.</div>}
          {hits.map((h, i) => (
            <button key={h.id} className={i === idx ? "cpHit cpHitOn" : "cpHit"} onMouseEnter={() => setIdx(i)} onClick={() => choose(h)}>
              <span className="cpDisc cpDiscSm"><Svg>{ICONS[h.cat.icon]}</Svg></span>
              <span className="cpHitText">
                <span className="cpHitLabel">{h.label}</span>
                <span className="cpHitSub">{h.sub}</span>
              </span>
              <Svg className="cpHitEnter">{UI.enter}</Svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Header ────────────────────────────────────────────────── */

type Menu = "browse" | "grades" | null;

function Header({ active, band, onHome, onOpen, onBand }: {
  active: Category | undefined; band: BandKey | null;
  onHome: () => void; onOpen: (slug: string) => void; onBand: (b: BandKey | null) => void;
}) {
  const [menu, setMenu] = useState<Menu>(null);
  const [palette, setPalette] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setMenu(null);
        setPalette(true);
      }
      if (e.key === "Escape") setMenu(null);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const closeAll = () => {
    setMenu(null);
    setMobile(false);
  };

  const toggle = (m: Exclude<Menu, null>) => setMenu((cur) => (cur === m ? null : m));

  return (
    <>
      <header className={scrolled ? "cpHead cpHeadScrolled" : "cpHead"}>
        <div className="cpBar" ref={wrapRef}>
          <button className="cpBrand" onClick={() => { closeAll(); onBand(null); onHome(); }} aria-label="CatholicProjects library home">
            <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
          </button>

          <nav className="cpNav" aria-label="Primary">
            <button className={!active && !band && !menu ? "cpLink cpLinkOn" : "cpLink"} onClick={() => { closeAll(); onBand(null); onHome(); }}>Home</button>

            <div className="cpDrop">
              <button className={menu === "browse" || active ? "cpLink cpLinkOn" : "cpLink"} aria-expanded={menu === "browse"} onClick={() => toggle("browse")}>
                Browse topics <Svg className={menu === "browse" ? "cpCaret cpCaretUp" : "cpCaret"} sw={2}>{UI.caret}</Svg>
              </button>
              {menu === "browse" && (
                <div className="cpMenu cpMenuWide" role="menu">
                  <div className="cpMenuTitle">What are you teaching?</div>
                  <div className="cpMenuGrid">
                    {CATEGORIES.map((c) => (
                      <button key={c.slug} role="menuitem" className={active?.slug === c.slug ? "cpMenuItem cpMenuItemOn" : "cpMenuItem"} onClick={() => { closeAll(); onOpen(c.slug); }}>
                        <span className="cpDisc cpDiscSm"><Svg>{ICONS[c.icon]}</Svg></span>
                        <span className="cpMenuText">
                          <span className="cpMenuName">{c.name}</span>
                          <span className="cpMenuSub">{gradeRange(c)}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="cpDrop">
              <button className={menu === "grades" || band ? "cpLink cpLinkOn" : "cpLink"} aria-expanded={menu === "grades"} onClick={() => toggle("grades")}>
                Find by grade <Svg className={menu === "grades" ? "cpCaret cpCaretUp" : "cpCaret"} sw={2}>{UI.caret}</Svg>
              </button>
              {menu === "grades" && (
                <div className="cpMenu" role="menu">
                  <div className="cpMenuTitle">Start with your class</div>
                  {BANDS.map((b) => (
                    <button key={b.key} role="menuitem" className={band === b.key ? "cpMenuItem cpMenuItemOn" : "cpMenuItem"} onClick={() => { closeAll(); onBand(b.key); }}>
                      <span className="cpMenuText">
                        <span className="cpMenuName">{b.label}</span>
                        <span className="cpMenuSub">{b.ages}</span>
                      </span>
                      <Svg className="cpMenuArrow">{UI.arrow}</Svg>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a className="cpLink" href="https://catholicprojects.org">About us</a>
          </nav>

          <div className="cpActions">
            <button className="cpSearchBtn" onClick={() => { setMenu(null); setPalette(true); }} aria-label="Search the library">
              <Svg className="cpSearchBtnIcon">{UI.search}</Svg>
              <span>Search</span>
              <kbd>/</kbd>
            </button>
            <a className="cpBtn cpBtnPrimary cpBtnSm cpHideSm" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Suggest a worksheet</a>
            <button className="cpIconBtn cpShowSm" onClick={() => setPalette(true)} aria-label="Search the library"><Svg>{UI.search}</Svg></button>
            <button className="cpIconBtn cpShowSm" onClick={() => setMobile((v) => !v)} aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile}>
              <Svg>{mobile ? UI.close : UI.menu}</Svg>
            </button>
          </div>
        </div>

        {mobile && (
          <div className="cpMobile">
            <button className="cpMobileRow" onClick={() => { closeAll(); onBand(null); onHome(); }}>Home</button>
            <span className="cpMobileLabel">Browse topics</span>
            <div className="cpMobileGrid">
              {CATEGORIES.map((c) => (
                <button key={c.slug} className="cpMobileCat" onClick={() => { closeAll(); onOpen(c.slug); }}>
                  <span className="cpDisc cpDiscSm"><Svg>{ICONS[c.icon]}</Svg></span>{c.name}
                </button>
              ))}
            </div>
            <span className="cpMobileLabel">Find by grade</span>
            <div className="cpMobileGrid">
              {BANDS.map((b) => (
                <button key={b.key} className="cpMobileCat cpMobileBand" onClick={() => { closeAll(); onBand(b.key); }}>
                  <span>{b.label}<em>{b.ages}</em></span>
                </button>
              ))}
            </div>
            <a className="cpBtn cpBtnPrimary cpMobileSuggest" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Suggest a worksheet</a>
          </div>
        )}
        <div className="cpRule" aria-hidden="true" />
      </header>

      {palette && <Palette onClose={() => setPalette(false)} onOpen={onOpen} />}
    </>
  );
}

/* ── Category card ─────────────────────────────────────────── */

function CategoryCard({ c, onOpen }: { c: Category; onOpen: (slug: string) => void }) {
  return (
    <button className="cpCat" onClick={() => onOpen(c.slug)} aria-label={`Open ${c.name}`}>
      <span className="cpCatMark" aria-hidden="true"><Svg sw={1.1}>{ICONS[c.icon]}</Svg></span>
      <span className="cpDisc"><Svg sw={1.5}>{ICONS[c.icon]}</Svg></span>
      <span className="cpCatName">{c.name}</span>
      <span className="cpCatDesc">{c.description}</span>

      <span className="cpCatMeta">
        <span className="cpCatMetaLabel">For</span>
        <span className="cpCatMetaValue">{gradeRange(c)}</span>
      </span>

      <span className="cpFormats">
        {c.formats.map((f) => <span key={f} className="cpFormat">{FORMAT_LABEL[f]}</span>)}
      </span>

      <span className="cpCatFoot">
        <span className="cpStatus">
          <span className="cpStatusDot" />
          {c.worksheets > 0 ? `${c.worksheets} ready to print` : "Opening soon"}
        </span>
        <span className="cpOpen">Open <Svg className="cpOpenIcon" sw={2}>{UI.arrow}</Svg></span>
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
        <p className="cpLead">
          Free, print-ready Catholic activities for children, made by a catechist for catechists. Find something by topic, season, or grade, and be ready in minutes.
        </p>

        <label className="cpHeroSearch">
          <Svg className="cpHeroSearchIcon">{UI.search}</Svg>
          <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="What are you teaching? Try “Advent”, “Hail Mary”, or “First Communion”" aria-label="Search topics" autoComplete="off" />
        </label>

        <div className="cpComing">
          <span className="cpComingLabel">Coming up:</span>
          {COMING_UP.map((x) => (
            <button key={x.label} className="cpComingChip" onClick={() => onOpen(x.slug)}>{x.label}</button>
          ))}
        </div>

        <ul className="cpPromises">
          <li><Svg sw={2}>{UI.check}</Svg> Free forever</li>
          <li><Svg sw={2}>{UI.print}</Svg> Print-ready</li>
          <li><Svg sw={2}>{UI.book}</Svg> Built from Catholic sources</li>
        </ul>
      </section>

      <section className="cpGrades" aria-label="Start with your class">
        <div className="cpGradesHead">
          <span className="cpEyebrow">Start with your class</span>
          <h2 className="cpH2">Who are you teaching?</h2>
        </div>
        <div className="cpGradeRow">
          {BANDS.map((b) => (
            <button key={b.key} className={band === b.key ? "cpGrade cpGradeOn" : "cpGrade"} aria-pressed={band === b.key} onClick={() => onBand(band === b.key ? null : b.key)}>
              <span className="cpGradeLabel">{b.label}</span>
              <span className="cpGradeAges">{b.ages}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cpTopics" id="topics">
        <div className="cpTopicsHead">
          <div>
            <span className="cpEyebrow">Browse topics</span>
            <h2 className="cpH2">
              {activeBand ? <>Topics for <em>{activeBand.label}</em></> : <>Choose a topic</>}
            </h2>
          </div>
          {(band || query) && (
            <button className="cpClear" onClick={() => { onBand(null); onQuery(""); }}>Show everything</button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="cpEmpty">
            <span className="cpEmptyMark">✠</span>
            <p className="cpEmptyTitle">We don’t have that yet.</p>
            <p>Tell us what you’re teaching and we’ll make it a priority.</p>
            <a className="cpBtn cpBtnPrimary" href={`mailto:team@catholicprojects.org?subject=${encodeURIComponent("Worksheet idea: " + query)}`}>Suggest “{query || "a topic"}”</a>
          </div>
        ) : (
          <div className="cpGrid">
            {results.map((c) => <CategoryCard key={c.slug} c={c} onOpen={onOpen} />)}
          </div>
        )}
      </section>

      <section className="cpAsk">
        <span className="cpAskIcon"><Svg sw={1.5}>{UI.mail}</Svg></span>
        <div className="cpAskText">
          <h3>Teaching something we don’t have yet?</h3>
          <p>Tell us the lesson, the grade, and the date you need it. Real classroom requests decide what gets made next.</p>
        </div>
        <a className="cpBtn cpBtnPrimary" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Suggest a worksheet</a>
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
        <div className="cpHeroDisc"><Svg sw={1.2}>{ICONS[c.icon]}</Svg></div>
        <div className="cpHeroBody">
          <span className="cpEyebrow">Topic</span>
          <h1 className="cpHeroTitle">{c.name}</h1>
          <p className="cpHeroDesc">{c.description}</p>

          <div className="cpFacts">
            <div><span>Grades</span><b>{gradeRange(c)}</b></div>
            <div><span>You’ll find</span><b>{c.formats.map((f) => FORMAT_LABEL[f]).join(" · ")}</b></div>
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
              <span className="cpTopicState"><span className="cpStatusDot" /> In preparation</span>
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
        <Ornament />
        <div className="cpSectionHead">
          <span className="cpEyebrow">Keep browsing</span>
          <h2 className="cpH2">Other topics</h2>
        </div>
        <div className="cpMini">
          {others.map((o) => (
            <button key={o.slug} className="cpMiniCard" onClick={() => onOpen(o.slug)}>
              <span className="cpDisc cpDiscSm"><Svg>{ICONS[o.icon]}</Svg></span>
              <span className="cpMenuText">
                <span className="cpMenuName">{o.name}</span>
                <span className="cpMenuSub">{gradeRange(o)}</span>
              </span>
              <Svg className="cpMenuArrow">{UI.arrow}</Svg>
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

  const push = (s: string | null, b: BandKey | null, toTop: boolean) => {
    const p = new URLSearchParams();
    if (s) p.set("category", s);
    if (b) p.set("grade", b);
    const qs = p.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
    if (toTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (s: string) => {
    setSlug(s);
    setQuery("");
    push(s, band, true);
  };

  const goHome = () => {
    setSlug(null);
    push(null, band, true);
  };

  const chooseBand = (b: BandKey | null) => {
    setBand(b);
    setSlug(null);
    push(null, b, false);
    window.setTimeout(() => {
      const el = document.getElementById("topics");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  };

  const active = bySlug(slug);

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <div className="cpGlow" aria-hidden="true" />

      <Header active={active} band={band} onHome={goHome} onOpen={openCategory} onBand={chooseBand} />

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
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d9a84e;--tint:#f8ecd3;--ink:#2b211a;--sub:#6a5d52;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--line:rgba(111,67,39,.13);
  --ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  position:relative;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;font-family:var(--ui);color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fdf8ef 50%,#fbf4e8 100%);-webkit-font-smoothing:antialiased;}
.cpRoot *{box-sizing:border-box;}
.cpRoot button{font-family:inherit;}
.cpRoot a{color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:12px;}
.cpRoot kbd{font-family:var(--ui);}
.cpGlow{position:absolute;top:-380px;left:50%;width:1000px;height:1000px;transform:translateX(-50%);border-radius:999px;pointer-events:none;background:radial-gradient(circle,rgba(200,148,58,.17),rgba(200,148,58,.05) 45%,transparent 70%);}

/* Header */
.cpHead{position:sticky;top:0;z-index:60;background:rgba(255,253,249,.94);backdrop-filter:saturate(1.3) blur(16px);-webkit-backdrop-filter:saturate(1.3) blur(16px);transition:box-shadow 240ms ease;}
.cpHeadScrolled{box-shadow:0 12px 34px rgba(46,29,16,.08);}
.cpBar{position:relative;max-width:1320px;margin:0 auto;height:100px;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:36px;transition:height 240ms ease;}
.cpHeadScrolled .cpBar{height:78px;}
.cpBrand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cpLogo{height:74px;width:auto;display:block;transition:height 240ms ease;}
.cpHeadScrolled .cpLogo{height:56px;}
.cpRule{height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.6) 15%,rgba(200,148,58,.6) 85%,transparent);}

.cpNav{display:flex;align-items:center;gap:2px;}
.cpLink{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 16px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:15.5px;font-weight:600;color:#5b4535;text-decoration:none;white-space:nowrap;transition:background 150ms ease,color 150ms ease;}
.cpLink:hover{background:var(--tint);color:var(--ink);}
.cpLinkOn{background:var(--tint);color:var(--ink);}
.cpCaret{width:15px;height:15px;opacity:.65;transition:transform 200ms ease;}
.cpCaretUp{transform:rotate(180deg);}

.cpDrop{position:relative;}
.cpMenu{position:absolute;top:calc(100% + 12px);left:0;width:320px;padding:12px;background:#fffdf9;border:1px solid var(--line);border-radius:22px;box-shadow:0 34px 80px rgba(46,29,16,.18);animation:cpIn 170ms cubic-bezier(.2,.8,.2,1);}
.cpMenuWide{width:600px;}
@keyframes cpIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
.cpMenuTitle{padding:8px 12px 12px;font-family:var(--serif);font-size:24px;font-weight:600;color:var(--ink);}
.cpMenuGrid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
.cpMenuItem{display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border:none;border-radius:14px;background:transparent;cursor:pointer;text-align:left;transition:background 140ms ease;}
.cpMenuItem:hover,.cpMenuItemOn{background:var(--cream);}
.cpMenuText{display:flex;flex-direction:column;min-width:0;flex:1;}
.cpMenuName{font-size:15.5px;font-weight:650;color:var(--ink);}
.cpMenuSub{margin-top:1px;font-size:13px;color:var(--mute);}
.cpMenuArrow{width:16px;height:16px;color:var(--gold);flex:0 0 auto;}

.cpDisc{flex:0 0 auto;width:64px;height:64px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:radial-gradient(circle at 35% 28%,#fff8e6,var(--tint) 70%);color:var(--chestnut);box-shadow:inset 0 0 0 1px rgba(200,148,58,.4),0 8px 18px rgba(168,116,37,.12);transition:transform 260ms cubic-bezier(.2,.8,.2,1);}
.cpDisc svg{width:32px;height:32px;}
.cpDiscSm{width:42px;height:42px;}
.cpDiscSm svg{width:21px;height:21px;}

.cpActions{margin-left:auto;display:flex;align-items:center;gap:10px;}
.cpSearchBtn{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 10px 0 16px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;color:var(--sub);font-size:14.5px;font-weight:550;transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpSearchBtn:hover{border-color:rgba(200,148,58,.55);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cpSearchBtnIcon{width:18px;height:18px;color:var(--chestnut);}
.cpSearchBtn kbd{min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:6px;background:var(--cream);font-size:12px;font-weight:600;color:var(--mute);}
.cpIconBtn{display:none;width:46px;height:46px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;color:var(--ink);}
.cpIconBtn svg{width:21px;height:21px;}
.cpShowSm{display:none;}

/* Buttons */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:52px;padding:0 26px;border-radius:999px;font-size:15px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease;}
.cpBtnSm{height:44px;padding:0 22px;font-size:14.5px;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 24px rgba(168,116,37,.26);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 14px 30px rgba(168,116,37,.34);}

/* Palette */
.cpPaletteBg{position:fixed;inset:0;z-index:100;display:flex;justify-content:center;align-items:flex-start;padding:12vh 16px 16px;background:rgba(43,33,26,.45);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);animation:cpFade 160ms ease;}
.cpPalette{width:min(660px,100%);border:1px solid rgba(200,148,58,.4);border-radius:26px;background:#fffdf9;box-shadow:0 50px 120px rgba(0,0,0,.3);overflow:hidden;animation:cpIn 200ms cubic-bezier(.2,.8,.2,1);}
.cpPaletteTop{display:flex;align-items:center;gap:14px;padding:0 22px;height:72px;border-bottom:1px solid var(--line);}
.cpPaletteIcon{width:23px;height:23px;color:var(--chestnut);flex:0 0 auto;}
.cpPaletteTop input{flex:1;min-width:0;height:100%;border:none;background:transparent;outline:none;font-size:18px;font-weight:500;color:var(--ink);font-family:var(--ui);}
.cpPaletteTop input::placeholder{color:var(--mute);}
.cpPalette kbd{padding:3px 8px;border:1px solid var(--line);border-radius:7px;background:var(--cream);font-size:11px;font-weight:600;color:var(--mute);}
.cpPaletteList{max-height:min(420px,56vh);overflow-y:auto;padding:8px;}
.cpHit{display:flex;align-items:center;gap:14px;width:100%;padding:10px 12px;border:none;border-radius:16px;background:transparent;cursor:pointer;text-align:left;}
.cpHitOn{background:var(--cream);box-shadow:inset 0 0 0 1px rgba(200,148,58,.32);}
.cpHitText{display:flex;flex-direction:column;flex:1;min-width:0;}
.cpHitLabel{font-size:16.5px;font-weight:650;color:var(--ink);}
.cpHitSub{font-size:13px;color:var(--mute);}
.cpHitEnter{width:17px;height:17px;color:var(--gold);opacity:0;}
.cpHitOn .cpHitEnter{opacity:1;}
.cpPaletteEmpty{padding:36px 16px;text-align:center;font-size:15px;color:var(--sub);}

/* Main */
.cpMain{position:relative;z-index:1;flex:1;width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,3vw,40px) 96px;}
.cpReady{animation:cpFade 340ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}
.cpEyebrow{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}

.cpIntro{padding:64px 0 8px;display:flex;flex-direction:column;align-items:center;text-align:center;}
.cpWelcome{display:inline-flex;align-items:center;gap:9px;padding:9px 18px;border:1px solid rgba(200,148,58,.4);border-radius:999px;background:rgba(255,255,255,.75);font-size:14px;font-weight:650;color:var(--chestnut-deep);}
.cpWelcomeIcon{width:17px;height:17px;color:var(--gold);fill:rgba(200,148,58,.25);}
.cpH1{margin:26px 0 0;max-width:900px;font-family:var(--serif);font-weight:600;font-size:clamp(46px,6vw,86px);line-height:.98;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;}
.cpH1 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpLead{margin:24px 0 0;max-width:640px;font-size:clamp(17px,1.4vw,19px);line-height:1.7;color:var(--sub);text-wrap:pretty;}

.cpHeroSearch{position:relative;width:min(100%,720px);margin-top:34px;display:flex;align-items:center;}
.cpHeroSearchIcon{position:absolute;left:24px;width:24px;height:24px;color:var(--chestnut);pointer-events:none;}
.cpHeroSearch input{width:100%;height:68px;padding:0 26px 0 62px;border:1.5px solid rgba(200,148,58,.45);border-radius:999px;background:#fff;color:var(--ink);font-family:var(--ui);font-size:17px;outline:none;box-shadow:0 18px 44px rgba(74,43,22,.09);transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpHeroSearch input::placeholder{color:var(--mute);}
.cpHeroSearch input:focus{border-color:var(--gold);box-shadow:0 18px 44px rgba(74,43,22,.09),0 0 0 5px rgba(200,148,58,.16);}

.cpComing{margin-top:20px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;}
.cpComingLabel{font-size:14px;font-weight:600;color:var(--sub);margin-right:2px;}
.cpComingChip{height:38px;padding:0 16px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.8);cursor:pointer;font-size:14px;font-weight:600;color:var(--chestnut-deep);transition:border-color 150ms ease,background 150ms ease;}
.cpComingChip:hover{border-color:rgba(200,148,58,.6);background:var(--tint);}
.cpPromises{margin:26px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:10px 26px;font-size:14.5px;font-weight:600;color:var(--sub);}
.cpPromises li{display:inline-flex;align-items:center;gap:8px;}
.cpPromises svg{width:18px;height:18px;color:var(--gold);}

/* Grades */
.cpGrades{margin-top:64px;padding:38px clamp(18px,3vw,44px) 40px;border:1px solid rgba(200,148,58,.3);border-radius:32px;background:linear-gradient(180deg,#fffefb,#fdf6e8);box-shadow:0 22px 56px rgba(74,43,22,.07);}
.cpGradesHead{text-align:center;margin-bottom:24px;}
.cpH2{margin:10px 0 0;font-family:var(--serif);font-size:clamp(34px,3.6vw,48px);font-weight:600;line-height:1.05;color:var(--ink);}
.cpH2 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpGradeRow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}
.cpGrade{display:flex;flex-direction:column;align-items:center;gap:6px;padding:26px 16px 24px;border:1.5px solid var(--line);border-radius:24px;background:#fff;cursor:pointer;transition:transform 200ms ease,border-color 200ms ease,box-shadow 200ms ease,background 200ms ease;}
.cpGrade:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.6);box-shadow:0 18px 40px rgba(74,43,22,.1);}
.cpGradeOn{border-color:var(--gold);background:var(--tint);box-shadow:0 0 0 4px rgba(200,148,58,.16);}
.cpGradeLabel{font-family:var(--serif);font-size:30px;font-weight:600;line-height:1;color:var(--ink);}
.cpGradeAges{font-size:14px;font-weight:550;color:var(--sub);}

/* Topics */
.cpTopics{margin-top:72px;scroll-margin-top:120px;}
.cpTopicsHead{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:28px;}
.cpClear{height:42px;padding:0 20px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14px;font-weight:650;color:var(--chestnut-deep);}
.cpClear:hover{border-color:rgba(200,148,58,.55);}
.cpGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px;}

.cpCat{position:relative;display:flex;flex-direction:column;align-items:flex-start;padding:28px 26px 22px;border:1px solid var(--line);border-radius:28px;background:linear-gradient(180deg,#fff,#fffbf3);cursor:pointer;text-align:left;overflow:hidden;box-shadow:0 14px 38px rgba(74,43,22,.06);transition:transform 260ms cubic-bezier(.2,.8,.2,1),box-shadow 260ms ease,border-color 260ms ease;}
.cpCat:hover{transform:translateY(-6px);border-color:rgba(200,148,58,.55);box-shadow:0 30px 60px rgba(74,43,22,.13);}
.cpCat:hover .cpDisc{transform:scale(1.07) rotate(-4deg);}
.cpCatMark{position:absolute;top:-18px;right:-18px;width:150px;height:150px;color:rgba(200,148,58,.11);pointer-events:none;}
.cpCatMark svg{width:100%;height:100%;}
.cpCatName{margin-top:20px;font-family:var(--serif);font-size:32px;font-weight:600;line-height:1.02;letter-spacing:-.01em;color:var(--ink);}
.cpCatDesc{margin-top:12px;font-size:15.5px;line-height:1.62;color:var(--sub);text-wrap:pretty;}
.cpCatMeta{margin-top:18px;display:flex;align-items:baseline;gap:8px;padding-top:16px;width:100%;border-top:1px dashed rgba(200,148,58,.4);}
.cpCatMetaLabel{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpCatMetaValue{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--chestnut-deep);}
.cpFormats{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;}
.cpFormat{padding:6px 12px;border-radius:999px;background:var(--tint);font-size:13px;font-weight:600;color:var(--chestnut-deep);}
.cpCatFoot{margin-top:auto;padding-top:22px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.cpStatus{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:650;color:var(--sub);}
.cpStatusDot{width:8px;height:8px;border-radius:999px;background:var(--gold);flex:0 0 auto;animation:cpPulse 2.4s ease-out infinite;}
@keyframes cpPulse{0%{box-shadow:0 0 0 0 rgba(200,148,58,.5);}70%{box-shadow:0 0 0 8px rgba(200,148,58,0);}100%{box-shadow:0 0 0 0 rgba(200,148,58,0);}}
.cpOpen{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:700;color:var(--chestnut);}
.cpOpenIcon{width:17px;height:17px;color:var(--gold);transition:transform 200ms ease;}
.cpCat:hover .cpOpenIcon{transform:translateX(4px);}

.cpEmpty{margin:0 auto;max-width:560px;padding:52px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;color:var(--sub);border:1px solid var(--line);border-radius:28px;background:rgba(255,255,255,.75);}
.cpEmptyMark{font-size:28px;color:var(--gold);}
.cpEmptyTitle{margin:10px 0 4px;font-family:var(--serif);font-size:32px;font-weight:600;color:var(--ink);}
.cpEmpty .cpBtn{margin-top:20px;}

/* Ask band */
.cpAsk{margin-top:64px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px;padding:32px 38px;border:1px solid rgba(200,148,58,.4);border-radius:30px;background:radial-gradient(90% 160% at 0% 0%,rgba(200,148,58,.2),transparent 62%),#fff8ea;}
.cpAskIcon{width:66px;height:66px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#fff;color:var(--chestnut);box-shadow:inset 0 0 0 1px rgba(200,148,58,.45),0 10px 22px rgba(168,116,37,.14);}
.cpAskIcon svg{width:30px;height:30px;}
.cpAskText h3{margin:0;font-family:var(--serif);font-size:32px;font-weight:600;line-height:1.05;color:var(--ink);}
.cpAskText p{margin:8px 0 0;max-width:560px;font-size:16px;line-height:1.6;color:var(--sub);}

/* Category page */
.cpBack{margin:34px 0 18px;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 20px 0 14px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:650;color:var(--chestnut-deep);}
.cpBack svg{width:16px;height:16px;}
.cpBack:hover{border-color:rgba(200,148,58,.55);}
.cpHero{display:grid;grid-template-columns:300px 1fr;gap:50px;align-items:center;padding:44px 48px;border:1px solid rgba(200,148,58,.32);border-radius:36px;background:linear-gradient(180deg,#fffefb,#fdf6e8);box-shadow:0 26px 64px rgba(74,43,22,.09);}
.cpHeroDisc{width:260px;height:260px;margin:0 auto;display:flex;align-items:center;justify-content:center;border-radius:999px;background:radial-gradient(circle at 35% 28%,#fff8e6,var(--tint) 72%);color:var(--chestnut);box-shadow:inset 0 0 0 1px rgba(200,148,58,.45),0 0 0 14px rgba(200,148,58,.08),0 24px 50px rgba(168,116,37,.16);}
.cpHeroDisc svg{width:120px;height:120px;}
.cpHeroTitle{margin:8px 0 0;font-family:var(--serif);font-size:clamp(48px,5.4vw,78px);font-weight:600;line-height:.98;letter-spacing:-.02em;color:var(--ink);}
.cpHeroDesc{margin:16px 0 0;max-width:560px;font-size:18px;line-height:1.7;color:var(--sub);}
.cpFacts{margin:24px 0 0;display:flex;flex-wrap:wrap;gap:28px;}
.cpFacts div{display:flex;flex-direction:column;gap:4px;}
.cpFacts span{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpFacts b{font-family:var(--serif);font-size:22px;font-weight:600;color:var(--chestnut-deep);}
.cpVerse{margin:26px 0 0;padding:6px 0 6px 22px;border-left:3px solid var(--gold);}
.cpVerse p{margin:0;font-family:var(--serif);font-style:italic;font-size:25px;line-height:1.3;color:var(--ink);}
.cpVerse cite{display:block;margin-top:8px;font-style:normal;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}

.cpSection{margin-top:68px;}
.cpSectionHead{margin-bottom:26px;text-align:center;}
.cpTopicGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
.cpTopicCard{display:flex;flex-direction:column;justify-content:space-between;gap:26px;min-height:150px;padding:26px 24px 22px;border:1px solid var(--line);border-radius:24px;background:#fff;box-shadow:0 10px 28px rgba(74,43,22,.05);}
.cpTopicName{font-family:var(--serif);font-size:27px;font-weight:600;line-height:1.08;color:var(--ink);}
.cpTopicState{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:650;color:var(--sub);}

.cpMini{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.cpMiniCard{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--line);border-radius:20px;background:#fff;cursor:pointer;text-align:left;transition:transform 200ms ease,box-shadow 200ms ease,border-color 200ms ease;}
.cpMiniCard:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.5);box-shadow:0 16px 34px rgba(74,43,22,.1);}

.cpOrnament{width:100%;max-width:520px;margin:0 auto 34px;display:flex;align-items:center;gap:18px;}
.cpOrnLine{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.6));}
.cpOrnLine:last-child{background:linear-gradient(90deg,rgba(200,148,58,.6),transparent);}
.cpOrnCross{font-size:20px;color:var(--gold);line-height:1;}

/* Footer */
.cpFoot{position:relative;z-index:1;border-top:1px solid var(--line);background:rgba(255,253,249,.75);}
.cpFootInner{max-width:760px;margin:0 auto;padding:40px clamp(16px,3vw,40px) 44px;text-align:center;}
.cpFootMark{font-size:20px;color:var(--gold);}
.cpFootText{margin:10px 0 0;font-family:var(--serif);font-size:22px;font-style:italic;color:var(--chestnut-deep);}
.cpFootFine{margin:12px 0 0;font-size:12.5px;line-height:1.65;color:var(--mute);}
.cpFootFine a{color:var(--chestnut)!important;text-decoration:none;}
.cpFootFine a:hover{text-decoration:underline;}

/* Mobile menu */
.cpMobile{display:none;}

@media (max-width:1240px){
  .cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpSearchBtn span,.cpSearchBtn kbd{display:none;}
  .cpSearchBtn{width:44px;padding:0;justify-content:center;}
  .cpBar{gap:24px;}
  .cpMini{grid-template-columns:repeat(3,minmax(0,1fr));}
}
@media (max-width:1040px){
  .cpNav,.cpSearchBtn,.cpHideSm{display:none;}
  .cpShowSm,.cpIconBtn{display:inline-flex;}
  .cpBar{height:84px;}
  .cpHeadScrolled .cpBar{height:70px;}
  .cpLogo{height:60px;}
  .cpHeadScrolled .cpLogo{height:48px;}
  .cpMobile{display:flex;flex-direction:column;max-height:calc(100svh - 90px);overflow-y:auto;padding:14px clamp(16px,3vw,40px) 26px;background:var(--ivory);border-top:1px solid var(--line);animation:cpIn 200ms ease;}
  .cpMobileRow{padding:14px 4px;border:none;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left;font-family:var(--serif);font-size:28px;font-weight:600;color:var(--ink);}
  .cpMobileLabel{margin:20px 4px 10px;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
  .cpMobileGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .cpMobileCat{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:18px;background:#fff;cursor:pointer;text-align:left;font-size:15px;font-weight:650;color:var(--ink);}
  .cpMobileBand span{display:flex;flex-direction:column;font-family:var(--serif);font-size:21px;font-weight:600;}
  .cpMobileBand em{font-family:var(--ui);font-style:normal;font-size:13px;font-weight:500;color:var(--mute);}
  .cpMobileSuggest{margin-top:22px;}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .cpGradeRow{grid-template-columns:repeat(2,minmax(0,1fr));}
  .cpAsk{grid-template-columns:auto 1fr;}
  .cpAsk .cpBtn{grid-column:1 / -1;}
  .cpHero{grid-template-columns:1fr;gap:26px;padding:34px 26px;text-align:center;}
  .cpHeroDisc{width:200px;height:200px;}
  .cpHeroDisc svg{width:92px;height:92px;}
  .cpHeroDesc{margin-left:auto;margin-right:auto;}
  .cpFacts{justify-content:center;}
  .cpVerse{text-align:left;}
  .cpTopicGrid,.cpMini{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  .cpLogo{height:52px;}
  .cpIntro{padding-top:40px;}
  .cpHeroSearch input{height:60px;font-size:16px;padding-left:56px;}
  .cpHeroSearchIcon{left:20px;width:22px;height:22px;}
  .cpGrades{padding:28px 16px 26px;border-radius:26px;}
  .cpGradeRow{gap:10px;}
  .cpGrade{padding:20px 10px 18px;border-radius:20px;}
  .cpGradeLabel{font-size:24px;}
  .cpTopicsHead{flex-direction:column;align-items:flex-start;}
  .cpGrid{grid-template-columns:1fr;gap:18px;}
  .cpAsk{grid-template-columns:1fr;padding:28px 22px;text-align:left;}
  .cpAskText h3{font-size:28px;}
  .cpMobileGrid{grid-template-columns:1fr;}
  .cpVerse p{font-size:21px;}
  .cpTopicGrid{grid-template-columns:1fr 1fr;gap:12px;}
  .cpTopicCard{padding:20px 18px 18px;min-height:130px;}
  .cpTopicName{font-size:22px;}
  .cpMini{grid-template-columns:1fr;}
  .cpPaletteBg{padding-top:8vh;}
  .cpPaletteTop input{font-size:16px;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
