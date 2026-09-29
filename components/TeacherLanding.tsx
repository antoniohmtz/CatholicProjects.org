"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./TeacherLanding.module.css";

type Saint = {
  slug: string;
  name: string;
  feast: string;
  patronage?: string;
  tags?: string[];
};

const SAMPLE_SAINTS: Saint[] = [
  { slug: "st-francis-of-assisi", name: "St. Francis of Assisi", feast: "October 4", patronage: "animals, ecology", tags: ["worksheet", "coloring", "craft"] },
  { slug: "st-therese-of-lisieux", name: "St. Thérèse of Lisieux", feast: "October 1", patronage: "missionaries, florists", tags: ["worksheet", "coloring"] },
  { slug: "st-juan-diego", name: "St. Juan Diego", feast: "December 9", patronage: "indigenous peoples", tags: ["worksheet", "coloring", "craft"] },
  { slug: "st-michael-the-archangel", name: "St. Michael the Archangel", feast: "September 29", patronage: "protection, soldiers", tags: ["worksheet", "prayer"] },
  { slug: "st-joseph", name: "St. Joseph", feast: "March 19", patronage: "workers, fathers", tags: ["worksheet", "coloring", "craft", "prayer"] },
  { slug: "our-lady-of-guadalupe", name: "Our Lady of Guadalupe", feast: "December 12", patronage: "the Americas", tags: ["worksheet", "coloring"] },
];

const TAGS = [
  { key: "worksheet", label: "Worksheets" },
  { key: "coloring", label: "Coloring pages" },
  { key: "craft", label: "Crafts" },
  { key: "prayer", label: "Prayers" },
];

export default function TeacherLanding({ saints = SAMPLE_SAINTS }: { saints?: Saint[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.hero}>
        <h1 className={styles.title}>
          Find a saint. <span>Print in minutes.</span>
        </h1>
        <p className={styles.lead}>
          Free, source-linked worksheets, coloring pages, activities, and prayers — built from the sources for parents, parishes, catechists, and educators.
        </p>

        <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()} role="search">
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by saint, patronage, or resource"
            aria-label="Search saints and resources"
            className={styles.searchInput}
            autoComplete="off"
          />
        </form>

        <div className={styles.chips}>
          {TAGS.map((t) => {
            const on = activeTag === t.key;
            return (
              <button key={t.key} type="button" onClick={() => setActiveTag(on ? null : t.key)} aria-pressed={on} className={on ? `${styles.chip} ${styles.chipOn}` : styles.chip}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.results}>
        {results.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No saints match that search yet.</p>
            <p>Try another name, or clear your filters.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {results.map((s) => (
              <button key={s.slug} type="button" className={styles.card} onClick={() => router.push(`/saints/${s.slug}`)}>
                <h2 className={styles.cardName}>{s.name}</h2>
                <p className={styles.cardMeta}>
                  Feast · {s.feast}
                  {s.patronage ? ` · Patron of ${s.patronage}` : ""}
                </p>
                <div className={styles.tagRow}>
                  {(s.tags || []).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
                <span className={styles.cardCta}>
                  Open resources <i aria-hidden="true">→</i>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
