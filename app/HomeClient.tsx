"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Edit your categories here ─────────────────────────────── */

type IconKey = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";
type Category = { slug: string; name: string; description: string; icon: IconKey };

const CATEGORIES: Category[] = [
  { slug: "saints", name: "Saints", description: "Lives of the saints, feast days, and patronage", icon: "saints" },
  { slug: "bible-stories", name: "Bible Stories", description: "Old and New Testament, told for the classroom", icon: "bible" },
  { slug: "the-mass", name: "The Mass", description: "The parts of the Mass and what they mean", icon: "mass" },
  { slug: "sacraments", name: "Sacraments", description: "Baptism, Reconciliation, Communion, Confirmation", icon: "sacraments" },
  { slug: "prayers", name: "Prayers", description: "Traditional prayers to learn and pray", icon: "prayers" },
  { slug: "liturgical-seasons", name: "Liturgical Seasons", description: "Advent, Christmas, Lent, Easter, Ordinary Time", icon: "seasons" },
  { slug: "the-rosary", name: "The Rosary", description: "The mysteries and how to pray it", icon: "rosary" },
  { slug: "virtues", name: "Virtues & Moral Life", description: "Faith, hope, charity, and the commandments", icon: "virtues" },
];

/* ── Edit your worksheets here (sample data — swap for Supabase later) ── */

type WType = "worksheet" | "coloring" | "craft" | "activity";
type Grade = "K–2" | "3–5" | "6–8" | "All ages";
type Worksheet = {
  id: string;
  title: string;
  category: string;
  type: WType;
  grade: Grade;
  pages: number;
  description: string;
  added: string;
  pdf?: string;
  thumb?: string;
};

const WORKSHEETS: Worksheet[] = [
  { id: "st-francis-panel", title: "St. Francis of Assisi — Four-Panel Story", category: "saints", type: "coloring", grade: "K–2", pages: 1, added: "2026-09-24", description: "Color the life of St. Francis in four scenes, from his conversion to preaching to the birds.", pdf: "#" },
  { id: "st-therese-standup", title: "St. Thérèse — Mini Stand-Up Saint", category: "saints", type: "craft", grade: "3–5", pages: 1, added: "2026-09-22", description: "Color, cut, fold, and stand. A desk-sized St. Thérèse with her feast day and patronage.", pdf: "#" },
  { id: "st-michael-panel", title: "St. Michael the Archangel — Four-Panel Story", category: "saints", type: "coloring", grade: "K–2", pages: 1, added: "2026-09-18", description: "Four scenes introducing St. Michael and the prayer for protection.", pdf: "#" },
  { id: "st-juan-diego-standup", title: "St. Juan Diego — Mini Stand-Up Saint", category: "saints", type: "craft", grade: "All ages", pages: 1, added: "2026-09-12", description: "Color, cut, fold, and stand. St. Juan Diego with the tilma of Our Lady of Guadalupe.", pdf: "#" },
  { id: "creation", title: "The Story of Creation", category: "bible-stories", type: "worksheet", grade: "K–2", pages: 2, added: "2026-09-10", description: "Walk through the seven days of creation with drawing and matching prompts.", pdf: "#" },
  { id: "noah-sequence", title: "Noah and the Ark — Sequencing", category: "bible-stories", type: "activity", grade: "K–2", pages: 1, added: "2026-09-08", description: "Cut and order the scenes of the flood story.", pdf: "#" },
  { id: "prodigal-son", title: "The Prodigal Son — Reflection", category: "bible-stories", type: "worksheet", grade: "6–8", pages: 2, added: "2026-09-05", description: "Read Luke 15 and reflect on mercy, repentance, and the Father’s love.", pdf: "#" },
  { id: "parts-of-mass", title: "The Parts of the Mass", category: "the-mass", type: "worksheet", grade: "3–5", pages: 2, added: "2026-09-15", description: "Label and order the Liturgy of the Word and the Liturgy of the Eucharist.", pdf: "#" },
  { id: "sacred-vessels", title: "Sacred Vessels Matching", category: "the-mass", type: "activity", grade: "3–5", pages: 1, added: "2026-09-02", description: "Match the chalice, paten, ciborium, and cruets to their names and uses.", pdf: "#" },
  { id: "seven-sacraments", title: "The Seven Sacraments", category: "sacraments", type: "worksheet", grade: "3–5", pages: 2, added: "2026-09-14", description: "An overview of the sacraments of initiation, healing, and service.", pdf: "#" },
  { id: "baptism-symbols", title: "Symbols of Baptism", category: "sacraments", type: "coloring", grade: "K–2", pages: 1, added: "2026-08-30", description: "Color the water, oil, white garment, and candle.", pdf: "#" },
  { id: "our-father", title: "The Our Father — Line by Line", category: "prayers", type: "worksheet", grade: "3–5", pages: 2, added: "2026-09-20", description: "Learn what each line of the Lord’s Prayer means.", pdf: "#" },
  { id: "hail-mary-trace", title: "Hail Mary Tracing Page", category: "prayers", type: "activity", grade: "K–2", pages: 1, added: "2026-08-28", description: "Trace the Hail Mary to practice handwriting and memorization.", pdf: "#" },
  { id: "advent-wreath", title: "The Advent Wreath", category: "liturgical-seasons", type: "craft", grade: "All ages", pages: 1, added: "2026-09-26", description: "Build a paper Advent wreath and learn what each candle means.", pdf: "#" },
  { id: "joyful-mysteries", title: "The Joyful Mysteries", category: "the-rosary", type: "worksheet", grade: "3–5", pages: 2, added: "2026-09-16", description: "The five Joyful Mysteries with a Scripture line and coloring bead for each.", pdf: "#" },
  { id: "fruits-spirit", title: "Fruits of the Holy Spirit", category: "virtues", type: "worksheet", grade: "6–8", pages: 2, added: "2026-09-06", description: "Identify the fruits of the Spirit and where you see them in daily life.", pdf: "#" },
  { id: "ten-commandments", title: "The Ten Commandments", category: "virtues", type: "activity", grade: "3–5", pages: 1, added: "2026-08-26", description: "Sort everyday choices under the commandment they honor.", pdf: "#" },
];

/* ──────────────────────────────────────────────────────────── */

const TYPE_LABEL: Record<WType, string> = { worksheet: "Worksheet", coloring: "Coloring page", craft: "Craft", activity: "Activity" };
const TYPES: WType[] = ["worksheet", "coloring", "craft", "activity"];
const GRADES: Grade[] = ["K–2", "3–5", "6–8", "All ages"];
const NEW_DAYS = 14;

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

const UI_ICONS: Record<string, ReactNode> = {
  library: (<><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>),
  categories: (<><path d="M4 6h16M4 12h16M4 18h10" /></>),
  new: (<><path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 18.5 12 15.6 7 18.5l1.4-5.7L4 9l5.8-.7Z" /></>),
  external: (<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  grid: (<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>),
  list: (<><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>),
  download: (<><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></>),
  print: (<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="1.5" /><path d="M7 14h10v6H7z" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  caret: (<><path d="m6 9 6 6 6-6" /></>),
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
  worksheet: (<><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6M9 15.5h6" /></>),
  coloring: (<><path d="M4 20c2.5 0 4-1.3 4-3.5a2.5 2.5 0 0 0-5 0" /><path d="m8.5 14.5 10-10a1.8 1.8 0 0 1 2.5 2.5l-10 10" /></>),
  craft: (<><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8.2 20 18M8 15.8 20 6" /></>),
  activity: (<><path d="M5 4h6v2.5a1.5 1.5 0 1 0 3 0V4h5v6h-2.5a1.5 1.5 0 1 0 0 3H19v7h-6v-2.5a1.5 1.5 0 1 0-3 0V20H5v-6h2.5a1.5 1.5 0 1 0 0-3H5Z" /></>),
};

function Svg({ children, className, sw = 1.6 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const catBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
const isNew = (w: Worksheet) => Date.now() - new Date(w.added).getTime() < NEW_DAYS * 86400000;

type View = "library" | "new";

/* ── Top navigation (Owntric-style app bar) ────────────────── */

function TopNav({
  view, category, query, onView, onCategory, onQuery,
}: {
  view: View; category: string; query: string;
  onView: (v: View) => void; onCategory: (slug: string) => void; onQuery: (q: string) => void;
}) {
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") setCatOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const pick = (slug: string) => {
    onCategory(slug);
    setCatOpen(false);
    setMobileOpen(false);
  };

  const activeCat = category !== "all" ? catBySlug(category) : undefined;

  return (
    <header className={scrolled ? "cpTop cpTopScrolled" : "cpTop"}>
      <div className="cpTopInner">
        <button className="cpBrand" onClick={() => { onView("library"); pick("all"); onQuery(""); }} aria-label="Library home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
        </button>

        <nav className="cpNav" aria-label="Primary">
          <button className={view === "library" && category === "all" ? "cpNavItem cpNavActive" : "cpNavItem"} onClick={() => { onView("library"); pick("all"); }}>
            <Svg className="cpNavIcon">{UI_ICONS.library}</Svg> Library
          </button>

          <div className="cpDrop" ref={catRef}>
            <button className={catOpen || (view === "library" && activeCat) ? "cpNavItem cpNavActive" : "cpNavItem"} aria-expanded={catOpen} aria-haspopup="true" onClick={() => setCatOpen((v) => !v)}>
              <Svg className="cpNavIcon">{UI_ICONS.categories}</Svg>
              {activeCat ? activeCat.name : "Categories"}
              <Svg className={catOpen ? "cpCaret cpCaretUp" : "cpCaret"} sw={2.2}>{UI_ICONS.caret}</Svg>
            </button>
            {catOpen && (
              <div className="cpMenu" role="menu">
                {CATEGORIES.map((c) => {
                  const count = WORKSHEETS.filter((w) => w.category === c.slug).length;
                  return (
                    <button key={c.slug} role="menuitem" className={category === c.slug ? "cpMenuItem cpMenuItemOn" : "cpMenuItem"} onClick={() => { onView("library"); pick(c.slug); }}>
                      <span className="cpMenuIcon"><Svg>{ICONS[c.icon]}</Svg></span>
                      <span className="cpMenuText">
                        <span className="cpMenuName">{c.name}<em>{count}</em></span>
                        <span className="cpMenuDesc">{c.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button className={view === "new" ? "cpNavItem cpNavActive" : "cpNavItem"} onClick={() => { onView("new"); pick("all"); }}>
            <Svg className="cpNavIcon">{UI_ICONS.new}</Svg> New
          </button>
        </nav>

        <div className="cpTopRight">
          <label className="cpSearch">
            <Svg className="cpSearchIcon" sw={2}>{UI_ICONS.search}</Svg>
            <input ref={searchRef} type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" />
            {!query && <kbd>/</kbd>}
          </label>
          <a href="https://catholicprojects.org" className="cpSiteLink">
            catholicprojects.org <Svg className="cpExt" sw={2}>{UI_ICONS.external}</Svg>
          </a>
        </div>

        <button className="cpBurger" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          <Svg sw={2}>{mobileOpen ? UI_ICONS.close : UI_ICONS.menu}</Svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="cpMobile">
          <label className="cpSearch cpSearchMobile">
            <Svg className="cpSearchIcon" sw={2}>{UI_ICONS.search}</Svg>
            <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" />
          </label>
          <button className="cpMobileItem" onClick={() => { onView("library"); pick("all"); }}>
            <Svg className="cpNavIcon">{UI_ICONS.library}</Svg> Library
          </button>
          <button className="cpMobileItem" onClick={() => { onView("new"); pick("all"); }}>
            <Svg className="cpNavIcon">{UI_ICONS.new}</Svg> New
          </button>
          <span className="cpMobileLabel">Categories</span>
          {CATEGORIES.map((c) => (
            <button key={c.slug} className={category === c.slug ? "cpMobileItem cpMobileOn" : "cpMobileItem"} onClick={() => { onView("library"); pick(c.slug); }}>
              <span className="cpMenuIcon cpMenuIconSm"><Svg>{ICONS[c.icon]}</Svg></span> {c.name}
            </button>
          ))}
          <a href="https://catholicprojects.org" className="cpMobileItem">
            <Svg className="cpNavIcon" sw={2}>{UI_ICONS.external}</Svg> catholicprojects.org
          </a>
        </div>
      )}
    </header>
  );
}

/* ── Worksheet paper thumbnail ─────────────────────────────── */

function Paper({ w, large }: { w: Worksheet; large?: boolean }) {
  const cat = catBySlug(w.category);
  if (w.thumb) {
    return (
      <div className={large ? "cpPaper cpPaperLg" : "cpPaper"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.thumb} alt="" className="cpPaperImg" />
      </div>
    );
  }
  return (
    <div className={large ? "cpPaper cpPaperLg" : "cpPaper"} aria-hidden="true">
      <div className="cpPaperHead">
        <span>{cat?.name}</span>
        <span className="cpPaperNm">Name ________</span>
      </div>
      <div className="cpPaperTitle">{w.title.split(" — ")[0]}</div>
      {w.type === "coloring" && (
        <div className="cpPanels"><span /><span /><span /><span /></div>
      )}
      {w.type === "craft" && (
        <div className="cpCraft">
          <div className="cpCraftFig"><Svg sw={1.2}>{cat ? ICONS[cat.icon] : null}</Svg></div>
          <div className="cpFold" />
          <div className="cpCraftBase" />
        </div>
      )}
      {w.type === "activity" && (
        <div className="cpBoxes"><span /><span /><span /><span /><span /><span /></div>
      )}
      {w.type === "worksheet" && (
        <div className="cpLines">
          {[0, 1, 2, 3, 4].map((i) => (<div key={i} className="cpLine"><i />{i % 2 === 0 ? <b /> : <b className="cpShort" />}</div>))}
        </div>
      )}
      <div className="cpPaperFoot">catholicprojects.org</div>
    </div>
  );
}

/* ── Preview modal ─────────────────────────────────────────── */

function Preview({ w, onClose, onOpen }: { w: Worksheet; onClose: () => void; onOpen: (w: Worksheet) => void }) {
  const cat = catBySlug(w.category);
  const related = WORKSHEETS.filter((x) => x.category === w.category && x.id !== w.id).slice(0, 3);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const printPdf = () => {
    if (!w.pdf || w.pdf === "#") return;
    const win = window.open(w.pdf, "_blank");
    if (win) win.addEventListener("load", () => win.print());
  };

  return (
    <div className="cpOverlay" onMouseDown={onClose}>
      <div className="cpModal" role="dialog" aria-modal="true" aria-label={w.title} onMouseDown={(e) => e.stopPropagation()}>
        <button className="cpModalClose" onClick={onClose} aria-label="Close preview"><Svg sw={2}>{UI_ICONS.close}</Svg></button>
        <div className="cpModalPreview"><Paper w={w} large /></div>
        <div className="cpModalBody">
          <span className="cpEyebrow">{cat?.name}</span>
          <h2 className="cpModalTitle">{w.title}</h2>
          <p className="cpModalDesc">{w.description}</p>

          <dl className="cpSpecs">
            <div><dt>Type</dt><dd><Svg className="cpSpecIcon">{UI_ICONS[w.type]}</Svg>{TYPE_LABEL[w.type]}</dd></div>
            <div><dt>Grades</dt><dd>{w.grade}</dd></div>
            <div><dt>Pages</dt><dd>{w.pages}</dd></div>
            <div><dt>Format</dt><dd>PDF · Letter</dd></div>
          </dl>

          <div className="cpModalActions">
            <a className="cpBtn cpBtnPrimary" href={w.pdf || "#"} download target="_blank" rel="noreferrer">
              <Svg sw={2}>{UI_ICONS.download}</Svg> Download PDF
            </a>
            <button className="cpBtn cpBtnGhost" onClick={printPdf}>
              <Svg sw={1.8}>{UI_ICONS.print}</Svg> Print
            </button>
          </div>

          <p className="cpSources"><Svg sw={2.2} className="cpSourcesIcon">{UI_ICONS.check}</Svg> Built from linked Catholic sources · Free to print for your classroom</p>

          {related.length > 0 && (
            <div className="cpRelated">
              <span className="cpRelatedHead">More in {cat?.name}</span>
              {related.map((r) => (
                <button key={r.id} className="cpRelatedItem" onClick={() => onOpen(r)}>
                  <span className="cpRelatedType"><Svg>{UI_ICONS[r.type]}</Svg></span>
                  <span className="cpRelatedTitle">{r.title}</span>
                  <span className="cpRelatedMeta">{r.grade}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Library ───────────────────────────────────────────────── */

export default function HomeClient() {
  const [view, setView] = useState<View>("library");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<WType[]>([]);
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [sort, setSort] = useState<"newest" | "az">("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState<Worksheet | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("category");
    if (c && catBySlug(c)) setCategory(c);
    if (p.get("q")) setQuery(p.get("q") || "");
    if (p.get("view") === "new") setView("new");
    const ws = p.get("worksheet");
    if (ws) setOpen(WORKSHEETS.find((w) => w.id === ws) || null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (category !== "all") p.set("category", category);
    if (query.trim()) p.set("q", query.trim());
    if (view === "new") p.set("view", "new");
    if (open) p.set("worksheet", open.id);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [category, query, view, open, ready]);

  const changeCategory = (slug: string) => {
    setCategory(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WORKSHEETS.filter((w) => {
      if (view === "new" && !isNew(w)) return false;
      if (category !== "all" && w.category !== category) return false;
      if (q) {
        const hay = `${w.title} ${w.description} ${catBySlug(w.category)?.name || ""} ${TYPE_LABEL[w.type]}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [view, category, query]);

  const results = useMemo(() => {
    const list = scoped.filter((w) => (types.length === 0 || types.includes(w.type)) && (grade === "all" || w.grade === grade));
    return [...list].sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : b.added.localeCompare(a.added)));
  }, [scoped, types, grade, sort]);

  const typeCount = (t: WType) => scoped.filter((w) => w.type === t && (grade === "all" || w.grade === grade)).length;
  const catCount = (slug: string) => WORKSHEETS.filter((w) => (slug === "all" || w.category === slug) && (view !== "new" || isNew(w))).length;

  const toggleType = (t: WType) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const clearFilters = () => { setTypes([]); setGrade("all"); };
  const hasFilters = types.length > 0 || grade !== "all";

  const activeCat = category !== "all" ? catBySlug(category) : undefined;
  const heading = view === "new" ? "New this month" : activeCat ? activeCat.name : "All worksheets";
  const sub = view === "new"
    ? `Worksheets added in the last ${NEW_DAYS} days.`
    : activeCat ? activeCat.description : "Every free, source-linked resource in the library, ready to print.";

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>

      <TopNav view={view} category={category} query={query} onView={setView} onCategory={changeCategory} onQuery={setQuery} />

      <main className="cpMain">
        <div className="cpPageHead">
          <div className="cpCrumbs">
            <button onClick={() => { setView("library"); changeCategory("all"); }}>Library</button>
            {(activeCat || view === "new") && <><span>/</span><b>{view === "new" ? "New" : activeCat?.name}</b></>}
          </div>
          <div className="cpTitleRow">
            <div>
              <h1 className="cpH1">{heading}</h1>
              <p className="cpSub">{sub}</p>
            </div>
            <div className="cpStat">
              <span className="cpStatNum">{results.length}</span>
              <span className="cpStatLbl">{results.length === 1 ? "resource" : "resources"}</span>
            </div>
          </div>
        </div>

        <div className="cpTabs" role="tablist" aria-label="Categories">
          <button role="tab" aria-selected={category === "all"} className={category === "all" ? "cpTab cpTabOn" : "cpTab"} onClick={() => changeCategory("all")}>
            All <em>{catCount("all")}</em>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} role="tab" aria-selected={category === c.slug} className={category === c.slug ? "cpTab cpTabOn" : "cpTab"} onClick={() => changeCategory(c.slug)}>
              <Svg className="cpTabIcon">{ICONS[c.icon]}</Svg>
              {c.name} <em>{catCount(c.slug)}</em>
            </button>
          ))}
        </div>

        <div className="cpToolbar">
          <div className="cpFilters">
            {TYPES.map((t) => {
              const on = types.includes(t);
              return (
                <button key={t} aria-pressed={on} className={on ? "cpChip cpChipOn" : "cpChip"} onClick={() => toggleType(t)}>
                  <Svg className="cpChipIcon">{UI_ICONS[t]}</Svg>
                  {TYPE_LABEL[t]} <em>{typeCount(t)}</em>
                </button>
              );
            })}
          </div>

          <div className="cpControls">
            <label className="cpSelect">
              <span>Grade</span>
              <select value={grade} onChange={(e) => setGrade(e.target.value as Grade | "all")}>
                <option value="all">All grades</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className="cpSelect">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "az")}>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </label>
            <div className="cpSeg" role="group" aria-label="Layout">
              <button aria-pressed={layout === "grid"} className={layout === "grid" ? "cpSegOn" : ""} onClick={() => setLayout("grid")} aria-label="Grid view"><Svg>{UI_ICONS.grid}</Svg></button>
              <button aria-pressed={layout === "list"} className={layout === "list" ? "cpSegOn" : ""} onClick={() => setLayout("list")} aria-label="List view"><Svg>{UI_ICONS.list}</Svg></button>
            </div>
          </div>
        </div>

        {(hasFilters || query) && (
          <div className="cpActive">
            {query && <button className="cpPill" onClick={() => setQuery("")}>“{query}” <Svg sw={2.4}>{UI_ICONS.close}</Svg></button>}
            {types.map((t) => <button key={t} className="cpPill" onClick={() => toggleType(t)}>{TYPE_LABEL[t]} <Svg sw={2.4}>{UI_ICONS.close}</Svg></button>)}
            {grade !== "all" && <button className="cpPill" onClick={() => setGrade("all")}>Grades {grade} <Svg sw={2.4}>{UI_ICONS.close}</Svg></button>}
            <button className="cpClear" onClick={() => { clearFilters(); setQuery(""); }}>Clear all</button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="cpEmpty">
            <div className="cpEmptyIcon"><Svg>{UI_ICONS.search}</Svg></div>
            <p className="cpEmptyTitle">No worksheets match yet.</p>
            <p>Try a different search or remove a filter.</p>
            <button className="cpBtn cpBtnGhost" onClick={() => { clearFilters(); setQuery(""); changeCategory("all"); setView("library"); }}>Reset library</button>
          </div>
        ) : layout === "grid" ? (
          <div className="cpGrid">
            {results.map((w) => (
              <article key={w.id} className="cpCard">
                <button className="cpCardThumb" onClick={() => setOpen(w)} aria-label={`Preview ${w.title}`}>
                  <Paper w={w} />
                  {isNew(w) && <span className="cpNew">New</span>}
                  <span className="cpHover"><span>Preview</span></span>
                </button>
                <div className="cpCardBody">
                  <span className="cpType"><Svg className="cpTypeIcon">{UI_ICONS[w.type]}</Svg>{TYPE_LABEL[w.type]}</span>
                  <button className="cpCardTitle" onClick={() => setOpen(w)}>{w.title}</button>
                  <div className="cpCardFoot">
                    <span className="cpMeta">{catBySlug(w.category)?.name} · {w.grade}</span>
                    <a className="cpDl" href={w.pdf || "#"} download target="_blank" rel="noreferrer" aria-label={`Download ${w.title}`}>
                      <Svg sw={2}>{UI_ICONS.download}</Svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cpTable" role="table">
            <div className="cpRow cpRowHead" role="row">
              <span role="columnheader">Worksheet</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Grades</span>
              <span role="columnheader">Pages</span>
              <span role="columnheader" />
            </div>
            {results.map((w) => (
              <div key={w.id} className="cpRow" role="row">
                <button className="cpRowTitle" onClick={() => setOpen(w)}>
                  <span className="cpRowThumb"><Svg>{UI_ICONS[w.type]}</Svg></span>
                  <span>{w.title}{isNew(w) && <em className="cpNewInline">New</em>}</span>
                </button>
                <span className="cpRowCell">{catBySlug(w.category)?.name}</span>
                <span className="cpRowCell">{TYPE_LABEL[w.type]}</span>
                <span className="cpRowCell">{w.grade}</span>
                <span className="cpRowCell">{w.pages}</span>
                <a className="cpDl" href={w.pdf || "#"} download target="_blank" rel="noreferrer" aria-label={`Download ${w.title}`}>
                  <Svg sw={2}>{UI_ICONS.download}</Svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="cpFoot">
        <p>CatholicProjects is an independent supplemental resource and does not claim parish, diocesan, or other ecclesial endorsement unless specifically stated.</p>
        <p><a href="mailto:team@catholicprojects.org">team@catholicprojects.org</a> · © {new Date().getFullYear()} CatholicProjects.org</p>
      </footer>

      {open && <Preview w={open} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  );
}

const CSS = `
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d6a349;--ink:#2b211a;--sub:#70645a;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--line:rgba(111,67,39,.12);--ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,serif;
  min-height:100svh;display:flex;flex-direction:column;font-family:var(--ui);color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fbf6ee 100%);-webkit-font-smoothing:antialiased;}
.cpRoot *{box-sizing:border-box;}
.cpRoot button{font-family:inherit;}
.cpRoot a{color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:10px;}

/* Top nav */
.cpTop{position:sticky;top:0;z-index:50;background:rgba(255,253,249,.82);border-bottom:1px solid var(--line);backdrop-filter:saturate(1.4) blur(18px);-webkit-backdrop-filter:saturate(1.4) blur(18px);transition:box-shadow 200ms ease;}
.cpTopScrolled{box-shadow:0 8px 28px rgba(46,29,16,.07);}
.cpTopInner{max-width:1440px;margin:0 auto;height:84px;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:28px;}
.cpBrand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cpLogo{height:60px;width:auto;display:block;transition:transform 200ms ease;}
.cpBrand:hover .cpLogo{transform:scale(1.02);}
.cpNav{display:flex;align-items:center;gap:4px;padding-left:24px;border-left:1px solid var(--line);height:40px;}
.cpNavItem{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border:none;border-radius:12px;background:transparent;cursor:pointer;font-size:15px;font-weight:600;color:#5b4535;white-space:nowrap;transition:background 150ms ease,color 150ms ease;}
.cpNavItem:hover{background:rgba(200,148,58,.1);color:var(--ink);}
.cpNavActive{background:var(--ink);color:#fff8ec;}
.cpNavActive:hover{background:var(--ink);color:#fff8ec;}
.cpNavActive .cpNavIcon{color:var(--gold-hi);}
.cpNavIcon{width:18px;height:18px;color:var(--chestnut);}
.cpCaret{width:14px;height:14px;opacity:.7;transition:transform 200ms ease;}
.cpCaretUp{transform:rotate(180deg);}

.cpDrop{position:relative;}
.cpMenu{position:absolute;top:calc(100% + 12px);left:0;width:620px;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:2px;background:#fffdf9;border:1px solid var(--line);border-radius:20px;box-shadow:0 34px 80px rgba(46,29,16,.18);animation:cpIn 170ms cubic-bezier(.2,.8,.2,1);}
@keyframes cpIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
.cpMenuItem{display:flex;align-items:flex-start;gap:12px;padding:12px;border:none;border-radius:14px;background:transparent;cursor:pointer;text-align:left;transition:background 140ms ease;}
.cpMenuItem:hover{background:var(--cream);}
.cpMenuItemOn{background:var(--cream);box-shadow:inset 0 0 0 1px rgba(200,148,58,.3);}
.cpMenuIcon{flex:0 0 auto;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(145deg,#fbeed6,#f1dcb8);color:var(--chestnut-deep);box-shadow:inset 0 0 0 1px rgba(200,148,58,.22);}
.cpMenuIcon svg{width:21px;height:21px;}
.cpMenuIconSm{width:32px;height:32px;border-radius:10px;}
.cpMenuIconSm svg{width:17px;height:17px;}
.cpMenuText{display:flex;flex-direction:column;min-width:0;}
.cpMenuName{display:flex;align-items:center;gap:8px;font-size:14.5px;font-weight:650;color:var(--ink);}
.cpMenuName em{font-style:normal;font-size:11px;font-weight:700;color:var(--chestnut);background:rgba(200,148,58,.14);padding:2px 7px;border-radius:999px;}
.cpMenuDesc{margin-top:3px;font-size:12.5px;line-height:1.45;color:var(--sub);}

.cpTopRight{margin-left:auto;display:flex;align-items:center;gap:16px;}
.cpSearch{position:relative;display:flex;align-items:center;}
.cpSearchIcon{position:absolute;left:15px;width:18px;height:18px;color:var(--mute);pointer-events:none;}
.cpSearch input{width:300px;height:44px;padding:0 44px 0 44px;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);font-family:var(--ui);font-size:14.5px;outline:none;transition:border-color 150ms ease,box-shadow 150ms ease,width 220ms ease;}
.cpSearch input::placeholder{color:var(--mute);}
.cpSearch input:focus{width:360px;border-color:rgba(200,148,58,.55);box-shadow:0 0 0 4px rgba(200,148,58,.13);}
.cpSearch kbd{position:absolute;right:12px;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-family:var(--ui);font-size:12px;font-weight:600;color:var(--mute);border:1px solid var(--line);border-radius:6px;background:var(--cream);pointer-events:none;}
.cpSiteLink{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:var(--chestnut-deep)!important;text-decoration:none;white-space:nowrap;}
.cpSiteLink:hover{color:var(--ink)!important;}
.cpExt{width:14px;height:14px;}
.cpBurger{display:none;margin-left:auto;width:46px;height:46px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);cursor:pointer;}
.cpBurger svg{width:22px;height:22px;}
.cpMobile{display:none;}

/* Page */
.cpMain{flex:1;width:100%;max-width:1440px;margin:0 auto;padding:36px clamp(16px,3vw,40px) 80px;}
.cpCrumbs{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mute);}
.cpCrumbs button{border:none;background:none;padding:0;cursor:pointer;font-size:13px;color:var(--chestnut);font-weight:600;}
.cpCrumbs b{color:var(--ink);font-weight:600;}
.cpTitleRow{margin-top:10px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;}
.cpH1{margin:0;font-family:var(--serif);font-size:clamp(38px,4.2vw,56px);font-weight:600;line-height:1;letter-spacing:-.015em;color:var(--ink);}
.cpSub{margin:10px 0 0;font-size:15.5px;color:var(--sub);}
.cpStat{display:flex;flex-direction:column;align-items:flex-end;padding:12px 18px;border:1px solid var(--line);border-radius:16px;background:#fff;}
.cpStatNum{font-family:var(--serif);font-size:34px;font-weight:700;line-height:1;color:var(--chestnut);}
.cpStatLbl{margin-top:4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);}

.cpTabs{margin-top:28px;display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
.cpTabs::-webkit-scrollbar{display:none;}
.cpTab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 16px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#5b4535;white-space:nowrap;transition:all 150ms ease;}
.cpTab:hover{border-color:rgba(200,148,58,.45);color:var(--ink);}
.cpTab em{font-style:normal;font-size:11.5px;font-weight:700;color:var(--mute);}
.cpTabIcon{width:17px;height:17px;color:var(--chestnut);}
.cpTabOn{background:var(--ink);border-color:var(--ink);color:#fff8ec;}
.cpTabOn:hover{color:#fff8ec;}
.cpTabOn em{color:var(--gold-hi);}
.cpTabOn .cpTabIcon{color:var(--gold-hi);}

.cpToolbar{margin-top:14px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.7);}
.cpFilters{display:flex;flex-wrap:wrap;gap:6px;}
.cpChip{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 13px;border:1px solid transparent;border-radius:10px;background:var(--cream);cursor:pointer;font-size:13.5px;font-weight:600;color:#5b4535;transition:all 140ms ease;}
.cpChip:hover{border-color:rgba(200,148,58,.4);}
.cpChip em{font-style:normal;font-size:11.5px;color:var(--mute);}
.cpChipIcon{width:16px;height:16px;color:var(--chestnut);}
.cpChipOn{background:#fff;border-color:var(--gold);color:var(--ink);box-shadow:0 0 0 3px rgba(200,148,58,.14);}
.cpControls{display:flex;align-items:center;gap:8px;}
.cpSelect{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 4px 0 12px;border:1px solid var(--line);border-radius:10px;background:#fff;}
.cpSelect span{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);}
.cpSelect select{height:34px;border:none;background:transparent;font-family:var(--ui);font-size:13.5px;font-weight:600;color:var(--ink);outline:none;cursor:pointer;}
.cpSeg{display:inline-flex;padding:3px;border:1px solid var(--line);border-radius:10px;background:#fff;}
.cpSeg button{width:32px;height:28px;display:flex;align-items:center;justify-content:center;border:none;border-radius:7px;background:transparent;cursor:pointer;color:var(--mute);}
.cpSeg button svg{width:17px;height:17px;}
.cpSeg .cpSegOn{background:var(--ink);color:#fff8ec;}

.cpActive{margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;}
.cpPill{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px 0 12px;border:1px solid rgba(200,148,58,.35);border-radius:999px;background:rgba(200,148,58,.1);cursor:pointer;font-size:12.5px;font-weight:600;color:var(--chestnut-deep);}
.cpPill svg{width:12px;height:12px;}
.cpClear{border:none;background:none;cursor:pointer;font-size:12.5px;font-weight:600;color:var(--mute);text-decoration:underline;}

/* Grid */
.cpGrid{margin-top:22px;display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:22px;}
.cpCard{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:20px;background:#fff;overflow:hidden;transition:transform 200ms cubic-bezier(.2,.8,.2,1),box-shadow 200ms ease,border-color 200ms ease;}
.cpCard:hover{transform:translateY(-4px);border-color:rgba(200,148,58,.3);box-shadow:0 24px 50px rgba(74,43,22,.1);}
.cpCardThumb{position:relative;display:block;padding:22px 26px 0;border:none;cursor:pointer;background:linear-gradient(180deg,#f7eddc,#f1e3cc);overflow:hidden;}
.cpCardThumb .cpPaper{transition:transform 260ms cubic-bezier(.2,.8,.2,1);}
.cpCard:hover .cpCardThumb .cpPaper{transform:translateY(-4px) rotate(-1deg);}
.cpNew{position:absolute;top:12px;left:12px;padding:4px 9px;border-radius:999px;background:var(--ink);color:var(--gold-hi);font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;}
.cpHover{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(43,33,26,.28);opacity:0;transition:opacity 180ms ease;}
.cpHover span{padding:10px 18px;border-radius:999px;background:#fff;color:var(--ink);font-size:13.5px;font-weight:700;box-shadow:0 10px 24px rgba(0,0,0,.18);}
.cpCardThumb:hover .cpHover,.cpCardThumb:focus-visible .cpHover{opacity:1;}
.cpCardBody{display:flex;flex-direction:column;flex:1;padding:16px 18px 16px;}
.cpType{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);}
.cpTypeIcon{width:14px;height:14px;}
.cpCardTitle{margin-top:7px;padding:0;border:none;background:none;cursor:pointer;text-align:left;font-size:15.5px;font-weight:650;line-height:1.35;color:var(--ink);}
.cpCardTitle:hover{color:var(--chestnut);}
.cpCardFoot{margin-top:auto;padding-top:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.cpMeta{font-size:12.5px;color:var(--mute);}
.cpDl{flex:0 0 auto;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:11px;border:1px solid var(--line);background:#fff;color:var(--chestnut-deep)!important;transition:all 150ms ease;}
.cpDl svg{width:17px;height:17px;}
.cpDl:hover{background:var(--gold);border-color:var(--gold);color:#2e1f12!important;}

/* Paper thumbnail */
.cpPaper{position:relative;aspect-ratio:8.5/11;width:100%;padding:12% 11% 9%;display:flex;flex-direction:column;background:#fff;border-radius:6px 6px 0 0;box-shadow:0 -1px 0 rgba(111,67,39,.06),0 10px 28px rgba(74,43,22,.12);overflow:hidden;}
.cpPaperLg{border-radius:8px;box-shadow:0 30px 70px rgba(46,29,16,.18);padding:10% 10% 8%;}
.cpPaperImg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.cpPaperHead{display:flex;justify-content:space-between;gap:6px;font-size:7px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);}
.cpPaperLg .cpPaperHead{font-size:11px;}
.cpPaperNm{color:rgba(111,67,39,.35);letter-spacing:0;text-transform:none;font-weight:500;}
.cpPaperTitle{margin-top:8%;font-family:var(--serif);font-size:17px;font-weight:600;line-height:1.05;color:var(--ink);}
.cpPaperLg .cpPaperTitle{font-size:32px;}
.cpPanels{margin-top:8%;flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6%;}
.cpPanels span{border:1.5px solid rgba(111,67,39,.35);border-radius:4px;background:repeating-linear-gradient(135deg,transparent 0 9px,rgba(138,93,59,.05) 9px 10px);}
.cpCraft{margin-top:6%;flex:1;display:flex;flex-direction:column;align-items:center;border:1.5px dashed rgba(138,93,59,.4);border-radius:6px;padding:6%;}
.cpCraftFig{flex:1;width:70%;display:flex;align-items:center;justify-content:center;color:rgba(111,67,39,.55);}
.cpCraftFig svg{width:100%;height:100%;max-height:120px;}
.cpPaperLg .cpCraftFig svg{max-height:240px;}
.cpFold{width:100%;border-top:1.5px dashed rgba(200,148,58,.7);margin:6% 0;}
.cpCraftBase{width:80%;height:14%;border:1.5px solid rgba(111,67,39,.3);border-radius:3px;}
.cpBoxes{margin-top:8%;flex:1;display:grid;grid-template-columns:1fr 1fr 1fr;grid-auto-rows:1fr;gap:6%;}
.cpBoxes span{border:1.5px dashed rgba(138,93,59,.4);border-radius:4px;}
.cpLines{margin-top:8%;flex:1;display:flex;flex-direction:column;justify-content:space-around;}
.cpLine{display:flex;align-items:center;gap:6%;}
.cpLine i{width:9%;aspect-ratio:1;border:1.5px solid rgba(138,93,59,.45);border-radius:3px;flex:0 0 auto;}
.cpLine b{flex:1;height:1.5px;background:rgba(111,67,39,.2);}
.cpLine .cpShort{flex:0 0 60%;}
.cpPaperFoot{margin-top:6%;font-size:6.5px;color:rgba(111,67,39,.4);}
.cpPaperLg .cpPaperFoot{font-size:10px;}

/* List */
.cpTable{margin-top:22px;border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden;}
.cpRow{display:grid;grid-template-columns:minmax(0,2.6fr) 1.2fr 1fr .7fr .5fr 52px;align-items:center;gap:14px;padding:12px 18px;border-top:1px solid var(--line);}
.cpRow:hover:not(.cpRowHead){background:var(--cream);}
.cpRowHead{border-top:none;background:#fbf6ee;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);}
.cpRowTitle{display:flex;align-items:center;gap:12px;padding:0;border:none;background:none;cursor:pointer;text-align:left;font-size:14.5px;font-weight:650;color:var(--ink);min-width:0;}
.cpRowTitle:hover{color:var(--chestnut);}
.cpRowThumb{flex:0 0 auto;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:var(--cream);color:var(--chestnut);}
.cpRowThumb svg{width:18px;height:18px;}
.cpRowCell{font-size:13.5px;color:var(--sub);}
.cpNewInline{margin-left:8px;font-style:normal;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);}

/* Empty */
.cpEmpty{margin-top:40px;padding:64px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;color:var(--sub);border:1px dashed rgba(111,67,39,.2);border-radius:22px;}
.cpEmptyIcon{width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:var(--cream);color:var(--chestnut);}
.cpEmptyIcon svg{width:26px;height:26px;}
.cpEmptyTitle{margin:16px 0 4px;font-family:var(--serif);font-size:28px;font-weight:600;color:var(--ink);}
.cpEmpty .cpBtn{margin-top:18px;}

/* Buttons */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 22px;border-radius:14px;font-size:14.5px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease,background 150ms ease;}
.cpBtn svg{width:18px;height:18px;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 8px 20px rgba(168,116,37,.25);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 12px 26px rgba(168,116,37,.32);}
.cpBtnGhost{border:1px solid var(--line);background:#fff;color:var(--ink);}
.cpBtnGhost:hover{border-color:rgba(200,148,58,.45);}

/* Modal */
.cpOverlay{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(31,24,18,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:cpFade 160ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}
.cpModal{position:relative;width:min(1040px,100%);max-height:calc(100svh - 48px);display:grid;grid-template-columns:1fr 1fr;background:var(--ivory);border-radius:26px;overflow:hidden;box-shadow:0 50px 120px rgba(0,0,0,.35);animation:cpIn 220ms cubic-bezier(.2,.8,.2,1);}
.cpModalClose{position:absolute;top:16px;right:16px;z-index:2;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:12px;background:#fff;cursor:pointer;color:var(--ink);}
.cpModalClose svg{width:18px;height:18px;}
.cpModalPreview{display:flex;align-items:center;justify-content:center;padding:44px;background:radial-gradient(90% 70% at 50% 0%,rgba(200,148,58,.22),transparent 70%),linear-gradient(180deg,#f5e9d4,#efdfc4);}
.cpModalPreview .cpPaper{max-width:380px;}
.cpModalBody{padding:48px 44px 36px;overflow-y:auto;}
.cpEyebrow{font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);}
.cpModalTitle{margin:12px 0 0;font-family:var(--serif);font-size:38px;font-weight:600;line-height:1.02;color:var(--ink);}
.cpModalDesc{margin:14px 0 0;font-size:15.5px;line-height:1.65;color:var(--sub);}
.cpSpecs{margin:24px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:16px;overflow:hidden;}
.cpSpecs div{padding:14px 16px;background:#fff;}
.cpSpecs dt{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);}
.cpSpecs dd{margin:5px 0 0;display:flex;align-items:center;gap:7px;font-size:14.5px;font-weight:650;color:var(--ink);}
.cpSpecIcon{width:16px;height:16px;color:var(--chestnut);}
.cpModalActions{margin-top:24px;display:flex;gap:10px;}
.cpModalActions .cpBtnPrimary{flex:1;}
.cpSources{margin:16px 0 0;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--sub);}
.cpSourcesIcon{width:15px;height:15px;color:#4d9b5f;flex:0 0 auto;}
.cpRelated{margin-top:28px;padding-top:22px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:4px;}
.cpRelatedHead{margin-bottom:6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);}
.cpRelatedItem{display:flex;align-items:center;gap:12px;padding:9px 10px;border:none;border-radius:12px;background:transparent;cursor:pointer;text-align:left;}
.cpRelatedItem:hover{background:var(--cream);}
.cpRelatedType{flex:0 0 auto;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:var(--cream);color:var(--chestnut);}
.cpRelatedType svg{width:16px;height:16px;}
.cpRelatedTitle{flex:1;font-size:13.5px;font-weight:600;color:var(--ink);}
.cpRelatedMeta{font-size:12px;color:var(--mute);}

/* Footer */
.cpFoot{border-top:1px solid var(--line);padding:22px clamp(16px,3vw,40px);display:flex;justify-content:space-between;gap:20px;max-width:1440px;width:100%;margin:0 auto;font-size:12px;line-height:1.6;color:var(--mute);}
.cpFoot p{margin:0;}
.cpFoot p:first-child{max-width:640px;}
.cpFoot a{color:var(--chestnut)!important;text-decoration:none;}

/* Responsive */
@media (max-width:1200px){
  .cpSiteLink{display:none;}
  .cpSearch input{width:240px;}
  .cpSearch input:focus{width:280px;}
}
@media (max-width:980px){
  .cpNav,.cpTopRight{display:none;}
  .cpBurger{display:inline-flex;}
  .cpTopInner{height:72px;}
  .cpLogo{height:50px;}
  .cpMobile{display:flex;flex-direction:column;gap:2px;max-height:calc(100svh - 72px);overflow-y:auto;padding:14px clamp(16px,3vw,40px) 24px;border-top:1px solid var(--line);background:var(--ivory);animation:cpIn 180ms ease;}
  .cpSearchMobile{margin-bottom:10px;}
  .cpSearchMobile input,.cpSearchMobile input:focus{width:100%;height:48px;font-size:16px;}
  .cpMobileItem{display:flex;align-items:center;gap:12px;padding:11px 8px;border:none;border-radius:12px;background:transparent;cursor:pointer;font-size:16px;font-weight:600;color:var(--ink);text-align:left;text-decoration:none;}
  .cpMobileItem:hover,.cpMobileOn{background:var(--cream);}
  .cpMobileLabel{margin:14px 8px 4px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
  .cpModal{grid-template-columns:1fr;overflow-y:auto;}
  .cpModalPreview{padding:32px 32px 24px;}
  .cpModalPreview .cpPaper{max-width:260px;}
  .cpModalBody{padding:28px 26px 30px;overflow:visible;}
  .cpRow{grid-template-columns:minmax(0,1fr) 44px;}
  .cpRow > .cpRowCell,.cpRowHead > span:not(:first-child):not(:last-child){display:none;}
}
@media (max-width:640px){
  .cpMain{padding-top:24px;}
  .cpTitleRow{align-items:flex-start;}
  .cpStat{padding:8px 12px;}
  .cpStatNum{font-size:26px;}
  .cpToolbar{padding:10px;}
  .cpFilters{flex-wrap:nowrap;overflow-x:auto;width:100%;scrollbar-width:none;}
  .cpFilters::-webkit-scrollbar{display:none;}
  .cpChip{flex:0 0 auto;}
  .cpControls{width:100%;}
  .cpSelect{flex:1;}
  .cpSelect select{flex:1;}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
  .cpCardThumb{padding:14px 16px 0;}
  .cpCardBody{padding:12px 12px 12px;}
  .cpCardTitle{font-size:14px;}
  .cpMeta{display:none;}
  .cpOverlay{padding:0;align-items:flex-end;}
  .cpModal{max-height:92svh;border-radius:24px 24px 0 0;}
  .cpModalTitle{font-size:30px;}
  .cpModalActions{flex-direction:column;}
  .cpFoot{flex-direction:column;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
