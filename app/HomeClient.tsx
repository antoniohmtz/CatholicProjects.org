"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cp-ui", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--cp-display", display: "swap" });

/* ── Grade bands ───────────────────────────────────────────── */

const BANDS = [
  { key: "prek", label: "Pre-K – K", short: "Pre-K–K", ages: "Ages 4–6", from: "Pre-K", to: "K" },
  { key: "early", label: "Grades 1–2", short: "1–2", ages: "Ages 6–8", from: "Grade 1", to: "Grade 2" },
  { key: "middle", label: "Grades 3–5", short: "3–5", ages: "Ages 8–11", from: "Grade 3", to: "Grade 5" },
  { key: "upper", label: "Grades 6–8", short: "6–8", ages: "Ages 11–14", from: "Grade 6", to: "Grade 8" },
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
  bands: BandKey[];
  formats: Format[];
  topics: string[];
  verse: string;
  reference: string;
  worksheets: number;
};

const CATEGORIES: Category[] = [
  {
    slug: "saints", name: "Saints", kind: "saints", worksheets: 0,
    description: "Four-panel coloring stories and stand-up saints that bring the heroes of the faith to life.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Four-panel stories", "Stand-up saints", "Feast day pages", "Patron saints"],
    verse: "Be ye followers of me, as I also am of Christ.", reference: "1 Corinthians 11:1",
  },
  {
    slug: "bible-stories", name: "Bible Stories", kind: "bible", worksheets: 0,
    description: "Scripture stories children can color, put in order, and retell, from Creation to the Resurrection.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "worksheet", "activity"],
    topics: ["Creation", "Noah’s Ark", "Parables of Jesus", "Miracles of Jesus"],
    verse: "Thy word is a lamp to my feet, and a light to my paths.", reference: "Psalm 118:105",
  },
  {
    slug: "the-mass", name: "The Mass", kind: "mass", worksheets: 0,
    description: "Help children understand what happens at Mass, and why every part of it matters.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Parts of the Mass", "Sacred vessels", "Liturgical colors", "Mass responses"],
    verse: "Do this for a commemoration of me.", reference: "Luke 22:19",
  },
  {
    slug: "sacraments", name: "Sacraments", kind: "sacraments", worksheets: 0,
    description: "Preparation pages for First Reconciliation, First Communion, and Confirmation.",
    bands: ["early", "middle", "upper"], formats: ["worksheet", "activity", "craft"],
    topics: ["Baptism", "First Reconciliation", "First Communion", "Confirmation"],
    verse: "Unless a man be born again of water and the Holy Ghost.", reference: "John 3:5",
  },
  {
    slug: "prayers", name: "Prayers", kind: "prayers", worksheets: 0,
    description: "Tracing pages and line-by-line guides for learning the prayers of the Church by heart.",
    bands: ["prek", "early", "middle", "upper"], formats: ["coloring", "activity", "worksheet"],
    topics: ["Sign of the Cross", "Our Father", "Hail Mary", "Guardian Angel Prayer"],
    verse: "Lord, teach us to pray.", reference: "Luke 11:1",
  },
  {
    slug: "liturgical-seasons", name: "Liturgical Seasons", kind: "seasons", worksheets: 0,
    description: "Advent wreaths, Lenten calendars, and Easter crafts for every season of the Church year.",
    bands: ["prek", "early", "middle", "upper"], formats: ["craft", "coloring", "activity"],
    topics: ["Advent", "Christmas", "Lent", "Easter"],
    verse: "All things have their season.", reference: "Ecclesiastes 3:1",
  },
  {
    slug: "the-rosary", name: "The Rosary", kind: "rosary", worksheets: 0,
    description: "Bead-by-bead coloring and mystery pages that teach children how to pray the Rosary.",
    bands: ["early", "middle", "upper"], formats: ["coloring", "craft", "worksheet"],
    topics: ["Joyful Mysteries", "Luminous Mysteries", "Sorrowful Mysteries", "Glorious Mysteries"],
    verse: "Hail, full of grace, the Lord is with thee.", reference: "Luke 1:28",
  },
  {
    slug: "virtues", name: "Virtues & Kindness", kind: "virtues", worksheets: 0,
    description: "Everyday lessons in kindness, honesty, and mercy, rooted in the Commandments.",
    bands: ["prek", "early", "middle", "upper"], formats: ["worksheet", "activity", "coloring"],
    topics: ["Ten Commandments", "Fruits of the Spirit", "Works of mercy", "Loving our neighbor"],
    verse: "And now there remain faith, hope, and charity, these three.", reference: "1 Corinthians 13:13",
  },
];

/* ── Coming up on the calendar (edit as the year moves) ────── */

const COMING_UP = [
  { label: "St. Francis · Oct 4", slug: "saints" },
  { label: "Month of the Rosary", slug: "the-rosary" },
  { label: "All Saints · Nov 1", slug: "saints" },
  { label: "Advent", slug: "liturgical-seasons" },
];

/* ──────────────────────────────────────────────────────────── */

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
  back: (<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  heart: (<><path d="M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z" /></>),
  print: (<><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="7" rx="1.5" /><path d="M7 14h10v6H7z" /></>),
  book: (<><path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v13H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H17" /></>),
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
};

function Svg({ children, className, sw = 1.7 }: { children: ReactNode; className?: string; sw?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

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

/* ── Illustrations (drawn, on-brand) ───────────────────────── */

const LINE = { fill: "none", stroke: "#8a5d3b", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const TINT = { fill: "#f8ecd3", stroke: "#8a5d3b", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const GOLD = { fill: "none", stroke: "#c8943a", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Motif({ kind }: { kind: Kind }) {
  switch (kind) {
    case "saints":
      return (
        <g>
          <ellipse cx="60" cy="44" rx="15" ry="4.5" {...GOLD} />
          <circle cx="60" cy="57" r="9" {...TINT} />
          <path d="M41 112Q43 74 60 70Q77 74 79 112Z" {...TINT} />
          <path d="M60 84v14M54 89h12" {...GOLD} />
        </g>
      );
    case "bible":
      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={60 + 10 * Math.cos((a * Math.PI) / 180)} y1={46 + 10 * Math.sin((a * Math.PI) / 180)} x2={60 + 15 * Math.cos((a * Math.PI) / 180)} y2={46 + 15 * Math.sin((a * Math.PI) / 180)} {...GOLD} />
          ))}
          <circle cx="60" cy="46" r="5" fill="#d9a84e" stroke="#c8943a" strokeWidth="1.5" />
          <path d="M22 108Q41 99 60 108Q79 99 98 108V72Q79 63 60 72Q41 63 22 72Z" {...TINT} />
          <path d="M60 72V108" {...LINE} />
        </g>
      );
    case "mass":
      return (
        <g>
          <circle cx="60" cy="46" r="9" fill="#fff" stroke="#c8943a" strokeWidth="2" />
          <path d="M60 41v10M55 46h10" {...GOLD} strokeWidth={1.6} />
          <path d="M40 62H80Q80 88 60 90Q40 88 40 62Z" {...TINT} />
          <path d="M60 90V104" {...LINE} />
          <path d="M46 112Q60 98 74 112Z" {...TINT} />
        </g>
      );
    case "sacraments":
      return (
        <g>
          <path d="M60 38C60 38 84 68 84 88A24 24 0 0 1 36 88C36 68 60 38 60 38Z" {...TINT} />
          <path d="M60 74v26M48 87h24" {...GOLD} />
        </g>
      );
    case "prayers":
      return (
        <g>
          <path d="M60 38V104M38 58H82" {...LINE} strokeWidth={3.4} />
          <path d="M24 112H96" stroke="#c8943a" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "seasons":
      return (
        <g>
          {[32, 48, 64, 80].map((x) => (
            <g key={x}>
              <rect x={x} y="64" width="10" height="34" rx="2" fill="#fff" stroke="#8a5d3b" strokeWidth="2" />
              <path d={`M${x + 5} 50q5 6 0 12q-5 -6 0 -12z`} fill="#d9a84e" stroke="#c8943a" strokeWidth="1.4" />
            </g>
          ))}
          <ellipse cx="60" cy="102" rx="38" ry="11" {...TINT} />
        </g>
      );
    case "rosary":
      return (
        <g>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={60 + 24 * Math.cos(a)} cy={62 + 22 * Math.sin(a)} r="3.6" {...TINT} strokeWidth={1.6} />;
          })}
          <circle cx="60" cy="92" r="3.4" {...TINT} strokeWidth={1.6} />
          <path d="M60 96V116M53 103h14" {...LINE} />
        </g>
      );
    case "virtues":
      return (
        <g>
          <path d="M60 108C30 88 32 56 50 52C57 50.5 60 58 60 58C60 58 63 50.5 70 52C88 56 90 88 60 108Z" {...TINT} />
          <path d="M88 38v12M82 44h12" {...GOLD} />
        </g>
      );
  }
}


function ActivityPreview({ kind, className }: { kind: Kind; className?: string }) {
  const ink = "#5f3e29";
  const gold = "#c8943a";
  const paper = "#fffdf8";
  const line = "rgba(95,62,41,.2)";

  const meta: Record<Kind, { title: string; sub: string; tag: string; accent: string; wash: string }> = {
    saints: { title: "ST. FRANCIS", sub: "COLOR • CUT • RETELL", tag: "Saint story", accent: "#c8943a", wash: "#f5e7c8" },
    bible: { title: "NOAH'S ARK", sub: "MINI STORY BOOK", tag: "Bible story", accent: "#7c8b69", wash: "#e8eee0" },
    mass: { title: "PARTS OF THE MASS", sub: "MATCH • NAME • LEARN", tag: "Mass activity", accent: "#a58965", wash: "#eee8df" },
    sacraments: { title: "FIRST COMMUNION", sub: "PREP • COLOR • LEARN", tag: "Sacrament", accent: "#6f91a0", wash: "#e4eef1" },
    prayers: { title: "OUR FATHER", sub: "TRACE • PRAY • LEARN", tag: "Prayer page", accent: "#8a5d3b", wash: "#f1e7dc" },
    seasons: { title: "ADVENT", sub: "COLOR • COUNT • PREPARE", tag: "Church year", accent: "#7b6788", wash: "#ede8f0" },
    rosary: { title: "JOYFUL MYSTERIES", sub: "PRAY • COLOR • LEARN", tag: "Rosary guide", accent: "#718b9b", wash: "#e8eef1" },
    virtues: { title: "WORKS OF MERCY", sub: "MATCH • REFLECT • DO", tag: "Virtue activity", accent: "#9a6b5f", wash: "#f0e4df" },
  };

  const m = meta[kind];

  const Scene = () => {
    switch (kind) {
      case "saints":
        return (<>
          <ellipse cx="166" cy="116" rx="34" ry="9" fill="none" stroke={gold} strokeWidth="3" />
          <circle cx="166" cy="144" r="23" fill={m.wash} stroke={ink} strokeWidth="2.4" />
          <path d="M124 232c3-49 22-70 42-70s39 21 42 70" fill="#e7edf1" stroke={ink} strokeWidth="2.5" />
          <path d="M166 184v29M153 198h26" stroke={gold} strokeWidth="3" strokeLinecap="round" />
          <path d="M105 213q-17-12-23-2q8 10 23 2ZM227 202q18-12 24-1q-9 9-24 1Z" fill="none" stroke={m.accent} strokeWidth="2" />
        </>);
      case "bible":
        return (<>
          <path d="M111 185q27-17 55 0q28-17 56 0v45q-28-14-56 1q-28-15-55-1Z" fill={m.wash} stroke={ink} strokeWidth="2.5" />
          <path d="M166 185v46" stroke={ink} strokeWidth="2" />
          <path d="M117 146q49-57 98 0" fill="none" stroke={m.accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M128 145q38-44 76 0" fill="none" stroke="#c8943a" strokeWidth="3" strokeLinecap="round" />
          <path d="M143 168h46l13 17h-72Z" fill="#e6c28a" stroke={ink} strokeWidth="2" />
          <circle cx="150" cy="158" r="4" fill={ink}/><circle cx="181" cy="158" r="4" fill={ink}/>
        </>);
      case "mass":
        return (<>
          <circle cx="166" cy="133" r="29" fill="#fff" stroke={gold} strokeWidth="3" />
          <path d="M166 118v30M151 133h30" stroke={gold} strokeWidth="2.8" />
          <path d="M140 177h52q-3 29-26 29t-26-29Z" fill={m.wash} stroke={ink} strokeWidth="2.4" />
          <path d="M166 206v18M149 225h34" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <rect x="111" y="231" width="110" height="18" rx="3" fill="#f7edd9" stroke={ink} strokeWidth="2" />
        </>);
      case "sacraments":
        return (<>
          <circle cx="186" cy="144" r="26" fill="#fff" stroke={gold} strokeWidth="2.8" />
          <path d="M186 131v26M173 144h26" stroke={gold} strokeWidth="2.4" />
          <path d="M128 119q22 8 38 28l-14 15q-18-20-38-25Z" fill={m.wash} stroke={ink} strokeWidth="2.2" />
          <path d="M126 178c-10 15-15 25-15 35a18 18 0 0 0 36 0c0-10-6-20-21-35Z" fill="#ddecf2" stroke={ink} strokeWidth="2.2" />
          <path d="M180 191h32q-2 21-16 21t-16-21Z" fill="#f7ead0" stroke={ink} strokeWidth="2" />
          <path d="M196 212v14" stroke={ink} strokeWidth="2" />
        </>);
      case "prayers":
        return (<>
          <path d="M166 112v90M128 144h76" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M116 220h101M125 232h83M137 244h59" stroke={m.accent} opacity=".45" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="118" cy="116" r="5" fill={gold}/><circle cx="218" cy="116" r="5" fill={gold}/>
        </>);
      case "seasons":
        return (<>
          <ellipse cx="166" cy="218" rx="61" ry="20" fill="#dfe8d7" stroke={ink} strokeWidth="2.2" />
          {[126,153,180,207].map((x,i)=><g key={x}>
            <rect x={x-7} y={154+(i%2)*5} width="14" height={54-(i%2)*5} rx="3" fill={i===2?"#e8bfd0":"#d7c6e4"} stroke={ink} strokeWidth="1.8"/>
            <path d={`M${x} ${139+(i%2)*5}q9 10 0 20q-9-10 0-20z`} fill="#f0c05b" stroke={gold} strokeWidth="1.6"/>
          </g>)}
          <path d="M116 222c18-18 82-18 101 0" fill="none" stroke="#7d9a69" strokeWidth="4.5" strokeLinecap="round" />
        </>);
      case "rosary":
        return (<>
          {Array.from({ length: 14 }).map((_, i) => { const a = i / 14 * Math.PI * 2 - Math.PI / 2; return <circle key={i} cx={166 + 52 * Math.cos(a)} cy={166 + 40 * Math.sin(a)} r="5.6" fill={i % 5 === 0 ? "#e2bd64" : m.wash} stroke={ink} strokeWidth="1.7" />; })}
          <circle cx="166" cy="218" r="5.5" fill={m.wash} stroke={ink} strokeWidth="1.7" />
          <path d="M166 224v31M155 239h22" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M110 123h22M200 123h22" stroke={m.accent} strokeWidth="3" strokeLinecap="round" />
        </>);
      case "virtues":
        return (<>
          <path d="M166 225c-44-29-50-66-28-79c17-10 28 7 28 7s11-17 28-7c22 13 16 50-28 79Z" fill={m.wash} stroke={ink} strokeWidth="2.5" />
          <path d="M166 163v28M152 177h28" stroke={gold} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M119 221q-25-10-30-31M213 221q25-10 30-31" fill="none" stroke={m.accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M111 136h32M190 136h32" stroke={m.accent} opacity=".45" strokeWidth="3.5" strokeLinecap="round" />
        </>);
    }
  };

  return (
    <svg className={className} viewBox="0 0 520 330" aria-hidden="true">
      <g className="cpPreviewBack cpPreviewBackA">
        <rect x="245" y="34" width="202" height="246" rx="13" fill="#f0e3c8" stroke={line} />
        <rect x="266" y="57" width="72" height="7" rx="3.5" fill={m.accent} opacity=".68" />
        <rect x="266" y="73" width="126" height="5" rx="2.5" fill={ink} opacity=".11" />
        <rect x="266" y="91" width="158" height="108" rx="9" fill={m.wash} opacity=".85" />
        <path d="M272 224h142M272 237h116M272 250h132" stroke={ink} opacity=".13" strokeWidth="5" strokeLinecap="round" />
      </g>

      <g className="cpPreviewBack cpPreviewBackB">
        <rect x="104" y="25" width="225" height="272" rx="14" fill="#faf1df" stroke={line} />
      </g>

      <g className="cpPreviewFront">
        <rect x="73" y="43" width="232" height="268" rx="14" fill={paper} stroke={line} />
        <rect x="94" y="65" width="54" height="7" rx="3.5" fill={m.accent} />
        <text x="94" y="91" fill={ink} fontSize="13" fontWeight="700" letterSpacing="1.6" fontFamily="Arial, sans-serif">{m.tag.toUpperCase()}</text>
        <text x="94" y="111" fill={ink} fontSize="18" fontWeight="700" fontFamily="Georgia, serif">{m.title}</text>
        <text x="94" y="128" fill={m.accent} fontSize="8.7" fontWeight="700" letterSpacing="1.2" fontFamily="Arial, sans-serif">{m.sub}</text>
        <Scene />
        <path d="M94 274h124M94 286h103" stroke={ink} opacity=".12" strokeWidth="5" strokeLinecap="round" />
      </g>

      <g className="cpPreviewMini">
        <rect x="335" y="173" width="120" height="105" rx="12" fill="#fffdf8" stroke={line} />
        <rect x="350" y="189" width="42" height="5" rx="2.5" fill={m.accent} opacity=".8" />
        <rect x="350" y="203" width="78" height="4" rx="2" fill={ink} opacity=".12" />
        <circle cx="395" cy="237" r="22" fill={m.wash} stroke={m.accent} strokeWidth="2" />
        <path d="M395 224v27M382 237h26" stroke={m.accent} strokeWidth="2" strokeLinecap="round" opacity={kind === "rosary" || kind === "seasons" ? .25 : .85} />
      </g>

      <g className="cpPreviewPencil" transform="rotate(-13 458 251)">
        <rect x="451" y="205" width="13" height="75" rx="5" fill="#d4a249" stroke={ink} strokeWidth="1.4" />
        <path d="M451 205l6.5-15 6.5 15Z" fill="#ecd8b2" stroke={ink} strokeWidth="1.4" />
        <rect x="451" y="267" width="13" height="13" rx="3" fill="#c47f75" opacity=".8" />
      </g>
    </svg>
  );
}
function Illustration({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 180" aria-hidden="true">
      <g className="cpSheetA"><rect x="60" y="14" width="120" height="152" rx="9" fill="#f3e2bd" stroke="rgba(111,67,39,.25)" /></g>
      <g className="cpSheetB"><rect x="60" y="14" width="120" height="152" rx="9" fill="#fbf1dc" stroke="rgba(111,67,39,.25)" /></g>
      <g className="cpSheetFront">
        <rect x="60" y="14" width="120" height="152" rx="9" fill="#fffefb" stroke="rgba(111,67,39,.3)" />
        <g transform="translate(60 14)">
          <rect x="14" y="12" width="46" height="5" rx="2.5" fill="#c8943a" opacity=".85" />
          <rect x="14" y="21" width="30" height="4" rx="2" fill="#8a5d3b" opacity=".2" />
          <Motif kind={kind} />
          <rect x="14" y="126" width="92" height="4" rx="2" fill="#8a5d3b" opacity=".16" />
          <rect x="14" y="135" width="66" height="4" rx="2" fill="#8a5d3b" opacity=".16" />
        </g>
      </g>
    </svg>
  );
}

/* ── Header ────────────────────────────────────────────────── */

function Header({ onHome, onSearch, onJump }: { onHome: () => void; onSearch: () => void; onJump: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <header className={scrolled ? "cpHead cpHeadOn" : "cpHead"}>
      <div className="cpBar">
        <button className="cpBrand" onClick={go(onHome)} aria-label="CatholicProjects library home">
          <Image src="/brand/catholicprojects-logo.png" alt="CatholicProjects.org" width={900} height={260} priority className="cpLogo" />
        </button>

        <nav className="cpNav" aria-label="Primary">
          <button className="cpLink" onClick={go(() => onJump("topics"))}>Topics</button>
          <button className="cpLink" onClick={go(() => onJump("finder"))}>Grades</button>
          <button className="cpLink" onClick={go(() => onJump("ask"))}>Request a worksheet</button>
          <a className="cpLink" href="https://catholicprojects.org">About us</a>
        </nav>

        <div className="cpActions">
          <button className="cpSearchPill" onClick={go(onSearch)} aria-label="Search topics">
            <Svg className="cpSearchPillIcon">{UI.search}</Svg>
            <span>Search topics</span>
            <kbd>/</kbd>
          </button>
          <button className="cpBurger" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            <Svg>{open ? UI.close : UI.menu}</Svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="cpSheet">
          <button className="cpSheetRow" onClick={go(onSearch)}>Search topics</button>
          <button className="cpSheetRow" onClick={go(() => onJump("topics"))}>Topics</button>
          <button className="cpSheetRow" onClick={go(() => onJump("finder"))}>Grades</button>
          <button className="cpSheetRow" onClick={go(() => onJump("ask"))}>Request a worksheet</button>
          <a className="cpSheetRow" href="https://catholicprojects.org">About us</a>
        </div>
      )}
    </header>
  );
}

/* ── Category card ─────────────────────────────────────────── */

function CategoryCard({ c, onOpen, featured = false }: { c: Category; onOpen: (slug: string) => void; featured?: boolean }) {
  const formatText = c.formats.map((f) => FORMAT_SHORT[f]).join(" · ");
  const topics = c.topics.slice(0, featured ? 4 : 3);

  return (
    <button className={`cpCat cpCat--${c.kind}${featured ? " cpCatFeatured" : ""}`} onClick={() => onOpen(c.slug)} aria-label={`Open ${c.name}`}>
      <span className="cpCatVisual">
        <ActivityPreview kind={c.kind} className="cpArtSvg" />
      </span>

      <span className="cpCatContent">
        <span className="cpCatOverline">
          <span>{featured ? "Featured collection" : "Catholic activities"}</span>
          <span className="cpCatGrade">{gradeRange(c)}</span>
        </span>

        <span className="cpCatName">{c.name}</span>
        <span className="cpCatDesc">{c.description}</span>

        <span className="cpTopicList" aria-label={`Popular ${c.name} topics`}>
          {topics.map((t) => <span key={t}>{t}</span>)}
        </span>

        <span className="cpCatBottom">
          <span className="cpFormatText">{formatText}</span>
          <span className="cpExplore">Explore {c.name}<Svg sw={2}>{UI.arrow}</Svg></span>
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
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATEGORIES.filter((c) => {
      if (band && !c.bands.includes(band)) return false;
      if (!q) return true;
      return [c.name, c.description, ...c.topics].join(" ").toLowerCase().includes(q);
    });
  }, [query, band]);

  const activeBand = bandByKey(band);

  return (
    <>
      <section className="cpIntro">
        <div className="cpIntroCopy">
          <span className="cpWelcome"><span className="cpWelcomeCross" aria-hidden="true">✠</span> Catholic Parish Activities &amp; Worksheet Hub</span>
          <h1 className="cpH1">Faithful resources for <em>your next class.</em></h1>
          <p className="cpLead">Print-ready Catholic activities for catechists, teachers, and parents—organized by topic and grade so lesson planning feels simple, beautiful, and focused on the faith.</p>

          <ul className="cpPromises" aria-label="Resource benefits">
            <li><span className="cpPromiseIcon"><Svg sw={2}>{UI.check}</Svg></span><span><b>Free to use</b><small>Made for Catholic classrooms</small></span></li>
            <li><span className="cpPromiseIcon"><Svg sw={2}>{UI.print}</Svg></span><span><b>Ready to print</b><small>Designed for standard paper</small></span></li>
            <li><span className="cpPromiseIcon"><Svg sw={2}>{UI.book}</Svg></span><span><b>Faithful by design</b><small>Built from Catholic sources</small></span></li>
          </ul>
        </div>

        <div className="cpFinderWrap">
          <div className="cpFinder" id="finder">
            <div className="cpFinderTop">
              <span className="cpFinderEyebrow">Resource finder</span>
              <h2 className="cpFinderTitle">What are you teaching?</h2>
              <p className="cpFinderSub">Search the library, then narrow it to the grade level you need.</p>
            </div>

            <label className="cpFinderSearch">
              <Svg className="cpFinderIcon">{UI.search}</Svg>
              <input id="cp-search" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Try “Advent,” “Hail Mary,” or “First Communion”" aria-label="Search topics" autoComplete="off" />
              <span className="cpFinderKey" aria-hidden="true">/</span>
            </label>

            <div className="cpFinderDivider" />
            <div className="cpFinderGrades" role="group" aria-label="Grade level">
              <span className="cpFinderLabel">Choose a grade</span>
              <div className="cpGradePills">
                <button className={!band ? "cpPill cpPillOn" : "cpPill"} onClick={() => onBand(null)}>All</button>
                {BANDS.map((b) => (
                  <button key={b.key} className={band === b.key ? "cpPill cpPillOn" : "cpPill"} aria-pressed={band === b.key} onClick={() => onBand(band === b.key ? null : b.key)}>
                    {b.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="cpFinderNote"><span aria-hidden="true">✦</span> New resources are being added as the library grows.</p>
        </div>
      </section>

      <section className="cpTopics" id="topics">
        <div className="cpTopicsHead">
          <div className="cpTopicsIntro">
            <span className="cpSectionEyebrow">Explore the library</span>
            <h2 className="cpH2">
              {query ? <>Results for <em>“{query}”</em></> : activeBand ? <>Resources for <em>{activeBand.label}</em></> : <>Find something for <em>the lesson ahead.</em></>}
            </h2>
            <p className="cpTopicsLead">
              {query || activeBand
                ? `${results.length} ${results.length === 1 ? "collection" : "collections"} match your current filters.`
                : "Start with the part of the faith you’re teaching. Each collection brings together print-ready activities made for Catholic children."}
            </p>
          </div>
        </div>

        {!query && !band && (
          <div className="cpChurchYear" aria-label="Coming up in the Church year">
            <div className="cpChurchYearLead">
              <span className="cpChurchYearMark" aria-hidden="true">✦</span>
              <span>
                <small>Coming up in the Church year</small>
                <b>Plan the next lesson around what’s ahead.</b>
              </span>
            </div>
            <div className="cpComing">
              {COMING_UP.map((x) => (
                <button key={x.label} className="cpComingChip" onClick={() => onOpen(x.slug)}>{x.label}</button>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="cpEmpty">
            <span className="cpEmptyMark">✠</span>
            <p className="cpEmptyTitle">We don’t have that yet.</p>
            <p>Tell us what you’re teaching and we’ll make it a priority.</p>
            <a className="cpBtn cpBtnPrimary" href={`mailto:team@catholicprojects.org?subject=${encodeURIComponent("Worksheet idea: " + query)}`}>Request “{query || "a topic"}”</a>
            <button className="cpTextBtn" onClick={() => { onBand(null); onQuery(""); }}>Show all topics</button>
          </div>
        ) : (
          <div className={`cpEditorialGrid${query || band ? " cpEditorialGridFiltered" : ""}`}>
            {results.map((c) => (
              <CategoryCard key={c.slug} c={c} onOpen={onOpen} featured={!query && !band && (c.kind === "saints" || c.kind === "bible")} />
            ))}
          </div>
        )}
      </section>

      <section className="cpAsk" id="ask">
        <span className="cpAskIcon"><Svg sw={1.5}>{UI.mail}</Svg></span>
        <div className="cpAskText">
          <h3>Teaching something we don’t have yet?</h3>
          <p>Tell us the lesson, the grade, and the date you need it. Real classroom requests decide what gets made next.</p>
        </div>
        <a className="cpBtn cpBtnPrimary" href="mailto:team@catholicprojects.org?subject=Worksheet%20idea">Request a worksheet</a>
      </section>
    </>
  );
}

/* ── Category page ─────────────────────────────────────────── */

function CategoryPage({ c, onHome, onOpen }: { c: Category; onHome: () => void; onOpen: (slug: string) => void }) {
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  const suggest = `mailto:team@catholicprojects.org?subject=${encodeURIComponent(`Worksheet idea: ${c.name}`)}`;

  return (
    <div>
      <button className="cpBack" onClick={onHome}>
        <Svg sw={2}>{UI.back}</Svg> All topics
      </button>

      <section className="cpHero">
        <div className="cpHeroArt"><Illustration kind={c.kind} className="cpHeroSvg" /></div>
        <div className="cpHeroBody">
          <span className="cpEyebrow">Topic</span>
          <h1 className="cpHeroTitle">{c.name}</h1>
          <p className="cpHeroDesc">{c.description}</p>

          <div className="cpSpecs">
            <div><span>Grades</span><b>{gradeRange(c)}</b></div>
            <div><span>You’ll find</span>
              <div className="cpFormats">
                {c.formats.map((f) => (
                  <span key={f} className="cpFormat"><Svg className="cpFormatIcon">{FORMAT_ICON[f]}</Svg>{FORMAT_LABEL[f]}</span>
                ))}
              </div>
            </div>
          </div>

          <blockquote className="cpVerse">
            <p>{c.verse}</p>
            <cite>{c.reference}</cite>
          </blockquote>
        </div>
      </section>

      <section className="cpSection">
        <div className="cpSectionHead">
          <span className="cpEyebrow">Coming to this topic</span>
          <h2 className="cpH2">What we’re preparing</h2>
        </div>
        <div className="cpTopicGrid">
          {c.topics.map((t) => (
            <div key={t} className="cpTopicCard">
              <span className="cpTopicName">{t}</span>
              <span className="cpStatus"><span className="cpStatusDot" /> In preparation</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cpAsk">
        <span className="cpAskIcon"><Svg sw={1.5}>{UI.mail}</Svg></span>
        <div className="cpAskText">
          <h3>Need {c.name.toLowerCase()} activities for your class?</h3>
          <p>Tell us the lesson, the grade, and when you need it. We build what teachers ask for first.</p>
        </div>
        <a className="cpBtn cpBtnPrimary" href={suggest}>Tell us what you need</a>
      </section>

      <section className="cpSection">
        <div className="cpSectionHead">
          <span className="cpEyebrow">Keep browsing</span>
          <h2 className="cpH2">Other topics</h2>
        </div>
        <div className="cpMini">
          {others.map((o) => (
            <button key={o.slug} className="cpMiniCard" onClick={() => onOpen(o.slug)}>
              <Illustration kind={o.kind} className="cpMiniArt" />
              <span className="cpMiniText">
                <span className="cpMiniName">{o.name}</span>
                <span className="cpMiniSub">{gradeRange(o)}</span>
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
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("category");
      const a = bandByKey(p.get("grade"));
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
    <div className={`cpRoot ${ui.variable} ${display.variable}`}>
      <style>{CSS}</style>
      <div className="cpGlow" aria-hidden="true" />

      <Header onHome={goHome} onSearch={onSearch} onJump={onJump} />

      <main className={ready ? "cpMain cpReady" : "cpMain"}>
        {active ? (
          <CategoryPage key={active.slug} c={active} onHome={goHome} onOpen={openCategory} />
        ) : (
          <LibraryHome query={query} onQuery={setQuery} band={band} onBand={chooseBand} onOpen={openCategory} />
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
.cpRoot{
  --chestnut:#8a5d3b;--chestnut-deep:#6f4327;--gold:#c8943a;--gold-hi:#d9a84e;--tint:#f8ecd3;--ink:#2b211a;--sub:#6a5d52;--mute:#9a8c7f;--ivory:#fffdf9;--cream:#faf3e7;--line:rgba(111,67,39,.13);--line-strong:rgba(200,148,58,.42);
  --r-sm:12px;--r-md:20px;--r-lg:28px;
  --sh-1:0 1px 2px rgba(74,43,22,.06),0 8px 20px rgba(74,43,22,.06);
  --sh-2:0 2px 4px rgba(74,43,22,.05),0 22px 48px rgba(74,43,22,.11);
  --sh-3:0 4px 8px rgba(74,43,22,.06),0 40px 80px rgba(74,43,22,.16);
  --ui:var(--cp-ui),-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--serif:var(--cp-display),Georgia,"Times New Roman",serif;
  position:relative;min-height:100svh;display:flex;flex-direction:column;overflow-x:hidden;font-family:var(--ui);font-size:16px;color:var(--ink);background:linear-gradient(180deg,#fffdf9 0%,#fdf8ef 55%,#fbf4e8 100%);-webkit-font-smoothing:antialiased;
}
.cpRoot *{box-sizing:border-box;}
.cpRoot :where(button){font-family:inherit;color:inherit;}
.cpRoot :where(a){color:inherit;}
.cpRoot :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:12px;}
.cpRoot kbd{font-family:var(--ui);}
.cpGlow{position:absolute;top:-420px;left:50%;width:1100px;height:1100px;transform:translateX(-50%);border-radius:999px;pointer-events:none;background:radial-gradient(circle,rgba(200,148,58,.16),rgba(200,148,58,.045) 45%,transparent 70%);}

/* Header */
.cpHead{position:sticky;top:0;z-index:50;background:rgba(255,253,249,.9);backdrop-filter:saturate(1.3) blur(14px);-webkit-backdrop-filter:saturate(1.3) blur(14px);border-bottom:1px solid transparent;transition:border-color 200ms ease,box-shadow 200ms ease;}
.cpHeadOn{border-bottom-color:var(--line);box-shadow:0 8px 28px rgba(46,29,16,.06);}
.cpBar{max-width:1320px;height:76px;margin:0 auto;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;gap:32px;}
.cpBrand{display:flex;align-items:center;padding:0;border:none;background:none;cursor:pointer;flex:0 0 auto;}
.cpLogo{height:54px;width:auto;display:block;}
.cpNav{display:flex;align-items:center;gap:2px;}
.cpLink{display:inline-flex;align-items:center;height:40px;padding:0 14px;border:none;border-radius:999px;background:transparent;cursor:pointer;font-size:15px;font-weight:600;color:#5b4535;text-decoration:none;white-space:nowrap;transition:background 150ms ease,color 150ms ease;}
.cpLink:hover{background:var(--tint);color:var(--ink);}
.cpActions{margin-left:auto;display:flex;align-items:center;gap:10px;}
.cpSearchPill{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 10px 0 16px;min-width:230px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:550;color:var(--mute);transition:border-color 150ms ease,box-shadow 150ms ease;}
.cpSearchPill:hover{border-color:var(--line-strong);box-shadow:0 0 0 4px rgba(200,148,58,.1);}
.cpSearchPill span{flex:1;text-align:left;}
.cpSearchPillIcon{width:18px;height:18px;color:var(--chestnut);}
.cpSearchPill kbd{min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:6px;background:var(--cream);font-size:12px;font-weight:600;color:var(--mute);}
.cpBurger{display:none;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;}
.cpBurger svg{width:21px;height:21px;}
.cpSheet{display:none;}

/* Buttons */
.cpBtn{display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 28px;border-radius:999px;font-size:15px;font-weight:650;text-decoration:none;cursor:pointer;white-space:nowrap;transition:transform 150ms ease,box-shadow 150ms ease;}
.cpBtnPrimary{border:none;background:linear-gradient(180deg,var(--gold-hi),var(--gold));color:#2e1f12!important;box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 24px rgba(168,116,37,.26);}
.cpBtnPrimary:hover{transform:translateY(-1px);box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 14px 30px rgba(168,116,37,.34);}
.cpTextBtn{margin-top:14px;border:none;background:none;cursor:pointer;font-size:14.5px;font-weight:650;color:var(--chestnut);text-decoration:underline;}

/* Layout */
.cpMain{position:relative;z-index:1;flex:1;width:100%;max-width:1320px;margin:0 auto;padding:0 clamp(16px,3vw,40px) 96px;}
.cpReady{animation:cpFade 320ms ease;}
@keyframes cpFade{from{opacity:0;}to{opacity:1;}}
.cpEyebrow{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpH2{margin:0;font-family:var(--serif);font-size:clamp(32px,3.2vw,44px);font-weight:600;line-height:1.05;color:var(--ink);}
.cpH2 em{font-style:italic;font-weight:500;color:var(--chestnut);}

/* Intro */
.cpIntro{position:relative;padding:68px 0 22px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(430px,.92fr);gap:clamp(48px,6vw,92px);align-items:center;}
.cpIntro::before{content:"";position:absolute;left:-120px;top:20px;width:440px;height:440px;border-radius:999px;background:radial-gradient(circle,rgba(200,148,58,.11),rgba(200,148,58,.035) 46%,transparent 70%);filter:blur(2px);pointer-events:none;}
.cpIntroCopy{position:relative;z-index:1;max-width:720px;}
.cpWelcome{display:inline-flex;align-items:center;gap:10px;padding:8px 13px 8px 10px;border:1px solid rgba(200,148,58,.36);border-radius:999px;background:rgba(255,255,255,.68);box-shadow:0 1px 0 rgba(255,255,255,.9) inset;font-size:11.5px;font-weight:750;letter-spacing:.11em;text-transform:uppercase;color:var(--chestnut-deep);}
.cpWelcomeCross{width:27px;height:27px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:linear-gradient(180deg,#dfb35c,#c8943a);box-shadow:0 5px 14px rgba(168,116,37,.2);font-family:Georgia,serif;font-size:15px;line-height:1;color:#3b2817;}
.cpH1{margin:25px 0 0;max-width:760px;font-family:var(--serif);font-weight:600;font-size:clamp(48px,5.6vw,78px);line-height:.94;letter-spacing:-.035em;color:var(--ink);text-wrap:balance;}
.cpH1 em{position:relative;font-style:italic;font-weight:500;color:var(--chestnut);white-space:nowrap;}
.cpH1 em::after{content:"";position:absolute;left:3%;right:0;bottom:-7px;height:7px;border-bottom:2px solid rgba(200,148,58,.55);border-radius:50%;transform:rotate(-1deg);}
.cpLead{margin:24px 0 0;max-width:660px;font-size:clamp(16.5px,1.35vw,19px);line-height:1.7;color:var(--sub);text-wrap:pretty;}

.cpPromises{margin:30px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;}
.cpPromises li{min-width:0;display:flex;align-items:center;gap:11px;padding:13px 12px 13px 0;border-top:1px solid rgba(111,67,39,.13);}
.cpPromiseIcon{width:34px;height:34px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(248,236,211,.72);color:var(--chestnut);}
.cpPromiseIcon svg{width:17px;height:17px;}
.cpPromises li>span:last-child{display:flex;flex-direction:column;gap:2px;min-width:0;}
.cpPromises b{font-size:13.5px;font-weight:750;color:var(--ink);}
.cpPromises small{font-size:11.5px;line-height:1.35;color:var(--mute);}

.cpFinderWrap{position:relative;}
.cpFinderWrap::before{content:"";position:absolute;inset:24px -20px -20px 30px;border-radius:36px;background:linear-gradient(135deg,rgba(200,148,58,.16),rgba(138,93,59,.055));filter:blur(.2px);transform:rotate(1.2deg);}
.cpFinder{position:relative;width:100%;margin:0;padding:28px;border:1px solid rgba(111,67,39,.14);border-radius:30px;background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(255,252,246,.97));box-shadow:0 2px 4px rgba(74,43,22,.035),0 24px 56px rgba(74,43,22,.11),0 1px 0 #fff inset;overflow:hidden;}
.cpFinder::before{content:"";position:absolute;right:-84px;top:-88px;width:230px;height:230px;border-radius:999px;background:radial-gradient(circle,rgba(217,168,78,.19),rgba(217,168,78,0) 68%);pointer-events:none;}
.cpFinderTop{position:relative;z-index:1;margin-bottom:22px;}
.cpFinderEyebrow{display:block;font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpFinderTitle{margin:8px 0 0;font-family:var(--serif);font-size:32px;font-weight:600;line-height:1.02;letter-spacing:-.01em;color:var(--ink);}
.cpFinderSub{margin:8px 0 0;max-width:420px;font-size:13.5px;line-height:1.55;color:var(--sub);}
.cpFinderSearch{position:relative;display:flex;align-items:center;}
.cpFinderIcon{position:absolute;left:17px;width:20px;height:20px;color:var(--chestnut);pointer-events:none;z-index:2;}
.cpFinderSearch input{width:100%;height:58px;padding:0 50px 0 50px;border:1px solid rgba(111,67,39,.14);border-radius:17px;background:#fff;color:var(--ink);font-family:var(--ui);font-size:15.5px;outline:none;box-shadow:0 7px 20px rgba(74,43,22,.055);transition:border-color 150ms ease,box-shadow 150ms ease,transform 150ms ease;}
.cpFinderSearch input::placeholder{color:#9c8f83;}
.cpFinderSearch input:focus{border-color:rgba(200,148,58,.7);box-shadow:0 0 0 4px rgba(200,148,58,.11),0 12px 26px rgba(74,43,22,.07);}
.cpFinderKey{position:absolute;right:16px;width:27px;height:27px;display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:8px;background:var(--cream);font-size:12px;font-weight:700;color:var(--mute);pointer-events:none;}
.cpFinderDivider{height:1px;margin:20px 0 17px;background:linear-gradient(90deg,var(--line),rgba(111,67,39,.035));}
.cpFinderGrades{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:0;}
.cpFinderLabel{margin:0;font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);}
.cpGradePills{display:flex;flex-wrap:wrap;gap:7px;}
.cpPill{height:37px;padding:0 15px;border:1px solid rgba(111,67,39,.13);border-radius:999px;background:rgba(255,255,255,.82);cursor:pointer;font-size:13px;font-weight:700;color:#5b4535;transition:transform 150ms ease,background 150ms ease,border-color 150ms ease,color 150ms ease,box-shadow 150ms ease;}
.cpPill:hover{transform:translateY(-1px);border-color:rgba(200,148,58,.5);background:#fffaf1;}
.cpPillOn,.cpPillOn:hover{background:var(--ink);border-color:var(--ink);color:#fff8ec;box-shadow:0 7px 16px rgba(43,33,26,.13);}
.cpFinderNote{position:relative;margin:15px 0 0;text-align:center;font-size:11.5px;font-weight:600;color:var(--mute);}
.cpFinderNote span{margin-right:6px;color:var(--gold);}

/* Topics */
.cpTopics{margin-top:84px;scroll-margin-top:96px;}
.cpTopicsHead{margin-bottom:26px;}
.cpTopicsIntro{max-width:760px;}
.cpSectionEyebrow{display:block;margin-bottom:12px;font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);}
.cpTopicsLead{margin:14px 0 0;max-width:690px;font-size:16px;line-height:1.7;color:var(--sub);text-wrap:pretty;}

.cpChurchYear{margin:30px 0 28px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:17px 18px 17px 20px;border-top:1px solid rgba(111,67,39,.12);border-bottom:1px solid rgba(111,67,39,.12);background:linear-gradient(90deg,rgba(255,255,255,.5),rgba(248,236,211,.24),rgba(255,255,255,.38));}
.cpChurchYearLead{display:flex;align-items:center;gap:12px;min-width:260px;}
.cpChurchYearMark{width:34px;height:34px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;border:1px solid rgba(200,148,58,.3);border-radius:999px;background:#fffaf0;color:var(--gold);font-size:13px;box-shadow:0 7px 18px rgba(74,43,22,.06);}
.cpChurchYearLead>span:last-child{display:flex;flex-direction:column;gap:2px;}
.cpChurchYearLead small{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}
.cpChurchYearLead b{font-family:var(--serif);font-size:17px;font-weight:600;color:var(--ink);}
.cpComing{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:7px;}
.cpComingChip{height:35px;padding:0 13px;border:1px solid rgba(111,67,39,.12);border-radius:999px;background:rgba(255,255,255,.82);cursor:pointer;font-size:12.5px;font-weight:650;color:var(--chestnut-deep);box-shadow:0 2px 8px rgba(74,43,22,.035);transition:transform 160ms ease,border-color 160ms ease,background 160ms ease,box-shadow 160ms ease;}
.cpComingChip:hover{transform:translateY(-1px);border-color:rgba(200,148,58,.45);background:#fffaf0;box-shadow:0 6px 14px rgba(74,43,22,.07);}

.cpEditorialGrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;align-items:stretch;}

/* Editorial collection cards */
.cpCat{--collection:#c8943a;--collection-soft:rgba(200,148,58,.12);position:relative;grid-column:span 4;min-width:0;display:flex;flex-direction:column;padding:0;border:1px solid rgba(95,62,41,.12);border-radius:28px;background:linear-gradient(180deg,#fffefb 0%,#fffaf2 100%);cursor:pointer;text-align:left;overflow:hidden;box-shadow:0 1px 2px rgba(74,43,22,.035),0 12px 34px rgba(74,43,22,.065);transition:transform 320ms cubic-bezier(.2,.8,.2,1),box-shadow 320ms ease,border-color 320ms ease;}
.cpCat::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;z-index:5;background:linear-gradient(90deg,transparent,var(--collection),transparent);opacity:.48;}
.cpCat:hover{transform:translateY(-6px);border-color:rgba(200,148,58,.36);box-shadow:0 3px 8px rgba(74,43,22,.055),0 28px 58px rgba(74,43,22,.13);}
.cpCat--saints{--collection:#c8943a;--collection-soft:rgba(200,148,58,.13);}
.cpCat--bible{--collection:#7c8b69;--collection-soft:rgba(124,139,105,.12);}
.cpCat--mass{--collection:#9e896d;--collection-soft:rgba(158,137,109,.11);}
.cpCat--sacraments{--collection:#6f91a0;--collection-soft:rgba(111,145,160,.12);}
.cpCat--prayers{--collection:#8a5d3b;--collection-soft:rgba(138,93,59,.1);}
.cpCat--seasons{--collection:#7b6788;--collection-soft:rgba(123,103,136,.11);}
.cpCat--rosary{--collection:#718b9b;--collection-soft:rgba(113,139,155,.12);}
.cpCat--virtues{--collection:#9a6b5f;--collection-soft:rgba(154,107,95,.11);}

.cpCatVisual{position:relative;height:235px;display:block;overflow:hidden;border-bottom:1px solid rgba(95,62,41,.09);background:radial-gradient(100% 90% at 70% 6%,rgba(255,255,255,.96),transparent 48%),linear-gradient(145deg,#fbf5e9 0%,#f4ead8 100%);}
.cpCatVisual::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,var(--collection-soft),transparent 48%);pointer-events:none;}
.cpCatVisual::after{content:"✠";position:absolute;right:18px;top:14px;font-family:var(--serif);font-size:26px;color:var(--collection);opacity:.11;}
.cpArtSvg{position:absolute;left:50%;bottom:-11px;width:112%;height:auto;max-width:500px;transform:translateX(-50%);overflow:visible;filter:drop-shadow(0 18px 22px rgba(74,43,22,.11));}
.cpPreviewBackA,.cpPreviewBackB,.cpPreviewFront,.cpPreviewMini,.cpPreviewPencil{transform-origin:260px 300px;transition:transform 460ms cubic-bezier(.2,.8,.2,1);}
.cpPreviewBackA{transform:rotate(5deg) translate(3px,1px);}
.cpPreviewBackB{transform:rotate(-5deg) translate(-3px,1px);}
.cpPreviewMini{transform:rotate(3deg);}
.cpCat:hover .cpPreviewBackA{transform:rotate(8deg) translate(12px,-4px);}
.cpCat:hover .cpPreviewBackB{transform:rotate(-8deg) translate(-11px,-5px);}
.cpCat:hover .cpPreviewFront{transform:translateY(-8px) rotate(-.7deg);}
.cpCat:hover .cpPreviewMini{transform:translate(9px,-8px) rotate(5deg);}
.cpCat:hover .cpPreviewPencil{transform:translate(6px,-8px) rotate(-2deg);}

.cpCatContent{display:flex;flex-direction:column;flex:1;padding:24px 24px 22px;}
.cpCatOverline{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--collection);}
.cpCatGrade{color:var(--mute);letter-spacing:.06em;white-space:nowrap;}
.cpCatName{display:block;font-family:var(--serif);font-size:31px;font-weight:600;line-height:1;letter-spacing:-.015em;color:var(--ink);}
.cpCatDesc{display:block;margin-top:11px;font-size:14.5px;line-height:1.58;color:var(--sub);}
.cpTopicList{display:flex;flex-wrap:wrap;gap:6px 0;margin-top:17px;color:#604d3f;}
.cpTopicList span{display:inline-flex;align-items:center;font-size:12.5px;font-weight:650;line-height:1.35;}
.cpTopicList span:not(:last-child)::after{content:"•";margin:0 8px;color:var(--collection);opacity:.75;}
.cpCatBottom{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-top:auto;padding-top:22px;}
.cpFormatText{font-size:10.5px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);}
.cpExplore{display:inline-flex;align-items:center;justify-content:flex-end;gap:8px;font-size:13px;font-weight:750;color:var(--chestnut-deep);white-space:nowrap;}
.cpExplore svg{width:17px;height:17px;color:var(--collection);transition:transform 200ms ease;}
.cpCat:hover .cpExplore svg{transform:translateX(4px);}

.cpCatFeatured{grid-column:span 6;min-height:380px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);background:linear-gradient(135deg,#fffefb 0%,#fffaf2 70%,#f9efdd 100%);}
.cpCatFeatured .cpCatVisual{order:2;height:auto;min-height:380px;border-bottom:none;border-left:1px solid rgba(95,62,41,.09);background:radial-gradient(110% 90% at 65% 22%,#fff 0%,#fbf5e8 46%,#f2e4ce 100%);}
.cpCatFeatured .cpArtSvg{width:124%;max-width:610px;bottom:10px;}
.cpCatFeatured .cpCatContent{order:1;padding:34px 30px 30px;justify-content:center;}
.cpCatFeatured .cpCatOverline{margin-bottom:18px;}
.cpCatFeatured .cpCatName{font-size:clamp(38px,3.1vw,50px);}
.cpCatFeatured .cpCatDesc{margin-top:15px;font-size:15.5px;line-height:1.65;}
.cpCatFeatured .cpTopicList{margin-top:22px;}
.cpCatFeatured .cpCatBottom{padding-top:28px;}
.cpCatFeatured .cpExplore{font-size:13.5px;}

.cpEditorialGridFiltered .cpCat{grid-column:span 4;}
.cpEditorialGridFiltered .cpCatFeatured{grid-column:span 4;display:flex;min-height:0;}
.cpEditorialGridFiltered .cpCatFeatured .cpCatVisual{order:initial;height:235px;min-height:0;border-left:none;border-bottom:1px solid rgba(95,62,41,.09);}
.cpEditorialGridFiltered .cpCatFeatured .cpCatContent{order:initial;padding:24px 24px 22px;}
.cpEditorialGridFiltered .cpCatFeatured .cpCatName{font-size:31px;}
.cpEditorialGridFiltered .cpCatFeatured .cpCatDesc{font-size:14.5px;}

.cpEmpty{margin:0 auto;max-width:560px;padding:52px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;color:var(--sub);border:1px solid var(--line);border-radius:var(--r-lg);background:rgba(255,255,255,.8);}
.cpEmptyMark{font-size:28px;color:var(--gold);}
.cpEmptyTitle{margin:10px 0 4px;font-family:var(--serif);font-size:32px;font-weight:600;color:var(--ink);}
.cpEmpty .cpBtn{margin-top:20px;}

/* Ask band */
.cpAsk{margin-top:64px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:26px;padding:30px 36px;border:1px solid var(--line-strong);border-radius:var(--r-lg);background:radial-gradient(90% 160% at 0% 0%,rgba(200,148,58,.2),transparent 62%),#fff8ea;}
.cpAskIcon{width:64px;height:64px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:#fff;color:var(--chestnut);box-shadow:inset 0 0 0 1px var(--line-strong),0 10px 22px rgba(168,116,37,.14);}
.cpAskIcon svg{width:29px;height:29px;}
.cpAskText h3{margin:0;font-family:var(--serif);font-size:30px;font-weight:600;line-height:1.05;color:var(--ink);}
.cpAskText p{margin:8px 0 0;max-width:560px;font-size:15.5px;line-height:1.6;color:var(--sub);}

/* Category page */
.cpBack{margin:30px 0 16px;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 20px 0 14px;border:1px solid var(--line);border-radius:999px;background:#fff;cursor:pointer;font-size:14.5px;font-weight:650;color:var(--chestnut-deep);}
.cpBack svg{width:16px;height:16px;}
.cpBack:hover{border-color:var(--line-strong);}
.cpHero{display:grid;grid-template-columns:340px 1fr;gap:48px;align-items:center;padding:36px 44px;border:1px solid var(--line-strong);border-radius:36px;background:linear-gradient(180deg,#fffefb,#fdf6e8);box-shadow:var(--sh-2);}
.cpHeroArt{position:relative;height:320px;border-radius:var(--r-lg);background:radial-gradient(120% 90% at 50% 0%,#fff6e0,#f6e7c8 70%,#f0dcb6);border:1px solid var(--line);overflow:hidden;}
.cpHeroArt::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(138,93,59,.14) 1px,transparent 1px);background-size:16px 16px;opacity:.5;}
.cpHeroSvg{position:absolute;left:50%;bottom:-10px;width:340px;height:255px;transform:translateX(-50%);overflow:visible;filter:drop-shadow(0 16px 24px rgba(74,43,22,.2));}
.cpHeroTitle{margin:8px 0 0;font-family:var(--serif);font-size:clamp(46px,5vw,72px);font-weight:600;line-height:.98;letter-spacing:-.02em;color:var(--ink);}
.cpHeroDesc{margin:14px 0 0;max-width:560px;font-size:17.5px;line-height:1.65;color:var(--sub);}
.cpSpecs{margin:22px 0 0;display:flex;flex-wrap:wrap;gap:14px 32px;}
.cpSpecs > div{display:flex;flex-direction:column;gap:6px;}
.cpSpecs span:first-child{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.cpSpecs b{font-family:var(--serif);font-size:24px;font-weight:600;color:var(--chestnut-deep);}
.cpVerse{margin:24px 0 0;padding:4px 0 4px 20px;border-left:3px solid var(--gold);}
.cpVerse p{margin:0;font-family:var(--serif);font-style:italic;font-size:24px;line-height:1.3;color:var(--ink);}
.cpVerse cite{display:block;margin-top:8px;font-style:normal;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}

.cpSection{margin-top:64px;}
.cpSectionHead{margin-bottom:24px;text-align:center;}
.cpSectionHead .cpH2{margin-top:8px;}
.cpTopicGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}
.cpTopicCard{display:flex;flex-direction:column;justify-content:space-between;gap:26px;min-height:150px;padding:24px 22px 20px;border:1px solid var(--line);border-radius:var(--r-md);background:#fff;box-shadow:var(--sh-1);}
.cpTopicName{font-family:var(--serif);font-size:26px;font-weight:600;line-height:1.08;color:var(--ink);}

.cpMini{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.cpMiniCard{position:relative;display:flex;align-items:center;gap:14px;padding:10px 16px 10px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:#fff;cursor:pointer;text-align:left;transition:transform 200ms ease,box-shadow 200ms ease,border-color 200ms ease;}
.cpMiniCard:hover{transform:translateY(-3px);border-color:var(--line-strong);box-shadow:var(--sh-2);}
.cpMiniArt{flex:0 0 auto;width:76px;height:62px;border-radius:14px;background:linear-gradient(180deg,#fff6e0,#f3e2bd);}
.cpMiniText{display:flex;flex-direction:column;flex:1;min-width:0;}
.cpMiniName{font-family:var(--serif);font-size:20px;font-weight:600;line-height:1.1;color:var(--ink);}
.cpMiniSub{margin-top:2px;font-size:12.5px;color:var(--mute);}
.cpMiniArrow{width:16px;height:16px;color:var(--gold);flex:0 0 auto;}

/* Footer */
.cpFoot{position:relative;z-index:1;border-top:1px solid var(--line);background:rgba(255,253,249,.8);}
.cpFootInner{max-width:760px;margin:0 auto;padding:40px clamp(16px,3vw,40px) 44px;text-align:center;}
.cpFootMark{font-size:20px;color:var(--gold);}
.cpFootText{margin:10px 0 0;font-family:var(--serif);font-size:22px;font-style:italic;color:var(--chestnut-deep);}
.cpFootFine{margin:12px 0 0;font-size:12.5px;line-height:1.65;color:var(--mute);}
.cpFootFine a{color:var(--chestnut)!important;text-decoration:none;}
.cpFootFine a:hover{text-decoration:underline;}

/* Responsive */
@media (max-width:1240px){
  .cpCat{grid-column:span 4;}
  .cpCatFeatured{grid-column:span 6;}
  .cpSearchPill{min-width:0;width:42px;padding:0;justify-content:center;}
  .cpSearchPill span,.cpSearchPill kbd{display:none;}
  .cpMini{grid-template-columns:repeat(3,minmax(0,1fr));}
}
@media (max-width:1040px){
  .cpCat,.cpEditorialGridFiltered .cpCat{grid-column:span 6;}
  .cpCatFeatured{grid-column:span 6;display:flex;min-height:0;}
  .cpCatFeatured .cpCatVisual{order:initial;height:250px;min-height:0;border-left:none;border-bottom:1px solid rgba(95,62,41,.09);}
  .cpCatFeatured .cpCatContent{order:initial;padding:24px 24px 22px;}
  .cpCatFeatured .cpCatName{font-size:32px;}
  .cpCatFeatured .cpCatDesc{font-size:14.5px;}
  .cpChurchYear{align-items:flex-start;flex-direction:column;}
  .cpComing{justify-content:flex-start;}
  .cpNav{display:none;}
  .cpIntro{grid-template-columns:1fr;gap:40px;padding-top:50px;}
  .cpIntroCopy{max-width:800px;}
  .cpH1{max-width:850px;}
  .cpLead{max-width:720px;}
  .cpFinderWrap{width:min(100%,760px);}
  .cpPromises{max-width:760px;}
  .cpBurger{display:inline-flex;}
  .cpBar{height:68px;}
  .cpLogo{height:46px;}
  .cpSheet{display:flex;flex-direction:column;padding:6px clamp(16px,3vw,40px) 16px;border-top:1px solid var(--line);background:var(--ivory);animation:cpFade 160ms ease;}
  .cpSheetRow{padding:14px 4px;border:none;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left;font-family:var(--serif);font-size:24px;font-weight:600;color:var(--ink);text-decoration:none;}
  .cpAsk{grid-template-columns:auto 1fr;}
  .cpAsk .cpBtn{grid-column:1 / -1;}
  .cpHero{grid-template-columns:1fr;gap:26px;padding:26px 24px 32px;text-align:center;}
  .cpHeroArt{height:280px;}
  .cpHeroDesc{margin-left:auto;margin-right:auto;}
  .cpSpecs{justify-content:center;}
  .cpSpecs .cpFormats{justify-content:center;}
  .cpVerse{text-align:left;}
  .cpTopicGrid,.cpMini{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:640px){
  .cpTopics{margin-top:66px;}
  .cpEditorialGrid{gap:16px;}
  .cpCat,.cpCatFeatured,.cpEditorialGridFiltered .cpCat{grid-column:1 / -1;}
  .cpCat{border-radius:24px;}
  .cpCatVisual,.cpCatFeatured .cpCatVisual{height:225px;}
  .cpCatContent,.cpCatFeatured .cpCatContent{padding:22px 20px 20px;}
  .cpCatName,.cpCatFeatured .cpCatName{font-size:30px;}
  .cpCatBottom{align-items:flex-start;flex-direction:column;gap:12px;padding-top:20px;}
  .cpChurchYear{margin-top:24px;padding:16px 0;background:transparent;}
  .cpComing{gap:6px;}
  .cpComingChip{height:34px;padding:0 11px;font-size:11.5px;}
  .cpIntro{padding-top:34px;gap:32px;}
  .cpWelcome{font-size:9.5px;letter-spacing:.08em;padding-right:10px;}
  .cpWelcomeCross{width:25px;height:25px;}
  .cpH1{margin-top:20px;font-size:clamp(43px,13vw,58px);line-height:.96;}
  .cpH1 em{white-space:normal;}
  .cpLead{margin-top:20px;font-size:16px;line-height:1.62;}
  .cpPromises{grid-template-columns:1fr;margin-top:24px;gap:0;}
  .cpPromises li{padding:12px 0;}
  .cpFinderWrap::before{inset:16px -8px -12px 12px;border-radius:28px;}
  .cpFinder{padding:22px 18px;border-radius:24px;}
  .cpFinderTitle{font-size:29px;}
  .cpFinderSearch input{height:54px;font-size:15px;padding-left:46px;}
  .cpFinderIcon{left:15px;width:18px;height:18px;}
  .cpFinderGrades{gap:9px;}
  .cpGradePills{gap:6px;}
  .cpPill{height:36px;padding:0 13px;font-size:12.5px;}
  .cpTopicsHead{flex-direction:column;align-items:flex-start;}
  .cpAsk{grid-template-columns:1fr;padding:26px 22px;}
  .cpAskText h3{font-size:27px;}
  .cpHeroArt{height:240px;}
  .cpHeroSvg{width:290px;height:218px;}
  .cpVerse p{font-size:21px;}
  .cpTopicGrid{grid-template-columns:1fr 1fr;gap:12px;}
  .cpTopicCard{min-height:130px;padding:20px 16px 16px;}
  .cpTopicName{font-size:21px;}
  .cpMini{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion:reduce){.cpRoot *{animation:none!important;transition:none!important;}}
`;
