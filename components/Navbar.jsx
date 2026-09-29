"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, BookOpen, Palette, Scissors, Info } from "lucide-react";

const cormorant = 'var(--font-cormorant), "Cormorant Garamond", Cormorant, serif';

function NavItem({ href, label, active, onClick, icon }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`font-medium text-base lg:text-lg px-3 lg:px-4 py-2 flex items-center whitespace-nowrap transition-colors duration-200 rounded-lg
        ${
          active
            ? "text-[#3d2410] bg-[#3d2410]/10"
            : "text-[#3d2410]/70 hover:text-[#3d2410] hover:bg-[#3d2410]/5"
        }`}
    >
      {icon && <span className="inline-block mr-2 align-middle">{icon}</span>}
      {label}
    </Link>
  );
}

const LINKS = [
  { href: "/saints", label: "Saints", page: "Saints", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/coloring-pages", label: "Coloring Pages", page: "Coloring Pages", icon: <Palette className="w-5 h-5" /> },
  { href: "/activities", label: "Activities", page: "Activities", icon: <Scissors className="w-5 h-5" /> },
  { href: "/about", label: "About", page: "About", icon: <Info className="w-5 h-5" /> },
];

export default function Navbar({ currentPage }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setMobileMenuOpen(false);
    router.push(q ? `/saints?q=${encodeURIComponent(q)}` : "/saints");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className="fixed w-full top-0 left-0 z-40 bg-[#f5ede0]/95 border-b border-[#3d2410]/15 backdrop-blur-xl"
      style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-3 sm:py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="CatholicProjects home" onClick={closeMenu}>
          <span
            className="text-2xl sm:text-3xl tracking-tight text-[#3d2410] select-none leading-none"
            style={{ fontFamily: cormorant, fontWeight: 700 }}
          >
            CatholicProjects
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-nowrap">
          {LINKS.map((l) => (
            <NavItem key={l.href} href={l.href} label={l.label} icon={l.icon} active={currentPage === l.page} onClick={closeMenu} />
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex items-center relative shrink-0">
          <Search className="w-5 h-5 absolute left-3 text-[#3d2410]/50 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saints"
            aria-label="Search saints"
            className="w-44 lg:w-60 pl-10 pr-4 py-2 rounded-full bg-white/70 border border-[#3d2410]/20 text-[#3d2410] placeholder-[#3d2410]/50 focus:outline-none focus:ring-2 focus:ring-[#3d2410]/40 transition"
          />
        </form>

        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#3d2410] hover:bg-[#3d2410]/10 transition"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#f5ede0] border-t border-[#3d2410]/15 shadow-lg">
          <div className="flex flex-col gap-1 py-4 px-5 max-w-7xl mx-auto">
            <form onSubmit={submitSearch} className="flex items-center relative mb-2">
              <Search className="w-5 h-5 absolute left-3 text-[#3d2410]/50 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saints"
                aria-label="Search saints"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-[#3d2410]/20 text-[#3d2410] placeholder-[#3d2410]/50 focus:outline-none focus:ring-2 focus:ring-[#3d2410]/40"
              />
            </form>
            {LINKS.map((l) => (
              <NavItem key={l.href} href={l.href} label={l.label} icon={l.icon} active={currentPage === l.page} onClick={closeMenu} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
