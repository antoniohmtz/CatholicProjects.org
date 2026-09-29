"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "./categories";
import CategoryIcon from "./CategoryIcon";
import styles from "./Navbar.module.css";

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Navbar({ currentPage }: { currentPage?: string }) {
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    closeAll();
    router.push(q ? `/worksheets?q=${encodeURIComponent(q)}` : "/worksheets");
  };

  const closeAll = () => {
    setMenuOpen(false);
    setCatOpen(false);
    setMobileCatOpen(false);
  };

  const navLinkClass = (page: string) =>
    currentPage === page ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={scrolled ? `${styles.header} ${styles.scrolled}` : styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={closeAll} aria-label="CatholicProjects home">
          <Image
            src="/brand/catholicprojects-logo.png"
            alt="CatholicProjects.org"
            width={340}
            height={98}
            priority
            className={styles.logo}
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.hasDropdown} ref={catRef}>
            <button
              type="button"
              className={catOpen ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              aria-haspopup="true"
              aria-expanded={catOpen}
              onClick={() => setCatOpen((v) => !v)}
            >
              Categories
              <svg className={catOpen ? `${styles.caret} ${styles.caretUp}` : styles.caret} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {catOpen && (
              <div className={styles.dropdown} role="menu">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/worksheets/${c.slug}`} className={styles.dropItem} role="menuitem" onClick={closeAll}>
                    <span className={styles.dropIconWrap}>
                      <CategoryIcon name={c.icon} className={styles.dropIcon} />
                    </span>
                    <span className={styles.dropText}>
                      <span className={styles.dropName}>{c.name}</span>
                      <span className={styles.dropDesc}>{c.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/worksheets" className={navLinkClass("Worksheets")} onClick={closeAll}>
            All Worksheets
          </Link>
          <Link href="/about" className={navLinkClass("About")} onClick={closeAll}>
            About
          </Link>
        </nav>

        <div className={styles.actions}>
          <form onSubmit={submitSearch} className={`${styles.searchForm} ${styles.desktopSearch}`} role="search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search worksheets"
              aria-label="Search worksheets"
              className={styles.searchInput}
            />
          </form>

          <Link href="/worksheets" className={styles.cta} onClick={closeAll}>
            Browse all
          </Link>
        </div>

        <button className={styles.menuButton} onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileOpen}>
          <div className={styles.mobileInner}>
            <form onSubmit={submitSearch} className={`${styles.searchForm} ${styles.mobileSearch}`} role="search">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search worksheets"
                aria-label="Search worksheets"
                className={styles.searchInput}
              />
            </form>

            <button type="button" className={styles.mobileAccordion} aria-expanded={mobileCatOpen} onClick={() => setMobileCatOpen((v) => !v)}>
              Categories
              <svg className={mobileCatOpen ? `${styles.caret} ${styles.caretUp}` : styles.caret} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {mobileCatOpen && (
              <div className={styles.mobileCats}>
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/worksheets/${c.slug}`} className={styles.mobileCatLink} onClick={closeAll}>
                    <CategoryIcon name={c.icon} className={styles.mobileCatIcon} />
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/worksheets" className={styles.mobileLink} onClick={closeAll}>
              All Worksheets
            </Link>
            <Link href="/about" className={styles.mobileLink} onClick={closeAll}>
              About
            </Link>

            <Link href="/worksheets" className={styles.mobileCta} onClick={closeAll}>
              Browse all
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
