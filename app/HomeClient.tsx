"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Edit your categories here ─────────────────────────────── */

type IconKey = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";

type Category = {
  slug: string;
  name: string;
  latin: string;
  numeral: string;
  description: string;
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
    description: "The lives of the saints, their feast days, and the causes they patron.",
    topics: ["Feast days", "Patron saints", "Four-panel stories", "Stand-up saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", latin: "Sacra Scriptura", numeral: "II", icon: "bible", accent: "#4f6b4a", worksheets: 0,
    description: "The Old and New Testaments, told simply for the classroom.",
    topics: ["Old Testament", "The Gospels", "Parables", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", latin: "Sancta Missa", numeral: "III", icon: "mass", accent: "#7a2e33", worksheets: 0,
    description: "The parts of the Mass, the sacred vessels, and what each moment means.",
    topics: ["Parts of the Mass", "Sacred vessels", "Vestments & colors", "Responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", latin: "Sacramenta", numeral: "IV", icon: "sacraments", accent: "#2f6570", worksheets: 0,
    description: "The seven sacraments, with special care for First Communion and Confirmation.",
    topics: ["Baptism", "Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", latin: "Orationes", numeral: "V", icon: "prayers", accent: "#7d5436", worksheets: 0,
    description: "The traditional prayers of the Church, to learn by heart and pray together.",
    topics: ["Our Father", "Hail Mary", "Glory Be", "Act of Contrition"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", latin: "Annus Liturgicus", numeral: "VI", icon: "seasons", accent: "#5a4273", worksheets: 0,
    description: "Walk through the Church year, from Advent to Ordinary Time.",
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", latin: "Rosarium", numeral: "VII", icon: "rosary", accent: "#3d5a86", worksheets: 0,
    description: "The mysteries of the Rosary and how to pray them, decade by decade.",
    topics: ["Joyful", "Luminous", "Sorrowful", "Glorious"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Moral Life", latin: "Virtutes", numeral: "VIII", icon: "virtues", accent: "#8c4a2a", worksheets: 0,
    description: "The virtues, the Commandments, and the works of mercy in daily life.",
    topics: ["Theological virtues", "Cardinal virtues", "Ten Commandments", "Works of mercy"],
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

const UI: Record<string, ReactNode> = {
  library: (<><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /><path d="M12 4V2M11 3h2" /></>),
  categories: (<><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  external: (<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  caret: (<><path d="m6 9 6 6 6-6" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  quill: (<><path d="M20 4c-6 0-11 4.5-12.5 11L6 20" /><path d="M20 4c0 6-4 10.5-10.5 11.5" /><path d="M9 14.5 13.5 10" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
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

function Ornament() {
  return (
    <div className="cpOrnament" aria-hidden="true">
      <span className="cpOrnLine" />
      <span className="cpOrnCross">✠</span>
      <span className="cpOrnLine" />
    </div>
  );
}

/* ── Top navigation (Owntric-style app bar) ────────────────── */

function TopNav({ active, query, onHome, onOpen, onQuery }: {
  active: Category | undefined; query: string;
  onHome: () => void; onOpen: (slug: string) => void; onQuery: (q: string) => void;
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
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
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
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const go = (slug: string) => {
    onOpen(slug);
    setCatOpen(false);
    setMobileOpen(false);
  };

  const home = () => {
    onHome();
    setCatOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className={scrolled ? "cpTop cpTopScrolled" : "cpTop"}>
      <div className="cpTopInner">
        <button className="cpBrand" onClick={home} aria-label="Library home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
        </button>

        <nav className="cpNav" aria-label="Primary">
          <button className={!active ? "cpNavItem cpNavActive" : "cpNavItem"} onClick={home}>
            <Svg className="cpNavIcon">{UI.library}</Svg> Library
          </button>

          <div className="cpDrop" ref={catRef}>
            <button className={catOpen || active ? "cpNavItem cpNavActive" : "cpNavItem"} aria-expanded={catOpen} aria-haspopup="true" onClick={() => setCatOpen((v) => !v)}>
              <Svg className="cpNavIcon">{UI.categories}</Svg>
              {active ? active.name : "Categories"}
              <Svg className={catOpen ? "cpCaret cpCaretUp" : "cpCaret"} sw={2.2}>{UI.caret}</Svg>
            </button>
            {catOpen && (
              <div className="cpMenu" role="menu">
                <div className="cpMenuHead">
                  <span className="cpMenuEyebrow">The Library</span>
                  <span className="cpMenuTitle">Browse by category</span>
                </div>
                <div className="cpMenuGrid">
                  {CATEGORIES.map((c) => (
                    <button key={c.slug} role="menuitem" style={accentStyle(c)} className={active?.slug === c.slug ? "cpMenuItem cpMenuItemOn" : "cpMenuItem"} onClick={() => go(c.slug)}>
                      <span className="cpMenuMedal"><Svg>{ICONS[c.icon]}</Svg></span>
                      <span className="cpMenuText">
                        <span className="cpMenuName">{c.name}</span>
                        <span className="cpMenuLatin">{c.latin}</span>
                      </span>
                      <span className="cpMenuNum">{c.numeral}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="cpTopRight">
          <label className="cpSearch">
            <Svg className="cpSearchIcon" sw={2}>{UI.search}</Svg>
            <input ref={searchRef} type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search categories and topics" aria-label="Search categories and topics" />
            {!query && <kbd>/</kbd>}
          </label>
          <a href="https://catholicprojects.org" className="cpSiteLink">
            CatholicProjects.org <Svg className="cpExt" sw={2}>{UI.external}</Svg>
          </a>
        </div>

        <button className="cpBurger" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          <Svg sw={2}>{mobileOpen ? UI.close : UI.menu}</Svg>
        </button>
      </div>
      <div className="cpTopRule" aria-hidden="true" />

      {mobileOpen && (
        <div className="cpMobile">
          <label className="cpSearch cpSearchMobile">
            <Svg className="cpSearchIcon" sw={2}>{UI.search}</Svg>
            <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search categories and topics" aria-label="Search categories and topics" />
          </label>
          <button className={!active ? "cpMobileItem cpMobileOn" : "cpMobileItem"} onClick={home}>
            <Svg className="cpNavIcon">{UI.library}</Svg> Library
          </button>
          <span className="cpMobileLabel">Categories</span>
          {CATEGORIES.map((c) => (
            <button key={c.slug} style={accentStyle(c)} className={active?.slug === c.slug ? "cpMobileItem cpMobileOn" : "cpMobileItem"} onClick={() => go(c.slug)}>
              <span className="cpMenuMedal cpMenuMedalSm"><Svg>{ICONS[c.icon]}</Svg></span>
              <span className="cpMobileText">{c.name}<em>{c.latin}</em></span>
            </button>
          ))}
          <a href="https://catholicprojects.org" className="cpMobileItem">
            <Svg className="cpNavIcon" sw={2}>{UI.external}</Svg> CatholicProjects.org
          </a>
        </div>
      )}
    </header>
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
        </span>

        <span className="cpCatBody">
          <span className="cpLatin">{c.latin}</span>
          <span className="cpCatName">{c.name}</span>
          <span className="cpCatRule" aria-hidden="true"><i /><b>✦</b><i /></span>
          <span className="cpCatDesc">{c.description}</span>
          <span className="cpTopics">
            {c.topics.map((t) => <span key={t} className="cpTopic">{t}</span>)}
          </span>
        </span>

        <span className="cpCatFoot">
          <span className="cpStatus">
            <span className="cpStatusDot" />
            {c.worksheets > 0 ? `${c.worksheets} worksheet${c.worksheets === 1 ? "" : "s"}` : "Coming soon"}
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

function LibraryHome({ query, onOpen, onClear }: { query: string; onOpen: (slug: string) => void; onClear: () => void }) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => [c.name, c.latin, c.description, ...c.topics].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <section className="cpIntro">
        <span className="cpEyebrow">The Library · Bibliotheca</span>
        <h1 className="cpH1">Every worksheet, <em>in its proper place.</em></h1>
        <p className="cpLead">
          Free, source-linked resources organized the way the faith is taught. Choose a category to see what it holds, and what is being prepared.
        </p>
        <div className="cpFacts">
          <span><b>{CATEGORIES.length}</b> categories</span>
          <span className="cpFactSep">✦</span>
          <span><b>Free</b> forever</span>
          <span className="cpFactSep">✦</span>
          <span><b>Source-linked</b></span>
          <span className="cpFactSep">✦</span>
          <span><b>Print-ready</b></span>
        </div>
        <Ornament />
      </section>

      {query && (
        <div className="cpSearchNote">
          {results.length} {results.length === 1 ? "category matches" : "categories match"} “{query}”
          <button onClick={onClear}>Clear</button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="cpEmpty">
          <span className="cpEmptyMark">✠</span>
          <p className="cpEmptyTitle">Nothing matches “{query}” yet.</p>
          <p>Try a saint, a prayer, a season, or a sacrament.</p>
          <button className="cpBtn cpBtnGhost" onClick={onClear}>Show all categories</button>
        </div>
      ) : (
        <div className="cpGrid">
          {results.map((c) => <CategoryCard key={c.slug} c={c} onOpen={onOpen} />)}
        </div>
      )}
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
          <h2 className="cpH2">What you’ll find here</h2>
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
          <h3>Worksheets are being prepared.</h3>
          <p>Each resource is researched from Catholic sources before it’s published. The first {c.name.toLowerCase()} worksheets will appear here as soon as they’re ready.</p>
        </div>
        <div className="cpPrepActions">
          <a className="cpBtn cpBtnPrimary" href={suggest}>
            <Svg sw={1.8}>{UI.mail}</Svg> Suggest a worksheet
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
              <span className="cpMenuMedal"><Svg>{ICONS[o.icon]}</Svg></span>
              <span className="cpMenuText">
                <span className="cpMenuName">{o.name}</span>
                <span className="cpMenuLatin">{o.latin}</span>
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
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("category");
    if (bySlug(c)) setSlug(c);
    setReady(true);
    const onPop = () => {
      const q = new URLSearchParams(window.location.search).get("category");
      setSlug(bySlug(q) ? q : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openCategory = (s: string) => {
    setSlug(s);
    setQuery("");
    window.history.pushState(null, "", `?category=${s}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setSlug(null);
    window.history.pushState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeQuery = (q: string) => {
    setQuery(q);
    if (slug) {
      setSlug(null);
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  const active = bySlug(slug);

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <div className="cpGlow cpGlowA" aria-hidden="true" />
      <div className="cpGlow cpGlowB" aria-hidden="true" />

      <TopNav active={active} query={query} onHome={goHome} onOpen={openCategory} onQuery={changeQuery} />

      <main className={ready ? "cpMain cpReady" : "cpMain"}>
        {active ? (
          <CategoryPage key={active.slug} c={active} onHome={goHome} onOpen={openCategory} />
        ) : (
          <LibraryHome query={query} onOpen={openCategory} onClear={() => setQuery("")} />
        )}
      </main>

      <footer className="cpFoot">
        <div className="cpFootInner">
          <span className="cpFootMark">✠</span>
          <p className="cpFootText">Free Catholic resources, built from the sources — for families, parishes, catechists, and educators.</p>
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
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d9a84e;--gold-soft:rgba(200,148,58,.28);--ink:#2b211a;--sub:#70645a;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--parch:#f6ecdb;--line:rgba(111,67,39,.12);
  --ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  position:relative;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;font-family:var(--ui);color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fdf8f0 40%,#fbf5ea 100%);-webkit-font-smoothing:antialiased;}
.cpRoot *{box-sizing:border-box;}
.cpRoot button{font-family:inherit;}
.cpRoot a{color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:12px;}
.cpGlow{position:absolute;border-radius:999px;pointer-events:none;filter:blur(8px);z-index:0;}
.cpGlowA{width:900px;height:900px;top:-520px;left:50%;transform:translateX(-50%);background:radial-gradient(circle,rgba(200,148,58,.18),rgba(200,148,58,.05) 45%,transparent 70%);}
.cpGlowB{width:700px;height:700px;top:900px;right:-360px;background:radial-gradient(circle,rgba(138,93,59,.08),transparent 65%);}

/* ── Top nav ── */
.cpTop{position:sticky;top:0;z-index:50;background:rgba(255,253,249,.84);backdrop-filter:saturate(1.4) blur(18px);-webkit-backdrop-filter:saturate(1.4) blur(18px);transition:box-shadow 200ms ease;}
.cpTopScrolled{box-shadow:0 10px 30px rgba(46,29,16,.07);}
.cpTopInner{max-width:1400px;margin:0 auto;height:88px;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:28px;}
.cpTopRule{height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.55) 20%,rgba(200,148,58,.55) 80%,transparent);}
.cpBrand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cpLogo{height:64px;width:auto;display:block;transition:transform 200ms ease;}
.cpBrand:hover .cpLogo{transform:scale(1.02);}
.cpNav{display:flex;align-items:center;gap:4px;padding-left:26px;border-left:1px solid var(--line);height:42px;}
.cpNavItem{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 16px;border:none;border-radius:12px;background:transparent;cursor:pointer;font-size:15px;font-weight:600;color:#5b4535;white-space:nowrap;transition:background 150ms ease,color 150ms ease;}
.cpNavItem:hover{background:rgba(200,148,58,.1);color:var(--ink);}
.cpNavActive,.cpNavActive:hover{background:var(--ink);color:#fff8ec;}
.cpNavIcon{width:18px;height:18px;color:var(--chestnut);}
.cpNavActive .cpNavIcon{color:var(--gold-hi);}
.cpCaret{width:14px;height:14px;opacity:.7;transition:transform 200ms ease;}
.cpCaretUp{transform:rotate(180deg);}

.cpDrop{position:relative;}
.cpMenu{position:absolute;top:calc(100% + 14px);left:0;width:640px;padding:10px;background:#fffdf9;border:1px solid var(--line);border-radius:22px;box-shadow:0 40px 90px rgba(46,29,16,.2);animation:cpIn 180ms cubic-bezier(.2,.8,.2,1);}
@keyframes cpIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
.cpMenuHead{display:flex;flex-direction:column;padding:14px 14px 12px;margin-bottom:6px;border-bottom:1px solid var(--line);}
.cpMenuEyebrow{font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpMenuTitle{margin-top:4px;font-family:var(--serif);font-size:24px;font-weight:600;color:var(--ink);}
.cpMenuGrid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
.cpMenuItem{display:flex;align-items:center;gap:12px;padding:10px 12px;border:none;border-radius:14px;background:transparent;cursor:pointer;text-align:left;transition:background 140ms ease;}
.cpMenuItem:hover{background:var(--cream);}
.cpMenuItemOn{background:var(--cream);box-shadow:inset 0 0 0 1px var(--gold-soft);}
.cpMenuMedal{flex:0 0 auto;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent,#8a5d3b) 70%,#fff),var(--accent,#8a5d3b) 70%);color:#fff6e6;box-shadow:0 0 0 2px #fffdf9,0 0 0 3px rgba(200,148,58,.55),0 6px 14px rgba(46,29,16,.15);}
.cpMenuMedal svg{width:20px;height:20px;}
.cpMenuMedalSm{width:32px;height:32px;}
.cpMenuMedalSm svg{width:16px;height:16px;}
.cpMenuText{display:flex;flex-direction:column;min-width:0;flex:1;}
.cpMenuName{font-size:14.5px;font-weight:650;color:var(--ink);}
.cpMenuLatin{margin-top:1px;font-family:var(--serif);font-style:italic;font-size:14px;color:var(--chestnut);}
.cpMenuNum{font-family:var(--serif);font-size:15px;font-weight:600;color:rgba(111,67,39,.35);}

.cpTopRight{margin-left:auto;display:flex;align-items:center;gap:18px;}
.cpSearch{position:relative;display:flex;align-items:center;}
.cpSearchIcon{position:absolute;left:15px;width:18px;height:18px;color:var(--mute);pointer-events:none;}
.cpSearch input{width:300px;height:44px;padding:0 44px;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);font-family:var(--ui);font-size:14.5px;outline:none;transition:border-color 150ms ease,box-shadow 150ms ease,width 220ms ease;}
.cpSearch input::placeholder{color:var(--mute);}
.cpSearch input:focus{width:350px;border-color:rgba(200,148,58,.55);box-shadow:0 0 0 4px rgba(200,148,58,.13);}
.cpSearch kbd{position:absolute;right:12px;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-family:var(--ui);font-size:12px;font-weight:600;color:var(--mute);border:1px solid var(--line);border-radius:6px;background:var(--cream);pointer-events:none;}
.cpSiteLink{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:var(--chestnut-deep)!important;text-decoration:none;white-space:nowrap;}
.cpSiteLink:hover{color:var(--ink)!important;}
.cpExt{width:14px;height:14px;}
.cpBurger{display:none;margin-left:auto;width:46px;height:46px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);cursor:pointer;}
.cpBurger svg{width:22px;height:22px;}
.cpMobile{display:none;}

/* ── Main ── */
.cpMain{position:relative;z-index:1;flex:1;width:100%;max-width:1400px;margin:0 auto;padding:0 clamp(16px,3vw,40px) 96px;}
.cpReady{animation:cpFade 360ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}

.cpIntro{padding:64px 0 10px;text-align:center;display:flex;flex-direction:column;align-items:center;}
.cpEyebrow{font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);}
.cpH1{margin:16px 0 0;max-width:900px;font-family:var(--serif);font-weight:600;font-size:clamp(44px,5.6vw,80px);line-height:.98;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;}
.cpH1 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpLead{margin:22px 0 0;max-width:620px;font-size:clamp(15.5px,1.3vw,17.5px);line-height:1.7;color:var(--sub);}
.cpFacts{margin-top:26px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;font-size:13.5px;color:var(--sub);}
.cpFacts b{color:var(--ink);font-weight:650;}
.cpFactSep{font-size:10px;color:var(--gold);}

.cpOrnament{width:100%;max-width:520px;margin:40px auto 44px;display:flex;align-items:center;gap:18px;}
.cpOrnLine{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.6));}
.cpOrnLine:last-child{background:linear-gradient(90deg,rgba(200,148,58,.6),transparent);}
.cpOrnCross{font-size:20px;color:var(--gold);line-height:1;}

.cpSearchNote{margin:-16px 0 24px;display:flex;align-items:center;justify-content:center;gap:12px;font-size:14px;color:var(--sub);}
.cpSearchNote button{border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:var(--chestnut);text-decoration:underline;}

/* ── Premium category cards ── */
.cpGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px;}
.cpCat{--accent:#8a5d3b;position:relative;display:block;width:100%;padding:9px;border:1px solid rgba(200,148,58,.32);border-radius:30px 30px 22px 22px;background:linear-gradient(180deg,#fffefb,#fdf7ec);cursor:pointer;text-align:center;overflow:hidden;box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 18px 44px rgba(74,43,22,.08);transition:transform 320ms cubic-bezier(.2,.8,.2,1),box-shadow 320ms ease,border-color 320ms ease;}
.cpCat:hover{transform:translateY(-8px);border-color:rgba(200,148,58,.6);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 36px 70px rgba(74,43,22,.16),0 0 0 4px rgba(200,148,58,.08);}
.cpCatFrame{position:relative;display:flex;flex-direction:column;height:100%;min-height:500px;border:1px solid rgba(200,148,58,.28);border-radius:23px 23px 15px 15px;overflow:hidden;}

.cpWindow,.cpHeroWindow{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 92%,#140d08) 0%,color-mix(in srgb,var(--accent) 62%,#140d08) 100%);}
.cpWindow{height:210px;margin:12px 12px 0;border-radius:999px 999px 10px 10px;box-shadow:inset 0 0 0 1px rgba(255,236,200,.18),inset 0 -30px 50px rgba(0,0,0,.22);}
.cpWindowGlass{position:absolute;inset:0;background:repeating-linear-gradient(60deg,rgba(255,240,210,.075) 0 1px,transparent 1px 26px),repeating-linear-gradient(-60deg,rgba(255,240,210,.075) 0 1px,transparent 1px 26px),repeating-linear-gradient(0deg,rgba(255,240,210,.05) 0 1px,transparent 1px 26px);}
.cpWindowLight{position:absolute;left:50%;top:-40%;width:140%;height:120%;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 30%,rgba(255,226,170,.55),rgba(255,226,170,.12) 38%,transparent 62%);transition:opacity 320ms ease,transform 400ms ease;opacity:.75;}
.cpCat:hover .cpWindowLight{opacity:1;transform:translateX(-50%) translateY(6%);}
.cpNumeral{position:absolute;top:22px;left:50%;transform:translateX(-50%);font-family:var(--serif);font-size:15px;font-weight:600;letter-spacing:.2em;color:rgba(255,238,205,.78);}
.cpNumeral::before,.cpNumeral::after{content:"";display:inline-block;width:14px;height:1px;margin:0 8px;vertical-align:middle;background:rgba(255,226,170,.55);}

.cpMedal{position:relative;z-index:1;margin-top:26px;width:104px;height:104px;padding:4px;border-radius:999px;background:conic-gradient(from 210deg,#8f6420,#f2d38c,#b98535,#f7df9f,#8f6420);box-shadow:0 0 0 6px rgba(255,240,210,.12),0 16px 34px rgba(0,0,0,.35);transition:transform 420ms cubic-bezier(.2,.8,.2,1);}
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
.cpTopics{margin-top:16px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;}
.cpTopic{padding:5px 10px;border-radius:999px;background:color-mix(in srgb,var(--accent) 9%,#fff);border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);font-size:11.5px;font-weight:600;color:color-mix(in srgb,var(--accent) 80%,#1a120c);}

.cpCatFoot{margin-top:auto;padding:22px 20px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.cpCatFoot{border-top:1px dashed rgba(200,148,58,.3);margin-left:14px;margin-right:14px;padding-left:4px;padding-right:4px;margin-top:22px;}
.cpStatus{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);}
.cpStatusDot{width:7px;height:7px;border-radius:999px;background:var(--gold);box-shadow:0 0 0 0 rgba(200,148,58,.5);animation:cpPulse 2.4s ease-out infinite;}
@keyframes cpPulse{0%{box-shadow:0 0 0 0 rgba(200,148,58,.5);}70%{box-shadow:0 0 0 8px rgba(200,148,58,0);}100%{box-shadow:0 0 0 0 rgba(200,148,58,0);}}
.cpExplore{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:700;color:var(--chestnut);}
.cpExploreIcon{width:16px;height:16px;color:var(--gold);transition:transform 220ms ease;}
.cpCat:hover .cpExploreIcon{transform:translateX(4px);}

.cpShine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,244,220,.55) 48%,transparent 62%);transform:translateX(-120%);}
.cpCat:hover .cpShine{transform:translateX(120%);transition:transform 1100ms cubic-bezier(.2,.8,.2,1);}

.cpEmpty{margin:10px auto 0;max-width:560px;padding:56px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;color:var(--sub);border:1px solid var(--line);border-radius:26px;background:rgba(255,255,255,.7);}
.cpEmptyMark{font-size:28px;color:var(--gold);}
.cpEmptyTitle{margin:12px 0 4px;font-family:var(--serif);font-size:30px;font-weight:600;color:var(--ink);}
.cpEmpty .cpBtn{margin-top:20px;}

/* ── Buttons ── */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:50px;padding:0 24px;border-radius:14px;font-size:14.5px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease,background 150ms ease,border-color 150ms ease;}
.cpBtn svg{width:18px;height:18px;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 24px rgba(168,116,37,.28);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 14px 30px rgba(168,116,37,.34);}
.cpBtnGhost{border:1px solid rgba(111,67,39,.18);background:#fff;color:var(--ink);}
.cpBtnGhost:hover{border-color:rgba(200,148,58,.5);}

/* ── Category page ── */
.cpBack{margin:34px 0 18px;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px 0 10px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:13.5px;font-weight:650;color:var(--chestnut-deep);}
.cpBack svg{width:16px;height:16px;}
.cpBack:hover{border-color:rgba(200,148,58,.5);}

.cpHero{display:grid;grid-template-columns:400px 1fr;gap:56px;align-items:center;padding:14px;border:1px solid rgba(200,148,58,.32);border-radius:36px;background:linear-gradient(180deg,#fffefb,#fdf7ec);box-shadow:0 30px 70px rgba(74,43,22,.1);}
.cpHeroWindow{height:480px;border-radius:999px 999px 20px 20px;box-shadow:inset 0 0 0 1px rgba(255,236,200,.2),inset 0 -40px 70px rgba(0,0,0,.25);}
.cpNumeralLg{top:44px;font-size:19px;}
.cpMedalLg{width:168px;height:168px;padding:6px;margin-top:30px;}
.cpMedalLg .cpMedalIcon{width:80px;height:80px;}
.cpHeroBody{padding:20px 40px 20px 0;}
.cpLatinLg{font-size:24px;}
.cpHeroTitle{margin:6px 0 0;font-family:var(--serif);font-size:clamp(48px,5.4vw,78px);font-weight:600;line-height:.98;letter-spacing:-.02em;color:var(--ink);}
.cpHeroDesc{margin:18px 0 0;max-width:560px;font-size:17px;line-height:1.7;color:var(--sub);}
.cpVerse{position:relative;margin:30px 0 0;padding:22px 26px 20px 28px;border-left:3px solid var(--accent);border-radius:0 18px 18px 0;background:color-mix(in srgb,var(--accent) 6%,#fff);}
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
@media (max-width:1280px){
  .cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpSiteLink{display:none;}
  .cpHero{grid-template-columns:340px 1fr;gap:40px;}
  .cpHeroWindow{height:420px;}
  .cpPreparing{grid-template-columns:auto 1fr;}
  .cpPrepActions{grid-column:1 / -1;}
  .cpMini{grid-template-columns:repeat(3,minmax(0,1fr));}
}
@media (max-width:1024px){
  .cpNav,.cpTopRight{display:none;}
  .cpBurger{display:inline-flex;}
  .cpTopInner{height:76px;}
  .cpLogo{height:52px;}
  .cpMobile{display:flex;flex-direction:column;gap:2px;max-height:calc(100svh - 77px);overflow-y:auto;padding:14px clamp(16px,3vw,40px) 24px;border-top:1px solid var(--line);background:var(--ivory);animation:cpIn 180ms ease;}
  .cpSearchMobile{margin-bottom:10px;}
  .cpSearchMobile input,.cpSearchMobile input:focus{width:100%;height:50px;font-size:16px;}
  .cpMobileItem{display:flex;align-items:center;gap:12px;padding:10px 8px;border:none;border-radius:14px;background:transparent;cursor:pointer;font-size:16px;font-weight:600;color:var(--ink);text-align:left;text-decoration:none;}
  .cpMobileItem:hover,.cpMobileOn{background:var(--cream);}
  .cpMobileText{display:flex;flex-direction:column;}
  .cpMobileText em{font-family:var(--serif);font-size:14px;font-weight:500;color:var(--chestnut);}
  .cpMobileLabel{margin:14px 8px 4px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;}
  .cpHero{grid-template-columns:1fr;gap:0;padding:12px;}
  .cpHeroWindow{height:340px;}
  .cpMedalLg{width:140px;height:140px;}
  .cpHeroBody{padding:30px 22px 22px;text-align:center;}
  .cpHeroDesc{margin-left:auto;margin-right:auto;}
  .cpVerse{text-align:left;}
  .cpTopicGrid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .cpMini{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  .cpIntro{padding-top:40px;}
  .cpFacts{gap:8px;font-size:12.5px;}
  .cpOrnament{margin:30px auto 32px;}
  .cpGrid{grid-template-columns:1fr;gap:18px;}
  .cpCatFrame{min-height:0;}
  .cpWindow{height:190px;}
  .cpHeroWindow{height:280px;}
  .cpMedalLg{width:118px;height:118px;margin-top:22px;}
  .cpMedalLg .cpMedalIcon{width:58px;height:58px;}
  .cpVerse p{font-size:20px;}
  .cpTopicGrid{grid-template-columns:1fr 1fr;gap:12px;}
  .cpTopicCard{padding:20px 18px 18px;}
  .cpTopicName{font-size:21px;}
  .cpPreparing{grid-template-columns:1fr;padding:26px 22px;text-align:left;}
  .cpPrepActions{flex-direction:column;}
  .cpMini{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
