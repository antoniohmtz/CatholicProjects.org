"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

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
  { slug: "virtues", name: "Virtues & the Moral Life", description: "Faith, hope, charity, and the commandments", icon: "virtues" },
];

/* ──────────────────────────────────────────────────────────── */

const ICONS: Record<IconKey, ReactNode> = {
  saints: (<><circle cx="12" cy="8" r="3" /><path d="M6.5 20a5.5 5.5 0 0 1 11 0" /><path d="M8.5 5.4a5 5 0 0 1 7 0" /></>),
  bible: (<><path d="M12 6c-1.6-1.2-3.6-2-6-2v13c2.4 0 4.4.8 6 2" /><path d="M12 6c1.6-1.2 3.6-2 6-2v13c-2.4 0-4.4.8-6 2" /><path d="M12 6v13" /></>),
  mass: (<><path d="M8 4h8" /><path d="M8.5 4c0 4 1.5 6.5 3.5 6.5S15.5 8 15.5 4" /><path d="M12 10.5V16" /><path d="M8.5 20h7" /><path d="M10.2 16h3.6l-.5 4h-2.6z" /></>),
  sacraments: (<><path d="M12 5c4 0 7 3 7 7H5c0-4 3-7 7-7Z" /><path d="M9 12 10.3 5.6M12 12V5M15 12l-1.3-6.4" /></>),
  prayers: (<><path d="M12 3.2v17.6" /><path d="M6.4 9h11.2" /></>),
  seasons: (<><path d="M12 3.5c1.3 1.6 2 2.7 2 3.9a2 2 0 0 1-4 0c0-1.2.7-2.3 2-3.9Z" /><rect x="9" y="10.6" width="6" height="9.4" rx="1.2" /></>),
  rosary: (<><circle cx="12" cy="9.8" r="5.4" /><path d="M12 15.4v3.2" /><path d="M10.5 17.2h3" /></>),
  virtues: (<><path d="M12 3.5c.8 3 3.5 4 3.5 7.6a3.5 3.5 0 0 1-7 0c0-1.7.8-2.9 1.9-3.9.4 1 .9 1.5 1.7 1.7-.2-2 .1-3.6-.1-5.4Z" /></>),
};

function Icon({ name, className }: { name: IconKey; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

function SiteNav({ currentPage }: { currentPage?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const linkClass = (page: string) => (currentPage === page ? "cpNavLink cpNavLinkActive" : "cpNavLink");

  return (
    <header className={scrolled ? "cpHeader cpScrolled" : "cpHeader"}>
      <div className="cpInner">
        <Link href="/" className="cpBrand" onClick={closeAll} aria-label="CatholicProjects home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={340} height={98} priority className="cpLogo" />
        </Link>

        <nav className="cpNav" aria-label="Primary">
          <div className="cpHasDropdown" ref={catRef}>
            <button type="button" className={catOpen ? "cpNavLink cpNavLinkActive" : "cpNavLink"} aria-haspopup="true" aria-expanded={catOpen} onClick={() => setCatOpen((v) => !v)}>
              Categories
              <svg className={catOpen ? "cpCaret cpCaretUp" : "cpCaret"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {catOpen && (
              <div className="cpDropdown" role="menu">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/worksheets/${c.slug}`} className="cpDropItem" role="menuitem" onClick={closeAll}>
                    <span className="cpDropIconWrap"><Icon name={c.icon} className="cpDropIcon" /></span>
                    <span className="cpDropText">
                      <span className="cpDropName">{c.name}</span>
                      <span className="cpDropDesc">{c.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/worksheets" className={linkClass("Worksheets")} onClick={closeAll}>All Worksheets</Link>
          <Link href="/about" className={linkClass("About")} onClick={closeAll}>About</Link>
        </nav>

        <div className="cpActions">
          <form onSubmit={submitSearch} className="cpSearchForm" role="search">
            <SearchGlyph className="cpSearchIcon" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" className="cpSearchInput" />
          </form>
          <Link href="/worksheets" className="cpCta" onClick={closeAll}>Browse all</Link>
        </div>

        <button className="cpMenuButton" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="cpMobileOpen">
          <div className="cpMobileInner">
            <form onSubmit={submitSearch} className="cpSearchForm cpMobileSearch" role="search">
              <SearchGlyph className="cpSearchIcon" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets" aria-label="Search worksheets" className="cpSearchInput" />
            </form>

            <button type="button" className="cpMobileAccordion" aria-expanded={mobileCatOpen} onClick={() => setMobileCatOpen((v) => !v)}>
              Categories
              <svg className={mobileCatOpen ? "cpCaret cpCaretUp" : "cpCaret"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>

            {mobileCatOpen && (
              <div className="cpMobileCats">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/worksheets/${c.slug}`} className="cpMobileCatLink" onClick={closeAll}>
                    <Icon name={c.icon} className="cpMobileCatIcon" />{c.name}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/worksheets" className="cpMobileLink" onClick={closeAll}>All Worksheets</Link>
            <Link href="/about" className="cpMobileLink" onClick={closeAll}>About</Link>
            <Link href="/worksheets" className="cpMobileCta" onClick={closeAll}>Browse all</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Landing() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (results.length === 1) return router.push(`/worksheets/${results[0].slug}`);
    router.push(q ? `/worksheets?q=${encodeURIComponent(q)}` : "/worksheets");
  };

  return (
    <section className="cpSection">
      <div className="cpGlow" aria-hidden="true" />

      <div className="cpHero">
        <h1 className="cpTitle">Free Catholic worksheets, <span>built from the sources.</span></h1>
        <p className="cpLead">
          Source-linked worksheets, coloring pages, and activities for every part of the faith — free for parents, parishes, catechists, and educators. Pick a category to begin.
        </p>

        <form className="cpHeroSearch" onSubmit={submit} role="search">
          <SearchGlyph className="cpHeroSearchIcon" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets by category or topic" aria-label="Search worksheets" className="cpHeroSearchInput" autoComplete="off" />
        </form>
      </div>

      <div className="cpResults">
        {results.length === 0 ? (
          <div className="cpEmpty">
            <p className="cpEmptyTitle">Nothing matches that yet.</p>
            <p>Try another topic, or clear your search.</p>
          </div>
        ) : (
          <div className="cpGrid">
            {results.map((c) => (
              <button key={c.slug} type="button" className="cpCard" onClick={() => router.push(`/worksheets/${c.slug}`)}>
                <span className="cpCardIconWrap"><Icon name={c.icon} className="cpCardIcon" /></span>
                <h2 className="cpCardName">{c.name}</h2>
                <p className="cpCardDesc">{c.description}</p>
                <span className="cpCardCta">Browse worksheets <i aria-hidden="true">→</i></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <div className="cpRoot">
      <style>{CSS}</style>
      <SiteNav currentPage="Home" />
      <main><Landing /></main>
    </div>
  );
}

const CSS = `
.cpRoot{--chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--ink:#2b211a;--sub:#70645a;--ivory:#fffdf9;--white:#ffffff;}

.cpHeader{position:fixed;top:0;left:0;z-index:40;width:100%;background:rgba(255,253,249,.55);border-bottom:1px solid transparent;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);transition:background 220ms ease,border-color 220ms ease,box-shadow 220ms ease;}
.cpScrolled{background:rgba(255,253,249,.86);border-bottom-color:rgba(111,67,39,.11);box-shadow:0 6px 26px rgba(74,43,22,.05);}
.cpInner{width:min(100%,1220px);margin:0 auto;padding:12px clamp(18px,4vw,48px);display:flex;align-items:center;gap:24px;}
.cpBrand{display:inline-flex;align-items:center;flex:0 0 auto;text-decoration:none;}
.cpLogo{height:34px;width:auto;object-fit:contain;display:block;}

.cpNav{display:flex;align-items:center;gap:2px;}
.cpNavLink{position:relative;display:inline-flex;align-items:center;gap:5px;padding:9px 15px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;color:var(--chestnut-deep);text-decoration:none;transition:color 160ms ease;}
.cpNavLink:hover{color:var(--ink);}
.cpNavLink::after{content:"";position:absolute;left:15px;right:15px;bottom:3px;height:2px;border-radius:2px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform 200ms ease;}
.cpNavLink:hover::after,.cpNavLinkActive::after{transform:scaleX(1);}
.cpNavLinkActive{color:var(--ink);}
.cpCaret{width:14px;height:14px;transition:transform 200ms ease;}
.cpCaretUp{transform:rotate(180deg);}

.cpHasDropdown{position:relative;}
.cpDropdown{position:absolute;top:calc(100% + 8px);left:0;width:600px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:2px;border:1px solid rgba(111,67,39,.12);border-radius:20px;background:rgba(255,253,249,.97);box-shadow:0 28px 70px rgba(74,43,22,.14);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);animation:cpDropIn 170ms ease;}
@keyframes cpDropIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.cpDropItem{display:flex;align-items:flex-start;gap:13px;padding:13px;border-radius:14px;text-decoration:none;transition:background 150ms ease;}
.cpDropItem:hover{background:rgba(200,148,58,.10);}
.cpDropIconWrap{flex:0 0 auto;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:11px;background:rgba(200,148,58,.13);color:var(--chestnut);}
.cpDropIcon{width:21px;height:21px;}
.cpDropText{display:flex;flex-direction:column;min-width:0;}
.cpDropName{font-size:14.5px;font-weight:700;color:var(--ink);line-height:1.2;}
.cpDropDesc{margin-top:3px;font-size:12px;line-height:1.42;color:var(--sub);}

.cpActions{margin-left:auto;display:flex;align-items:center;gap:12px;}
.cpSearchForm{position:relative;display:flex;align-items:center;}
.cpSearchIcon{position:absolute;left:14px;width:17px;height:17px;color:rgba(111,67,39,.5);pointer-events:none;}
.cpSearchInput{width:200px;padding:9px 16px 9px 39px;border:1px solid rgba(111,67,39,.18);border-radius:999px;background:rgba(255,255,255,.72);color:var(--ink);font-family:inherit;font-size:14px;outline:none;transition:border-color 150ms ease,box-shadow 150ms ease,width 200ms ease;}
.cpSearchInput::placeholder{color:rgba(111,67,39,.45);}
.cpSearchInput:focus{width:240px;border-color:rgba(200,148,58,.55);box-shadow:0 0 0 3px rgba(200,148,58,.14);}

.cpCta{display:inline-flex;align-items:center;padding:10px 20px;border-radius:999px;background:var(--gold);color:#3e2a1a;font-family:inherit;font-size:13.5px;font-weight:750;text-decoration:none;white-space:nowrap;box-shadow:0 6px 18px rgba(168,116,37,.16);transition:transform 150ms ease,background 150ms ease,box-shadow 150ms ease;}
.cpCta:hover{transform:translateY(-1px);background:#d09d42;box-shadow:0 8px 22px rgba(168,116,37,.22);}

.cpMenuButton{display:none;align-items:center;justify-content:center;margin-left:auto;width:42px;height:42px;border:none;border-radius:12px;background:transparent;color:var(--chestnut-deep);cursor:pointer;}
.cpMenuButton:hover{background:rgba(200,148,58,.10);}
.cpMobileOpen{display:none;}

.cpSection{position:relative;width:100%;min-height:100svh;overflow:hidden;background:linear-gradient(180deg,#fffdf9 0%,#fffaf2 48%,#fffdf9 100%);color:var(--ink);}
.cpGlow{position:absolute;top:-430px;left:50%;width:680px;height:680px;transform:translateX(-50%);border-radius:999px;pointer-events:none;filter:blur(4px);background:radial-gradient(circle,rgba(200,148,58,.15) 0%,rgba(200,148,58,.055) 42%,transparent 72%);}
.cpHero{position:relative;z-index:2;width:min(100%,920px);margin:0 auto;padding:132px clamp(18px,4vw,40px) 30px;text-align:center;}
.cpTitle{margin:0;font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:clamp(38px,6vw,66px);line-height:1.04;letter-spacing:-.04em;text-wrap:balance;color:var(--ink);}
.cpTitle span{color:var(--chestnut);}
.cpLead{max-width:660px;margin:22px auto 0;font-size:clamp(16px,1.6vw,18px);line-height:1.7;text-wrap:pretty;color:var(--sub);}
.cpHeroSearch{position:relative;max-width:640px;margin:34px auto 0;display:flex;align-items:center;}
.cpHeroSearchIcon{position:absolute;left:20px;width:22px;height:22px;color:rgba(111,67,39,.5);pointer-events:none;}
.cpHeroSearchInput{width:100%;padding:17px 22px 17px 52px;border:1px solid rgba(111,67,39,.18);border-radius:999px;background:var(--white);color:var(--ink);font-size:17px;outline:none;box-shadow:0 10px 30px rgba(74,43,22,.06);transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpHeroSearchInput::placeholder{color:rgba(111,67,39,.45);}
.cpHeroSearchInput:focus{border-color:rgba(200,148,58,.55);box-shadow:0 10px 30px rgba(74,43,22,.06),0 0 0 3px rgba(200,148,58,.16);}

.cpResults{position:relative;z-index:2;width:min(100%,1160px);margin:0 auto;padding:10px clamp(18px,4vw,40px) 96px;}
.cpGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
.cpCard{position:relative;display:flex;flex-direction:column;align-items:flex-start;padding:26px 24px 22px;border:1px solid rgba(111,67,39,.12);border-radius:22px;background:rgba(255,255,255,.78);box-shadow:0 14px 40px rgba(74,43,22,.05);text-align:left;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease,border-color 160ms ease;}
.cpCard:hover{transform:translateY(-3px);border-color:rgba(200,148,58,.34);box-shadow:0 20px 54px rgba(74,43,22,.09);}
.cpCardIconWrap{width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:15px;background:rgba(200,148,58,.12);color:var(--chestnut);transition:background 160ms ease;}
.cpCard:hover .cpCardIconWrap{background:rgba(200,148,58,.2);}
.cpCardIcon{width:27px;height:27px;}
.cpCardName{margin:18px 0 0;font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:23px;line-height:1.15;letter-spacing:-.02em;color:var(--ink);}
.cpCardDesc{margin:8px 0 0;font-size:13.5px;line-height:1.55;color:var(--sub);}
.cpCardCta{margin-top:18px;display:inline-flex;align-items:center;gap:6px;color:var(--chestnut);font-size:13px;font-weight:750;}
.cpCardCta i{color:var(--gold);font-style:normal;transition:transform 160ms ease;}
.cpCard:hover .cpCardCta i{transform:translateX(3px);}
.cpEmpty{padding:72px 20px;text-align:center;color:var(--sub);}
.cpEmptyTitle{margin:0 0 6px;font-family:Georgia,"Times New Roman",serif;font-size:22px;color:var(--chestnut-deep);}

@media (max-width:1080px){.cpGrid{grid-template-columns:repeat(3,minmax(0,1fr));}}
@media (max-width:960px){
  .cpNav,.cpActions{display:none;}
  .cpMenuButton{display:inline-flex;}
  .cpLogo{height:30px;}
  .cpMobileOpen{display:block;border-top:1px solid rgba(111,67,39,.10);background:var(--ivory);max-height:calc(100vh - 64px);overflow-y:auto;}
  .cpMobileInner{width:100%;padding:14px clamp(18px,4vw,48px) 22px;display:flex;flex-direction:column;gap:4px;}
  .cpMobileSearch{width:100%;margin-bottom:10px;}
  .cpMobileSearch .cpSearchInput,.cpMobileSearch .cpSearchInput:focus{width:100%;}
  .cpMobileAccordion,.cpMobileLink{display:flex;align-items:center;justify-content:space-between;width:100%;padding:13px 6px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:16px;font-weight:650;text-align:left;text-decoration:none;color:var(--chestnut-deep);}
  .cpMobileCats{display:flex;flex-direction:column;gap:2px;margin:2px 0 8px;padding-left:6px;}
  .cpMobileCatLink{display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:12px;color:var(--ink);font-size:15px;font-weight:550;text-decoration:none;}
  .cpMobileCatLink:hover{background:rgba(200,148,58,.10);}
  .cpMobileCatIcon{width:20px;height:20px;flex:0 0 auto;color:var(--chestnut);}
  .cpMobileCta{margin-top:12px;display:inline-flex;align-items:center;justify-content:center;padding:14px 20px;border-radius:999px;background:var(--gold);color:#3e2a1a;font-family:inherit;font-size:15px;font-weight:750;text-decoration:none;box-shadow:0 6px 18px rgba(168,116,37,.16);}
}
@media (max-width:820px){.cpGrid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (max-width:640px){.cpHero{padding-top:112px;}.cpGrid{grid-template-columns:1fr;gap:14px;}}
`;
