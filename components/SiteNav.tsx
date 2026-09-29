"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/* -----------------------------------------------------------
   SiteNav — universal CatholicProjects navigation

   Drop <SiteNav /> at the top of any page. It is self-contained
   (own styles, own tokens) and works two ways:

   1. Anywhere: every item is a real link (/#topics, /#ask ...),
      so it navigates to the library home from any other page.
   2. On the library page itself: pass onHome / onSearch / onJump
      and the same items become in-page smooth-scrolls instead.

   To add or rename a link, edit NAV_ITEMS below. Nothing else
   needs to change.
------------------------------------------------------------ */

const LOGO_SRC = "/brand/catholicprojects-logo.png";
const MARKETING_URL = "https://catholicprojects.org";

/** id = the section id on the library home page (used for /#id and scroll-spy) */
export const NAV_ITEMS = [
  { id: "topics", label: "Topics" },
  { id: "finder", label: "Grades" },
  { id: "how", label: "How it works" },
] as const;

const CTA = { id: "ask", label: "Request a worksheet" };

type SiteNavProps = {
  /** Called when the logo is clicked. If omitted, the logo links to "/". */
  onHome?: () => void;
  /** Called by the Search button. If omitted, it links to "/#finder". */
  onSearch?: () => void;
  /** Called with a section id. If omitted, items link to "/#id". */
  onJump?: (id: string) => void;
};

const Icon = ({ children, className }: { children: ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const I = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  close: (<path d="M18 6 6 18M6 6l12 12" />),
  menu: (<path d="M4 8h16M4 16h16" />),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
};

export default function SiteNav({ onHome, onSearch, onJump }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section in view (only where those sections exist) */
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const seen: Record<string, number> = {};
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
        const best = ids.filter((i) => seen[i] > 0).sort((x, y) => seen[y] - seen[x])[0];
        setCurrent(best ?? null);
      },
      { rootMargin: "-110px 0px -35% 0px", threshold: [0, 0.15, 0.4, 0.75] }
    );
    ids.forEach((i) => { const el = document.getElementById(i); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const close = () => setOpen(false);

  /* One item, rendered as a button (in-page) or a link (cross-page) */
  const Item = ({ id, className, children }: { id: string; className: string; children: ReactNode }) =>
    onJump ? (
      <button className={className} onClick={() => { close(); onJump(id); }}>{children}</button>
    ) : (
      <Link className={className} href={`/#${id}`} onClick={close}>{children}</Link>
    );

  const logo = (
    <Image src={LOGO_SRC} alt="CatholicProjects.org" width={900} height={260} priority className="cpn-logo" />
  );

  return (
    <header className={scrolled ? "cpn cpn-on" : "cpn"}>
      <style>{CSS}</style>

      <div className="cpn-bar">
        {onHome ? (
          <button className="cpn-brand" onClick={() => { close(); onHome(); }} aria-label="CatholicProjects library home">{logo}</button>
        ) : (
          <Link className="cpn-brand" href="/" onClick={close} aria-label="CatholicProjects library home">{logo}</Link>
        )}

        <nav className="cpn-nav" aria-label="Primary">
          {NAV_ITEMS.map((n) => (
            <Item key={n.id} id={n.id} className={current === n.id ? "cpn-link cpn-linkOn" : "cpn-link"}>{n.label}</Item>
          ))}
          <a className="cpn-link" href={MARKETING_URL}>About us</a>
        </nav>

        <div className="cpn-actions">
          {onSearch ? (
            <button className="cpn-search" onClick={() => { close(); onSearch(); }} aria-label="Search topics">
              <Icon className="cpn-searchIcon">{I.search}</Icon><span>Search</span><kbd>/</kbd>
            </button>
          ) : (
            <Link className="cpn-search" href="/#finder" aria-label="Search topics">
              <Icon className="cpn-searchIcon">{I.search}</Icon><span>Search</span><kbd>/</kbd>
            </Link>
          )}

          <Item id={CTA.id} className="cpn-cta"><Icon>{I.mail}</Icon>{CTA.label}</Item>

          <button className="cpn-burger" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <Icon>{open ? I.close : I.menu}</Icon>
          </button>
        </div>

        {open && (
          <div className="cpn-sheet">
            {onSearch ? (
              <button className="cpn-sheetRow" onClick={() => { close(); onSearch(); }}><Icon>{I.search}</Icon>Search topics</button>
            ) : (
              <Link className="cpn-sheetRow" href="/#finder" onClick={close}><Icon>{I.search}</Icon>Search topics</Link>
            )}
            {NAV_ITEMS.map((n) => (
              <Item key={n.id} id={n.id} className="cpn-sheetRow">{n.label}</Item>
            ))}
            <a className="cpn-sheetRow" href={MARKETING_URL}>About us</a>
            <Item id={CTA.id} className="cpn-sheetCta">{CTA.label}</Item>
          </div>
        )}
      </div>
    </header>
  );
}

/* -----------------------------------------------------------
   Styles — all scoped to .cpn
------------------------------------------------------------ */

const CSS = `
.cpn{
  --n-gold:#C8943A;--n-gold-dark:#A87425;--n-espresso:#4A2B16;--n-cream:#FAF7F0;
  position:sticky;top:0;z-index:50;padding:12px 16px 0;pointer-events:none;
  font-family:var(--cp-ui),Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
}
.cpn,.cpn *,.cpn *::before,.cpn *::after{box-sizing:border-box;}
.cpn :where(button){font-family:inherit;color:inherit;}
.cpn :where(a){color:inherit;}
.cpn a:focus-visible,.cpn button:focus-visible{outline:2px solid var(--n-gold-dark);outline-offset:3px;}

.cpn-bar{pointer-events:auto;position:relative;max-width:1240px;height:88px;margin:0 auto;padding:0 14px 0 26px;display:flex;align-items:center;gap:20px;border:1px solid rgba(74,43,22,.09);border-radius:26px;background:rgba(255,253,249,.84);-webkit-backdrop-filter:saturate(1.4) blur(18px);backdrop-filter:saturate(1.4) blur(18px);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 10px 30px -18px rgba(74,43,22,.28);transition:box-shadow 200ms ease,background 200ms ease;}
.cpn-bar::after{content:"";position:absolute;left:34px;right:34px;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.55),transparent);opacity:.7;pointer-events:none;}
.cpn-on .cpn-bar{background:rgba(255,253,249,.95);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 18px 40px -20px rgba(74,43,22,.4);}

.cpn-brand{display:flex;align-items:center;flex:0 0 auto;padding:0;border:0;background:none;cursor:pointer;text-decoration:none;}
.cpn-logo{height:68px;width:auto;display:block;}

.cpn-nav{margin-left:10px;padding:4px;display:flex;align-items:center;gap:2px;border-radius:999px;background:rgba(74,43,22,.04);}
.cpn-link{position:relative;display:inline-flex;align-items:center;height:40px;padding:0 16px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:14.5px;font-weight:700;color:#6B5847;text-decoration:none;white-space:nowrap;transition:background 150ms ease,color 150ms ease,box-shadow 150ms ease;}
.cpn-link:hover{color:var(--n-espresso);background:rgba(255,255,255,.7);}
.cpn-link.cpn-linkOn{color:var(--n-espresso);background:#fff;box-shadow:0 0 0 1px rgba(200,148,58,.28),0 6px 14px -8px rgba(74,43,22,.45);}
.cpn-link.cpn-linkOn::after{content:"";position:absolute;left:50%;bottom:5px;width:14px;height:2px;margin-left:-7px;border-radius:2px;background:var(--n-gold);}

.cpn-actions{margin-left:auto;display:flex;align-items:center;gap:10px;}
.cpn-search{height:46px;padding:0 10px 0 14px;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(74,43,22,.12);border-radius:14px;background:#fff;cursor:pointer;font-size:14px;font-weight:650;color:#7A6857;text-decoration:none;transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpn-search:hover{border-color:rgba(200,148,58,.45);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cpn-searchIcon{width:17px;height:17px;color:var(--n-gold-dark);}
.cpn-search kbd{min-width:22px;height:22px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(74,43,22,.14);border-radius:6px;background:var(--n-cream);font:inherit;font-size:12px;font-weight:700;color:#8A7867;}
.cpn-cta{height:46px;padding:0 18px 0 15px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(168,116,37,.22);border-radius:14px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 20px -8px rgba(168,116,37,.5);color:#2E1E10;cursor:pointer;font-size:14.5px;font-weight:800;white-space:nowrap;text-decoration:none;transition:transform 160ms ease,box-shadow 160ms ease,filter 160ms ease;}
.cpn-cta:hover{transform:translateY(-1px);filter:brightness(1.03);box-shadow:0 12px 24px -8px rgba(168,116,37,.55);}
.cpn-cta svg{width:17px;height:17px;}
.cpn-burger{display:none;width:46px;height:46px;align-items:center;justify-content:center;border:1px solid rgba(74,43,22,.12);border-radius:14px;background:#fff;cursor:pointer;}
.cpn-burger svg{width:22px;height:22px;}

.cpn-sheet{display:none;}

@media (max-width:1180px){
  .cpn-logo{height:60px;}
  .cpn-link{padding:0 13px;}
  .cpn-search span,.cpn-search kbd{display:none;}
  .cpn-search{padding:0 14px;}
}
@media (max-width:980px){
  .cpn{padding:8px 10px 0;}
  .cpn-bar{height:76px;padding:0 10px 0 16px;border-radius:20px;}
  .cpn-logo{height:54px;}
  .cpn-nav,.cpn-search,.cpn-cta{display:none;}
  .cpn-burger{display:inline-flex;}
  .cpn-sheet{position:absolute;top:calc(100% + 8px);left:0;right:0;display:flex;flex-direction:column;gap:2px;padding:10px;border:1px solid rgba(74,43,22,.09);border-radius:20px;background:rgba(255,253,249,.98);box-shadow:0 30px 60px -24px rgba(74,43,22,.45);}
  .cpn-sheetRow{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border:0;border-radius:12px;background:none;cursor:pointer;text-align:left;font-size:16px;font-weight:700;color:var(--n-espresso);text-decoration:none;}
  .cpn-sheetRow svg{width:18px;height:18px;color:var(--n-gold-dark);}
  .cpn-sheetRow:hover{background:rgba(200,148,58,.1);}
  .cpn-sheetCta{margin-top:6px;height:50px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(168,116,37,.22);border-radius:13px;background:linear-gradient(135deg,#D7A94F,#B88029);color:#2E1E10;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;}
}
@media (max-width:520px){
  .cpn-bar{height:68px;}
  .cpn-logo{height:46px;}
}
@media (prefers-reduced-motion:reduce){
  .cpn-cta,.cpn-link,.cpn-search,.cpn-bar{transition:none;}
}
`;
