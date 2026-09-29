"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Palette, Scissors, Sparkles, ArrowRight } from "lucide-react";

const cormorant = 'var(--font-cormorant), "Cormorant Garamond", Cormorant, serif';

const RESOURCE_ICONS = {
  worksheet: BookOpen,
  coloring: Palette,
  craft: Scissors,
  prayer: Sparkles,
};

const SAMPLE_SAINTS = [
  { slug: "st-francis-of-assisi", name: "St. Francis of Assisi", feast: "October 4", patronage: "Animals, ecology", tags: ["worksheet", "coloring", "craft"] },
  { slug: "st-therese-of-lisieux", name: "St. Thérèse of Lisieux", feast: "October 1", patronage: "Missionaries, florists", tags: ["worksheet", "coloring"] },
  { slug: "st-juan-diego", name: "St. Juan Diego", feast: "December 9", patronage: "Indigenous peoples", tags: ["worksheet", "coloring", "craft"] },
  { slug: "st-michael-the-archangel", name: "St. Michael the Archangel", feast: "September 29", patronage: "Protection, soldiers", tags: ["worksheet", "prayer"] },
  { slug: "st-joseph", name: "St. Joseph", feast: "March 19", patronage: "Workers, fathers", tags: ["worksheet", "coloring", "craft", "prayer"] },
  { slug: "our-lady-of-guadalupe", name: "Our Lady of Guadalupe", feast: "December 12", patronage: "The Americas", tags: ["worksheet", "coloring"] },
];

const TAGS = [
  { key: "worksheet", label: "Worksheets" },
  { key: "coloring", label: "Coloring pages" },
  { key: "craft", label: "Crafts" },
  { key: "prayer", label: "Prayers" },
];

export default function TeacherLanding({ saints = SAMPLE_SAINTS }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return saints.filter((s) => {
      const matchesTag = !activeTag || (s.tags || []).includes(activeTag);
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.patronage || "").toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [saints, query, activeTag]);

  const select = (slug) => router.push(`/saints/${slug}`);

  return (
    <section className="w-full bg-[#f5ede0] text-[#3d2410]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-10 text-center">
        <h1 className="leading-tight" style={{ fontFamily: cormorant, fontWeight: 700, fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
          Find a saint. Print in minutes.
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-[#3d2410]/75 max-w-2xl mx-auto">
          Free, vetted, catechism-cited worksheets, coloring pages, crafts, and prayers for your religious education classroom.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 relative max-w-2xl mx-auto">
          <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-[#3d2410]/50 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by saint, patronage, or resource"
            aria-label="Search saints and resources"
            className="w-full pl-14 pr-5 py-4 text-lg rounded-full bg-white border border-[#3d2410]/20 text-[#3d2410] placeholder-[#3d2410]/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d2410]/40 transition"
          />
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {TAGS.map((t) => {
            const on = activeTag === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTag(on ? null : t.key)}
                aria-pressed={on}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition
                  ${
                    on
                      ? "bg-[#3d2410] text-[#f5ede0] border-[#3d2410]"
                      : "bg-transparent text-[#3d2410]/80 border-[#3d2410]/25 hover:border-[#3d2410]/50"
                  }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {results.length === 0 ? (
          <div className="text-center py-16 text-[#3d2410]/60">
            <p className="text-xl" style={{ fontFamily: cormorant }}>No saints match that search yet.</p>
            <p className="mt-2">Try another name, or clear your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((s) => (
              <button
                key={s.slug}
                onClick={() => select(s.slug)}
                className="group text-left bg-white rounded-2xl border border-[#3d2410]/15 p-6 shadow-sm hover:shadow-md hover:border-[#3d2410]/35 transition flex flex-col"
              >
                <h3 className="text-2xl text-[#3d2410]" style={{ fontFamily: cormorant, fontWeight: 700 }}>
                  {s.name}
                </h3>
                <p className="mt-1 text-sm text-[#3d2410]/60">Feast · {s.feast}</p>
                {s.patronage && <p className="mt-1 text-sm text-[#3d2410]/70">Patron of {s.patronage}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(s.tags || []).map((t) => {
                    const Icon = RESOURCE_ICONS[t] || BookOpen;
                    return (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3d2410]/10 text-[#3d2410]/80 text-xs font-medium capitalize">
                        <Icon className="w-3.5 h-3.5" />
                        {t}
                      </span>
                    );
                  })}
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-[#3d2410] font-semibold text-sm">
                  Open resources
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
