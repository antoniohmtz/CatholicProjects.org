"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/saints", label: "Saints", page: "Saints" },
  { href: "/coloring-pages", label: "Coloring Pages", page: "Coloring Pages" },
  { href: "/activities", label: "Activities", page: "Activities" },
  { href: "/about", label: "About", page: "About" },
];

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
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
    router.push(q ? `/saints?q=${encodeURIComponent(q)}` : "/saints");
  };

  const close = () => setMenuOpen(false);

  const linkClass = (page: string) =>
    currentPage === page ? `${styles.link} ${styles.linkActive}` : styles.link;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={close} aria-label="CatholicProjects home">
          CatholicProjects<span className={styles.brandDot}>.org</span>
        </Link>

        <nav className={styles.nav}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} aria-current={currentPage === l.page ? "page" : undefined} className={linkClass(l.page)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className={`${styles.searchForm} ${styles.desktopSearch}`} role="search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saints"
            aria-label="Search saints"
            className={styles.searchInput}
          />
        </form>

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
                placeholder="Search saints"
                aria-label="Search saints"
                className={styles.searchInput}
              />
            </form>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} aria-current={currentPage === l.page ? "page" : undefined} className={linkClass(l.page)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
