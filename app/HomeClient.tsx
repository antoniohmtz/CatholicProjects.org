"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Age bands ─────────────────────────────────────────────── */

const BANDS = [
  { key: "prek", label: "Pre-K – K", ages: "Ages 4–6", from: "Pre-K", to: "K" },
  { key: "early", label: "Grades 1–2", ages: "Ages 6–8", from: "Grade 1", to: "Grade 2" },
  { key: "middle", label: "Grades 3–5", ages: "Ages 8–11", from: "Grade 3", to: "Grade 5" },
  { key: "upper", label: "Grades 6–8", ages: "Ages 11–14", from: "Grade 6", to: "Grade 8" },
] as const;

type BandKey = (typeof BANDS)[number]["key"];

/* ── Activity formats ──────────────────────────────────────── */

type Format = "coloring" | "craft" | "worksheet" | "activity";

const FORMAT_LABEL: Record<Format, string> = { coloring: "Coloring", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };

/* ── Edit your categories here ─────────────────────────────── */

type IconKey = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";

type Category = {
  slug: string;
  name: string;
  latin: string;
  numeral: string;
  description: string;
  bands: BandKey[];
  formats: Format[];
  topics: string[];
  verse: string;
  reference: string;
  accent: string;
  icon: IconKey;
  worksheets: number;
};

const CATEGORIES: Category[] = [
  {
    slug: "saints", name: "Saints", latin: "Sancti", numeral: "I", icon: "saints", accent: "#a87a2c", worksheets: 0,
    description: "Four-panel coloring stories and stand-up saints that bring the heroes of the faith to life.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Four-panel stories", "Stand-up saints", "Feast day pages", "Patron saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", latin: "Sacra Scriptura", numeral: "II", icon: "bible", accent: "#4f6b4a", worksheets: 0,
    description: "Scripture stories children can color, sequence, and retell, from Creation to the Resurrection.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "worksheet", "activity"],
    topics: ["Creation", "Noah’s Ark", "Parables of Jesus", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", latin: "Sancta Missa", numeral: "III", icon: "mass", accent: "#7a2e33", worksheets: 0,
    description: "Help children understand what happens at Mass, and why every part of it matters.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Parts of the Mass", "Sacred vessels", "Liturgical colors", "Mass responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", latin: "Sacramenta", numeral: "IV", icon: "sacraments", accent: "#2f6570", worksheets: 0,
    description: "Preparation pages for First Reconciliation, First Communion, and Confirmation.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "craft"],
    topics: ["Baptism", "First Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", latin: "Orationes", numeral: "V", icon: "prayers", accent: "#7d5436", worksheets: 0,
    description: "Tracing pages and line-by-line guides for learning the prayers of the Church by heart.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "activity", "worksheet"],
    topics: ["Sign of the Cross", "Our Father", "Hail Mary", "Guardian Angel Prayer"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", latin: "Annus Liturgicus", numeral: "VI", icon: "seasons", accent: "#5a4273", worksheets: 0,
    description: "Advent wreaths, Lenten calendars, and Easter crafts for every season of the Church year.",
    bands: ["prek", "early", "middle", "upper"], formats: ["craft", "coloring", "activity"],
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", latin: "Rosarium", numeral: "VII", icon: "rosary", accent: "#3d5a86", worksheets: 0,
    description: "Bead-by-bead coloring and mystery pages that teach children how to pray the Rosary.",
    bands: ["early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Kindness", latin: "Virtutes", numeral: "VIII", icon: "virtues", accent: "#8c4a2a", worksheets: 0,
    description: "Everyday lessons in kindness, honesty, and mercy, rooted in the Commandments.",
    bands: ["prek", "early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Ten Commandments", "Fruits of the Spirit", "Works of mercy", "Loving our neighbor"],
    verse: "And now there remain faith, hope, and charity, these three.", reference: "1 Corinthians 13:13",
  },
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

const FORMAT_ICONS: Record<Format, ReactNode> = {
  coloring: (<><path d="M4 20c2.5 0 4-1.3 4-3.5a2.5 2.5 0 0 0-5 0" /><path d="m8.5 14.5 10-10a1.8 1.8 0 0 1 2.5 2.5l-10 10" /></>),
  craft: (<><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8.2 20 18M8 15.8 20 6" /></>),
  worksheet: (<><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6M9 15.5h6" /></>),
  activity: (<><path d="M5 4h6v2.5a1.5 1.5 0 1 0 3 0V4h5v6h-2.5a1.5 1.5 0 1 0 0 3H19v7h-6v-2.5a1.5 1.5 0 1 0-3 0V20H5v-6h2.5a1.5 1.5 0 1 0 0-3H5Z" /></>),
};

const UI: Record<string, ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  external: (<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 8h16M4 16h16" /></>),
  caret: (<><path d="m7 10 5 5 5-5" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  quill: (<><path d="M20 4c-6 0-11 4.5-12.5 11L6 20" /><path d="M20 4c0 6-4 10.5-10.5 11.5" /><path d="M9 14.5 13.5 10" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  enter: (<><path d="M20 5v7a3 3 0 0 1-3 3H5" /><path d="m9 11-4 4 4 4" /></>),
  child: (<><circle cx="12" cy="6" r="2.5" /><path d="M7 21v-5l-2-3 3-2h8l3 2-2 3v5" /></>),
};

function Svg({ children, className, sw = 1.6 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const accentStyle = (c: Category) => ({ "--accent": c.accent }) as CSSProperties;
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

type Hit = { id: string; kind: "category" | "topic"; label: string; sub: string; cat: Category };

function Palette({ onClose, onOpen }: { onClose: () => void; onOpen: (slug: string) => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const s = q.trim().toLowerCase();
    const cats: Hit[] = CATEGORIES.filter((c) => !s || [c.name, c.latin, c.description].join(" ").toLowerCase().includes(s)).map((c) => ({
      id: `c-${c.slug}`, kind: "category", label: c.name, sub: `${c.latin} · ${gradeRange(c)}`, cat: c,
    }));
    const topics: Hit[] = !s ? [] : CATEGORIES.flatMap((c) =>
      c.topics.filter((t) => t.toLowerCase().includes(s)).map((t) => ({ id: `t-${c.slug}-${t}`, kind: "topic" as const, label: t, sub: `in ${c.name}`, cat: c }))
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

  const catHits = hits.filter((h) => h.kind === "category");
  const topicHits = hits.filter((h) => h.kind === "topic");

  const row = (h: Hit) => {
    const i = hits.indexOf(h);
    return (
      <button key={h.id} className={i === idx ? "cpHit cpHitOn" : "cpHit"} style={accentStyle(h.cat)} onMouseEnter={() => setIdx(i)} onClick={() => choose(h)}>
        <span className="cpMiniMedal"><Svg>{ICONS[h.cat.icon]}</Svg></span>
        <span className="cpHitText">
          <span className="cpHitLabel">{h.label}</span>
          <span className="cpHitSub">{h.sub}</span>
        </span>
        <Svg className="cpHitEnter" sw={1.8}>{UI.enter}</Svg>
      </button>
    );
  };

  return (
    <div className="cpPaletteBg" onMouseDown={onClose}>
      <div className="cpPalette" role="dialog" aria-modal="true" aria-label="Search the library" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cpPaletteTop">
          <Svg className="cpPaletteIcon" sw={1.8}>{UI.search}</Svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search saints, prayers, seasons, sacraments…" aria-label="Search the library" />
          <kbd>esc</kbd>
        </div>
        <div className="cpPaletteList">
          {hits.length === 0 && <div className="cpPaletteEmpty">No matches for “{q}”. Try a saint, a prayer, or a season.</div>}
          {catHits.length > 0 && <div className="cpPaletteGroup">Categories</div>}
          {catHits.map(row)}
          {topicHits.length > 0 && <div className="cpPaletteGroup">Topics</div>}
          {topicHits.map(row)}
        </div>
        <div className="cpPaletteFoot">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to open</span>
          <span className="cpPaletteBrand">✠ CatholicProjects Library</span>
        </div>
      </div>
    </div>
  );
}

/* ── Header ────────────────────────────────────────────────── */

type Panel = "categories" | "ages" | null;

function Header({ active, band, onHome, onOpen, onBand }: {
  active: Category | undefined; band: BandKey | null;
  onHome: () => void; onOpen: (slug: string) => void; onBand: (b: BandKey | null) => void;
}) {
  const [panel, setPanel] = useState<Panel>(null);
  const [palette, setPalette] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setPanel(null);
        setPalette(true);
      }
      if (e.key === "Escape") setPanel(null);
    };
    const onDown = (e: MouseEvent) => {
      if (headRef.current && !headRef.current.contains(e.target as Node)) setPanel(null);
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
    setPanel(null);
    setMobile(false);
  };

  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur === p ? null : p));

  const linkCls = (on: boolean) => (on ? "cpLink cpLinkOn" : "cpLink");

  return (
    <>
      <header ref={headRef} className={scrolled ? "cpHead cpHeadScrolled" : "cpHead"}>
        <div className="cpUtil">
          <div className="cpUtilInner">
            <span className="cpUtilText">✠ Free Catholic activities for children · Built from the sources</span>
            <span className="cpUtilLinks">
              <a href="mailto:team@catholicprojects.org">Contact</a>
              <span className="cpUtilSep" />
              <a href="https://catholicprojects.org">CatholicProjects.org <Svg className="cpUtilExt" sw={2}>{UI.external}</Svg></a>
            </span>
          </div>
        </div>

        <div className="cpBar">
          <nav className="cpNavL" aria-label="Primary">
            <button className={linkCls(!active && !band && panel === null)} onClick={() => { closeAll(); onHome(); }}>Library</button>
            <button className={linkCls(panel === "categories" || !!active)} aria-expanded={panel === "categories"} onClick={() => toggle("categories")}>
              Categories <Svg className={panel === "categories" ? "cpCaret cpCaretUp" : "cpCaret"} sw={2}>{UI.caret}</Svg>
            </button>
            <button className={linkCls(panel === "ages" || !!band)} aria-expanded={panel === "ages"} onClick={() => toggle("ages")}>
              By Age <Svg className={panel === "ages" ? "cpCaret cpCaretUp" : "cpCaret"} sw={2}>{UI.caret}</Svg>
            </button>
          </nav>

          <button className="cpBrand" onClick={() => { closeAll(); onBand(null); onHome(); }} aria-label="CatholicProjects Library home">
            <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
          </button>

          <div className="cpNavR">
            <button className="cpSearchBtn" onClick={() => { setPanel(null); setPalette(true); }} aria-label="Search the library">
              <Svg className="cpSearchBtnIcon" sw={1.8}>{UI.search}</Svg>
              <span>Search the library</span>
              <kbd>⌘K</kbd>
            </button>
            <a className="cpSuggest" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Suggest a worksheet</a>
            <button className="cpIconBtn cpMobileOnly" onClick={() => setPalette(true)} aria-label="Search the library">
              <Svg sw={1.8}>{UI.search}</Svg>
            </button>
            <button className="cpIconBtn cpMobileOnly" onClick={() => setMobile((v) => !v)} aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile}>
              <Svg sw={1.8}>{mobile ? UI.close : UI.menu}</Svg>
            </button>
          </div>
        </div>

        <div className="cpRules" aria-hidden="true"><span /><span /></div>

        {panel === "categories" && (
          <div className="cpPanel">
            <div className="cpPanelInner cpPanelCats">
              <div className="cpPanelFeature">
                <span className="cpEyebrow cpEyebrowLight">Bibliotheca</span>
                <p className="cpPanelTitle">Eight categories, one faith.</p>
                <p className="cpPanelText">Coloring pages, crafts, and worksheets for every part of the faith, organized the way catechists teach it.</p>
                <button className="cpPanelCta" onClick={() => { closeAll(); onBand(null); onHome(); }}>View the whole library <Svg sw={2}>{UI.arrow}</Svg></button>
              </div>
              <div className="cpPanelGrid">
                {CATEGORIES.map((c) => (
                  <button key={c.slug} style={accentStyle(c)} className={active?.slug === c.slug ? "cpPanelItem cpPanelItemOn" : "cpPanelItem"} onClick={() => { closeAll(); onOpen(c.slug); }}>
                    <span className="cpMiniMedal"><Svg>{ICONS[c.icon]}</Svg></span>
                    <span className="cpPanelItemText">
                      <span className="cpPanelItemName">{c.name}</span>
                      <span className="cpPanelItemSub"><em>{c.latin}</em> · {gradeRange(c)}</span>
                    </span>
                    <span className="cpPanelNum">{c.numeral}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {panel === "ages" && (
          <div className="cpPanel">
            <div className="cpPanelInner cpPanelAges">
              {BANDS.map((b) => {
                const count = CATEGORIES.filter((c) => c.bands.includes(b.key)).length;
                return (
                  <button key={b.key} className={band === b.key ? "cpAgeTile cpAgeTileOn" : "cpAgeTile"} onClick={() => { closeAll(); onBand(b.key); }}>
                    <span className="cpAgeIcon"><Svg sw={1.5}>{UI.child}</Svg></span>
                    <span className="cpAgeLabel">{b.label}</span>
                    <span className="cpAgeSub">{b.ages}</span>
                    <span className="cpAgeCount">{count} categories <Svg sw={2}>{UI.arrow}</Svg></span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mobile && (
          <div className="cpMobile">
            <button className="cpMobileRow" onClick={() => { closeAll(); onBand(null); onHome(); }}>Library</button>
            <span className="cpMobileLabel">Categories</span>
            <div className="cpMobileGrid">
              {CATEGORIES.map((c) => (
                <button key={c.slug} style={accentStyle(c)} className="cpMobileCat" onClick={() => { closeAll(); onOpen(c.slug); }}>
                  <span className="cpMiniMedal cpMiniMedalSm"><Svg>{ICONS[c.icon]}</Svg></span>
                  {c.name}
                </button>
              ))}
            </div>
            <span className="cpMobileLabel">By age</span>
            <div className="cpMobileGrid">
              {BANDS.map((b) => (
                <button key={b.key} className="cpMobileCat" onClick={() => { closeAll(); onBand(b.key); }}>
                  <span className="cpMobileBand">{b.label}<em>{b.ages}</em></span>
                </button>
              ))}
            </div>
            <a className="cpSuggest cpSuggestMobile" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Suggest a worksheet</a>
          </div>
        )}
      </header>

      {panel && <div className="cpScrim" onMouseDown={() => setPanel(null)} aria-hidden="true" />}
      {palette && <Palette onClose={() => setPalette(false)} onOpen={onOpen} />}
    </>
  );
}

/* ── Premium category card ─────────────────────────────────── */

function CategoryCard({ c, onOpen }: { c: Category; onOpen: (slug: string) => void }) {
  return (
    <button className="cpCat" style={accentStyle(c)} onClick={() => onOpen(c.slug)} aria-label={`Open ${c.name}`}>
      <span className="cpCatFrame">
        <span className="cpWindow">
          <span className="cpWindowGlass" aria-hidden="true" />
          <span className="cpWindowLight" aria-hidden="true" />
          <span className="cpNumeral">{c.numeral}</span>
          <span className="cpMedal">
            <span className="cpMedalInner"><Svg className="cpMedalIcon" sw={1.4}>{ICONS[c.icon]}</Svg></span>
          </span>
          <span className="cpGrade">{gradeRange(c)}</span>
        </span>

        <span className="cpCatBody">
          <span className="cpLatin">{c.latin}</span>
          <span className="cpCatName">{c.name}</span>
          <span className="cpCatRule" aria-hidden="true"><i /><b>✦</b><i /></span>
          <span className="cpCatDesc">{c.description}</span>
          <span className="cpFormats">
            {c.formats.map((f) => (
              <span key={f} className="cpFormat">
                <Svg className="cpFormatIcon" sw={1.7}>{FORMAT_ICONS[f]}</Svg>{FORMAT_LABEL[f]}
              </span>
            ))}
          </span>
        </span>

        <span className="cpCatFoot">
          <span className="cpStatus">
            <span className="cpStatusDot" />
            {c.worksheets > 0 ? `${c.worksheets} resource${c.worksheets === 1 ? "" : "s"}` : "Coming soon"}
          </span>
          <span className="cpExplore">
            Explore <Svg className="cpExploreIcon" sw={2}>{UI.arrow}</Svg>
          </span>
        </span>
      </span>
      <span className="cpShine" aria-hidden="true" />
    </button>
  );
}

/* ── Library home ──────────────────────────────────────────── */

function LibraryHome({ band, onBand, onOpen }: { band: BandKey | null; onBand: (b: BandKey | null) => void; onOpen: (slug: string) => void }) {
  const results = band ? CATEGORIES.filter((c) => c.bands.includes(band)) : CATEGORIES;
  const activeBand = bandByKey(band);

  return (
    <>
      <section className="cpIntro">
        <span className="cpEyebrow">The Library · Bibliotheca</span>
        <h1 className="cpH1">Faith-filled activities, <em>beautifully made.</em></h1>
        <p className="cpLead">
          Coloring pages, crafts, and worksheets that teach children the faith. Free for every catechist, parent, and Catholic school teacher.
        </p>
        <div className="cpFacts">
          <span><b>Pre-K</b> through <b>Grade 8</b></span>
          <span className="cpFactSep">✦</span>
          <span><b>Free</b> forever</span>
          <span className="cpFactSep">✦</span>
          <span><b>Source-linked</b></span>
          <span className="cpFactSep">✦</span>
          <span><b>Print-ready</b></span>
        </div>
        <Ornament />
      </section>

      <div className="cpBandBar" role="group" aria-label="Filter by age">
        <button className={!band ? "cpBand cpBandOn" : "cpBand"} onClick={() => onBand(null)}>All ages</button>
        {BANDS.map((b) => (
          <button key={b.key} className={band === b.key ? "cpBand cpBandOn" : "cpBand"} onClick={() => onBand(b.key)}>
            {b.label}<em>{b.ages}</em>
          </button>
        ))}
      </div>

      {activeBand && (
        <p className="cpBandNote">
          Showing {results.length} categories with activities for <b>{activeBand.label}</b> ({activeBand.ages.toLowerCase()}).
        </p>
      )}

      <div className="cpGrid">
        {results.map((c) => <CategoryCard key={c.slug} c={c} onOpen={onOpen} />)}
      </div>
    </>
  );
}

/* ── Category page ─────────────────────────────────────────── */

function CategoryPage({ c, onHome, onOpen }: { c: Category; onHome: () => void; onOpen: (slug: string) => void }) {
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  const suggest = `mailto:team@catholicprojects.org?subject=${encodeURIComponent(`Worksheet idea: ${c.name}`)}`;

  return (
    <div style={accentStyle(c)}>
      <button className="cpBack" onClick={onHome}>
        <Svg sw={2}>{UI.back}</Svg> Library
      </button>

      <section className="cpHero">
        <div className="cpHeroWindow">
          <span className="cpWindowGlass" aria-hidden="true" />
          <span className="cpWindowLight" aria-hidden="true" />
          <span className="cpNumeral cpNumeralLg">{c.numeral}</span>
          <span className="cpMedal cpMedalLg">
            <span className="cpMedalInner"><Svg className="cpMedalIcon" sw={1.3}>{ICONS[c.icon]}</Svg></span>
          </span>
        </div>
        <div className="cpHeroBody">
          <span className="cpLatin cpLatinLg">{c.latin}</span>
          <h1 className="cpHeroTitle">{c.name}</h1>
          <p className="cpHeroDesc">{c.description}</p>

          <dl className="cpSpecs">
            <div><dt>Ages</dt><dd>{gradeRange(c)}</dd></div>
            <div>
              <dt>Formats</dt>
              <dd className="cpSpecFormats">
                {c.formats.map((f) => (
                  <span key={f}><Svg className="cpFormatIcon" sw={1.7}>{FORMAT_ICONS[f]}</Svg>{FORMAT_LABEL[f]}</span>
                ))}
              </dd>
            </div>
          </dl>

          <blockquote className="cpVerse">
            <span className="cpVerseMark" aria-hidden="true">“</span>
            <p>{c.verse}</p>
            <cite>{c.reference}</cite>
          </blockquote>
        </div>
      </section>

      <section className="cpSection">
        <div className="cpSectionHead">
          <span className="cpEyebrow">In this category</span>
          <h2 className="cpH2">What children will explore</h2>
        </div>
        <div className="cpTopicGrid">
          {c.topics.map((t, i) => (
            <div key={t} className="cpTopicCard">
              <span className="cpTopicNum">{String(i + 1).padStart(2, "0")}</span>
              <span className="cpTopicName">{t}</span>
              <span className="cpTopicState">In preparation</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cpPreparing">
        <span className="cpPrepIcon"><Svg sw={1.5}>{UI.quill}</Svg></span>
        <div className="cpPrepText">
          <h3>Activities are being prepared.</h3>
          <p>Each page is researched from Catholic sources before it’s published. The first {c.name.toLowerCase()} activities will appear here as soon as they’re ready.</p>
        </div>
        <div className="cpPrepActions">
          <a className="cpBtn cpBtnPrimary" href={suggest}>
            <Svg sw={1.8}>{UI.mail}</Svg> Suggest an activity
          </a>
          <button className="cpBtn cpBtnGhost" onClick={onHome}>Browse all categories</button>
        </div>
      </section>

      <section className="cpSection">
        <Ornament />
        <div className="cpSectionHead">
          <span className="cpEyebrow">Continue browsing</span>
          <h2 className="cpH2">Other categories</h2>
        </div>
        <div className="cpMini">
          {others.map((o) => (
            <button key={o.slug} className="cpMiniCard" style={accentStyle(o)} onClick={() => onOpen(o.slug)}>
              <span className="cpMiniMedal"><Svg>{ICONS[o.icon]}</Svg></span>
              <span className="cpPanelItemText">
                <span className="cpPanelItemName">{o.name}</span>
                <span className="cpPanelItemSub"><em>{o.latin}</em></span>
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("category");
      const a = bandByKey(p.get("ages"));
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
    if (b) p.set("ages", b);
    const qs = p.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCategory = (s: string) => {
    setSlug(s);
    push(s, band);
  };

  const goHome = () => {
    setSlug(null);
    push(null, band);
  };

  const chooseBand = (b: BandKey | null) => {
    setBand(b);
    setSlug(null);
    push(null, b);
  };

  const active = bySlug(slug);

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <div className="cpGlow cpGlowA" aria-hidden="true" />
      <div className="cpGlow cpGlowB" aria-hidden="true" />

      <Header active={active} band={band} onHome={goHome} onOpen={openCategory} onBand={chooseBand} />

      <main className={ready ? "cpMain cpReady" : "cpMain"}>
        {active ? (
          <CategoryPage key={active.slug} c={active} onHome={goHome} onOpen={openCategory} />
        ) : (
          <LibraryHome band={band} onBand={chooseBand} onOpen={openCategory} />
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
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d9a84e;--gold-soft:rgba(200,148,58,.28);--ink:#2b211a;--sub:#70645a;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--line:rgba(111,67,39,.12);
  --ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  position:relative;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;font-family:var(--ui);color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fdf8f0 40%,#fbf5ea 100%);-webkit-font-smoothing:antialiased;}
.cpRoot *{box-sizing:border-box;}
.cpRoot button{font-family:inherit;}
.cpRoot a{color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:12px;}
.cpRoot kbd{font-family:var(--ui);}
.cpGlow{position:absolute;border-radius:999px;pointer-events:none;filter:blur(8px);z-index:0;}
.cpGlowA{width:900px;height:900px;top:-420px;left:50%;transform:translateX(-50%);background:radial-gradient(circle,rgba(200,148,58,.18),rgba(200,148,58,.05) 45%,transparent 70%);}
.cpGlowB{width:700px;height:700px;top:1000px;right:-360px;background:radial-gradient(circle,rgba(138,93,59,.08),transparent 65%);}

/* ── Header ── */
.cpHead{position:sticky;top:0;z-index:60;background:rgba(255,253,249,.93);backdrop-filter:saturate(1.3) blur(18px);-webkit-backdrop-filter:saturate(1.3) blur(18px);transition:box-shadow 240ms ease;}
.cpHeadScrolled{box-shadow:0 14px 40px rgba(46,29,16,.08);}

.cpUtil{background:var(--ink);color:#e8dac2;overflow:hidden;max-height:38px;transition:max-height 260ms ease;}
.cpHeadScrolled .cpUtil{max-height:0;}
.cpUtilInner{max-width:1400px;margin:0 auto;height:38px;padding:0 clamp(16px,3vw,48px);display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;}
.cpUtilText{color:#d9c7a6;}
.cpUtilLinks{display:flex;align-items:center;gap:16px;}
.cpUtilLinks a{display:inline-flex;align-items:center;gap:6px;color:#e8dac2!important;text-decoration:none;transition:color 150ms ease;}
.cpUtilLinks a:hover{color:var(--gold-hi)!important;}
.cpUtilSep{width:1px;height:12px;background:rgba(232,218,194,.3);}
.cpUtilExt{width:12px;height:12px;}

.cpBar{max-width:1400px;margin:0 auto;height:108px;padding:0 clamp(16px,3vw,48px);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;transition:height 260ms ease;}
.cpHeadScrolled .cpBar{height:80px;}
.cpNavL{display:flex;align-items:center;gap:6px;}
.cpLink{position:relative;display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;border:none;background:transparent;cursor:pointer;font-size:12px;font-weight:650;letter-spacing:.18em;text-transform:uppercase;color:#6a5140;transition:color 160ms ease;}
.cpLink:hover{color:var(--ink);}
.cpLink::after{content:"";position:absolute;left:50%;bottom:4px;width:6px;height:6px;background:var(--gold);transform:translateX(-50%) rotate(45deg) scale(0);transition:transform 220ms cubic-bezier(.2,.8,.2,1);}
.cpLinkOn{color:var(--ink);}
.cpLinkOn::after{transform:translateX(-50%) rotate(45deg) scale(1);}
.cpCaret{width:14px;height:14px;opacity:.6;transition:transform 220ms ease;}
.cpCaretUp{transform:rotate(180deg);}

.cpBrand{display:flex;align-items:center;justify-content:center;padding:0;border:none;background:none;cursor:pointer;}
.cpLogo{height:78px;width:auto;display:block;transition:height 260ms ease,transform 200ms ease;}
.cpHeadScrolled .cpLogo{height:56px;}
.cpBrand:hover .cpLogo{transform:scale(1.015);}

.cpNavR{display:flex;align-items:center;justify-content:flex-end;gap:12px;}
.cpSearchBtn{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 10px 0 16px;min-width:240px;border:1px solid rgba(111,67,39,.16);border-radius:999px;background:#fff;cursor:pointer;color:var(--mute);font-size:13.5px;transition:border-color 160ms ease,box-shadow 160ms ease;}
.cpSearchBtn:hover{border-color:rgba(200,148,58,.55);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cpSearchBtn span{flex:1;text-align:left;}
.cpSearchBtnIcon{width:17px;height:17px;color:var(--chestnut);}
.cpSearchBtn kbd{padding:3px 7px;border:1px solid var(--line);border-radius:7px;background:var(--cream);font-size:11px;font-weight:600;color:var(--mute);}
.cpSuggest{display:inline-flex;align-items:center;height:44px;padding:0 20px;border:1px solid var(--gold);border-radius:999px;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--chestnut-deep)!important;text-decoration:none;white-space:nowrap;transition:background 180ms ease,color 180ms ease;}
.cpSuggest:hover{background:var(--gold);color:#2e1f12!important;}
.cpIconBtn{display:none;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid rgba(111,67,39,.16);border-radius:999px;background:#fff;cursor:pointer;color:var(--ink);}
.cpIconBtn svg{width:20px;height:20px;}

.cpRules{max-width:1400px;margin:0 auto;padding:0 clamp(16px,3vw,48px);display:flex;flex-direction:column;gap:3px;}
.cpRules span{height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.65) 12%,rgba(200,148,58,.65) 88%,transparent);}
.cpRules span:last-child{opacity:.45;}

.cpPanel{position:absolute;top:100%;left:0;right:0;z-index:2;background:#fffdf9;border-bottom:1px solid rgba(200,148,58,.35);box-shadow:0 40px 80px rgba(46,29,16,.16);animation:cpDrop 220ms cubic-bezier(.2,.8,.2,1);}
@keyframes cpDrop{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}
.cpPanelInner{max-width:1400px;margin:0 auto;padding:30px clamp(16px,3vw,48px) 34px;}
.cpPanelCats{display:grid;grid-template-columns:320px 1fr;gap:34px;}
.cpPanelFeature{display:flex;flex-direction:column;padding:28px 28px 26px;border-radius:24px;background:radial-gradient(120% 90% at 0% 0%,rgba(200,148,58,.3),transparent 60%),var(--ink);color:#e8dac2;}
.cpEyebrowLight{color:var(--gold-hi)!important;}
.cpPanelTitle{margin:12px 0 0;font-family:var(--serif);font-size:32px;font-weight:600;line-height:1.05;color:#fff8ec;}
.cpPanelText{margin:12px 0 0;font-size:14px;line-height:1.65;color:#cdbfa9;}
.cpPanelCta{margin-top:auto;padding:22px 0 0;display:inline-flex;align-items:center;gap:8px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:700;letter-spacing:.06em;color:var(--gold-hi);text-align:left;}
.cpPanelCta svg{width:16px;height:16px;transition:transform 200ms ease;}
.cpPanelCta:hover svg{transform:translateX(4px);}
.cpPanelGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 20px;align-content:start;}
.cpPanelItem{display:flex;align-items:center;gap:14px;padding:12px 14px;border:none;border-bottom:1px solid var(--line);border-radius:0;background:transparent;cursor:pointer;text-align:left;transition:background 150ms ease;}
.cpPanelItem:hover,.cpPanelItemOn{background:var(--cream);border-radius:14px;border-bottom-color:transparent;}
.cpPanelItemText{display:flex;flex-direction:column;min-width:0;flex:1;}
.cpPanelItemName{font-family:var(--serif);font-size:21px;font-weight:600;line-height:1.1;color:var(--ink);}
.cpPanelItemSub{margin-top:3px;font-size:12px;color:var(--mute);}
.cpPanelItemSub em{font-family:var(--serif);font-size:14px;color:var(--chestnut);}
.cpPanelNum{font-family:var(--serif);font-size:16px;font-weight:600;color:rgba(111,67,39,.3);}

.cpMiniMedal{flex:0 0 auto;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent,#8a5d3b) 70%,#fff),var(--accent,#8a5d3b) 70%);color:#fff6e6;box-shadow:0 0 0 2px #fffdf9,0 0 0 3px rgba(200,148,58,.6),0 6px 14px rgba(46,29,16,.15);}
.cpMiniMedal svg{width:21px;height:21px;}
.cpMiniMedalSm{width:34px;height:34px;}
.cpMiniMedalSm svg{width:17px;height:17px;}

.cpPanelAges{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}
.cpAgeTile{display:flex;flex-direction:column;align-items:flex-start;padding:24px 24px 22px;border:1px solid var(--line);border-radius:22px;background:#fff;cursor:pointer;text-align:left;transition:transform 200ms ease,border-color 200ms ease,box-shadow 200ms ease;}
.cpAgeTile:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.5);box-shadow:0 18px 40px rgba(74,43,22,.1);}
.cpAgeTileOn{border-color:var(--gold);box-shadow:0 0 0 3px rgba(200,148,58,.15);}
.cpAgeIcon{width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:var(--cream);color:var(--chestnut);box-shadow:inset 0 0 0 1px rgba(200,148,58,.3);}
.cpAgeIcon svg{width:22px;height:22px;}
.cpAgeLabel{margin-top:16px;font-family:var(--serif);font-size:28px;font-weight:600;line-height:1;color:var(--ink);}
.cpAgeSub{margin-top:6px;font-size:13px;color:var(--sub);}
.cpAgeCount{margin-top:18px;display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--chestnut);}
.cpAgeCount svg{width:14px;height:14px;color:var(--gold);}

.cpScrim{position:fixed;inset:0;z-index:55;background:rgba(31,24,18,.28);backdrop-filter:blur(2px);animation:cpFade 200ms ease;}
.cpMobile{display:none;}
.cpMobileOnly{display:none;}

/* ── Search palette ── */
.cpPaletteBg{position:fixed;inset:0;z-index:100;display:flex;justify-content:center;align-items:flex-start;padding:12vh 16px 16px;background:rgba(31,24,18,.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:cpFade 160ms ease;}
.cpPalette{width:min(680px,100%);border:1px solid rgba(200,148,58,.4);border-radius:24px;background:#fffdf9;box-shadow:0 50px 120px rgba(0,0,0,.35);overflow:hidden;animation:cpDrop 220ms cubic-bezier(.2,.8,.2,1);}
.cpPaletteTop{display:flex;align-items:center;gap:14px;padding:0 20px;height:70px;border-bottom:1px solid var(--line);}
.cpPaletteIcon{width:22px;height:22px;color:var(--chestnut);flex:0 0 auto;}
.cpPaletteTop input{flex:1;min-width:0;height:100%;border:none;background:transparent;outline:none;font-family:var(--serif);font-size:24px;font-weight:500;color:var(--ink);}
.cpPaletteTop input::placeholder{color:var(--mute);}
.cpPalette kbd{padding:3px 7px;border:1px solid var(--line);border-radius:7px;background:var(--cream);font-size:11px;font-weight:600;color:var(--mute);}
.cpPaletteList{max-height:min(420px,56vh);overflow-y:auto;padding:8px;}
.cpPaletteGroup{padding:12px 12px 6px;font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpHit{display:flex;align-items:center;gap:14px;width:100%;padding:10px 12px;border:none;border-radius:14px;background:transparent;cursor:pointer;text-align:left;}
.cpHitOn{background:var(--cream);box-shadow:inset 0 0 0 1px rgba(200,148,58,.3);}
.cpHitText{display:flex;flex-direction:column;flex:1;min-width:0;}
.cpHitLabel{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--ink);}
.cpHitSub{font-size:12.5px;color:var(--mute);}
.cpHitEnter{width:17px;height:17px;color:var(--gold);opacity:0;}
.cpHitOn .cpHitEnter{opacity:1;}
.cpPaletteEmpty{padding:34px 16px;text-align:center;font-size:14px;color:var(--sub);}
.cpPaletteFoot{display:flex;align-items:center;gap:18px;padding:12px 20px;border-top:1px solid var(--line);background:var(--cream);font-size:12px;color:var(--mute);}
.cpPaletteFoot kbd{margin-right:4px;}
.cpPaletteBrand{margin-left:auto;font-family:var(--serif);font-size:14px;font-style:italic;color:var(--chestnut);}

/* ── Main ── */
.cpMain{position:relative;z-index:1;flex:1;width:100%;max-width:1400px;margin:0 auto;padding:0 clamp(16px,3vw,48px) 96px;}
.cpReady{animation:cpFade 360ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}

.cpIntro{padding:66px 0 0;text-align:center;display:flex;flex-direction:column;align-items:center;}
.cpEyebrow{font-size:11.5px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);}
.cpH1{margin:16px 0 0;max-width:920px;font-family:var(--serif);font-weight:600;font-size:clamp(44px,5.8vw,84px);line-height:.98;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;}
.cpH1 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpLead{margin:22px 0 0;max-width:620px;font-size:clamp(15.5px,1.3vw,17.5px);line-height:1.7;color:var(--sub);}
.cpFacts{margin-top:26px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;font-size:13.5px;color:var(--sub);}
.cpFacts b{color:var(--ink);font-weight:650;}
.cpFactSep{font-size:10px;color:var(--gold);}

.cpOrnament{width:100%;max-width:520px;margin:40px auto 36px;display:flex;align-items:center;gap:18px;}
.cpOrnLine{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.6));}
.cpOrnLine:last-child{background:linear-gradient(90deg,rgba(200,148,58,.6),transparent);}
.cpOrnCross{font-size:20px;color:var(--gold);line-height:1;}

.cpBandBar{margin:0 auto 14px;width:fit-content;max-width:100%;display:flex;gap:4px;padding:5px;border:1px solid rgba(200,148,58,.3);border-radius:999px;background:rgba(255,255,255,.8);overflow-x:auto;scrollbar-width:none;box-shadow:0 10px 30px rgba(74,43,22,.06);}
.cpBandBar::-webkit-scrollbar{display:none;}
.cpBand{flex:0 0 auto;display:inline-flex;align-items:baseline;gap:7px;height:42px;padding:0 20px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:14px;font-weight:650;color:#5b4535;white-space:nowrap;transition:background 160ms ease,color 160ms ease;line-height:42px;}
.cpBand em{font-style:normal;font-size:11.5px;font-weight:500;color:var(--mute);}
.cpBand:hover{background:var(--cream);}
.cpBandOn,.cpBandOn:hover{background:var(--ink);color:#fff8ec;}
.cpBandOn em{color:var(--gold-hi);}
.cpBandNote{margin:6px 0 0;text-align:center;font-size:13.5px;color:var(--sub);}
.cpBandNote b{color:var(--ink);}

/* ── Premium category cards ── */
.cpGrid{margin-top:34px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px;}
.cpCat{--accent:#8a5d3b;position:relative;display:block;width:100%;padding:9px;border:1px solid rgba(200,148,58,.32);border-radius:30px 30px 22px 22px;background:linear-gradient(180deg,#fffefb,#fdf7ec);cursor:pointer;text-align:center;overflow:hidden;box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 18px 44px rgba(74,43,22,.08);transition:transform 320ms cubic-bezier(.2,.8,.2,1),box-shadow 320ms ease,border-color 320ms ease;}
.cpCat:hover{transform:translateY(-8px);border-color:rgba(200,148,58,.6);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 36px 70px rgba(74,43,22,.16),0 0 0 4px rgba(200,148,58,.08);}
.cpCatFrame{position:relative;display:flex;flex-direction:column;height:100%;min-height:500px;border:1px solid rgba(200,148,58,.28);border-radius:23px 23px 15px 15px;overflow:hidden;}

.cpWindow,.cpHeroWindow{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 92%,#140d08) 0%,color-mix(in srgb,var(--accent) 62%,#140d08) 100%);}
.cpWindow{height:220px;margin:12px 12px 0;border-radius:999px 999px 10px 10px;box-shadow:inset 0 0 0 1px rgba(255,236,200,.18),inset 0 -30px 50px rgba(0,0,0,.22);}
.cpWindowGlass{position:absolute;inset:0;background:repeating-linear-gradient(60deg,rgba(255,240,210,.075) 0 1px,transparent 1px 26px),repeating-linear-gradient(-60deg,rgba(255,240,210,.075) 0 1px,transparent 1px 26px),repeating-linear-gradient(0deg,rgba(255,240,210,.05) 0 1px,transparent 1px 26px);}
.cpWindowLight{position:absolute;left:50%;top:-40%;width:140%;height:120%;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 30%,rgba(255,226,170,.55),rgba(255,226,170,.12) 38%,transparent 62%);transition:opacity 320ms ease,transform 400ms ease;opacity:.75;}
.cpCat:hover .cpWindowLight{opacity:1;transform:translateX(-50%) translateY(6%);}
.cpNumeral{position:absolute;top:22px;left:50%;transform:translateX(-50%);font-family:var(--serif);font-size:15px;font-weight:600;letter-spacing:.2em;color:rgba(255,238,205,.78);white-space:nowrap;}
.cpNumeral::before,.cpNumeral::after{content:"";display:inline-block;width:14px;height:1px;margin:0 8px;vertical-align:middle;background:rgba(255,226,170,.55);}
.cpGrade{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);padding:5px 12px;border:1px solid rgba(255,226,170,.35);border-radius:999px;background:rgba(20,13,8,.28);font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,242,218,.92);white-space:nowrap;backdrop-filter:blur(4px);}

.cpMedal{position:relative;z-index:1;margin-top:-4px;width:104px;height:104px;padding:4px;border-radius:999px;background:conic-gradient(from 210deg,#8f6420,#f2d38c,#b98535,#f7df9f,#8f6420);box-shadow:0 0 0 6px rgba(255,240,210,.12),0 16px 34px rgba(0,0,0,.35);transition:transform 420ms cubic-bezier(.2,.8,.2,1);}
.cpCat:hover .cpMedal{transform:scale(1.06) rotate(-4deg);}
.cpMedalInner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:999px;background:radial-gradient(circle at 38% 30%,#fffdf6,#f5e6c8 70%,#e9d3a9);box-shadow:inset 0 2px 6px rgba(111,67,39,.25);color:color-mix(in srgb,var(--accent) 85%,#1a120c);}
.cpMedalIcon{width:50px;height:50px;}

.cpCatBody{display:flex;flex-direction:column;align-items:center;padding:24px 22px 0;}
.cpLatin{font-family:var(--serif);font-style:italic;font-size:17px;font-weight:500;color:var(--gold);letter-spacing:.01em;}
.cpCatName{margin-top:4px;font-family:var(--serif);font-size:31px;font-weight:600;line-height:1.04;letter-spacing:-.01em;color:var(--ink);text-wrap:balance;}
.cpCatRule{margin:14px 0 0;display:flex;align-items:center;gap:10px;width:120px;}
.cpCatRule i{flex:1;height:1px;background:rgba(200,148,58,.5);}
.cpCatRule b{font-size:9px;color:var(--gold);font-weight:400;}
.cpCatDesc{margin-top:14px;font-size:14px;line-height:1.6;color:var(--sub);text-wrap:pretty;}
.cpFormats{margin-top:18px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;}
.cpFormat{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;background:color-mix(in srgb,var(--accent) 8%,#fff);border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);font-size:12px;font-weight:600;color:color-mix(in srgb,var(--accent) 80%,#1a120c);}
.cpFormatIcon{width:14px;height:14px;flex:0 0 auto;}

.cpCatBody{flex:1;}
.cpCatFoot{margin:22px 14px 0;padding:18px 4px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px dashed rgba(200,148,58,.3);}
.cpStatus{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);}
.cpStatusDot{width:7px;height:7px;border-radius:999px;background:var(--gold);animation:cpPulse 2.4s ease-out infinite;}
@keyframes cpPulse{0%{box-shadow:0 0 0 0 rgba(200,148,58,.5);}70%{box-shadow:0 0 0 8px rgba(200,148,58,0);}100%{box-shadow:0 0 0 0 rgba(200,148,58,0);}}
.cpExplore{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:700;color:var(--chestnut);}
.cpExploreIcon{width:16px;height:16px;color:var(--gold);transition:transform 220ms ease;}
.cpCat:hover .cpExploreIcon{transform:translateX(4px);}
.cpShine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,244,220,.55) 48%,transparent 62%);transform:translateX(-120%);}
.cpCat:hover .cpShine{transform:translateX(120%);transition:transform 1100ms cubic-bezier(.2,.8,.2,1);}

/* ── Buttons ── */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:50px;padding:0 24px;border-radius:14px;font-size:14.5px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease,background 150ms ease,border-color 150ms ease;}
.cpBtn svg{width:18px;height:18px;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 24px rgba(168,116,37,.28);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 14px 30px rgba(168,116,37,.34);}
.cpBtnGhost{border:1px solid rgba(111,67,39,.18);background:#fff;color:var(--ink);}
.cpBtnGhost:hover{border-color:rgba(200,148,58,.5);}

/* ── Category page ── */
.cpBack{margin:34px 0 18px;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px 0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--chestnut-deep);}
.cpBack svg{width:15px;height:15px;}
.cpBack:hover{border-color:rgba(200,148,58,.5);}
.cpHero{display:grid;grid-template-columns:400px 1fr;gap:56px;align-items:center;padding:14px;border:1px solid rgba(200,148,58,.32);border-radius:36px;background:linear-gradient(180deg,#fffefb,#fdf7ec);box-shadow:0 30px 70px rgba(74,43,22,.1);}
.cpHeroWindow{height:500px;border-radius:999px 999px 20px 20px;box-shadow:inset 0 0 0 1px rgba(255,236,200,.2),inset 0 -40px 70px rgba(0,0,0,.25);}
.cpNumeralLg{top:44px;font-size:19px;}
.cpMedalLg{width:168px;height:168px;padding:6px;margin-top:30px;}
.cpMedalLg .cpMedalIcon{width:80px;height:80px;}
.cpHeroBody{padding:20px 40px 20px 0;}
.cpLatinLg{font-size:24px;}
.cpHeroTitle{margin:6px 0 0;font-family:var(--serif);font-size:clamp(48px,5.4vw,78px);font-weight:600;line-height:.98;letter-spacing:-.02em;color:var(--ink);}
.cpHeroDesc{margin:18px 0 0;max-width:560px;font-size:17px;line-height:1.7;color:var(--sub);}
.cpSpecs{margin:24px 0 0;display:grid;grid-template-columns:auto 1fr;border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden;}
.cpSpecs div{padding:14px 18px;}
.cpSpecs div + div{border-left:1px solid var(--line);}
.cpSpecs dt{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);}
.cpSpecs dd{margin:6px 0 0;font-family:var(--serif);font-size:20px;font-weight:600;color:var(--ink);}
.cpSpecFormats{display:flex;flex-wrap:wrap;gap:14px;}
.cpSpecFormats span{display:inline-flex;align-items:center;gap:6px;font-family:var(--ui);font-size:14px;font-weight:600;color:color-mix(in srgb,var(--accent) 80%,#1a120c);}
.cpVerse{position:relative;margin:24px 0 0;padding:22px 26px 20px 28px;border-left:3px solid var(--accent);border-radius:0 18px 18px 0;background:color-mix(in srgb,var(--accent) 6%,#fff);}
.cpVerseMark{position:absolute;top:-6px;right:18px;font-family:var(--serif);font-size:88px;line-height:1;color:color-mix(in srgb,var(--accent) 22%,transparent);}
.cpVerse p{margin:0;font-family:var(--serif);font-style:italic;font-size:24px;line-height:1.3;color:var(--ink);}
.cpVerse cite{display:block;margin-top:10px;font-style:normal;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}

.cpSection{margin-top:72px;}
.cpSectionHead{margin-bottom:26px;text-align:center;}
.cpH2{margin:10px 0 0;font-family:var(--serif);font-size:clamp(34px,3.6vw,46px);font-weight:600;line-height:1.05;color:var(--ink);}
.cpTopicGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
.cpTopicCard{position:relative;display:flex;flex-direction:column;padding:26px 24px 22px;border:1px solid var(--line);border-radius:22px;background:#fff;overflow:hidden;}
.cpTopicCard::before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,var(--accent),var(--gold));}
.cpTopicNum{font-family:var(--serif);font-size:30px;font-weight:600;color:color-mix(in srgb,var(--accent) 45%,transparent);line-height:1;}
.cpTopicName{margin-top:14px;font-family:var(--serif);font-size:25px;font-weight:600;line-height:1.1;color:var(--ink);}
.cpTopicState{margin-top:16px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);}

.cpPreparing{margin-top:28px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px;padding:30px 34px;border-radius:26px;background:radial-gradient(80% 140% at 0% 0%,color-mix(in srgb,var(--accent) 45%,transparent),transparent 60%),var(--ink);color:#efe3cf;}
.cpPrepIcon{width:62px;height:62px;display:flex;align-items:center;justify-content:center;border-radius:18px;background:rgba(214,163,73,.14);color:var(--gold-hi);box-shadow:inset 0 0 0 1px rgba(214,163,73,.3);}
.cpPrepIcon svg{width:30px;height:30px;}
.cpPrepText h3{margin:0;font-family:var(--serif);font-size:30px;font-weight:600;color:#fff8ec;}
.cpPrepText p{margin:8px 0 0;max-width:560px;font-size:14.5px;line-height:1.65;color:#cdbfa9;}
.cpPrepActions{display:flex;gap:10px;}
.cpPreparing .cpBtnGhost{background:transparent;border-color:rgba(239,227,207,.25);color:#efe3cf;}
.cpPreparing .cpBtnGhost:hover{border-color:var(--gold-hi);}

.cpMini{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.cpMiniCard{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--line);border-radius:18px;background:#fff;cursor:pointer;text-align:left;transition:transform 200ms ease,box-shadow 200ms ease,border-color 200ms ease;}
.cpMiniCard:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.45);box-shadow:0 16px 34px rgba(74,43,22,.1);}
.cpMiniArrow{width:16px;height:16px;color:var(--gold);flex:0 0 auto;}

/* ── Footer ── */
.cpFoot{position:relative;z-index:1;border-top:1px solid var(--line);background:rgba(255,253,249,.7);}
.cpFootInner{max-width:760px;margin:0 auto;padding:40px clamp(16px,3vw,40px) 44px;text-align:center;}
.cpFootMark{font-size:20px;color:var(--gold);}
.cpFootText{margin:10px 0 0;font-family:var(--serif);font-size:21px;font-style:italic;color:var(--chestnut-deep);}
.cpFootFine{margin:12px 0 0;font-size:12px;line-height:1.65;color:var(--mute);}
.cpFootFine a{color:var(--chestnut)!important;text-decoration:none;}
.cpFootFine a:hover{text-decoration:underline;}

/* ── Responsive ── */
@media (max-width:1320px){
  .cpSearchBtn{min-width:0;}
  .cpSearchBtn span,.cpSearchBtn kbd{display:none;}
  .cpSearchBtn{width:44px;padding:0;justify-content:center;}
  .cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpHero{grid-template-columns:340px 1fr;gap:40px;}
  .cpHeroWindow{height:440px;}
  .cpPreparing{grid-template-columns:auto 1fr;}
  .cpPrepActions{grid-column:1 / -1;}
  .cpMini{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpPanelCats{grid-template-columns:260px 1fr;}
}
@media (max-width:1060px){
  .cpNavL,.cpSearchBtn,.cpNavR > .cpSuggest{display:none;}
  .cpMobileOnly{display:inline-flex;}
  .cpBar{grid-template-columns:auto 1fr;height:84px;}
  .cpHeadScrolled .cpBar{height:70px;}
  .cpBrand{justify-content:flex-start;}
  .cpLogo{height:60px;}
  .cpHeadScrolled .cpLogo{height:48px;}
  .cpNavR{gap:8px;}
  .cpPanel{display:none;}
  .cpMobile{display:flex;flex-direction:column;max-height:calc(100svh - 90px);overflow-y:auto;padding:16px clamp(16px,3vw,48px) 26px;background:var(--ivory);border-top:1px solid var(--line);animation:cpDrop 200ms ease;}
  .cpMobileRow{padding:14px 4px;border:none;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left;font-family:var(--serif);font-size:28px;font-weight:600;color:var(--ink);}
  .cpMobileLabel{margin:20px 4px 10px;font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);}
  .cpMobileGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .cpMobileCat{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:16px;background:#fff;cursor:pointer;text-align:left;font-size:14px;font-weight:650;color:var(--ink);}
  .cpMobileBand{display:flex;flex-direction:column;font-family:var(--serif);font-size:19px;font-weight:600;}
  .cpMobileBand em{font-family:var(--ui);font-style:normal;font-size:12px;font-weight:500;color:var(--mute);}
  .cpSuggestMobile{margin-top:22px;justify-content:center;height:50px;}
  .cpScrim{display:none;}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;}
  .cpHero{grid-template-columns:1fr;gap:0;padding:12px;}
  .cpHeroWindow{height:340px;}
  .cpMedalLg{width:140px;height:140px;}
  .cpHeroBody{padding:30px 22px 22px;text-align:center;}
  .cpHeroDesc{margin-left:auto;margin-right:auto;}
  .cpSpecs,.cpVerse{text-align:left;}
  .cpTopicGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .cpMini{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  .cpUtilText{display:none;}
  .cpUtilInner{justify-content:center;}
  .cpLogo{height:50px;}
  .cpIntro{padding-top:42px;}
  .cpFacts{gap:8px;font-size:12.5px;}
  .cpOrnament{margin:30px auto 28px;}
  .cpBandBar{width:100%;}
  .cpBand{padding:0 14px;}
  .cpGrid{grid-template-columns:1fr;gap:18px;}
  .cpCatFrame{min-height:0;}
  .cpWindow{height:200px;}
  .cpHeroWindow{height:280px;}
  .cpMedalLg{width:118px;height:118px;margin-top:22px;}
  .cpMedalLg .cpMedalIcon{width:58px;height:58px;}
  .cpSpecs{grid-template-columns:1fr;}
  .cpSpecs div + div{border-left:none;border-top:1px solid var(--line);}
  .cpVerse p{font-size:20px;}
  .cpTopicGrid{grid-template-columns:1fr 1fr;gap:12px;}
  .cpTopicCard{padding:20px 18px 18px;}
  .cpTopicName{font-size:21px;}
  .cpPreparing{grid-template-columns:1fr;padding:26px 22px;}
  .cpPrepActions{flex-direction:column;}
  .cpMini{grid-template-columns:1fr;}
  .cpMobileGrid{grid-template-columns:1fr;}
  .cpPaletteBg{padding-top:8vh;}
  .cpPaletteTop input{font-size:20px;}
  .cpPaletteFoot span:not(.cpPaletteBrand){display:none;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
