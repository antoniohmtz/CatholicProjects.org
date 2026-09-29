"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--cp-display",
  display: "swap",
});

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

const QUICK_SEARCHES = ["Advent", "Our Father", "Baptism", "Parts of the Mass"];

/* ──────────────────────────────────────────────────────────── */

const ICONS: Record<IconKey, ReactNode> = {
  saints: (<><path d="M8 5.2a6 6 0 0 1 8 0" /><circle cx="12" cy="9.2" r="2.8" /><path d="M6.5 20.5c.4-3.6 2.6-6 5.5-6s5.1 2.4 5.5 6" /></>),
  bible: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /><path d="M11 7.5v5M9 9.5h4" /></>),
  mass: (<><circle cx="12" cy="4.2" r="1.7" /><path d="M7 7.5h10c0 4-2.2 6.5-5 6.5s-5-2.5-5-6.5Z" /><path d="M12 14v4" /><path d="M8.5 20.5c.6-1.6 1.9-2.5 3.5-2.5s2.9.9 3.5 2.5Z" /></>),
  sacraments: (<><path d="M12 3.5s5.5 6 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 9.5 12 3.5 12 3.5Z" /><path d="M12 11v5.5M9.8 13.2h4.4" /></>),
  prayers: (<><path d="M12 3v18" /><path d="M7 8.5h10" /></>),
  seasons: (<><path d="M12 3.2c1.4 1.7 2.1 2.8 2.1 4a2.1 2.1 0 0 1-4.2 0c0-1.2.7-2.3 2.1-4Z" /><rect x="9.2" y="10.5" width="5.6" height="7.5" rx="1" /><path d="M5.5 20.5h13" /></>),
  rosary: (
    <>
      <circle cx="17.5" cy="9" r="1.1" /><circle cx="15.9" cy="12.9" r="1.1" /><circle cx="8.1" cy="12.9" r="1.1" />
      <circle cx="6.5" cy="9" r="1.1" /><circle cx="8.1" cy="5.1" r="1.1" /><circle cx="12" cy="3.5" r="1.1" /><circle cx="15.9" cy="5.1" r="1.1" />
      <path d="M12 14.2v7M10.2 17.6h3.6" />
    </>
  ),
  virtues: (<><path d="M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z" /><path d="M12 3v3M10.5 4.5h3" /></>),
};

function Icon({ name, className }: { name: IconKey; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function Caret({ up }: { up?: boolean }) {
  return (
    <svg className={up ? "cpCaret cpCaretUp" : "cpCaret"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCatOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setCatOpen(false);
    setMobileCatOpen(false);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    closeAll();
    router.push(q ? `/worksheets?q=${encodeURIComponent(q)}` : "/worksheets");
  };

  return (
    <header className={scrolled ? "cpHeader cpScrolled" : "cpHeader"}>
      <div className="cpAnnounce">
        <div className="cpAnnounceInner">
          <span className="cpAnnounceDot" aria-hidden="true" />
          <span>Free forever — source-linked Catholic resources for every classroom.</span>
          <Link href="/about" className="cpAnnounceLink">Our commitment →</Link>
        </div>
      </div>

      <div className="cpBar">
        <div className="cpInner">
          <Link href="/" className="cpBrand" onClick={closeAll} aria-label="CatholicProjects home">
            <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
          </Link>

          <nav className="cpNav" aria-label="Primary">
            <div className="cpHasDropdown" ref={catRef}>
              <button type="button" className={catOpen ? "cpNavLink cpNavLinkActive" : "cpNavLink"} aria-haspopup="true" aria-expanded={catOpen} onClick={() => setCatOpen((v) => !v)}>
                Categories <Caret up={catOpen} />
              </button>

              {catOpen && (
                <div className="cpMega" role="menu">
                  <div className="cpMegaFeature">
                    <span className="cpEyebrow cpEyebrowLight">Start here</span>
                    <p className="cpMegaTitle">Every resource, built from the sources.</p>
                    <p className="cpMegaText">Worksheets, coloring pages, and activities — each one linked to the Catholic sources behind it.</p>
                    <Link href="/worksheets" className="cpMegaCta" onClick={closeAll}>Browse all worksheets →</Link>
                  </div>
                  <div className="cpMegaGrid">
                    {CATEGORIES.map((c) => (
                      <Link key={c.slug} href={`/worksheets/${c.slug}`} className="cpMegaItem" role="menuitem" onClick={closeAll}>
                        <span className="cpMegaIcon"><Icon name={c.icon} /></span>
                        <span className="cpMegaItemText">
                          <span className="cpMegaName">{c.name}</span>
                          <span className="cpMegaDesc">{c.description}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/worksheets" className="cpNavLink" onClick={closeAll}>All Worksheets</Link>
            <Link href="/about" className="cpNavLink" onClick={closeAll}>About</Link>
          </nav>

          <div className="cpActions">
            <form onSubmit={submitSearch} className="cpNavSearch" role="search">
              <SearchGlyph className="cpNavSearchIcon" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" className="cpNavSearchInput" />
            </form>
            <Link href="/worksheets" className="cpBtn cpBtnPrimary" onClick={closeAll}>Browse all</Link>
          </div>

          <button className="cpMenuButton" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="cpSheet">
          <form onSubmit={submitSearch} className="cpNavSearch cpSheetSearch" role="search">
            <SearchGlyph className="cpNavSearchIcon" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" className="cpNavSearchInput" />
          </form>

          <button type="button" className="cpSheetRow" aria-expanded={mobileCatOpen} onClick={() => setMobileCatOpen((v) => !v)}>
            Categories <Caret up={mobileCatOpen} />
          </button>
          {mobileCatOpen && (
            <div className="cpSheetCats">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/worksheets/${c.slug}`} className="cpSheetCat" onClick={closeAll}>
                  <span className="cpMegaIcon"><Icon name={c.icon} /></span>
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <Link href="/worksheets" className="cpSheetRow" onClick={closeAll}>All Worksheets</Link>
          <Link href="/about" className="cpSheetRow" onClick={closeAll}>About</Link>
          <Link href="/worksheets" className="cpBtn cpBtnPrimary cpSheetCta" onClick={closeAll}>Browse all worksheets</Link>
        </div>
      )}
    </header>
  );
}

function WorksheetStack() {
  return (
    <div className="cpStack" aria-hidden="true">
      <div className="cpPaper cpPaperBack1">
        <div className="cpPaperBar cpW60" />
        <div className="cpPaperBar cpW40 cpFaint" />
        <div className="cpPaperOutline" />
        <div className="cpPaperLine" /><div className="cpPaperLine" /><div className="cpPaperLine cpW70" />
      </div>
      <div className="cpPaper cpPaperBack2">
        <div className="cpPaperBar cpW50" />
        <div className="cpPaperBar cpW70 cpFaint" />
        <div className="cpPaperGrid"><span /><span /><span /><span /></div>
        <div className="cpPaperLine" /><div className="cpPaperLine cpW60" />
      </div>
      <div className="cpPaper cpPaperFront">
        <div className="cpPaperHead">
          <span className="cpPaperTag">The Rosary · Worksheet</span>
          <span className="cpPaperName">Name ______________</span>
        </div>
        <p className="cpPaperTitle">The Joyful Mysteries</p>
        <div className="cpBeads">
          {[0, 1, 2, 3, 4].map((i) => <span key={i} />)}
        </div>
        <ul className="cpPaperList">
          <li><i /> The Annunciation</li>
          <li><i /> The Visitation</li>
          <li><i /> The Nativity</li>
          <li><i /> The Presentation</li>
          <li><i /> Finding in the Temple</li>
        </ul>
        <div className="cpPaperFoot">
          <span>catholicprojects.org</span>
          <span className="cpPaperSrc">✓ Sources linked</span>
        </div>
      </div>
      <div className="cpFloat cpFloatA">
        <span className="cpFloatDot" /> Free · Print-ready
      </div>
      <div className="cpFloat cpFloatB">
        <Icon name="bible" className="cpFloatIcon" /> Built from the sources
      </div>
    </div>
  );
}

function Hero({ query, setQuery, onSubmit }: { query: string; setQuery: (v: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  const router = useRouter();
  return (
    <section className="cpHero">
      <div className="cpGlow cpGlowA" aria-hidden="true" />
      <div className="cpGlow cpGlowB" aria-hidden="true" />

      <div className="cpHeroInner">
        <div className="cpHeroCopy">
          <span className="cpPill"><span className="cpPillDot" />Free Catholic resources · In beta</span>
          <h1 className="cpTitle">
            Free Catholic worksheets, <em>built from the sources.</em>
          </h1>
          <p className="cpLead">
            Source-linked worksheets, coloring pages, and activities for every part of the faith — free for parents, parishes, catechists, and educators.
          </p>

          <form className="cpHeroSearch" onSubmit={onSubmit} role="search">
            <SearchGlyph className="cpHeroSearchIcon" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a topic, prayer, or season…" aria-label="Search worksheets" className="cpHeroSearchInput" autoComplete="off" />
            <button type="submit" className="cpBtn cpBtnPrimary cpHeroSearchBtn">Search</button>
          </form>

          <div className="cpQuick">
            <span className="cpQuickLabel">Popular:</span>
            {QUICK_SEARCHES.map((q) => (
              <button key={q} type="button" className="cpQuickChip" onClick={() => router.push(`/worksheets?q=${encodeURIComponent(q)}`)}>
                {q}
              </button>
            ))}
          </div>

          <div className="cpTrust">
            <span><b>100%</b> free</span>
            <span className="cpTrustSep" />
            <span><b>Source-linked</b> content</span>
            <span className="cpTrustSep" />
            <span><b>Print-ready</b> for class</span>
          </div>
        </div>

        <WorksheetStack />
      </div>
    </section>
  );
}

function Categories({ query }: { query: string }) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="cpCats" id="categories">
      <div className="cpSectionHead">
        <span className="cpEyebrow">Browse by category</span>
        <h2 className="cpH2">Everything you need for <em>the classroom.</em></h2>
        <p className="cpSectionLead">Choose a category to find worksheets, coloring pages, and activities ready to print.</p>
      </div>

      {results.length === 0 ? (
        <div className="cpEmpty">
          <p className="cpEmptyTitle">Nothing matches “{query}” yet.</p>
          <p>Try another topic, or browse all worksheets.</p>
        </div>
      ) : (
        <div className="cpGrid">
          {results.map((c, i) => (
            <Link key={c.slug} href={`/worksheets/${c.slug}`} className="cpCard">
              <span className="cpCardNum">{String(i + 1).padStart(2, "0")}</span>
              <span className="cpCardIcon"><Icon name={c.icon} /></span>
              <h3 className="cpCardName">{c.name}</h3>
              <p className="cpCardDesc">{c.description}</p>
              <span className="cpCardCta">Explore <i aria-hidden="true">→</i></span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Values() {
  const items = [
    { icon: "bible" as IconKey, title: "Source-linked", text: "Every resource traces back to the Catholic sources used to build it." },
    { icon: "virtues" as IconKey, title: "Free, always", text: "No paywalls and no subscriptions. Built in service, not for sale." },
    { icon: "seasons" as IconKey, title: "Classroom-ready", text: "Designed to print cleanly for parish programs, schools, and home." },
  ];
  return (
    <section className="cpValues">
      <div className="cpValuesInner">
        {items.map((v) => (
          <div key={v.title} className="cpValue">
            <span className="cpValueIcon"><Icon name={v.icon} /></span>
            <h3 className="cpValueTitle">{v.title}</h3>
            <p className="cpValueText">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="cpFooter">
      <div className="cpFooterInner">
        <div className="cpFooterBrand">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} className="cpFooterLogo" />
          <p>Free Catholic resources, built from the sources — for families, parishes, catechists, and educators.</p>
        </div>
        <div className="cpFooterCol">
          <span className="cpFooterHead">Categories</span>
          {CATEGORIES.slice(0, 4).map((c) => <Link key={c.slug} href={`/worksheets/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div className="cpFooterCol">
          <span className="cpFooterHead">&nbsp;</span>
          {CATEGORIES.slice(4).map((c) => <Link key={c.slug} href={`/worksheets/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div className="cpFooterCol">
          <span className="cpFooterHead">Project</span>
          <Link href="/about">About</Link>
          <Link href="/worksheets">All Worksheets</Link>
          <a href="mailto:team@catholicprojects.org">Contact us</a>
        </div>
      </div>
      <div className="cpFooterBase">
        <p>CatholicProjects is an independent supplemental resource and does not claim parish, diocesan, or other ecclesial endorsement unless specifically stated.</p>
        <p>© {new Date().getFullYear()} CatholicProjects.org</p>
      </div>
    </footer>
  );
}

export default function HomeClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const matches = q ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
    if (matches.length === 1) return router.push(`/worksheets/${matches[0].slug}`);
    router.push(q ? `/worksheets?q=${encodeURIComponent(query.trim())}` : "/worksheets");
  };

  return (
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <SiteHeader />
      <main>
        <Hero query={query} setQuery={setQuery} onSubmit={submit} />
        <Categories query={query} />
        <Values />
      </main>
      <SiteFooter />
    </div>
  );
}

const CSS = `
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d6a349;--ink:#2b211a;--sub:#70645a;--ivory:#fffdf9;--cream:#fbf5ea;--line:rgba(111,67,39,.12);--ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  font-family:var(--ui);color:var(--ink);background:var(--ivory);-webkit-font-smoothing:antialiased;}
.cpRoot *{box-sizing:border-box;}
.cpRoot a{color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:8px;}

/* Buttons */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:999px;font-family:var(--ui);font-weight:650;text-decoration:none;white-space:nowrap;cursor:pointer;transition:transform 160ms ease,background 160ms ease,box-shadow 160ms ease;}
.cpBtnPrimary{padding:12px 22px;font-size:14px;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 8px 20px rgba(168,116,37,.22);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 12px 26px rgba(168,116,37,.3);}

/* Header */
.cpHeader{position:fixed;top:0;left:0;right:0;z-index:50;}
.cpAnnounce{background:var(--ink);color:#efe3cf;overflow:hidden;max-height:44px;transition:max-height 260ms ease,opacity 200ms ease;}
.cpScrolled .cpAnnounce{max-height:0;opacity:0;}
.cpAnnounceInner{max-width:1280px;margin:0 auto;padding:10px 24px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;letter-spacing:.01em;}
.cpAnnounceDot{width:6px;height:6px;border-radius:999px;background:var(--gold);box-shadow:0 0 0 4px rgba(200,148,58,.2);}
.cpAnnounceLink{color:var(--gold-hi)!important;font-weight:600;text-decoration:none;}
.cpAnnounceLink:hover{text-decoration:underline;}

.cpBar{background:rgba(255,253,249,.72);border-bottom:1px solid transparent;backdrop-filter:saturate(1.4) blur(20px);-webkit-backdrop-filter:saturate(1.4) blur(20px);transition:background 240ms ease,border-color 240ms ease,box-shadow 240ms ease;}
.cpScrolled .cpBar{background:rgba(255,253,249,.9);border-bottom-color:var(--line);box-shadow:0 10px 30px rgba(74,43,22,.06);}
.cpInner{max-width:1280px;margin:0 auto;padding:14px clamp(20px,4vw,48px);display:flex;align-items:center;gap:36px;transition:padding 240ms ease;}
.cpScrolled .cpInner{padding-top:10px;padding-bottom:10px;}
.cpBrand{display:inline-flex;align-items:center;flex:0 0 auto;}
.cpLogo{height:62px;width:auto;display:block;transition:height 240ms ease;}
.cpScrolled .cpLogo{height:50px;}

.cpNav{display:flex;align-items:center;gap:4px;}
.cpNavLink{position:relative;display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border:none;background:transparent;cursor:pointer;font-family:var(--ui);font-size:15px;font-weight:550;letter-spacing:-.005em;color:#4a3526;text-decoration:none;border-radius:999px;transition:color 160ms ease,background 160ms ease;}
.cpNavLink:hover,.cpNavLinkActive{color:var(--ink);background:rgba(200,148,58,.1);}
.cpCaret{width:15px;height:15px;transition:transform 220ms ease;opacity:.7;}
.cpCaretUp{transform:rotate(180deg);}

.cpHasDropdown{position:relative;}
.cpMega{position:absolute;top:calc(100% + 14px);left:-24px;width:820px;display:grid;grid-template-columns:250px 1fr;border:1px solid var(--line);border-radius:24px;background:#fffdf9;box-shadow:0 40px 90px rgba(46,29,16,.18),0 2px 6px rgba(46,29,16,.05);overflow:hidden;animation:cpIn 200ms cubic-bezier(.2,.8,.2,1);}
@keyframes cpIn{from{opacity:0;transform:translateY(-6px) scale(.99);}to{opacity:1;transform:none;}}
.cpMegaFeature{position:relative;padding:28px 26px;background:radial-gradient(120% 90% at 0% 0%,rgba(200,148,58,.28),transparent 60%),var(--ink);color:#efe3cf;display:flex;flex-direction:column;}
.cpMegaTitle{margin:12px 0 0;font-family:var(--serif);font-size:28px;font-weight:600;line-height:1.08;color:#fff8ec;}
.cpMegaText{margin:12px 0 0;font-size:13.5px;line-height:1.6;color:#cdbfa9;}
.cpMegaCta{margin-top:auto;padding-top:22px;font-size:13.5px;font-weight:650;color:var(--gold-hi)!important;text-decoration:none;}
.cpMegaCta:hover{text-decoration:underline;}
.cpMegaGrid{padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:2px;}
.cpMegaItem{display:flex;gap:13px;align-items:flex-start;padding:13px;border-radius:14px;text-decoration:none;transition:background 150ms ease;}
.cpMegaItem:hover{background:var(--cream);}
.cpMegaIcon{flex:0 0 auto;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(145deg,#fbeed6,#f3e1c2);color:var(--chestnut-deep);box-shadow:inset 0 0 0 1px rgba(200,148,58,.22);}
.cpMegaIcon svg{width:21px;height:21px;}
.cpMegaItemText{display:flex;flex-direction:column;min-width:0;}
.cpMegaName{font-size:14.5px;font-weight:650;color:var(--ink);}
.cpMegaDesc{margin-top:3px;font-size:12.5px;line-height:1.45;color:var(--sub);}

.cpActions{margin-left:auto;display:flex;align-items:center;gap:12px;}
.cpNavSearch{position:relative;display:flex;align-items:center;}
.cpNavSearchIcon{position:absolute;left:15px;width:17px;height:17px;color:rgba(111,67,39,.5);pointer-events:none;}
.cpNavSearchInput{width:230px;padding:11px 16px 11px 42px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.85);color:var(--ink);font-family:var(--ui);font-size:14px;outline:none;transition:border-color 160ms ease,box-shadow 160ms ease,width 220ms ease;}
.cpNavSearchInput::placeholder{color:rgba(111,67,39,.45);}
.cpNavSearchInput:focus{width:270px;border-color:rgba(200,148,58,.55);box-shadow:0 0 0 4px rgba(200,148,58,.13);}

.cpMenuButton{display:none;margin-left:auto;width:46px;height:46px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.8);color:var(--ink);cursor:pointer;}
.cpSheet{display:none;}

/* Hero */
.cpHero{position:relative;overflow:hidden;padding:190px clamp(20px,4vw,48px) 110px;background:linear-gradient(180deg,#fffdf9 0%,#fdf6ea 100%);}
.cpGlow{position:absolute;border-radius:999px;pointer-events:none;filter:blur(10px);}
.cpGlowA{width:820px;height:820px;top:-420px;left:-220px;background:radial-gradient(circle,rgba(200,148,58,.2),transparent 65%);}
.cpGlowB{width:700px;height:700px;bottom:-420px;right:-200px;background:radial-gradient(circle,rgba(138,93,59,.12),transparent 65%);}
.cpHeroInner{position:relative;z-index:2;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.08fr .92fr;gap:64px;align-items:center;}

.cpPill{display:inline-flex;align-items:center;gap:9px;padding:8px 15px;border:1px solid rgba(200,148,58,.3);border-radius:999px;background:rgba(255,255,255,.7);font-size:12.5px;font-weight:600;color:var(--chestnut-deep);letter-spacing:.01em;}
.cpPillDot{width:7px;height:7px;border-radius:999px;background:var(--gold);box-shadow:0 0 0 4px rgba(200,148,58,.18);}
.cpTitle{margin:24px 0 0;font-family:var(--serif);font-weight:600;font-size:clamp(46px,6.2vw,88px);line-height:.98;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;}
.cpTitle em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpLead{max-width:560px;margin:26px 0 0;font-size:clamp(16px,1.35vw,18.5px);line-height:1.7;color:var(--sub);}

.cpHeroSearch{position:relative;max-width:580px;margin-top:34px;display:flex;align-items:center;padding:7px;border:1px solid var(--line);border-radius:999px;background:#fff;box-shadow:0 20px 50px rgba(74,43,22,.09);transition:border-color 160ms ease,box-shadow 160ms ease;}
.cpHeroSearch:focus-within{border-color:rgba(200,148,58,.55);box-shadow:0 20px 50px rgba(74,43,22,.09),0 0 0 4px rgba(200,148,58,.14);}
.cpHeroSearchIcon{position:absolute;left:24px;width:21px;height:21px;color:rgba(111,67,39,.5);pointer-events:none;}
.cpHeroSearchInput{flex:1;min-width:0;padding:12px 12px 12px 50px;border:none;background:transparent;color:var(--ink);font-family:var(--ui);font-size:16px;outline:none;}
.cpHeroSearchInput::placeholder{color:rgba(111,67,39,.45);}
.cpHeroSearchBtn{padding:13px 26px;font-size:15px;}

.cpQuick{margin-top:18px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;}
.cpQuickLabel{font-size:13px;font-weight:600;color:var(--sub);margin-right:2px;}
.cpQuickChip{padding:7px 14px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.65);font-family:var(--ui);font-size:13px;font-weight:550;color:var(--chestnut-deep);cursor:pointer;transition:border-color 150ms ease,background 150ms ease;}
.cpQuickChip:hover{border-color:rgba(200,148,58,.5);background:#fff;}

.cpTrust{margin-top:34px;display:flex;flex-wrap:wrap;align-items:center;gap:14px;font-size:13.5px;color:var(--sub);}
.cpTrust b{color:var(--ink);font-weight:650;}
.cpTrustSep{width:4px;height:4px;border-radius:999px;background:rgba(111,67,39,.3);}

/* Worksheet stack */
.cpStack{position:relative;height:540px;}
.cpPaper{position:absolute;width:340px;height:440px;padding:28px;border-radius:16px;background:#fff;border:1px solid rgba(111,67,39,.1);box-shadow:0 30px 70px rgba(46,29,16,.13),0 2px 4px rgba(46,29,16,.04);}
.cpPaperBack1{top:40px;left:4%;transform:rotate(-8deg);background:#fffaf1;}
.cpPaperBack2{top:18px;right:2%;transform:rotate(6deg);background:#fffcf6;}
.cpPaperFront{top:62px;left:50%;transform:translateX(-50%) rotate(-1.5deg);width:360px;height:462px;display:flex;flex-direction:column;animation:cpFloat 7s ease-in-out infinite;}
@keyframes cpFloat{0%,100%{transform:translateX(-50%) rotate(-1.5deg) translateY(0);}50%{transform:translateX(-50%) rotate(-1.5deg) translateY(-8px);}}
.cpPaperBar{height:12px;border-radius:6px;background:rgba(111,67,39,.16);margin-bottom:12px;}
.cpFaint{background:rgba(111,67,39,.08);}
.cpW40{width:40%;}.cpW50{width:50%;}.cpW60{width:60%;}.cpW70{width:70%;}
.cpPaperOutline{width:130px;height:130px;margin:26px auto;border:2px dashed rgba(138,93,59,.3);border-radius:999px;}
.cpPaperGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0;}
.cpPaperGrid span{height:78px;border:2px dashed rgba(138,93,59,.25);border-radius:10px;}
.cpPaperLine{height:1px;background:rgba(111,67,39,.14);margin:22px 0 0;}
.cpPaperHead{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);}
.cpPaperName{color:rgba(111,67,39,.4);letter-spacing:.02em;text-transform:none;font-weight:500;}
.cpPaperTitle{margin:18px 0 0;font-family:var(--serif);font-size:32px;font-weight:600;line-height:1.05;color:var(--ink);}
.cpBeads{margin:20px 0 6px;display:flex;align-items:center;gap:12px;}
.cpBeads span{width:30px;height:30px;border-radius:999px;border:2px dashed rgba(138,93,59,.4);}
.cpBeads span:first-child{background:rgba(200,148,58,.3);border-style:solid;border-color:var(--gold);}
.cpPaperList{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:11px;}
.cpPaperList li{display:flex;align-items:center;gap:11px;font-size:14px;color:#4a3a2e;border-bottom:1px solid rgba(111,67,39,.1);padding-bottom:9px;}
.cpPaperList i{width:16px;height:16px;border:1.6px solid rgba(138,93,59,.5);border-radius:4px;flex:0 0 auto;}
.cpPaperFoot{margin-top:auto;display:flex;justify-content:space-between;font-size:10.5px;color:rgba(111,67,39,.5);}
.cpPaperSrc{color:var(--chestnut);font-weight:650;}

.cpFloat{position:absolute;z-index:3;display:inline-flex;align-items:center;gap:9px;padding:11px 16px;border-radius:14px;background:rgba(255,255,255,.94);border:1px solid var(--line);box-shadow:0 18px 40px rgba(46,29,16,.14);font-size:13px;font-weight:650;color:var(--ink);backdrop-filter:blur(10px);}
.cpFloatA{bottom:34px;left:0;}
.cpFloatB{top:0;right:4%;}
.cpFloatDot{width:8px;height:8px;border-radius:999px;background:#4d9b5f;box-shadow:0 0 0 4px rgba(77,155,95,.16);}
.cpFloatIcon{width:18px;height:18px;color:var(--chestnut);}

/* Section heads */
.cpEyebrow{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);}
.cpEyebrowLight{color:var(--gold-hi);}
.cpSectionHead{max-width:720px;margin:0 auto 52px;text-align:center;}
.cpH2{margin:14px 0 0;font-family:var(--serif);font-weight:600;font-size:clamp(36px,4.4vw,58px);line-height:1.02;letter-spacing:-.015em;color:var(--ink);}
.cpH2 em{font-style:italic;font-weight:500;color:var(--chestnut);}
.cpSectionLead{margin:16px auto 0;max-width:540px;font-size:16.5px;line-height:1.65;color:var(--sub);}

/* Categories */
.cpCats{padding:110px clamp(20px,4vw,48px) 120px;max-width:1280px;margin:0 auto;}
.cpGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;}
.cpCard{position:relative;display:flex;flex-direction:column;padding:30px 26px 26px;min-height:268px;border:1px solid var(--line);border-radius:24px;background:#fff;text-decoration:none;overflow:hidden;transition:transform 220ms cubic-bezier(.2,.8,.2,1),box-shadow 220ms ease,border-color 220ms ease;}
.cpCard::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,var(--gold),var(--chestnut));transform:scaleX(0);transform-origin:left;transition:transform 320ms ease;}
.cpCard:hover{transform:translateY(-5px);border-color:rgba(200,148,58,.3);box-shadow:0 28px 60px rgba(74,43,22,.11);}
.cpCard:hover::before{transform:scaleX(1);}
.cpCardNum{position:absolute;top:24px;right:26px;font-family:var(--serif);font-size:18px;font-weight:600;color:rgba(111,67,39,.25);}
.cpCardIcon{width:60px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:18px;background:linear-gradient(145deg,#fbeed6,#f1dcb8);color:var(--chestnut-deep);box-shadow:inset 0 0 0 1px rgba(200,148,58,.25),0 8px 18px rgba(168,116,37,.12);transition:transform 220ms ease;}
.cpCard:hover .cpCardIcon{transform:scale(1.06) rotate(-3deg);}
.cpCardIcon svg{width:30px;height:30px;}
.cpCardName{margin:24px 0 0;font-family:var(--serif);font-weight:600;font-size:27px;line-height:1.08;color:var(--ink);}
.cpCardDesc{margin:9px 0 0;font-size:14px;line-height:1.6;color:var(--sub);}
.cpCardCta{margin-top:auto;padding-top:20px;display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:650;color:var(--chestnut);}
.cpCardCta i{font-style:normal;color:var(--gold);transition:transform 200ms ease;}
.cpCard:hover .cpCardCta i{transform:translateX(4px);}
.cpEmpty{padding:60px 20px;text-align:center;color:var(--sub);}
.cpEmptyTitle{margin:0 0 6px;font-family:var(--serif);font-size:28px;font-weight:600;color:var(--chestnut-deep);}

/* Values band */
.cpValues{position:relative;padding:96px clamp(20px,4vw,48px);background:radial-gradient(70% 120% at 15% 0%,rgba(200,148,58,.22),transparent 60%),var(--ink);color:#efe3cf;}
.cpValuesInner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:48px;}
.cpValueIcon{width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(200,148,58,.14);color:var(--gold-hi);box-shadow:inset 0 0 0 1px rgba(214,163,73,.28);}
.cpValueIcon svg{width:26px;height:26px;}
.cpValueTitle{margin:22px 0 0;font-family:var(--serif);font-weight:600;font-size:30px;color:#fff8ec;}
.cpValueText{margin:10px 0 0;font-size:15px;line-height:1.7;color:#cdbfa9;max-width:320px;}

/* Footer */
.cpFooter{background:#1f1812;color:#b9ab96;padding:72px clamp(20px,4vw,48px) 36px;}
.cpFooterInner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px;}
.cpFooterLogo{height:58px;width:auto;display:block;filter:brightness(1.35) saturate(.9);}
.cpFooterBrand p{margin:18px 0 0;max-width:320px;font-size:14px;line-height:1.7;}
.cpFooterCol{display:flex;flex-direction:column;gap:11px;}
.cpFooterHead{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-hi);margin-bottom:4px;}
.cpFooterCol a{font-size:14px;text-decoration:none;color:#d8ccb8!important;}
.cpFooterCol a:hover{color:#fff!important;}
.cpFooterBase{max-width:1180px;margin:52px auto 0;padding-top:24px;border-top:1px solid rgba(239,227,207,.1);display:flex;justify-content:space-between;gap:24px;font-size:12.5px;line-height:1.6;color:#8d8070;}
.cpFooterBase p{margin:0;}
.cpFooterBase p:first-child{max-width:680px;}

/* Responsive */
@media (max-width:1180px){
  .cpNavSearch:not(.cpSheetSearch){display:none;}
  .cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
  .cpMega{width:720px;grid-template-columns:220px 1fr;}
}
@media (max-width:1024px){
  .cpNav,.cpActions{display:none;}
  .cpMenuButton{display:inline-flex;}
  .cpLogo{height:52px;}
  .cpScrolled .cpLogo{height:44px;}
  .cpSheet{display:flex;flex-direction:column;gap:4px;height:calc(100svh - 80px);overflow-y:auto;padding:20px clamp(20px,4vw,48px) 32px;background:var(--ivory);border-top:1px solid var(--line);animation:cpIn 200ms ease;}
  .cpSheetSearch{margin-bottom:12px;}
  .cpSheetSearch .cpNavSearchInput,.cpSheetSearch .cpNavSearchInput:focus{width:100%;padding-top:14px;padding-bottom:14px;font-size:16px;}
  .cpSheetRow{display:flex;align-items:center;justify-content:space-between;width:100%;padding:16px 4px;border:none;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;font-family:var(--serif);font-size:26px;font-weight:600;color:var(--ink);text-align:left;text-decoration:none;}
  .cpSheetCats{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:12px 0;}
  .cpSheetCat{display:flex;align-items:center;gap:10px;padding:10px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--ink);text-decoration:none;}
  .cpSheetCat .cpMegaIcon{width:34px;height:34px;}
  .cpSheetCta{margin-top:20px;padding:16px;font-size:16px;}
  .cpHeroInner{grid-template-columns:1fr;gap:40px;text-align:center;}
  .cpHeroCopy{display:flex;flex-direction:column;align-items:center;}
  .cpLead{margin-left:auto;margin-right:auto;}
  .cpHeroSearch{width:100%;}
  .cpQuick,.cpTrust{justify-content:center;}
  .cpStack{height:500px;max-width:560px;width:100%;margin:0 auto;}
  .cpValuesInner{grid-template-columns:1fr;gap:40px;max-width:520px;text-align:center;}
  .cpValueIcon{margin:0 auto;}
  .cpValueText{margin-left:auto;margin-right:auto;}
  .cpFooterInner{grid-template-columns:1fr 1fr;}
  .cpFooterBrand{grid-column:1 / -1;}
}
@media (max-width:760px){
  .cpAnnounceLink{display:none;}
  .cpAnnounceInner{font-size:12px;}
  .cpHero{padding-top:160px;padding-bottom:70px;}
  .cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
  .cpCard{min-height:0;padding:24px 20px 20px;}
  .cpCardName{font-size:23px;}
  .cpStack{height:420px;transform:scale(.8);transform-origin:top center;margin-bottom:-80px;}
  .cpFooterBase{flex-direction:column;}
}
@media (max-width:520px){
  .cpLogo{height:44px;}
  .cpGrid{grid-template-columns:1fr;}
  .cpHeroSearchBtn{padding:12px 18px;}
  .cpTrust{gap:10px;font-size:12.5px;}
  .cpStack{transform:scale(.66);height:360px;margin-bottom:-120px;}
  .cpFloatB{display:none;}
  .cpSheetCats{grid-template-columns:1fr;}
  .cpFooterInner{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){
  .cpRoot *{animation:none!important;transition:none!important;}
}
`;
