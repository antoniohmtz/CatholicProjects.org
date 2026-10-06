import { ImageResponse } from "next/og";
import { SEO, type Lang } from "./seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

/* Load a Google Font subset for the glyphs we actually draw. Falls back to a
   system serif if the fetch fails, so the image never breaks the build. */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`,
    )).text(); // no browser UA on purpose: Google then serves TTF, which next/og can read (it can't read WOFF2)
    const m = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype|woff)'\)/);
    if (!m) return null;
    return await (await fetch(m[1])).arrayBuffer();
  } catch { return null; }
}

export async function renderOg(lang: Lang) {
  const s = SEO[lang];
  const text = `${s.ogTitle}${s.ogSub}CATHOLIC SAINT STORIES✠ A project of CatholicProjects.org Un proyecto de`;
  const [serif, serifItalic] = await Promise.all([
    googleFont("Cormorant Garamond", 600, text),
    googleFont("Cormorant Garamond", 500, text),
  ]);
  const fonts = [
    serif && { name: "Cormorant", data: serif, weight: 600 as const, style: "normal" as const },
    serifItalic && { name: "CormorantLight", data: serifItalic, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 500; style: "normal" }[];
  const ff = serif ? "Cormorant" : "Georgia, serif";
  const ffLight = serifItalic ? "CormorantLight" : "Georgia, serif";
  const [h1a, h1b] = s.ogTitle.split(". ");

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "64px 72px", background: "radial-gradient(120% 90% at 50% 110%, #2A1C0F 0%, #120D09 55%, #0B0806 100%)",
        color: "#F4ECDD", fontFamily: ff, position: "relative",
      }}>
        {/* dawn rays */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: "linear-gradient(90deg, transparent, #C9A356 30%, #E6C97F 50%, #C9A356 70%, transparent)" }} />
        <div style={{ position: "absolute", right: -120, top: -160, width: 560, height: 560, borderRadius: 9999, background: "radial-gradient(circle, rgba(201,163,86,.22) 0%, rgba(201,163,86,0) 65%)" }} />

        {/* kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: "0.28em", color: "#C9A356", textTransform: "uppercase" }}>
          <span style={{ fontSize: 26 }}>✠</span>
          <span>Catholic Saint Stories</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.01em" }}>{h1a}.</div>
          <div style={{ fontSize: 88, lineHeight: 1.02, fontWeight: 500, fontFamily: ffLight, color: "#E6C97F" }}>{h1b}</div>
          <div style={{ marginTop: 26, fontSize: 30, color: "rgba(244,236,221,.78)", letterSpacing: "0.02em" }}>{s.ogSub}</div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, color: "rgba(244,236,221,.6)", letterSpacing: "0.06em" }}>
          <span>{lang === "en" ? "A project of CatholicProjects.org" : "Un proyecto de CatholicProjects.org"}</span>
          <span style={{ color: "#C9A356" }}>app.catholicprojects.org</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
