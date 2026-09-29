"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });

/* -----------------------------------------------------------
   CatholicProjects — Activity Library (app.catholicprojects.org)

   Same design system as the landing page: espresso / gold /
   ivory, Georgia headlines, tinted art cards with an accent
   color per topic.
------------------------------------------------------------ */

const T = {
  gold: "#C8943A",
  goldDark: "#A87425",
  goldSoft: "#E8C77E",
  espresso: "#4A2B16",
  ink: "#211A14",
  sub: "#5E5349",
  ivory: "#FFFDF9",
  cream: "#FAF7F0",
  line: "rgba(74,43,22,.11)",
  goldLine: "rgba(200,148,58,.22)",
};

const CONTACT = "team@catholicprojects.org";
const MARKETING_URL = "https://catholicprojects.org";

/* ── Grade bands ───────────────────────────────────────────── */

const BANDS = [
  { key: "prek", label: "Pre-K – K", short: "Pre-K–K", from: "Pre-K", to: "K" },
  { key: "early", label: "Grades 1–2", short: "1–2", from: "Grade 1", to: "Grade 2" },
  { key: "middle", label: "Grades 3–5", short: "3–5", from: "Grade 3", to: "Grade 5" },
  { key: "upper", label: "Grades 6–8", short: "6–8", from: "Grade 6", to: "Grade 8" },
] as const;

type BandKey = (typeof BANDS)[number]["key"];
type Format = "coloring" | "craft" | "worksheet" | "activity";

const FORMAT_LABEL: Record<Format, string> = { coloring: "Coloring pages", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };
const FORMAT_SHORT: Record<Format, string> = { coloring: "Coloring", craft: "Crafts", worksheet: "Worksheets", activity: "Activities" };

/* ── Edit your categories here ─────────────────────────────── */

type Kind = "saints" | "bible" | "mass" | "sacraments" | "prayers" | "seasons" | "rosary" | "virtues";

type Category = {
  slug: string;
  name: string;
  kind: Kind;
  description: string;
  accent: string;
  tint: string;
  bands: BandKey[];
  formats: Format[];
  topics: string[];
  verse: string;
  reference: string;
};

const CATEGORIES: Category[] = [
  {
    slug: "saints", name: "Saint Stories", kind: "saints", accent: "#C8943A", tint: "#FBF1DC",
    description: "Four-panel coloring stories and stand-up saints that bring the heroes of the faith to life.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Four-panel stories", "Stand-up saints", "Feast day pages", "Patron saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", kind: "bible", accent: "#8A5A33", tint: "#F4EADF",
    description: "Scripture stories children can color, put in order, and retell, from Creation to the Resurrection.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "worksheet", "activity"],
    topics: ["Creation", "Noah’s Ark", "Parables of Jesus", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", kind: "mass", accent: "#A87425", tint: "#F7EEDC",
    description: "Help children understand what happens at Mass, and why every part of it matters.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Parts of the Mass", "Sacred vessels", "Liturgical colors", "Mass responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", kind: "sacraments", accent: "#4F8FB8", tint: "#E7F2F9",
    description: "Preparation pages for First Reconciliation, First Communion, and Confirmation.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "craft"],
    topics: ["Baptism", "First Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", kind: "prayers", accent: "#7B5EA7", tint: "#F1ECF8",
    description: "Tracing pages and line-by-line guides for learning the prayers of the Church by heart.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "activity", "worksheet"],
    topics: ["Sign of the Cross", "Our Father", "Hail Mary", "Guardian Angel Prayer"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", kind: "seasons", accent: "#5E8A55", tint: "#EAF2E5",
    description: "Advent wreaths, Lenten calendars, and Easter crafts for every season of the Church year.",
    bands: ["prek", "early", "middle", "upper"], formats: ["craft", "coloring", "activity"],
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", kind: "rosary", accent: "#D9785F", tint: "#FCECE6",
    description: "Bead-by-bead coloring and mystery pages that teach children how to pray the Rosary.",
    bands: ["early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Kindness", kind: "virtues", accent: "#C8453A", tint: "#FBEAE7",
    description: "Everyday lessons in kindness, honesty, and mercy, rooted in the Commandments.",
    bands: ["prek", "early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Ten Commandments", "Fruits of the Spirit", "Works of mercy", "Loving our neighbor"],
    verse: "And now there remain faith, hope, and charity, these three.", reference: "1 Corinthians 13:13",
  },
];

/* ── Icons ─────────────────────────────────────────────────── */

const FORMAT_ICON: Record<Format, ReactNode> = {
  coloring: (<><path d="M4 20c2.5 0 4-1.3 4-3.5a2.5 2.5 0 0 0-5 0" /><path d="m8.5 14.5 10-10a1.8 1.8 0 0 1 2.5 2.5l-10 10" /></>),
  craft: (<><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8.2 20 18M8 15.8 20 6" /></>),
  worksheet: (<><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6M9 15.5h6" /></>),
  activity: (<><path d="M5 4h6v2.5a1.5 1.5 0 1 0 3 0V4h5v6h-2.5a1.5 1.5 0 1 0 0 3H19v7h-6v-2.5a1.5 1.5 0 1 0-3 0V20H5v-6h2.5a1.5 1.5 0 1 0 0-3H5Z" /></>),
};

const UI: Record<string, ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>),
  close: (<><path d="M18 6 6 18M6 6l12 12" /></>),
  menu: (<><path d="M4 8h16M4 16h16" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  arrowDown: (<><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>),
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  print: (<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="1.5" /><path d="M7 14h10v6H7z" /></>),
  book: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /></>),
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
  sparkle: (<><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" /></>),
};

function Svg({ children, className, sw = 1.8 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

const bySlug = (slug: string | null) => CATEGORIES.find((c) => c.slug === slug);
const bandByKey = (k: string | null) => BANDS.find((b) => b.key === k);

function gradeRange(c: Category) {
  const first = BANDS.find((b) => c.bands.includes(b.key));
  const last = [...BANDS].reverse().find((b) => c.bands.includes(b.key));
  if (!first || !last) return "";
  const end = last.to === "K" ? "K" : last.to.replace("Grade ", "");
  if (first.key === "prek") return end === "K" ? "Pre-K – K" : `Pre-K – ${end}`;
  return `Grades ${first.from.replace("Grade ", "")}–${end}`;
}

const jump = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ── Church-year badges (computed after mount) ─────────────── */

const DAY = 24 * 60 * 60 * 1000;
const COMING_UP_DAYS = 70;

function easterSunday(year: number) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function seasonsBadge(now: Date): string | undefined {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let result: string | undefined;
  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]) {
    const christmas = new Date(year, 11, 25);
    const advent = addDays(christmas, -(christmas.getDay() || 7) - 21);
    const easter = easterSunday(year);
    const windows = [
      { start: advent, end: new Date(year, 11, 24) },
      { start: christmas, end: new Date(year + 1, 0, 13) },
      { start: addDays(easter, -46), end: addDays(easter, -1) },
      { start: easter, end: addDays(easter, 49) },
    ];
    for (const w of windows) {
      if (today >= w.start && today <= w.end) return "In season";
      const away = (w.start.getTime() - today.getTime()) / DAY;
      if (away > 0 && away <= COMING_UP_DAYS) result = "Coming up";
    }
  }
  return result;
}

function rosaryBadge(now: Date): string | undefined {
  if (now.getMonth() === 9) return "In season";
  if (now.getMonth() === 8 && now.getDate() >= 15) return "Coming up";
  return undefined;
}

function useBadges() {
  const [badges, setBadges] = useState<Record<string, string>>({});
  useEffect(() => {
    const now = new Date();
    const next: Record<string, string> = {};
    const s = seasonsBadge(now);
    const r = rosaryBadge(now);
    if (s) next["liturgical-seasons"] = s;
    if (r) next["the-rosary"] = r;
    setBadges(next);
  }, []);
  return badges;
}

/* ── Topic art (96 × 96, same style as the landing page) ───── */

function starPath(cx: number, cy: number, outer: number, inner: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  });
  return `M ${pts.join(" L ")} Z`;
}

function TopicArt({ kind, accent }: { kind: Kind; accent: string }) {
  const ink = "#3B2A1C";
  const skin = "#F1D3AE";
  const hair = "#4A3423";
  const gold = "#E9B54D";

  const hostRays = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i;
    return { x1: 48 + Math.cos(a) * 15, y1: 24 + Math.sin(a) * 15, x2: 48 + Math.cos(a) * 19, y2: 24 + Math.sin(a) * 19 };
  });

  const beads = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { cx: 48 + Math.cos(a) * 28, cy: 40 + Math.sin(a) * 25, big: i % 3 === 0 };
  });

  const art: Record<Kind, ReactNode> = {
    saints: (
      <>
        <circle cx="48" cy="26" r="17" fill="#FFF3D9" />
        <circle cx="48" cy="26" r="19" fill="none" stroke={gold} strokeWidth="3.5" />
        <path d="M 30 88 Q 32 60 48 54 Q 64 60 66 88 Z" fill={accent} />
        <path d="M 56 60 Q 63 66 66 88 L 57 88 Q 57 70 52 61 Z" fill="#000" opacity=".12" />
        <path d="M 44 88 Q 45 68 48 62 Q 51 68 52 88 Z" fill="#FFF" opacity=".5" />
        <circle cx="48" cy="34" r="13" fill={skin} />
        <path d="M 36 42 Q 33 20 48 20 Q 63 20 60 42 Q 57 40 57 33 L 57 30 Q 53 32 48 32 Q 43 32 39 30 L 39 33 Q 39 40 36 42 Z" fill={hair} />
        <circle cx="43.5" cy="36" r="1.7" fill={ink} />
        <circle cx="52.5" cy="36" r="1.7" fill={ink} />
        <circle cx="40.5" cy="40.5" r="2.4" fill="#E58C74" opacity=".35" />
        <circle cx="55.5" cy="40.5" r="2.4" fill="#E58C74" opacity=".35" />
        <path d="M 45 41 Q 48 44.5 51 41" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    bible: (
      <>
        <rect x="45.8" y="8" width="4.4" height="14" rx="1.5" fill="#C8943A" />
        <rect x="41" y="12" width="14" height="4.4" rx="1.5" fill="#C8943A" />
        <path d="M 48 34 Q 30 26 12 30 L 12 76 Q 30 72 48 80 Q 66 72 84 76 L 84 30 Q 66 26 48 34 Z" fill={accent} />
        <path d="M 48 36 Q 33 29 17 32 L 17 71 Q 33 68 48 74 Z" fill="#FDF8EE" />
        <path d="M 48 36 Q 63 29 79 32 L 79 71 Q 63 68 48 74 Z" fill="#FFFDF6" />
        <path d="M 46.6 36 Q 48 36.8 49.4 36 L 49.4 74 Q 48 73.4 46.6 74 Z" fill="#E2D2B8" />
        <g stroke="#D8C7AE" strokeWidth="2.4" strokeLinecap="round">
          <line x1="24" y1="42" x2="41" y2="40" /><line x1="24" y1="50" x2="41" y2="48" /><line x1="24" y1="58" x2="41" y2="56" />
          <line x1="55" y1="40" x2="72" y2="42" /><line x1="55" y1="48" x2="72" y2="50" /><line x1="55" y1="56" x2="72" y2="58" />
        </g>
        <path d="M 46 74.5 L 46 87 L 50 83 L 54 87 L 54 74 Q 50 76 46 74.5 Z" fill="#C8453A" />
      </>
    ),
    mass: (
      <>
        {hostRays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={gold} strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx="48" cy="24" r="12" fill="#FFF9EC" stroke="#E4D2A8" strokeWidth="2.5" />
        <line x1="48" y1="18" x2="48" y2="30" stroke="#C8943A" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="42" y1="24" x2="54" y2="24" stroke="#C8943A" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 29 42 L 67 42 Q 65 59 48 61 Q 31 59 29 42 Z" fill={accent} />
        <path d="M 56 42 L 67 42 Q 65 56 51 60 Q 55 52 56 42 Z" fill="#000" opacity=".14" />
        <rect x="29" y="40" width="38" height="4.5" rx="2.2" fill="#E8C77E" />
        <rect x="45" y="61" width="6" height="9" fill={accent} />
        <circle cx="48" cy="72.5" r="4.2" fill={accent} />
        <circle cx="46.8" cy="71.3" r="1.5" fill="#E8C77E" />
        <rect x="45" y="75.5" width="6" height="5" fill={accent} />
        <path d="M 33 86 Q 48 77 63 86 Z" fill={accent} />
        <ellipse cx="48" cy="86" rx="15" ry="3.2" fill={accent} />
        <ellipse cx="48" cy="85.2" rx="15" ry="2.4" fill="#E8C77E" opacity=".45" />
      </>
    ),
    sacraments: (
      <>
        <path d="M 48 10 C 48 10 74 42 74 62 A 26 26 0 0 1 22 62 C 22 42 48 10 48 10 Z" fill={accent} />
        <path d="M 48 10 C 48 10 74 42 74 62 A 26 26 0 0 1 60 84 C 68 70 66 44 48 10 Z" fill="#000" opacity=".12" />
        <ellipse cx="36" cy="58" rx="4.5" ry="9" fill="#FFF" opacity=".35" transform="rotate(14 36 58)" />
        <line x1="48" y1="50" x2="48" y2="74" stroke="#F4D488" strokeWidth="4" strokeLinecap="round" />
        <line x1="38" y1="60" x2="58" y2="60" stroke="#F4D488" strokeWidth="4" strokeLinecap="round" />
        <path d={starPath(80, 20, 5, 2.1)} fill={gold} />
        <path d={starPath(16, 30, 3.4, 1.4)} fill={gold} />
      </>
    ),
    prayers: (
      <>
        <circle cx="48" cy="34" r="26" fill="#FFF3D9" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (Math.PI / 5) * i;
          return <line key={i} x1={48 + Math.cos(a) * 28} y1={34 + Math.sin(a) * 28} x2={48 + Math.cos(a) * 33} y2={34 + Math.sin(a) * 33} stroke={gold} strokeWidth="2.2" strokeLinecap="round" />;
        })}
        <rect x="44" y="14" width="8" height="40" rx="2.5" fill={accent} />
        <rect x="32" y="26" width="32" height="8" rx="2.5" fill={accent} />
        <path d="M 14 66 Q 31 60 48 68 Q 65 60 82 66 L 82 88 Q 65 82 48 90 Q 31 82 14 88 Z" fill={accent} />
        <path d="M 19 68 Q 33 64 46 70 L 46 85 Q 33 80 19 84 Z" fill="#FDF8EE" />
        <path d="M 50 70 Q 63 64 77 68 L 77 84 Q 63 80 50 85 Z" fill="#FFFDF6" />
        <g stroke="#D8C7AE" strokeWidth="2" strokeLinecap="round">
          <line x1="24" y1="74" x2="41" y2="75" /><line x1="24" y1="79" x2="41" y2="80" />
          <line x1="55" y1="75" x2="72" y2="74" /><line x1="55" y1="80" x2="72" y2="79" />
        </g>
      </>
    ),
    seasons: (
      <>
        <path d="M 20 64 Q 26 54 48 52 Q 70 54 76 64" fill="none" stroke="#4E7A47" strokeWidth="9" strokeLinecap="round" />
        {[
          { x: 30, h: 24, c: "#7B5EA7", lit: true },
          { x: 42, h: 28, c: "#7B5EA7", lit: false },
          { x: 54, h: 26, c: "#D989A8", lit: false },
          { x: 66, h: 22, c: "#7B5EA7", lit: false },
        ].map((cd) => (
          <g key={cd.x}>
            <line x1={cd.x} y1={64 - cd.h - 1} x2={cd.x} y2={64 - cd.h - 4} stroke="#8B7A6B" strokeWidth="1.6" strokeLinecap="round" />
            <rect x={cd.x - 3.5} y={64 - cd.h} width="7" height={cd.h} rx="2" fill={cd.c} />
            <rect x={cd.x - 3.5} y={64 - cd.h} width="2.6" height={cd.h} rx="1.3" fill="#FFF" opacity=".28" />
            {cd.lit && (
              <>
                <circle cx={cd.x} cy={64 - cd.h - 8} r="7.5" fill="#F2B544" opacity=".25" />
                <path d={`M ${cd.x} ${64 - cd.h - 13} Q ${cd.x + 3.8} ${64 - cd.h - 7.5} ${cd.x} ${64 - cd.h - 3.5} Q ${cd.x - 3.8} ${64 - cd.h - 7.5} ${cd.x} ${64 - cd.h - 13} Z`} fill="#F2B544" />
              </>
            )}
          </g>
        ))}
        <path d="M 18 64 Q 25 76 48 78 Q 71 76 78 64" fill="none" stroke={accent} strokeWidth="11" strokeLinecap="round" />
        <path d="M 24 69 Q 32 75 44 76.5" fill="none" stroke="#6FA163" strokeWidth="5" strokeLinecap="round" />
        <circle cx="33" cy="73.5" r="2.2" fill="#C8453A" />
        <circle cx="59" cy="74.5" r="2.2" fill="#C8453A" />
        <circle cx="74.5" cy="66" r="2" fill="#C8453A" />
      </>
    ),
    rosary: (
      <>
        {beads.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.big ? 5.6 : 4.2} fill={b.big ? gold : accent} stroke="#FFF" strokeWidth="1.2" />
        ))}
        <circle cx="48" cy="72" r="4.2" fill={accent} stroke="#FFF" strokeWidth="1.2" />
        <circle cx="48" cy="80" r="4.2" fill={accent} stroke="#FFF" strokeWidth="1.2" />
        <rect x="45.2" y="84" width="5.6" height="11" rx="1.8" fill="#8A5A33" />
        <rect x="41" y="87.5" width="14" height="5" rx="1.8" fill="#8A5A33" />
        <path d={starPath(48, 40, 6, 2.6)} fill="#FFF" opacity=".9" />
      </>
    ),
    virtues: (
      <>
        <path d="M 48 84 C 14 62 14 30 34 26 C 42 24.5 48 33 48 33 C 48 33 54 24.5 62 26 C 82 30 82 62 48 84 Z" fill={accent} />
        <path d="M 48 84 C 82 62 82 30 62 26 C 70 40 66 66 48 84 Z" fill="#000" opacity=".12" />
        <ellipse cx="32" cy="38" rx="5" ry="8" fill="#FFF" opacity=".32" transform="rotate(28 32 38)" />
        <line x1="48" y1="46" x2="48" y2="66" stroke="#F4D488" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="39" y1="55" x2="57" y2="55" stroke="#F4D488" strokeWidth="3.6" strokeLinecap="round" />
        <path d={starPath(80, 16, 5.2, 2.2)} fill={gold} />
        <path d={starPath(14, 78, 3.6, 1.5)} fill={gold} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      {art[kind]}
    </svg>
  );
}

/* ── Header ────────────────────────────────────────────────── */

const NAV = [
  { id: "topics", label: "Topics" },
  { id: "finder", label: "Grades" },
  { id: "how", label: "How it works" },
] as const;

function Header({ onHome, onSearch, onJump }: { onHome: () => void; onSearch: () => void; onJump: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["finder", "topics", "how"];
    const seen: Record<string, number> = {};
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
        const best = ids.filter((i) => seen[i] > 0).sort((x, y) => seen[y] - seen[x])[0];
        setCurrent(best ?? null);
      },
      { rootMargin: "-90px 0px -35% 0px", threshold: [0, 0.15, 0.4, 0.75] }
    );
    ids.forEach((i) => { const el = document.getElementById(i); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <header className={scrolled ? "cp-head cp-headOn" : "cp-head"}>
      <div className="cp-bar">
        <button className="cp-brand" onClick={go(onHome)} aria-label="CatholicProjects library home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cp-logo" />
        </button>

        <nav className="cp-nav" aria-label="Primary">
          {NAV.map((n) => (
            <button key={n.id} className={current === n.id ? "cp-link cp-linkOn" : "cp-link"} aria-current={current === n.id ? "location" : undefined} onClick={go(() => onJump(n.id))}>
              {n.label}
            </button>
          ))}
          <a className="cp-link" href={MARKETING_URL}>About us</a>
        </nav>

        <div className="cp-actions">
          <button className="cp-searchPill" onClick={go(onSearch)} aria-label="Search topics">
            <Svg className="cp-searchPillIcon">{UI.search}</Svg>
            <span>Search</span>
            <kbd>/</kbd>
          </button>
          <button className="cp-navCta" onClick={go(() => onJump("ask"))}>
            <Svg sw={2}>{UI.mail}</Svg>
            Request a worksheet
          </button>
          <button className="cp-burger" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <Svg>{open ? UI.close : UI.menu}</Svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="cp-sheet">
          <button className="cp-sheetRow" onClick={go(onSearch)}><Svg>{UI.search}</Svg>Search topics</button>
          {NAV.map((n) => (
            <button key={n.id} className="cp-sheetRow" onClick={go(() => onJump(n.id))}>{n.label}</button>
          ))}
          <a className="cp-sheetRow" href={MARKETING_URL}>About us</a>
          <button className="cp-sheetCta" onClick={go(() => onJump("ask"))}>Request a worksheet</button>
        </div>
      )}
    </header>
  );
}

/* ── Category card (same anatomy as the landing topic card) ── */

function CategoryCard({ c, badge, onOpen, compact = false }: { c: Category; badge?: string; onOpen: (slug: string) => void; compact?: boolean }) {
  const style = { "--tp-accent": c.accent, "--tp-tint": c.tint } as CSSProperties;
  const formats = c.formats.map((f) => FORMAT_SHORT[f]).join(" · ");

  return (
    <button className={compact ? "tp-card tp-cardCompact" : "tp-card"} style={style} onClick={() => onOpen(c.slug)} aria-label={`Open ${c.name}`}>
      <span className="tp-art">
        <TopicArt kind={c.kind} accent={c.accent} />
      </span>

      <span className="tp-badge">{badge ?? "Arriving soon"}</span>
      <span className="tp-grade">{gradeRange(c)}</span>

      <span className="tp-body">
        <span className="tp-name">{c.name}</span>
        <span className="tp-desc">{c.description}</span>

        {!compact && (
          <span className="tp-topics" aria-label={`What’s inside ${c.name}`}>
            {c.topics.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
          </span>
        )}

        <span className="tp-foot">
          <span className="tp-formats">{formats}</span>
          <span className="tp-link">
            Explore
            <Svg sw={2.2}>{UI.arrow}</Svg>
          </span>
        </span>
      </span>
    </button>
  );
}

/* ── Library home ──────────────────────────────────────────── */

function LibraryHome({ query, onQuery, band, onBand, onOpen }: {
  query: string; onQuery: (q: string) => void;
  band: BandKey | null; onBand: (b: BandKey | null) => void; onOpen: (slug: string) => void;
}) {
  const badges = useBadges();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.filter((c) => {
      if (band && !c.bands.includes(band)) return false;
      if (!q) return true;
      return [c.name, c.description, ...c.topics].join(" ").toLowerCase().includes(q);
    });
  }, [query, band]);

  const activeBand = bandByKey(band);
  const filtered = !!query || !!band;

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="cp-shell">
        <div className="cp-copy">
          <span className="cp-eyebrow"><span className="cp-eyebrowSymbol" aria-hidden="true">✦</span> Free Catholic Activity Library</span>
          <h1 className="cp-title">
            Everything you need for<span className="cp-titleGold"> your next class.</span>
          </h1>
          <p className="cp-sub">
            Print-ready <strong>coloring pages, crafts, worksheets, and activities</strong> for catechists, teachers, and parents — organized by topic and grade so lesson planning feels simple.
          </p>

          <div className="cp-actions2">
            <button className="cp-cta" onClick={() => jump("topics")}>
              Browse topics
              <Svg sw={2.2}>{UI.arrowDown}</Svg>
            </button>
            <button className="cp-secondary" onClick={() => jump("how")}>
              <span className="cp-secondaryIcon"><Svg sw={1.9}>{UI.arrowDown}</Svg></span>
              See how it works
            </button>
          </div>

          <ul className="cp-trust">
            <li><Svg sw={2.2}>{UI.check}</Svg>Free to access</li>
            <li><Svg sw={2.2}>{UI.check}</Svg>Ready to print</li>
            <li><Svg sw={2.2}>{UI.check}</Svg>Faithful Catholic content</li>
          </ul>
        </div>

        <div className="cp-preview">
          <div className="cp-previewGlow" aria-hidden="true" />
          <div className="cp-finder" id="finder">
            <span className="cp-finderEyebrow">Resource finder</span>
            <h2 className="cp-finderTitle">What are you teaching?</h2>
            <p className="cp-finderSub">Search the library, then narrow it to the grade you need.</p>

            <label className="cp-search">
              <Svg className="cp-searchIcon">{UI.search}</Svg>
              <input id="cp-search" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Try “Advent,” “Hail Mary,” or “Communion”" aria-label="Search topics" autoComplete="off" />
              <span className="cp-searchKey" aria-hidden="true">/</span>
            </label>

            <div className="cp-gradeRow" role="group" aria-label="Grade level">
              <span className="cp-gradeLabel">Choose a grade</span>
              <div className="cp-pills">
                <button className={!band ? "cp-pill cp-pillOn" : "cp-pill"} aria-pressed={!band} onClick={() => onBand(null)}>All</button>
                {BANDS.map((b) => (
                  <button key={b.key} className={band === b.key ? "cp-pill cp-pillOn" : "cp-pill"} aria-pressed={band === b.key} onClick={() => onBand(band === b.key ? null : b.key)}>
                    {b.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOPICS ===== */}
      <section className="tp" id="topics" aria-labelledby="tp-title">
        <div className="tp-head">
          <div>
            <div className="tp-eyebrow">Browse by topic</div>
            <h2 id="tp-title" className="tp-titleH">
              {query ? <>Results for “{query}”</> : activeBand ? <>Resources for {activeBand.label}</> : <>Something for every lesson and season</>}
            </h2>
            <p className="tp-sub">
              {filtered
                ? `${results.length} ${results.length === 1 ? "collection matches" : "collections match"} your filters.`
                : "Saints, sacraments, and the liturgical year — organized the way catechists plan."}
            </p>
          </div>
          {filtered && (
            <button className="tp-all" onClick={() => { onBand(null); onQuery(""); }}>
              Clear filters
              <Svg sw={2.2}>{UI.close}</Svg>
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="cp-empty">
            <span className="cp-emptyMark" aria-hidden="true">✠</span>
            <p className="cp-emptyTitle">We don’t have that yet.</p>
            <p className="cp-emptyText">Tell us what you’re teaching and we’ll make it a priority.</p>
            <a className="cp-cta" href={`mailto:${CONTACT}?subject=${encodeURIComponent("Worksheet idea: " + query)}`}>Request “{query || "a topic"}”</a>
          </div>
        ) : (
          <ul className="tp-grid">
            {results.map((c) => (
              <li key={c.slug}><CategoryCard c={c} badge={badges[c.slug]} onOpen={onOpen} /></li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== FIND · PRINT · TEACH ===== */}
      <div id="how" className="cp-pillars" role="list">
        <Pillar n="01" icon={UI.search} title="Find" text="Search by the topic, Bible story, Saint, feast day, sacrament, or prayer you're teaching." />
        <Pillar n="02" icon={UI.print} title="Print" text="Download a ready-to-use printable — no prep or design work needed." />
        <Pillar n="03" icon={UI.sparkle} title="Teach" text="Bring it straight into your parish program, classroom, or home." />
      </div>

      <div className="cp-principle">
        <div className="cp-principleMark" aria-hidden="true"><Svg sw={1.8}>{UI.book}</Svg></div>
        <div className="cp-principleCopy">
          <strong>Faithful content. Practical resources.</strong>
          <span>Every resource starts from researched Catholic content, so catechists spend less time building materials from scratch and more time teaching the Faith.</span>
        </div>
      </div>

      <AskBand
        id="ask"
        title="Teaching something we don’t have yet?"
        text="Tell us the lesson, the grade, and the date you need it. Real classroom requests decide what gets made next."
        href={`mailto:${CONTACT}?subject=Worksheet%20idea`}
        cta="Request a worksheet"
      />
    </>
  );
}

function Pillar({ n, icon, title, text }: { n: string; icon: ReactNode; title: string; text: string }) {
  return (
    <div className="pillar" role="listitem">
      <span className="pillarNumber" aria-hidden="true">{n}</span>
      <div className="pillar-icon" aria-hidden="true"><Svg sw={1.9}>{icon}</Svg></div>
      <div className="pillar-title">{title}</div>
      <div className="pillar-text">{text}</div>
    </div>
  );
}

function AskBand({ id, title, text, href, cta }: { id?: string; title: string; text: string; href: string; cta: string }) {
  return (
    <section className="cp-ask" id={id}>
      <span className="cp-askIcon"><Svg sw={1.7}>{UI.mail}</Svg></span>
      <div className="cp-askText">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <a className="cp-cta" href={href}>
        {cta}
        <Svg sw={2.2}>{UI.arrow}</Svg>
      </a>
    </section>
  );
}

/* ── Category page ─────────────────────────────────────────── */

function CategoryPage({ c, onHome, onOpen }: { c: Category; onHome: () => void; onOpen: (slug: string) => void }) {
  const badges = useBadges();
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  const style = { "--tp-accent": c.accent, "--tp-tint": c.tint } as CSSProperties;

  return (
    <div className="cp-page">
      <button className="cp-back" onClick={onHome}>
        <Svg sw={2}>{UI.back}</Svg> All topics
      </button>

      <section className="cp-hero" style={style}>
        <div className="cp-heroArt">
          <TopicArt kind={c.kind} accent={c.accent} />
          <span className="tp-badge">{badges[c.slug] ?? "Arriving soon"}</span>
        </div>

        <div className="cp-heroBody">
          <span className="tp-eyebrow">Topic</span>
          <h1 className="cp-heroTitle">{c.name}</h1>
          <p className="cp-heroDesc">{c.description}</p>

          <div className="cp-specs">
            <div className="cp-spec">
              <span>Grades</span>
              <b>{gradeRange(c)}</b>
            </div>
            <div className="cp-spec">
              <span>You’ll find</span>
              <div className="cp-formats">
                {c.formats.map((f) => (
                  <span key={f} className="cp-format"><Svg className="cp-formatIcon">{FORMAT_ICON[f]}</Svg>{FORMAT_LABEL[f]}</span>
                ))}
              </div>
            </div>
          </div>

          <blockquote className="cp-verse">
            <p>“{c.verse}”</p>
            <cite>{c.reference}</cite>
          </blockquote>
        </div>
      </section>

      <section className="tp cp-sectionTight" style={style}>
        <div className="tp-head">
          <div>
            <div className="tp-eyebrow">Coming to this topic</div>
            <h2 className="tp-titleH">What we’re preparing</h2>
          </div>
        </div>
        <ul className="cp-topicGrid">
          {c.topics.map((t) => (
            <li key={t} className="cp-topicCard">
              <span className="cp-topicName">{t}</span>
              <span className="cp-status"><span className="cp-statusDot" /> In preparation</span>
            </li>
          ))}
        </ul>
      </section>

      <AskBand
        title={`Need ${c.name.toLowerCase()} for your class?`}
        text="Tell us the lesson, the grade, and when you need it. We build what teachers ask for first."
        href={`mailto:${CONTACT}?subject=${encodeURIComponent(`Worksheet idea: ${c.name}`)}`}
        cta="Tell us what you need"
      />

      <section className="tp">
        <div className="tp-head">
          <div>
            <div className="tp-eyebrow">Keep browsing</div>
            <h2 className="tp-titleH">Other topics</h2>
          </div>
        </div>
        <ul className="tp-grid">
          {others.slice(0, 4).map((o) => (
            <li key={o.slug}><CategoryCard c={o} badge={badges[o.slug]} onOpen={onOpen} compact /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ── App ───────────────────────────────────────────────────── */

export default function HomeClient() {
  const [slug, setSlug] = useState<string | null>(null);
  const [band, setBand] = useState<BandKey | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("category");
      const a = bandByKey(p.get("grade"));
      setSlug(bySlug(c) ? c : null);
      setBand(a ? a.key : null);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const push = (s: string | null, b: BandKey | null) => {
    const p = new URLSearchParams();
    if (s) p.set("category", s);
    if (b) p.set("grade", b);
    const qs = p.toString();
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const focusSearch = () => {
    window.setTimeout(() => {
      const el = document.getElementById("cp-search") as HTMLInputElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        if (slug) {
          setSlug(null);
          push(null, band);
        }
        focusSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [slug, band]);

  const openCategory = (s: string) => {
    setSlug(s);
    setQuery("");
    push(s, band);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setSlug(null);
    push(null, band);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseBand = (b: BandKey | null) => {
    setBand(b);
    push(null, b);
  };

  const onJump = (id: string) => {
    if (slug) {
      setSlug(null);
      push(null, band);
      window.setTimeout(() => jump(id), 80);
    } else {
      jump(id);
    }
  };

  const onSearch = () => {
    if (slug) {
      setSlug(null);
      push(null, band);
    }
    focusSearch();
  };

  const active = bySlug(slug);

  return (
    <div className={`cp ${ui.variable}`}>
      <style>{CSS}</style>
      <div className="cp-bg" aria-hidden="true" />

      <Header onHome={goHome} onSearch={onSearch} onJump={onJump} />

      <main className="cp-main">
        {active ? (
          <CategoryPage key={active.slug} c={active} onHome={goHome} onOpen={openCategory} />
        ) : (
          <LibraryHome query={query} onQuery={setQuery} band={band} onBand={chooseBand} onOpen={openCategory} />
        )}
      </main>

      <footer className="cp-foot">
        <div className="cp-footInner">
          <span className="cp-footMark" aria-hidden="true">✠</span>
          <p className="cp-footText">Free Catholic activities, built from the sources, for the children in your care.</p>
          <p className="cp-footFine">
            CatholicProjects is an independent supplemental resource and does not claim parish, diocesan, or other ecclesial endorsement unless specifically stated.
          </p>
          <p className="cp-footFine">
            <a href={MARKETING_URL}>CatholicProjects.org</a> · <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

/* -----------------------------------------------------------
   Styles (all scoped to .cp — same tokens as the landing page)
------------------------------------------------------------ */

const CSS = `
.cp{
  --cp-gold:${T.gold};--cp-gold-dark:${T.goldDark};--cp-gold-soft:${T.goldSoft};
  --cp-espresso:${T.espresso};--cp-ink:${T.ink};--cp-sub:${T.sub};
  --cp-ivory:${T.ivory};--cp-cream:${T.cream};--cp-line:${T.line};--cp-gold-line:${T.goldLine};
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;
  color:var(--cp-ink);background:linear-gradient(180deg,#FFFDF9 0%,#FCF8F0 100%);
  font-family:var(--cp-ui),Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;-webkit-font-smoothing:antialiased;
}
.cp,.cp *,.cp *::before,.cp *::after{box-sizing:border-box;}
.cp :where(button){font-family:inherit;color:inherit;}
.cp :where(a){color:inherit;}
.cp a:focus-visible,.cp button:focus-visible,.cp input:focus-visible{outline:2px solid var(--cp-gold-dark);outline-offset:3px;}
.cp-main{flex:1;}

.cp-bg{position:absolute;inset:0;z-index:-1;pointer-events:none;height:900px;
  background:radial-gradient(720px 430px at 80% 24%,rgba(200,148,58,.14),transparent 67%),radial-gradient(520px 300px at 7% 17%,rgba(200,148,58,.055),transparent 72%);}

/* ================= HEADER ================= */
.cp-head{position:sticky;top:0;z-index:50;padding:12px 16px 0;pointer-events:none;}
.cp-bar{pointer-events:auto;position:relative;max-width:1240px;height:68px;margin:0 auto;padding:0 12px 0 20px;display:flex;align-items:center;gap:18px;border:1px solid rgba(74,43,22,.09);border-radius:22px;background:rgba(255,253,249,.82);-webkit-backdrop-filter:saturate(1.4) blur(18px);backdrop-filter:saturate(1.4) blur(18px);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 10px 30px -18px rgba(74,43,22,.28);transition:box-shadow 200ms ease,background 200ms ease;}
.cp-bar::after{content:"";position:absolute;left:28px;right:28px;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,148,58,.55),transparent);opacity:.7;pointer-events:none;}
.cp-headOn .cp-bar{background:rgba(255,253,249,.94);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 18px 40px -20px rgba(74,43,22,.4);}
.cp-brand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cp-logo{height:50px;width:auto;display:block;}
.cp-nav{margin-left:14px;padding:4px;display:flex;align-items:center;gap:2px;border-radius:999px;background:rgba(74,43,22,.04);}
.cp-link{position:relative;display:inline-flex;align-items:center;height:38px;padding:0 16px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:14.5px;font-weight:700;color:#6B5847;text-decoration:none;white-space:nowrap;transition:background 150ms ease,color 150ms ease,box-shadow 150ms ease;}
.cp-link:hover{color:var(--cp-espresso);background:rgba(255,255,255,.7);}
.cp-link.cp-linkOn{color:var(--cp-espresso);background:#fff;box-shadow:0 0 0 1px rgba(200,148,58,.28),0 6px 14px -8px rgba(74,43,22,.45);}
.cp-link.cp-linkOn::after{content:"";position:absolute;left:50%;bottom:5px;width:14px;height:2px;margin-left:-7px;border-radius:2px;background:var(--cp-gold);}
.cp-actions{margin-left:auto;display:flex;align-items:center;gap:10px;}
.cp-searchPill{height:44px;padding:0 10px 0 14px;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(74,43,22,.12);border-radius:14px;background:#fff;cursor:pointer;font-size:14px;font-weight:650;color:#7A6857;transition:border-color 150ms ease,box-shadow 150ms ease;}
.cp-searchPill:hover{border-color:rgba(200,148,58,.45);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cp-searchPillIcon{width:17px;height:17px;color:var(--cp-gold-dark);}
.cp-searchPill kbd{min-width:22px;height:22px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(74,43,22,.14);border-radius:6px;background:var(--cp-cream);font-size:12px;font-weight:700;color:#8A7867;}
.cp-navCta{height:44px;padding:0 18px 0 15px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(168,116,37,.22);border-radius:14px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 20px -8px rgba(168,116,37,.5);color:#2E1E10;cursor:pointer;font-size:14.5px;font-weight:800;white-space:nowrap;transition:transform 160ms ease,box-shadow 160ms ease,filter 160ms ease;}
.cp-navCta:hover{transform:translateY(-1px);filter:brightness(1.03);box-shadow:0 12px 24px -8px rgba(168,116,37,.55);}
.cp-navCta svg{width:17px;height:17px;}
.cp-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid rgba(74,43,22,.12);border-radius:14px;background:#fff;cursor:pointer;}
.cp-burger svg{width:22px;height:22px;}
.cp-sheet{display:none;}

/* ================= HERO ================= */
.cp-shell{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:52px 0 44px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(400px,.92fr);gap:52px;align-items:center;}
.cp-copy{position:relative;z-index:2;}
.cp-eyebrow{width:fit-content;margin-bottom:18px;padding:7px 13px;display:inline-flex;align-items:center;gap:8px;border:1px solid var(--cp-gold-line);border-radius:999px;background:rgba(255,255,255,.7);box-shadow:0 4px 16px rgba(74,43,22,.035);color:var(--cp-gold-dark);font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;}
.cp-eyebrowSymbol{color:var(--cp-gold);font-size:13px;}
.cp-title{max-width:640px;margin:0 0 20px;color:var(--cp-ink);font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.7rem,4.6vw,4.3rem);line-height:1.02;letter-spacing:-.04em;font-weight:600;}
.cp-titleGold{color:var(--cp-gold-dark);}
.cp-sub{max-width:560px;margin:0;color:var(--cp-sub);font-size:clamp(1.02rem,1.5vw,1.16rem);line-height:1.6;font-weight:450;}
.cp-sub strong{color:var(--cp-espresso);font-weight:650;}

.cp-actions2{margin-top:28px;display:flex;align-items:center;flex-wrap:wrap;gap:12px;}
.cp-cta{min-height:52px;padding:13px 22px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(168,116,37,.2);border-radius:13px;background:linear-gradient(135deg,#D7A94F 0%,#C8943A 55%,#B88029 100%);box-shadow:0 8px 24px rgba(168,116,37,.18);color:#2E1E10;text-decoration:none;font-size:16px;font-weight:800;cursor:pointer;transition:transform 160ms ease,box-shadow 160ms ease,filter 160ms ease;}
.cp-cta:hover,.cp-cta:focus-visible{transform:translateY(-2px);filter:brightness(1.025);box-shadow:0 12px 30px rgba(168,116,37,.24);}
.cp-cta svg{width:18px;height:18px;}
.cp-secondary{min-height:52px;padding:12px 18px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid rgba(74,43,22,.1);border-radius:13px;background:rgba(255,255,255,.64);color:var(--cp-espresso);font-size:15px;font-weight:700;cursor:pointer;transition:background 150ms ease,border-color 150ms ease,transform 150ms ease;}
.cp-secondary:hover{background:#fff;border-color:rgba(200,148,58,.25);transform:translateY(-1px);}
.cp-secondaryIcon{width:27px;height:27px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(200,148,58,.12);color:var(--cp-gold-dark);}
.cp-secondaryIcon svg{width:15px;height:15px;}

.cp-trust{margin:22px 0 0;padding:0;list-style:none;display:flex;align-items:center;flex-wrap:wrap;gap:10px 20px;}
.cp-trust li{display:inline-flex;align-items:center;gap:6px;color:#665A4F;font-size:13.5px;font-weight:600;}
.cp-trust svg{width:15px;height:15px;color:var(--cp-gold-dark);}

/* Finder card */
.cp-preview{position:relative;display:flex;justify-content:center;}
.cp-previewGlow{position:absolute;top:50%;left:50%;width:520px;height:520px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(200,148,58,.16),rgba(200,148,58,.06) 45%,transparent 70%);filter:blur(20px);pointer-events:none;}
.cp-finder{position:relative;z-index:2;width:100%;max-width:500px;padding:26px 26px 24px;border:1px solid rgba(74,43,22,.08);border-radius:24px;background:#fff;box-shadow:0 32px 64px -26px rgba(74,43,22,.42),0 8px 18px -10px rgba(74,43,22,.18);scroll-margin-top:96px;}
.cp-finderEyebrow{display:block;margin-bottom:8px;color:var(--cp-gold-dark);font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.cp-finderTitle{margin:0;color:var(--cp-espresso);font-family:Georgia,"Times New Roman",serif;font-size:30px;line-height:1.08;letter-spacing:-.025em;font-weight:600;}
.cp-finderSub{margin:8px 0 18px;color:var(--cp-sub);font-size:14.5px;line-height:1.5;}
.cp-search{height:54px;padding:0 12px 0 16px;display:flex;align-items:center;gap:11px;border:1px solid rgba(74,43,22,.14);border-radius:14px;background:var(--cp-ivory);transition:border-color 150ms ease,box-shadow 150ms ease;}
.cp-search:focus-within{border-color:var(--cp-gold);box-shadow:0 0 0 4px rgba(200,148,58,.16);}
.cp-searchIcon{flex:0 0 auto;width:20px;height:20px;color:var(--cp-gold-dark);}
.cp-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;font:inherit;font-size:15.5px;font-weight:500;color:var(--cp-ink);}
.cp-search input::placeholder{color:#A0917F;}
.cp-search input:focus-visible{outline:none;}
.cp-searchKey{min-width:24px;height:24px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(74,43,22,.14);border-radius:6px;background:#fff;font-size:12px;font-weight:700;color:#8A7867;}
.cp-gradeRow{margin-top:20px;padding-top:18px;border-top:1px solid rgba(74,43,22,.08);}
.cp-gradeLabel{display:block;margin-bottom:10px;color:var(--cp-espresso);font-size:12.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.cp-pills{display:flex;flex-wrap:wrap;gap:8px;}
.cp-pill{height:40px;padding:0 16px;border:1px solid rgba(74,43,22,.12);border-radius:999px;background:#fff;cursor:pointer;font-size:14px;font-weight:700;color:#6E6155;transition:background 150ms ease,border-color 150ms ease,color 150ms ease;}
.cp-pill:hover{background:rgba(200,148,58,.08);border-color:rgba(200,148,58,.35);color:var(--cp-espresso);}
.cp-pill.cp-pillOn{background:var(--cp-espresso);border-color:var(--cp-espresso);color:#FFF7E8;}

/* ================= TOPICS ================= */
.tp{width:min(1180px,calc(100% - 40px));margin:12px auto 72px;scroll-margin-top:92px;}
.tp-head{margin-bottom:28px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;}
.tp-eyebrow{margin-bottom:10px;color:var(--cp-gold-dark);font-size:12.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.tp-titleH{margin:0;color:var(--cp-ink);font-family:Georgia,"Times New Roman",serif;font-size:clamp(2rem,3.3vw,2.75rem);line-height:1.05;letter-spacing:-.03em;font-weight:600;}
.tp-sub{max-width:560px;margin:12px 0 0;color:var(--cp-sub);font-size:16.5px;line-height:1.55;}
.tp-all{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;padding:10px 0;border:0;background:none;cursor:pointer;color:var(--cp-espresso);font-size:15px;font-weight:750;}
.tp-all svg{width:16px;height:16px;color:var(--cp-gold-dark);}

.tp-grid{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
.tp-grid>li{display:flex;}

.tp-card{position:relative;width:100%;display:flex;flex-direction:column;align-items:stretch;padding:0;overflow:hidden;text-align:left;cursor:pointer;border:1px solid rgba(74,43,22,.08);border-radius:22px;background:#fff;box-shadow:0 12px 30px -24px rgba(74,43,22,.45);color:inherit;font:inherit;transition:transform 180ms ease,box-shadow 180ms ease,border-color 180ms ease;}
.tp-card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--tp-accent) 35%,transparent);box-shadow:0 24px 44px -26px rgba(74,43,22,.5);}
.tp-art{display:flex;align-items:center;justify-content:center;aspect-ratio:16/10;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.85) 0,rgba(255,255,255,0) 58%),radial-gradient(rgba(74,43,22,.07) 1px,transparent 1.4px) 0 0/14px 14px,var(--tp-tint);}
.tp-art svg{width:46%;max-width:124px;height:auto;overflow:visible;transition:transform 220ms ease;}
.tp-card:hover .tp-art svg{transform:scale(1.06) rotate(-2deg);}

.tp-badge{position:absolute;top:12px;left:12px;padding:5px 10px 5px 8px;display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 4px 12px -6px rgba(74,43,22,.35);color:var(--cp-espresso);font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;}
.tp-badge::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--tp-accent);}
.tp-grade{position:absolute;top:12px;right:12px;padding:5px 10px;border-radius:999px;background:rgba(74,43,22,.86);color:#FFF7E8;font-size:11.5px;font-weight:750;letter-spacing:.02em;}

.tp-body{flex:1;padding:16px 18px 18px;display:flex;flex-direction:column;}
.tp-name{display:block;color:var(--cp-espresso);font-size:17.5px;font-weight:800;letter-spacing:-.01em;}
.tp-desc{display:block;margin:6px 0 12px;color:var(--cp-sub);font-size:14px;line-height:1.45;}
.tp-topics{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.tp-topics span{padding:4px 9px;border-radius:999px;background:var(--tp-tint);color:var(--cp-espresso);font-size:12px;font-weight:650;line-height:1.2;}
.tp-foot{margin-top:auto;min-height:56px;padding-top:12px;border-top:1px solid rgba(74,43,22,.07);display:flex;align-items:center;justify-content:space-between;gap:10px;}
.tp-formats{color:#8A7867;font-size:12px;font-weight:650;line-height:1.3;}
.tp-link{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;color:var(--cp-espresso);font-size:13.5px;font-weight:750;}
.tp-link svg{width:15px;height:15px;color:var(--tp-accent);transition:transform 160ms ease;}
.tp-card:hover .tp-link svg{transform:translateX(3px);}
.tp-cardCompact .tp-desc{margin-bottom:14px;}

.cp-empty{padding:56px 24px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;border:1px dashed rgba(200,148,58,.4);border-radius:22px;background:rgba(255,255,255,.6);}
.cp-emptyMark{color:var(--cp-gold);font-size:28px;}
.cp-emptyTitle{margin:0;color:var(--cp-espresso);font-family:Georgia,serif;font-size:26px;font-weight:600;}
.cp-emptyText{margin:0 0 14px;color:var(--cp-sub);}

/* ================= FIND / PRINT / TEACH ================= */
.cp-pillars{width:min(1100px,calc(100% - 40px));margin:0 auto 30px;padding-top:28px;border-top:1px solid rgba(74,43,22,.09);display:grid;grid-template-columns:repeat(3,1fr);scroll-margin-top:92px;}
.pillar{position:relative;min-height:122px;padding:8px 30px;display:grid;grid-template-columns:44px 1fr;grid-template-rows:auto auto;column-gap:14px;align-content:center;text-align:left;}
.pillar+.pillar{border-left:1px solid rgba(74,43,22,.085);}
.pillarNumber{position:absolute;top:3px;right:22px;color:rgba(168,116,37,.4);font-size:11px;font-weight:900;letter-spacing:.1em;}
.pillar-icon{grid-row:1/span 2;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:11px;background:rgba(200,148,58,.09);color:var(--cp-gold-dark);}
.pillar-icon svg{width:20px;height:20px;}
.pillar-title{margin-bottom:4px;color:var(--cp-espresso);font-size:16px;font-weight:800;}
.pillar-text{color:var(--cp-sub);font-size:14.5px;line-height:1.5;font-weight:450;}

.cp-principle{width:min(880px,calc(100% - 40px));margin:0 auto 44px;padding:18px 22px;display:flex;align-items:center;gap:15px;border:1px solid rgba(200,148,58,.18);border-radius:16px;background:rgba(255,255,255,.5);box-shadow:0 8px 24px rgba(74,43,22,.035);}
.cp-principleMark{flex:0 0 auto;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(200,148,58,.1);color:var(--cp-gold-dark);}
.cp-principleMark svg{width:19px;height:19px;}
.cp-principleCopy{display:flex;flex-direction:column;gap:3px;}
.cp-principleCopy strong{color:var(--cp-espresso);font-size:15px;font-weight:800;}
.cp-principleCopy span{color:var(--cp-sub);font-size:14px;line-height:1.5;font-weight:450;}

/* ================= ASK BAND ================= */
.cp-ask{width:min(1080px,calc(100% - 40px));margin:0 auto 64px;padding:26px 30px;display:flex;align-items:center;gap:22px;border:1px solid rgba(200,148,58,.28);border-radius:24px;background:linear-gradient(135deg,#FFF9EC 0%,#FBF0D8 100%);box-shadow:0 24px 50px -32px rgba(74,43,22,.45);scroll-margin-top:92px;}
.cp-askIcon{flex:0 0 auto;width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:16px;background:#fff;color:var(--cp-gold-dark);box-shadow:0 8px 18px -10px rgba(74,43,22,.4);}
.cp-askIcon svg{width:26px;height:26px;}
.cp-askText{flex:1;min-width:0;}
.cp-askText h3{margin:0;color:var(--cp-espresso);font-family:Georgia,"Times New Roman",serif;font-size:26px;line-height:1.12;letter-spacing:-.02em;font-weight:600;}
.cp-askText p{margin:6px 0 0;color:var(--cp-sub);font-size:15px;line-height:1.5;}
.cp-ask .cp-cta{flex:0 0 auto;}

/* ================= CATEGORY PAGE ================= */
.cp-page{padding-top:22px;}
.cp-back{width:min(1180px,calc(100% - 40px));margin:0 auto 18px;padding:8px 14px 8px 10px;display:flex;align-items:center;gap:8px;border:0;background:none;cursor:pointer;color:var(--cp-espresso);font-size:14.5px;font-weight:750;}
.cp-back{width:fit-content;margin-left:max(20px,calc((100% - 1180px)/2));}
.cp-back svg{width:17px;height:17px;color:var(--cp-gold-dark);}
.cp-hero{width:min(1180px,calc(100% - 40px));margin:0 auto 56px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:44px;align-items:center;}
.cp-heroArt{position:relative;aspect-ratio:1/.9;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(74,43,22,.08);border-radius:28px;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.85) 0,rgba(255,255,255,0) 58%),radial-gradient(rgba(74,43,22,.07) 1px,transparent 1.4px) 0 0/14px 14px,var(--tp-tint);box-shadow:0 34px 70px -34px rgba(74,43,22,.45);}
.cp-heroArt svg{width:46%;max-width:240px;height:auto;overflow:visible;}
.cp-heroArt .tp-badge{top:18px;left:18px;}
.cp-heroTitle{margin:0 0 14px;color:var(--cp-ink);font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.6rem,4.6vw,4rem);line-height:1.02;letter-spacing:-.04em;font-weight:600;}
.cp-heroDesc{max-width:560px;margin:0 0 24px;color:var(--cp-sub);font-size:1.1rem;line-height:1.6;}
.cp-specs{display:grid;grid-template-columns:auto 1fr;gap:12px 32px;padding:18px 20px;border:1px solid rgba(74,43,22,.08);border-radius:18px;background:#fff;box-shadow:0 12px 30px -24px rgba(74,43,22,.45);}
.cp-spec span{display:block;margin-bottom:7px;color:var(--cp-gold-dark);font-size:11.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.cp-spec b{color:var(--cp-espresso);font-size:16px;font-weight:800;}
.cp-formats{display:flex;flex-wrap:wrap;gap:8px;}
.cp-format{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;background:var(--tp-tint);color:var(--cp-espresso);font-size:13px;font-weight:700;white-space:nowrap;}
.cp-formatIcon{width:15px;height:15px;color:var(--tp-accent);}
.cp-verse{margin:22px 0 0;padding:4px 0 4px 18px;border-left:3px solid var(--cp-gold);}
.cp-verse p{margin:0;color:var(--cp-espresso);font-family:Georgia,serif;font-size:1.3rem;line-height:1.4;font-style:italic;}
.cp-verse cite{display:block;margin-top:8px;color:var(--cp-gold-dark);font-size:13px;font-weight:800;font-style:normal;letter-spacing:.06em;text-transform:uppercase;}

.cp-sectionTight{margin-bottom:56px;}
.cp-topicGrid{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
.cp-topicCard{padding:18px 18px 16px;display:flex;flex-direction:column;gap:14px;border:1px solid rgba(74,43,22,.08);border-radius:18px;background:#fff;box-shadow:0 12px 30px -24px rgba(74,43,22,.45);border-top:3px solid var(--tp-accent);}
.cp-topicName{color:var(--cp-espresso);font-family:Georgia,serif;font-size:19px;font-weight:600;line-height:1.2;letter-spacing:-.01em;}
.cp-status{display:inline-flex;align-items:center;gap:7px;color:#8A7867;font-size:12.5px;font-weight:700;}
.cp-statusDot{width:8px;height:8px;border-radius:50%;background:var(--tp-accent);opacity:.75;}

/* ================= FOOTER ================= */
.cp-foot{border-top:1px solid var(--cp-line);background:rgba(255,255,255,.55);}
.cp-footInner{width:min(760px,calc(100% - 40px));margin:0 auto;padding:38px 0 44px;text-align:center;}
.cp-footMark{color:var(--cp-gold);font-size:22px;}
.cp-footText{margin:8px 0 12px;color:var(--cp-espresso);font-family:Georgia,serif;font-size:20px;font-weight:600;}
.cp-footFine{margin:0 0 6px;color:#8A7867;font-size:13px;line-height:1.55;}
.cp-footFine a{color:var(--cp-espresso);font-weight:650;text-decoration:none;}
.cp-footFine a:hover{text-decoration:underline;}

/* ================= RESPONSIVE ================= */
@media (max-width:1080px){
  .cp-searchPill span{display:none;}
  .cp-searchPill kbd{display:none;}
  .cp-searchPill{padding:0 13px;}
  .cp-shell{gap:36px;grid-template-columns:minmax(0,1fr) minmax(360px,.9fr);}
  .tp-grid,.cp-topicGrid{grid-template-columns:repeat(3,minmax(0,1fr));}
}
@media (max-width:940px){
  .cp-nav,.cp-searchPill,.cp-navCta{display:none;}
  .cp-burger{display:inline-flex;}
  .cp-head{padding:8px 10px 0;}
  .cp-bar{height:62px;padding:0 9px 0 14px;border-radius:18px;}
  .cp-sheet{pointer-events:auto;position:absolute;top:calc(100% + 8px);left:0;right:0;display:flex;flex-direction:column;gap:2px;padding:10px;border:1px solid rgba(74,43,22,.09);border-radius:20px;background:rgba(255,253,249,.98);box-shadow:0 30px 60px -24px rgba(74,43,22,.45);}
  .cp-sheetRow{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border:0;border-radius:12px;background:none;cursor:pointer;text-align:left;font-size:16px;font-weight:700;color:var(--cp-espresso);text-decoration:none;}
  .cp-sheetRow svg{width:18px;height:18px;color:var(--cp-gold-dark);}
  .cp-sheetRow:hover{background:rgba(200,148,58,.1);}
  .cp-sheetCta{margin-top:6px;height:50px;border:1px solid rgba(168,116,37,.22);border-radius:13px;background:linear-gradient(135deg,#D7A94F,#B88029);color:#2E1E10;font-size:16px;font-weight:800;cursor:pointer;}
  .cp-shell{grid-template-columns:1fr;gap:36px;padding-top:40px;text-align:center;}
  .cp-copy{display:flex;flex-direction:column;align-items:center;}
  .cp-actions2,.cp-trust{justify-content:center;}
  .cp-finder{text-align:left;}
  .tp-head{flex-direction:column;align-items:center;text-align:center;}
  .tp-sub{margin-left:auto;margin-right:auto;}
  .tp-all{padding:0;}
  .tp-grid,.cp-topicGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
  .cp-pillars{max-width:650px;grid-template-columns:1fr;}
  .pillar{width:100%;max-width:590px;margin:auto;padding:19px 14px;}
  .pillar+.pillar{border-left:0;border-top:1px solid rgba(74,43,22,.075);}
  .cp-hero{grid-template-columns:1fr;gap:28px;}
  .cp-heroArt{aspect-ratio:16/10;}
  .cp-ask{flex-direction:column;text-align:center;}
}
@media (max-width:620px){
  .cp-logo{height:42px;}
  .cp-shell{width:calc(100% - 32px);padding:32px 0 32px;gap:30px;}
  .cp-eyebrow{margin-bottom:15px;padding:6px 11px;font-size:11px;letter-spacing:.06em;}
  .cp-title{font-size:clamp(2.3rem,10.5vw,3.1rem);margin-bottom:16px;}
  .cp-actions2{width:100%;flex-direction:column;gap:10px;}
  .cp-actions2 .cp-cta,.cp-actions2 .cp-secondary{width:100%;max-width:360px;}
  .cp-trust{display:none;}
  .cp-previewGlow{width:360px;height:360px;}
  .cp-finder{padding:20px 18px 18px;border-radius:20px;}
  .cp-finderTitle{font-size:26px;}
  .tp{width:calc(100% - 32px);margin:4px auto 52px;}
  .tp-head{margin-bottom:22px;gap:14px;}
  .tp-sub{font-size:15.5px;}
  .tp-grid{gap:12px;}
  .tp-card{border-radius:18px;}
  .tp-body{padding:12px 13px 14px;}
  .tp-name{font-size:15.5px;}
  .tp-desc{margin:4px 0 10px;font-size:13px;}
  .tp-topics{display:none;}
  .tp-badge{top:8px;left:8px;padding:4px 8px 4px 7px;font-size:10px;}
  .tp-grade{top:8px;right:8px;padding:4px 8px;font-size:10px;}
  .tp-foot{flex-direction:column;align-items:flex-start;gap:6px;}
  .cp-pillars{width:calc(100% - 32px);margin-bottom:22px;}
  .pillar{grid-template-columns:40px 1fr;column-gap:12px;padding:18px 4px;}
  .pillar-icon{width:40px;height:40px;}
  .pillarNumber{right:4px;}
  .cp-principle{width:calc(100% - 32px);margin-bottom:32px;padding:16px;align-items:flex-start;text-align:left;}
  .cp-ask{width:calc(100% - 32px);padding:22px 18px;margin-bottom:44px;}
  .cp-askText h3{font-size:23px;}
  .cp-ask .cp-cta{width:100%;}
  .cp-hero{width:calc(100% - 32px);}
  .cp-specs{grid-template-columns:1fr;}
  .cp-topicGrid{grid-template-columns:1fr 1fr;gap:10px;}
  .cp-topicName{font-size:16.5px;}
  .cp-back{margin-left:16px;}
}
@media (prefers-reduced-motion:reduce){
  .cp-cta,.cp-secondary,.tp-card,.tp-art svg,.tp-link svg{transition:none;}
  .tp-card:hover,.tp-card:hover .tp-art svg{transform:none;}
}
`;
