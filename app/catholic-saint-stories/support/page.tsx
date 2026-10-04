"use client";

import { useEffect, useState } from "react";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cst-ui", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--cst-serif",
  display: "swap",
});

/* -----------------------------------------------------------
   Catholic Saint Stories — Support  (v8 · bilingual · cinematic)

   Language: EN / ES toggle in the top bar. Auto-detects Spanish
   browsers; `?lang=es` forces Spanish (use it from Spanish posts).

   Videos play from Facebook — nothing to upload.
   One image in /public/saint-stories/ (keep it < 2MB):
     banner.jpg   Facebook cover art (hero + story break)
------------------------------------------------------------ */

const A = "/saint-stories";
const ASSETS = { banner: `${A}/banner.jpg` };
/* CatholicProjects logo. If it's a dark logo on transparent, the CSS
   turns it white for the dark page. For a multi-color logo, export a
   light version to /public/saint-stories/cp-logo-light.png and use that. */
const CP_LOGO = "https://app.catholicprojects.org/brand/catholicprojects-logo.png";

const CONTACT = "team@catholicprojects.org";
const STRIPE_LINK = "https://buy.stripe.com/your-stripe-link"; // TODO
const PAYPAL_LINK = "https://paypal.me/catholicsaintstories"; // TODO
const FACEBOOK_URL = "https://www.facebook.com/people/Catholicsaintstories/61592672761916/";
const INSTAGRAM_URL = "https://instagram.com/catholicsaintstories";

type Lang = "en" | "es";

/* ═══════════════════════ FILMS ═══════════════════════
   FEATURED (4): autoplaying players. Keep this at four — each one is
   a live Facebook player and more gets heavy.
   MORE: as many as you like — lightweight rows, no players.
   Stats are strings so you can write "56.1K", "1.2M", "—". Combine
   platforms however you count them (TODO: fill in real numbers). */
type Stats = { views: string; likes: string; shares: string };
type Film = { slug: string; title: string; lang: "English" | "Español"; logline: string; stats: Stats; ig: string; fb: string };

const FEATURED: Film[] = [
  {
    slug: "sebastian", title: "Saint Sebastian", lang: "English",
    logline: "A captain of the Emperor's guard who served another King — and would not deny Him, even under the arrows.",
    stats: { views: "", likes: "", shares: "" }, // TODO: real numbers
    ig: INSTAGRAM_URL, // TODO: direct Instagram reel link
    fb: "https://fb.watch/v/79fkexHl-/",
  },
  {
    slug: "sheen", title: "Blessed Fulton Sheen", lang: "English",
    logline: "A bishop, a chalkboard, and a television camera — and thirty million people listening.",
    stats: { views: "19.5K", likes: "—", shares: "—" },
    ig: "https://www.instagram.com/reel/DduZyldBW9M/", fb: "https://fb.watch/v/6tDwOkXld/",
  },
  {
    slug: "alacoque", title: "Santa Margarita María de Alacoque", lang: "Español",
    logline: "Jesús le mostró Su Corazón ardiendo de amor — y le confió una misión para toda la Iglesia.",
    stats: { views: "31.7K", likes: "3.6K", shares: "418" },
    ig: "https://www.instagram.com/reel/Dd4tluZBbbc/", fb: "https://fb.watch/v/84XezVsW2/",
  },
  {
    slug: "gines", title: "San Ginés de Roma", lang: "Español",
    logline: "Un actor que se burlaba de los cristianos en escena — hasta que, a mitad de la obra, creyó.",
    stats: { views: "—", likes: "—", shares: "—" },
    ig: INSTAGRAM_URL, fb: "https://fb.watch/v/7WGZBbZ1Q/", // TODO: direct Instagram reel
  },
];

/* MORE: same video cards, second row. Add as many as you like —
   they load lazily as people scroll. Each needs a Facebook link. */
const MORE: Film[] = [
  // Empty = the "More stories" row doesn't render. Uncomment to add a second row:
  // { slug: "vincent", title: "Saint Vincent de Paul", lang: "English", logline: "He wanted to rise above poverty — then God led him back to the poor.", stats: { views: "53.3K", likes: "3.5K", shares: "607" }, ig: INSTAGRAM_URL, fb: "https://www.facebook.com/reel/958525383998552" },
  // { slug: "damian-es", title: "San Damián de Molokai", lang: "Español", logline: "Eligió vivir con los enviados lejos por la lepra — sabiendo que quizá nunca volvería.", stats: { views: "56.1K", likes: "748", shares: "100" }, ig: "https://www.instagram.com/reel/DeAb99UBwNT/", fb: "https://www.facebook.com/reel/2563206477478130" },
];

/* Mission section plays this reel (no image needed). */
const MISSION_REEL: Film = {
  slug: "damian-es", title: "San Damián de Molokai", lang: "Español", logline: "",
  stats: { views: "", likes: "", shares: "" },
  ig: "https://www.instagram.com/reel/DeAb99UBwNT/", fb: "https://www.facebook.com/reel/2563206477478130",
};

/* ═══════════════════════ COPY ═══════════════════════ */
const COPY = {
  en: {
    langLabel: "ES",
    barLink: "CatholicProjects.org",
    barCta: "Support",
    kicker: "Real saints · True stories · Eternal inspiration",
    h1a: "Stories of the Saints.",
    h1b: "Made for a new generation.",
    heroSub: "Cinematic films about the men and women who gave their lives to Christ — martyrs, servants, mystics — told faithfully, released free, and carried to the feeds where the whole world now lives.",
    ctaPrimary: "Be part of the mission",
    ctaWatch: "Watch the stories",
    litany: [
      "St. Vincent de Paul, pray for us", "San Ginés de Roma, pray for us", "St. Damien of Molokai, pray for us",
      "St. Pier Giorgio Frassati, pray for us", "St. Carlo Acutis, pray for us", "St. Padre Pio, pray for us",
      "St. Anthony of Padua, pray for us", "St. Maximilian Kolbe, pray for us", "St. Thérèse of Lisieux, pray for us",
      "St. Margaret Mary Alacoque, pray for us", "Blessed Fulton Sheen, pray for us", "All you holy men and women, pray for us",
    ],
    band: [["435K", "monthly views"], ["14K", "followers"], ["102", "stories released"], ["EN · ES", "two languages"]],
    showingEyebrow: "Now showing",
    showingH2: "Stories people can't stop sharing",
    showingLede: "Every film is free to watch. These are the ones traveling furthest right now.",
    watch: "Watch on Instagram",
    watchFb: "Watch on Facebook",
    views: "views", likes: "likes", shares: "shares",
    moreH3: "More stories",
    seeAll: "All 102 stories, free, on Instagram & Facebook →",
    quote: "Verso l'alto — To the heights.",
    quoteBy: "St. Pier Giorgio Frassati",
    missionEyebrow: "Why we tell these stories",
    missionVerse: "Since we are surrounded by so great a cloud of witnesses…",
    missionVerseRef: "Hebrews 12:1",
    missionH2: "Lives that belonged to Christ",
    missionP1: "The Church has told the stories of her saints for two thousand years — in Scripture, in the liturgy, in every parish that bears a saint's name. We are not replacing that. We are carrying it into the feeds where this generation actually lives.",
    missionP2: "The saints were not Catholics in name only. They were martyrs who died for Christ. Servants who gave everything to the poor. Young people who chose heaven over comfort. Men and women who understood that their lives were not their own — they belonged to Christ — and lived like it. Vincent de Paul among the poor of Paris. Ginés, the actor who mocked the faith on stage until, mid-play, he believed. Damien, who chose the lepers of Molokai knowing he would die among them.",
    missionP3: "Every film has one purpose: that someone, somewhere, stops scrolling — meets a saint — and comes home. To their parish. To the sacraments. To Christ. And begins to believe what the Church has always taught: that they, too, are called to be saints.",
    missionCap: "San Damián de Molokai — from the film",
    saintsEyebrow: "Martyrs · Servants · Mystics · Saints",
    saintsH2: "A cloud of witnesses",
    saints: [
      ["St. Vincent de Paul", "Servant of the poor"],
      ["San Ginés de Roma", "Martyr · the actor who believed"],
      ["St. Damien of Molokai", "Apostle to the lepers"],
      ["St. Pier Giorgio Frassati", "Verso l'alto"],
      ["St. Carlo Acutis", "The Eucharist, his highway to heaven"],
      ["St. Padre Pio", "The stigmata, the confessional"],
      ["St. Anthony of Padua", "Hammer of heretics, finder of the lost"],
      ["St. Maximilian Kolbe", "Martyr of charity, Auschwitz"],
    ],
    prayForUs: "pray for us",
    sourcesEyebrow: "Faithful to the sources",
    sourcesH2: "How every story is researched",
    sourcesLede: "A saint's story is sacred. Before a single frame is made, each film is built from two tiers of Catholic sources — and nothing else.",
    tier1: "Tier 1 — Primary sources",
    tier1Text: "Sacred Scripture. The saint's own writings, letters, and diaries. The Church's official record: decrees and homilies of beatification and canonization, the Roman Martyrology, and documents of the Holy See.",
    tier2: "Tier 2 — Trusted Catholic scholarship",
    tier2Text: "Biographies by established Catholic authors and publishers, Butler's Lives of the Saints, the Catholic Encyclopedia, and the archives of the religious orders and dioceses that knew the saint.",
    notUsed: "Not used",
    notUsedText: "Unattested legends, anonymous posts, or anything that contradicts the teaching of the Church. Where sources differ, we say so — or leave it out.",
    ledgerEyebrow: "Where every dollar goes",
    ledgerH2: "What your support makes possible",
    ledgerLede: "Each story costs real money to make. Support goes to the work — no overhead, no middlemen.",
    ledger: [
      ["Research", "Weeks in Tier 1 and Tier 2 sources, so the saint is portrayed faithfully."],
      ["Script & production", "Cinematic visuals, careful writing, and editing worthy of the life being told."],
      ["Narration", "Voice performances that carry reverence, in every language we publish."],
      ["Translation & captions", "Every story crosses languages — subtitled, translated, accessible."],
      ["Distribution", "Published where people are — Instagram, Facebook, TikTok, YouTube — so each story travels as far as it can."],
    ],
    nextEyebrow: "What's next",
    nextH2: "Where the mission is going",
    next: [
      ["From 60 seconds to five minutes", "Our films today are a minute or less. Next: five-minute films that tell a saint's whole story — childhood, conversion, mission, death — with the care each life deserves."],
      ["Saint Stories for Kids", "Age-appropriate films for families, classrooms, and parish programs — so children meet the saints the way they meet everything else: with wonder."],
      ["More languages", "English and Spanish today. As support grows, the saints in more languages — so no one is left out because of the language they pray in."],
    ],
    cpEyebrow: "A project of CatholicProjects.org",
    cpH2: "Built to serve the Church — and always free",
    cpText: "Catholic Saint Stories is one of two projects at CatholicProjects.org. The other is a free library of Catholic worksheets, crafts, and saint activities for catechists, parishes, and families. Both exist for the same reason: to help people take one step closer to Christ and to the life of their parish.",
    cpLink: "Explore the free resource hub",
    supportEyebrow: "Be part of the mission",
    supportH2: "Help carry the saints to the world",
    supportLede: "You're not funding a channel. You're helping tell the stories of the saints to people who have never heard them — and pointing them home: to their parish, to the sacraments, to Christ. Every gift carries real impact. It becomes research, production, narration, translation — the next story, reaching the next person.",
    tiers: [
      ["Friend", "Keeps the research going."],
      ["Patron", "Helps carry a story through production."],
      ["Benefactor", "Funds narration and translation — in every language."],
      ["Founding Patron", "Sustains the whole slate, month after month."],
    ],
    featured: "Most common",
    perMo: "/mo",
    support: "Support",
    noPerks: "Support is a voluntary gift to the creator of this work. It earns our deep gratitude and our prayers — but no rewards, ownership, or exclusive access. The films remain free, for everyone, always.",
    giveOnce: "Give once",
    paypal: "PayPal",
    ask: "Questions? Write to us",
    fineH: "Transparency about your gift",
    fine: "CatholicProjects is not a tax-exempt charitable organization, and contributions are not tax-deductible. Your support is voluntary creator support — received as ordinary income, reported properly, and spent on the work described above. No contribution funds a specific film, and no outcome is promised beyond this: more stories of the saints, made well, released free.",
    notDeductible: "not tax-deductible",
    footLine: "All you holy men and women of God, pray for us.",
    footProject: "A project of",
    footFine: "CatholicProjects is an independent Catholic project and does not imply parish, diocesan, or ecclesial endorsement unless specifically stated.",
  },
  es: {
    langLabel: "EN",
    barLink: "CatholicProjects.org",
    barCta: "Apoyar",
    kicker: "Santos reales · Historias verdaderas · Inspiración eterna",
    h1a: "Historias de los Santos.",
    h1b: "Hechas para una nueva generación.",
    heroSub: "Películas cinematográficas sobre los hombres y mujeres que entregaron su vida a Cristo — mártires, siervos, místicos — contadas con fidelidad, publicadas gratis y llevadas a las redes donde hoy vive el mundo entero.",
    ctaPrimary: "Sé parte de la misión",
    ctaWatch: "Ver las historias",
    litany: [
      "San Vicente de Paúl, ruega por nosotros", "San Ginés de Roma, ruega por nosotros", "San Damián de Molokai, ruega por nosotros",
      "San Pier Giorgio Frassati, ruega por nosotros", "San Carlo Acutis, ruega por nosotros", "San Pío de Pietrelcina, ruega por nosotros",
      "San Antonio de Padua, ruega por nosotros", "San Maximiliano Kolbe, ruega por nosotros", "Santa Teresita de Lisieux, ruega por nosotros",
      "Santa Margarita María de Alacoque, ruega por nosotros", "Beato Fulton Sheen, ruega por nosotros", "Santos y santas de Dios, rueguen por nosotros",
    ],
    band: [["435K", "vistas al mes"], ["14K", "seguidores"], ["102", "historias publicadas"], ["ES · EN", "dos idiomas"]],
    showingEyebrow: "En cartelera",
    showingH2: "Historias que la gente no deja de compartir",
    showingLede: "Todas las películas son gratis. Estas son las que más lejos están llegando ahora.",
    watch: "Ver en Instagram",
    watchFb: "Ver en Facebook",
    views: "vistas", likes: "me gusta", shares: "compartidos",
    moreH3: "Más historias",
    seeAll: "Las 102 historias, gratis, en Instagram y Facebook →",
    quote: "Verso l'alto — Hacia lo alto.",
    quoteBy: "San Pier Giorgio Frassati",
    missionEyebrow: "Por qué contamos estas historias",
    missionVerse: "Teniendo en torno nuestro tan gran nube de testigos…",
    missionVerseRef: "Hebreos 12:1",
    missionH2: "Vidas que pertenecieron a Cristo",
    missionP1: "La Iglesia lleva dos mil años contando las historias de sus santos — en la Escritura, en la liturgia, en cada parroquia que lleva el nombre de un santo. No venimos a reemplazar eso. Venimos a llevarlo a las redes donde esta generación realmente vive.",
    missionP2: "Los santos no fueron católicos solo de nombre. Fueron mártires que murieron por Cristo. Siervos que lo dieron todo por los pobres. Jóvenes que eligieron el cielo antes que la comodidad. Hombres y mujeres que entendieron que su vida no era suya — pertenecía a Cristo — y vivieron así. Vicente de Paúl entre los pobres de París. Ginés, el actor que se burlaba de la fe en escena hasta que, a mitad de la obra, creyó. Damián, que eligió a los leprosos de Molokai sabiendo que moriría entre ellos.",
    missionP3: "Cada película tiene un solo propósito: que alguien, en algún lugar, deje de hacer scroll — conozca a un santo — y vuelva a casa. A su parroquia. A los sacramentos. A Cristo. Y empiece a creer lo que la Iglesia siempre ha enseñado: que él también está llamado a ser santo.",
    missionCap: "San Damián de Molokai — de la película",
    saintsEyebrow: "Mártires · Siervos · Místicos · Santos",
    saintsH2: "Una nube de testigos",
    saints: [
      ["San Vicente de Paúl", "Siervo de los pobres"],
      ["San Ginés de Roma", "Mártir · el actor que creyó"],
      ["San Damián de Molokai", "Apóstol de los leprosos"],
      ["San Pier Giorgio Frassati", "Verso l'alto"],
      ["San Carlo Acutis", "La Eucaristía, su autopista al cielo"],
      ["San Pío de Pietrelcina", "Los estigmas, el confesionario"],
      ["San Antonio de Padua", "Martillo de herejes, hallador de lo perdido"],
      ["San Maximiliano Kolbe", "Mártir de la caridad, Auschwitz"],
    ],
    prayForUs: "ruega por nosotros",
    sourcesEyebrow: "Fieles a las fuentes",
    sourcesH2: "Cómo se investiga cada historia",
    sourcesLede: "La historia de un santo es sagrada. Antes de crear un solo cuadro, cada película se construye con dos niveles de fuentes católicas — y nada más.",
    tier1: "Nivel 1 — Fuentes primarias",
    tier1Text: "La Sagrada Escritura. Los escritos, cartas y diarios del propio santo. El registro oficial de la Iglesia: decretos y homilías de beatificación y canonización, el Martirologio Romano y los documentos de la Santa Sede.",
    tier2: "Nivel 2 — Estudios católicos de confianza",
    tier2Text: "Biografías de autores y editoriales católicas reconocidas, las Vidas de los Santos de Butler, la Enciclopedia Católica y los archivos de las órdenes religiosas y diócesis que conocieron al santo.",
    notUsed: "No se usa",
    notUsedText: "Leyendas sin respaldo, publicaciones anónimas o cualquier cosa que contradiga la enseñanza de la Iglesia. Cuando las fuentes difieren, lo decimos — o lo dejamos fuera.",
    ledgerEyebrow: "A dónde va cada dólar",
    ledgerH2: "Lo que tu apoyo hace posible",
    ledgerLede: "Cada historia cuesta dinero real. El apoyo va al trabajo — sin gastos administrativos, sin intermediarios.",
    ledger: [
      ["Investigación", "Semanas en fuentes de Nivel 1 y 2, para retratar al santo con fidelidad."],
      ["Guion y producción", "Imágenes cinematográficas, escritura cuidada y edición a la altura de la vida que se cuenta."],
      ["Narración", "Voces que transmiten reverencia, en cada idioma que publicamos."],
      ["Traducción y subtítulos", "Cada historia cruza idiomas — subtitulada, traducida, accesible."],
      ["Distribución", "Publicadas donde está la gente — Instagram, Facebook, TikTok, YouTube — para que cada historia llegue lo más lejos posible."],
    ],
    nextEyebrow: "Lo que viene",
    nextH2: "Hacia dónde va la misión",
    next: [
      ["De 60 segundos a cinco minutos", "Hoy nuestras películas duran un minuto o menos. Lo próximo: películas de cinco minutos que cuenten la historia completa de un santo — infancia, conversión, misión, muerte — con el cuidado que cada vida merece."],
      ["Historias de Santos para Niños", "Películas adecuadas para familias, aulas y programas parroquiales — para que los niños conozcan a los santos como conocen todo lo demás: con asombro."],
      ["Más idiomas", "Hoy, español e inglés. Conforme crezca el apoyo, los santos en más idiomas — para que nadie quede fuera por el idioma en que reza."],
    ],
    cpEyebrow: "Un proyecto de CatholicProjects.org",
    cpH2: "Hecho para servir a la Iglesia — y siempre gratis",
    cpText: "Catholic Saint Stories es uno de los dos proyectos de CatholicProjects.org. El otro es una biblioteca gratuita de fichas, manualidades y actividades de santos para catequistas, parroquias y familias. Ambos existen por la misma razón: ayudar a las personas a dar un paso más hacia Cristo y hacia la vida de su parroquia.",
    cpLink: "Explorar los recursos gratuitos",
    supportEyebrow: "Sé parte de la misión",
    supportH2: "Ayuda a llevar a los santos al mundo",
    supportLede: "No estás financiando un canal. Estás ayudando a contar las historias de los santos a personas que nunca las han oído — y a orientarlas de vuelta a casa: a su parroquia, a los sacramentos, a Cristo. Cada aporte tiene un impacto real. Se convierte en investigación, producción, narración, traducción — la próxima historia, llegando a la próxima persona.",
    tiers: [
      ["Amigo", "Mantiene viva la investigación."],
      ["Patrono", "Ayuda a llevar una historia hasta su producción."],
      ["Benefactor", "Financia narración y traducción — en cada idioma."],
      ["Patrono fundador", "Sostiene toda la cartelera, mes tras mes."],
    ],
    featured: "El más elegido",
    perMo: "/mes",
    support: "Apoyar",
    noPerks: "El apoyo es un regalo voluntario al creador de esta obra. Recibe nuestra profunda gratitud y nuestras oraciones — pero no recompensas, propiedad ni acceso exclusivo. Las películas siguen siendo gratis, para todos, siempre.",
    giveOnce: "Donar una vez",
    paypal: "PayPal",
    ask: "¿Preguntas? Escríbenos",
    fineH: "Transparencia sobre tu aporte",
    fine: "CatholicProjects no es una organización benéfica exenta de impuestos, y los aportes no son deducibles de impuestos. Tu apoyo es apoyo voluntario a un creador — se recibe como ingreso ordinario, se declara correctamente y se destina al trabajo descrito arriba. Ningún aporte financia una película específica, y no se promete otro resultado que este: más historias de los santos, bien hechas, publicadas gratis.",
    notDeductible: "no son deducibles de impuestos",
    footLine: "Santos y santas de Dios, rueguen por nosotros.",
    footProject: "Un proyecto de",
    footFine: "CatholicProjects es un proyecto católico independiente y no implica respaldo parroquial, diocesano ni eclesial salvo que se indique expresamente.",
  },
} as const;

const TIER_AMOUNTS = [5, 15, 25, 50];

/* ═══════════════════════ HELPERS ═══════════════════════ */
function Svg({ children, sw = 1.6, className }: { children: ReactNode; sw?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const I = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  down: (<><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>),
  play: (<><polygon points="6 4 20 12 6 20 6 4" /></>),
  check: (<><path d="m5 12 4.5 4.5L19 7" /></>),
  x: (<><path d="M18 6 6 18M6 6l12 12" /></>),
};

function useLang(): [Lang, () => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("lang");
    let saved: string | null = null;
    try { saved = localStorage.getItem("cst-lang"); } catch {}
    const nav = (navigator.language || "").toLowerCase().startsWith("es");
    const pick = (q === "es" || q === "en") ? q : (saved === "es" || saved === "en") ? saved : nav ? "es" : "en";
    setLang(pick as Lang);
    document.documentElement.lang = pick;
  }, []);
  const toggle = () => {
    setLang((l) => {
      const n: Lang = l === "en" ? "es" : "en";
      try { localStorage.setItem("cst-lang", n); } catch {}
      const u = new URL(window.location.href); u.searchParams.set("lang", n);
      window.history.replaceState(null, "", u.toString());
      document.documentElement.lang = n;
      return n;
    });
  };
  return [lang, toggle];
}

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/* ── Facebook SDK: the documented route to muted autoplay ── */
declare global { interface Window { FB?: { XFBML: { parse: (el?: Element) => void } }; fbAsyncInit?: () => void } }

function useFacebookSdk() {
  useEffect(() => {
    if (window.FB) { window.FB.XFBML.parse(); return; }
    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div"); root.id = "fb-root"; document.body.prepend(root);
    }
    if (!document.getElementById("fb-sdk")) {
      const s = document.createElement("script");
      s.id = "fb-sdk"; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
      s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
      document.body.appendChild(s);
    }
  }, []);
}

const igId = (url: string) => url.match(/\/(?:reel|p)\/([^/?#]+)/)?.[1] ?? "";

/* Plays the Facebook reel (autoplay, muted) or, with no Facebook link, the Instagram embed. */
function Player({ film }: { film: Film }) {
  if (film.fb) {
    return (
      <div
        className="fb-video cst-fbVideo"
        data-href={film.fb}
        data-width="auto"
        data-autoplay="true"
        data-show-text="false"
        data-show-captions="false"
        data-allowfullscreen="true"
        data-lazy="true"
      />
    );
  }
  return (
    <iframe className="cst-posterFrame cst-igFrame" src={`https://www.instagram.com/reel/${igId(film.ig)}/embed/`} title={film.title}
      loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
  );
}

function FilmCard({ film, t, lang }: { film: Film; t: (typeof COPY)[Lang]; lang: Lang }) {
  return (
    <article className="cst-film" data-reveal>
      <div className="cst-poster">
        <Player film={film} />
        <span className="cst-lang">{film.lang}</span>
      </div>
      <div className="cst-filmBody">
        <h3 className="cst-filmTitle">{film.title}</h3>
        {film.logline && <p className="cst-filmLogline">{film.logline}</p>}
        <dl className="cst-stats">
          <div><dt>{film.stats.views || "—"}</dt><dd>{t.views}</dd></div>
          <div><dt>{film.stats.likes || "—"}</dt><dd>{t.likes}</dd></div>
          <div><dt>{film.stats.shares || "—"}</dt><dd>{t.shares}</dd></div>
        </dl>
        <a className="cst-filmWatch" href={film.ig || film.fb} target="_blank" rel="noopener noreferrer">
          {film.ig && film.ig !== INSTAGRAM_URL ? t.watch : t.watchFb} <Svg sw={2.2}>{I.arrow}</Svg>
        </a>
      </div>
    </article>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function SupportPage() {
  const [lang, toggleLang] = useLang();
  const t = COPY[lang];
  useReveal(lang);
  useFacebookSdk();

  return (
    <div className={`cst ${ui.variable} ${serif.variable}`}>
      <style>{CSS}</style>
      <div className="cst-grain" aria-hidden="true" />

      <header className="cst-bar">
        <a className="cst-mark" href="https://catholicprojects.org">
          <span className="cst-markTile"><img className="cst-markLogo" src={CP_LOGO} alt="CatholicProjects.org" /></span>
          <span className="cst-markDivider" aria-hidden="true" />
          <span className="cst-markText">Catholic Saint Stories</span>
        </a>
        <nav className="cst-barNav">
          <a className="cst-barLink" href="https://catholicprojects.org">{t.barLink}</a>
          <button className="cst-langBtn" onClick={toggleLang} aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}>
            <span className={lang === "en" ? "is-on" : ""}>EN</span><i /><span className={lang === "es" ? "is-on" : ""}>ES</span>
          </button>
          <a className="cst-barCta" href="#support">{t.barCta}</a>
        </nav>
      </header>

      <main>
        {/* ═══ HERO ═══ */}
        <section className="cst-hero">
          <div className="cst-heroArt" style={{ backgroundImage: `url(${ASSETS.banner})` }} aria-hidden="true" />
          <div className="cst-heroDawn" aria-hidden="true" />
          <div className="cst-heroRays" aria-hidden="true" />
          <div className="cst-heroShade" aria-hidden="true" />

          <div className="cst-heroInner">
            <p className="cst-kicker">{t.kicker}</p>
            <h1 className="cst-h1">{t.h1a}<em>{t.h1b}</em></h1>
            <p className="cst-heroSub">{t.heroSub}</p>
            <div className="cst-heroCtas">
              <a className="cst-cta" href="#support">{t.ctaPrimary} <Svg sw={2}>{I.arrow}</Svg></a>
              <a className="cst-ghost" href="#films"><Svg sw={2} className="cst-ghostIcon">{I.play}</Svg>{t.ctaWatch}</a>
            </div>
          </div>

          {/* Litany of the Saints — slow procession across the bottom of the hero */}
          <div className="cst-litany" aria-hidden="true">
            <div className="cst-litanyTrack">
              {[...t.litany, ...t.litany].map((line, i) => (
                <span key={i} className="cst-litanyItem"><i>✠</i>{line}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NUMBERS ═══ */}
        <dl className="cst-band" data-reveal>
          {t.band.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}
        </dl>

        {/* ═══ NOW SHOWING ═══ */}
        <section className="cst-section" id="films">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.showingEyebrow}</p>
            <h2 className="cst-h2">{t.showingH2}</h2>
            <p className="cst-lede">{t.showingLede}</p>
          </div>
          <div className="cst-films">
            {FEATURED.map((f) => <FilmCard key={f.slug} film={f} t={t} lang={lang} />)}
          </div>

          {MORE.length > 0 && (
            <div className="cst-more">
              <h3 className="cst-moreH3" data-reveal>{t.moreH3}</h3>
              <div className="cst-films">
                {MORE.map((f) => <FilmCard key={f.slug} film={f} t={t} lang={lang} />)}
              </div>
            </div>
          )}
          <p className="cst-seeAll" data-reveal><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{t.seeAll}</a></p>
        </section>

        {/* ═══ STORY BREAK ═══ */}
        <section className="cst-break" style={{ backgroundImage: `url(${ASSETS.banner})` }}>
          <div className="cst-breakShade" aria-hidden="true" />
          <figure className="cst-quote" data-reveal>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>{t.quoteBy}</figcaption>
          </figure>
        </section>

        {/* ═══ MISSION ═══ */}
        <section className="cst-section cst-mission">
          <div className="cst-missionStill" data-reveal>
            <div className="cst-missionFrame">
              <Player film={MISSION_REEL} />
            </div>
            <span className="cst-missionCap">{t.missionCap}</span>
          </div>
          <div className="cst-missionCopy" data-reveal>
            <p className="cst-eyebrow">{t.missionEyebrow}</p>
            <blockquote className="cst-verse">
              <p>“{t.missionVerse}”</p>
              <cite>{t.missionVerseRef}</cite>
            </blockquote>
            <h2 className="cst-h2">{t.missionH2}</h2>
            <p>{t.missionP1}</p>
            <p>{t.missionP2}</p>
            <p className="cst-missionCall">{t.missionP3}</p>
          </div>
        </section>

        {/* ═══ THE SAINTS ═══ */}
        <section className="cst-section">
          <div className="cst-head cst-headCenter" data-reveal>
            <p className="cst-eyebrow">{t.saintsEyebrow}</p>
            <h2 className="cst-h2">{t.saintsH2}</h2>
          </div>
          <ul className="cst-saintsGrid">
            {t.saints.map(([name, role]) => (
              <li key={name} className="cst-saintCard" data-reveal>
                <span className="cst-saintCardName">{name}</span>
                <span className="cst-saintCardRole">{role}</span>
                <span className="cst-saintPray">{t.prayForUs}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ═══ SOURCES ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.sourcesEyebrow}</p>
            <h2 className="cst-h2">{t.sourcesH2}</h2>
            <p className="cst-lede">{t.sourcesLede}</p>
          </div>
          <div className="cst-tiers2">
            <div className="cst-tierBox cst-tierBox1" data-reveal>
              <span className="cst-tierBoxN">I</span>
              <h3>{t.tier1}</h3>
              <p>{t.tier1Text}</p>
            </div>
            <div className="cst-tierBox cst-tierBox2" data-reveal>
              <span className="cst-tierBoxN">II</span>
              <h3>{t.tier2}</h3>
              <p>{t.tier2Text}</p>
            </div>
            <div className="cst-tierBox cst-tierBoxNo" data-reveal>
              <span className="cst-tierBoxN"><Svg sw={2}>{I.x}</Svg></span>
              <h3>{t.notUsed}</h3>
              <p>{t.notUsedText}</p>
            </div>
          </div>
        </section>

        {/* ═══ LEDGER ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.ledgerEyebrow}</p>
            <h2 className="cst-h2">{t.ledgerH2}</h2>
            <p className="cst-lede">{t.ledgerLede}</p>
          </div>
          <ol className="cst-ledger">
            {t.ledger.map(([title, text], i) => (
              <li key={title} className="cst-row" data-reveal>
                <span className="cst-rowN">{String(i + 1).padStart(2, "0")}</span>
                <span className="cst-rowTitle">{title}</span>
                <span className="cst-rowText">{text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ═══ WHAT'S NEXT ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.nextEyebrow}</p>
            <h2 className="cst-h2">{t.nextH2}</h2>
          </div>
          <div className="cst-next">
            {t.next.map(([title, text], i) => (
              <div key={title} className="cst-nextCard" data-reveal>
                <span className="cst-nextN">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CATHOLICPROJECTS ═══ */}
        <section className="cst-section">
          <div className="cst-cp" data-reveal>
            <div className="cst-cpLogoWrap">
              <img className="cst-cpLogo" src={CP_LOGO} alt="CatholicProjects.org" />
            </div>
            <div className="cst-cpBody">
              <p className="cst-eyebrow">{t.cpEyebrow}</p>
              <h2 className="cst-h2 cst-h2Small">{t.cpH2}</h2>
              <p className="cst-cpText">{t.cpText}</p>
              <a className="cst-cpLink" href="https://app.catholicprojects.org">{t.cpLink} <Svg sw={2.2}>{I.arrow}</Svg></a>
            </div>
          </div>
        </section>

        {/* ═══ SUPPORT ═══ */}
        <section className="cst-section cst-support" id="support">
          <div className="cst-head cst-headCenter cst-headWide" data-reveal>
            <p className="cst-eyebrow">{t.supportEyebrow}</p>
            <h2 className="cst-h2">{t.supportH2}</h2>
            <p className="cst-lede">{t.supportLede}</p>
          </div>
          <div className="cst-tiers">
            {t.tiers.map(([name, line], i) => (
              <a key={name} className={`cst-tier ${i === 1 ? "is-featured" : ""}`} href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" data-reveal>
                {i === 1 && <span className="cst-tierFlag">{t.featured}</span>}
                <span className="cst-tierName">{name}</span>
                <span className="cst-tierAmt"><sup>$</sup>{TIER_AMOUNTS[i]}<span className="cst-tierPer">{t.perMo}{i === 3 ? "+" : ""}</span></span>
                <span className="cst-tierLine">{line}</span>
                <span className="cst-tierGo">{t.support} <Svg sw={2.2}>{I.arrow}</Svg></span>
              </a>
            ))}
          </div>
          <p className="cst-noPerks" data-reveal>{t.noPerks}</p>
          <div className="cst-alt" data-reveal>
            <a className="cst-altBtn" href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">{t.giveOnce}</a>
            <a className="cst-altBtn" href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">{t.paypal}</a>
            <a className="cst-altBtn" href={`mailto:${CONTACT}`}>{t.ask}</a>
          </div>
          <div className="cst-fine" data-reveal>
            <h3>{t.fineH}</h3>
            <p>{t.fine.split(t.notDeductible).map((part, i, arr) => (
              <span key={i}>{part}{i < arr.length - 1 && <strong>{t.notDeductible}</strong>}</span>
            ))}</p>
          </div>
        </section>
      </main>

      <footer className="cst-foot">
        <img className="cst-footLogo" src={CP_LOGO} alt="CatholicProjects.org" />
        <p className="cst-footLine">{t.footLine}</p>
        <p className="cst-footMeta">{t.footProject} <a href="https://catholicprojects.org">CatholicProjects.org</a> · <a href={`mailto:${CONTACT}`}>{CONTACT}</a> · © {new Date().getFullYear()}</p>
        <p className="cst-footFine">{t.footFine}</p>
      </footer>
    </div>
  );
}

/* ═══════════════════════ STYLES ═══════════════════════ */
const CSS = `
.cst{
  --bg:#120D09;--bg2:#1A130D;--panel:#1F1710;--panel2:#261D14;
  --gold:#C9A356;--gold-bright:#E6C97F;--gold-dim:rgba(201,163,86,.4);
  --hair:rgba(201,163,86,.18);--hair-soft:rgba(243,234,218,.08);
  --text:#F4ECDD;--muted:#BBAB94;--faint:#8F8069;
  --tile:#D8CBB2; /* logo tile — warm parchment, tune darker/lighter here */
  --serif:var(--cst-serif),"Cormorant Garamond",Georgia,serif;
  --sans:var(--cst-ui),Inter,system-ui,sans-serif;
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:clip;
  background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;-webkit-font-smoothing:antialiased;
}
.cst,.cst *,.cst *::before,.cst *::after{box-sizing:border-box;}
.cst :where(a){color:inherit;text-decoration:none;}
.cst :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;}
.cst a:focus-visible,.cst button:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px;}
.cst ::selection{background:rgba(201,163,86,.3);}
.cst-grain{position:fixed;inset:0;z-index:40;pointer-events:none;opacity:.055;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");}
[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity 900ms cubic-bezier(.2,.65,.2,1),transform 900ms cubic-bezier(.2,.65,.2,1);}
[data-reveal].is-in{opacity:1;transform:none;}

/* bar */
.cst-bar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px clamp(20px,4vw,44px);
  background:rgba(18,13,9,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(201,163,86,.1);}
.cst-mark{display:inline-flex;align-items:center;gap:16px;}
/* Logo at its real colors on a small cream tile */
.cst-markTile{display:inline-flex;align-items:center;padding:3px 6px;border-radius:8px;background:var(--tile);box-shadow:0 6px 18px -8px rgba(0,0,0,.8),inset 0 0 0 1px rgba(201,163,86,.25);}
.cst-markLogo{height:40px;width:auto;display:block;}
.cst-markDivider{width:1px;height:22px;background:var(--hair);}
.cst-markText{font-family:var(--serif);font-weight:600;font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-bright);}
.cst-barNav{display:flex;align-items:center;gap:18px;}
.cst-barLink{color:var(--muted);font-size:13px;font-weight:600;transition:color 150ms;}
.cst-barLink:hover{color:var(--text);}
.cst-langBtn{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid var(--hair-soft);border-radius:999px;background:rgba(18,13,9,.4);backdrop-filter:blur(8px);font-size:11.5px;font-weight:800;letter-spacing:.12em;color:var(--faint);transition:border-color 150ms;}
.cst-langBtn:hover{border-color:var(--gold-dim);}
.cst-langBtn span.is-on{color:var(--gold-bright);}
.cst-langBtn i{width:1px;height:12px;background:var(--hair);}
.cst-barCta{padding:9px 18px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:background 160ms,color 160ms;}
.cst-barCta:hover{background:var(--gold);color:#17110A;}

/* hero — golden dawn */
.cst-hero{position:relative;min-height:min(92svh,860px);display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(180deg,#3A2A14 0%,#24190F 45%,var(--bg) 100%);}
.cst-heroArt{position:absolute;inset:-4%;z-index:0;background-size:cover;background-position:center 28%;filter:saturate(1.05) brightness(.95);animation:cst-kb 36s ease-in-out infinite alternate;}
@keyframes cst-kb{from{transform:scale(1)}to{transform:scale(1.07)}}
.cst-heroDawn{position:absolute;inset:0;z-index:1;mix-blend-mode:screen;animation:cst-breathe 9s ease-in-out infinite alternate;
  background:radial-gradient(55% 48% at 50% 0%,rgba(255,220,140,.55),rgba(230,180,90,.22) 40%,transparent 72%),radial-gradient(35% 30% at 50% 8%,rgba(255,240,200,.45),transparent 70%);}
@keyframes cst-breathe{from{opacity:.85}to{opacity:1}}
.cst-heroRays{position:absolute;inset:-20% 0 0;z-index:1;mix-blend-mode:screen;opacity:.35;pointer-events:none;
  background:conic-gradient(from 180deg at 50% 0%,transparent 0 8%,rgba(255,225,160,.18) 10%,transparent 12%,transparent 20%,rgba(255,225,160,.14) 22%,transparent 24%,transparent 30%,rgba(255,225,160,.2) 32%,transparent 34%,transparent 40%,rgba(255,225,160,.12) 42%,transparent 44%,transparent 56%,rgba(255,225,160,.12) 58%,transparent 60%,transparent 66%,rgba(255,225,160,.2) 68%,transparent 70%,transparent 76%,rgba(255,225,160,.14) 78%,transparent 80%,transparent 88%,rgba(255,225,160,.18) 90%,transparent 92%);
  -webkit-mask-image:radial-gradient(70% 90% at 50% 0%,#000 30%,transparent 100%);mask-image:radial-gradient(70% 90% at 50% 0%,#000 30%,transparent 100%);}
.cst-heroShade{position:absolute;inset:0;z-index:2;background:radial-gradient(60% 55% at 50% 60%,rgba(18,13,9,.35),rgba(18,13,9,.55) 100%),linear-gradient(180deg,rgba(18,13,9,.05) 0%,rgba(18,13,9,.2) 45%,rgba(18,13,9,.6) 80%,var(--bg) 100%);}
.cst-heroInner{position:relative;z-index:3;max-width:920px;padding:120px 20px 130px;text-align:center;}
.cst-kicker{margin:0 0 26px;color:var(--gold-bright);font-size:12px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;text-shadow:0 2px 24px rgba(0,0,0,.7);}
.cst-h1{margin:0 auto 24px;font-family:var(--serif);font-weight:600;font-size:clamp(3rem,7.6vw,5.8rem);line-height:1.02;letter-spacing:-.015em;color:#FBF4E6;text-shadow:0 2px 6px rgba(0,0,0,.35),0 10px 50px rgba(0,0,0,.7);}
.cst-h1 em{display:block;margin-top:10px;font-style:italic;font-weight:500;font-size:.56em;background:linear-gradient(100deg,#E6C97F 10%,#FFF0C8 45%,#E6C97F 90%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 14px rgba(0,0,0,.55));}
.cst-heroSub{margin:0 auto;max-width:60ch;color:#E9DEC8;font-size:clamp(1rem,1.5vw,1.15rem);line-height:1.75;text-shadow:0 2px 20px rgba(0,0,0,.8);}
.cst-heroCtas{margin:38px auto 0;display:flex;justify-content:center;flex-wrap:wrap;gap:14px;}
.cst-cta{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 26px;border-radius:999px;background:linear-gradient(135deg,#E6C97F,#C9A356 55%,#A8823C);color:#17110A;font-size:15px;font-weight:800;box-shadow:0 10px 36px -10px rgba(201,163,86,.6);transition:transform 160ms,box-shadow 160ms;}
.cst-cta:hover{transform:translateY(-2px);box-shadow:0 16px 44px -10px rgba(201,163,86,.7);}
.cst-cta svg{width:17px;height:17px;}
.cst-ghost{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 24px;border:1px solid rgba(243,234,218,.28);border-radius:999px;background:rgba(18,13,9,.35);backdrop-filter:blur(8px);font-size:15px;font-weight:700;transition:border-color 160ms,background 160ms;}
.cst-ghost:hover{border-color:var(--gold-dim);background:rgba(201,163,86,.12);}
.cst-ghostIcon{width:14px;height:14px;color:var(--gold-bright);}

/* litany procession */
.cst-litany{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:16px 0 18px;border-top:1px solid rgba(201,163,86,.14);background:linear-gradient(180deg,rgba(18,13,9,0),rgba(18,13,9,.6));overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
.cst-litanyTrack{display:flex;width:max-content;gap:0;animation:cst-litany 110s linear infinite;}
.cst-litanyItem{display:inline-flex;align-items:center;gap:14px;padding:0 28px;white-space:nowrap;font-family:var(--serif);font-style:italic;font-size:17px;color:rgba(230,201,127,.85);letter-spacing:.02em;}
.cst-litanyItem i{font-style:normal;font-size:11px;color:rgba(201,163,86,.6);}
@keyframes cst-litany{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cst-litany:hover .cst-litanyTrack{animation-play-state:paused;}

/* band */
.cst-band{width:min(840px,calc(100% - 40px));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--hair);}
.cst-band>div{padding:22px 10px;display:flex;flex-direction:column;gap:5px;text-align:center;}
.cst-band>div+div{border-left:1px solid var(--hair-soft);}
.cst-band dt{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(1.6rem,2.8vw,2.2rem);color:var(--gold-bright);line-height:1;}
.cst-band dd{margin:0;color:var(--faint);font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;}

/* sections */
.cst-section{width:min(1200px,calc(100% - 40px));margin:0 auto;padding:clamp(48px,7vh,80px) 0 0;scroll-margin-top:40px;}
.cst-head{max-width:680px;margin-bottom:clamp(24px,4vh,36px);}
.cst-headCenter{margin-left:auto;margin-right:auto;text-align:center;}
.cst-headWide{max-width:780px;}
.cst-eyebrow{margin:0 0 14px;color:var(--gold);font-size:11.5px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;}
.cst-h2{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(2.1rem,4.4vw,3.4rem);line-height:1.08;letter-spacing:-.01em;}
.cst-lede{margin:16px 0 0;color:var(--muted);font-size:16.5px;line-height:1.7;}

/* films */
.cst-films{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.cst-film{display:flex;flex-direction:column;border:1px solid var(--hair-soft);border-radius:20px;overflow:hidden;background:var(--panel);transition:transform 260ms ease,border-color 260ms,box-shadow 260ms;}
.cst-film:hover{transform:translateY(-6px);border-color:var(--gold-dim);box-shadow:0 36px 70px -34px rgba(0,0,0,.95),0 0 0 1px rgba(201,163,86,.08);}
.cst-poster{position:relative;display:block;width:100%;aspect-ratio:9/16;background:#000;overflow:hidden;}
.cst-posterFrame{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000;}
/* Facebook SDK player: fills the 9:16 frame */
.cst-fbVideo{position:absolute;inset:0;width:100%;height:100%;}
.cst-fbVideo>span,.cst-fbVideo iframe{width:100%!important;height:100%!important;display:block;}
/* Instagram fallback: crop its white header/footer */
.cst-igFrame{top:-54px;height:calc(100% + 54px + 140px);}
.cst-lang{position:absolute;left:14px;bottom:14px;z-index:2;pointer-events:none;padding:5px 11px;border:1px solid rgba(230,201,127,.4);border-radius:999px;background:rgba(18,13,9,.65);backdrop-filter:blur(6px);color:var(--gold-bright);font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;}
.cst-filmBody{display:flex;flex-direction:column;flex:1;padding:18px 18px 16px;}
.cst-filmTitle{margin:0;font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.15;}
.cst-filmLogline{margin:8px 0 0;color:var(--muted);font-family:var(--serif);font-style:italic;font-size:16px;line-height:1.5;}
.cst-stats{margin:16px 0 0;padding:14px 0 0;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--hair-soft);}
.cst-stats>div{display:flex;flex-direction:column;gap:2px;}
.cst-stats>div+div{border-left:1px solid var(--hair-soft);padding-left:12px;}
.cst-stats dt{margin:0;font-family:var(--serif);font-weight:600;font-size:20px;line-height:1;color:var(--gold-bright);}
.cst-stats dd{margin:0;color:var(--faint);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;}
.cst-filmWatch{margin-top:auto;padding-top:14px;display:inline-flex;align-items:center;gap:6px;color:var(--gold-bright);font-size:13px;font-weight:700;white-space:nowrap;}
.cst-filmWatch svg{width:14px;height:14px;transition:transform 160ms;}
.cst-film:hover .cst-filmWatch svg{transform:translateX(3px);}
/* more stories — second row of the same cards */
.cst-more{margin-top:40px;padding-top:32px;border-top:1px solid var(--hair);}
.cst-moreH3{margin:0 0 20px;color:var(--gold);font-size:11.5px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;}
.cst-seeAll{margin:28px 0 0;text-align:center;}
.cst-seeAll a{color:var(--muted);font-size:14px;font-weight:600;border-bottom:1px solid var(--hair);padding-bottom:3px;transition:color 150ms,border-color 150ms;}
.cst-seeAll a:hover{color:var(--gold-bright);border-color:var(--gold-dim);}

/* story break */
.cst-break{position:relative;margin-top:clamp(48px,7vh,80px);min-height:min(56svh,520px);display:flex;align-items:center;justify-content:center;background-size:cover;background-position:center 35%;background-attachment:fixed;background-color:var(--bg2);}
.cst-breakShade{position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0%,rgba(18,13,9,.45) 25%,rgba(18,13,9,.55) 75%,var(--bg) 100%);}
.cst-quote{position:relative;width:min(860px,calc(100% - 40px));margin:0;padding:32px 0;text-align:center;}
.cst-quote blockquote{margin:0;font-family:var(--serif);font-style:italic;font-weight:500;color:var(--gold-bright);font-size:clamp(1.8rem,4vw,3rem);line-height:1.3;text-shadow:0 4px 40px rgba(0,0,0,.8);}
.cst-quote figcaption{margin-top:20px;color:var(--text);font-size:12px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;opacity:.8;}
.cst-quote::before,.cst-quote::after{content:"";display:block;width:56px;height:1px;margin:0 auto;background:var(--gold-dim);}
.cst-quote::before{margin-bottom:36px}.cst-quote::after{margin-top:36px}

/* mission */
.cst-mission{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,5vw,72px);align-items:center;}
.cst-missionStill{position:relative;max-width:400px;margin:0 auto;padding:10px;border-radius:26px;background:linear-gradient(160deg,rgba(201,163,86,.35),rgba(201,163,86,.06) 50%,rgba(201,163,86,.25));box-shadow:0 50px 100px -40px rgba(0,0,0,.95),0 0 0 1px rgba(201,163,86,.12);}
.cst-missionFrame{position:relative;aspect-ratio:9/16;border-radius:18px;background:#000;overflow:hidden;}
.cst-missionCap{display:block;padding:14px 6px 2px;text-align:center;color:var(--faint);font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;}
.cst-verse{margin:0 0 22px;padding:0;}
.cst-verse p{margin:0;font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,1.9vw,1.5rem);line-height:1.4;color:var(--gold-bright);}
.cst-verse cite{display:block;margin-top:6px;color:var(--faint);font-style:normal;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;}
.cst-missionCopy p:not(.cst-eyebrow){margin:18px 0 0;color:var(--muted);font-size:16.5px;line-height:1.85;}
.cst-missionCopy .cst-missionCall{margin-top:26px;padding:22px 24px;border:1px solid var(--hair);border-left:3px solid var(--gold);border-radius:0 16px 16px 0;background:linear-gradient(90deg,rgba(201,163,86,.09),transparent);color:var(--text);font-family:var(--serif);font-size:21px;line-height:1.55;}

/* saints grid */
.cst-saintsGrid{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.cst-saintCard{display:flex;flex-direction:column;gap:6px;padding:22px 20px;border:1px solid var(--hair-soft);border-radius:16px;background:linear-gradient(180deg,var(--panel),var(--bg2));transition:border-color 200ms,transform 200ms;}
.cst-saintCard:hover{border-color:var(--gold-dim);transform:translateY(-3px);}
.cst-saintCardName{font-family:var(--serif);font-weight:600;font-size:20px;line-height:1.15;}
.cst-saintCardRole{color:var(--muted);font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.4;}
.cst-saintPray{margin-top:8px;color:var(--faint);font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;}

/* sources */
.cst-tiers2{display:grid;grid-template-columns:1.2fr 1.2fr .9fr;gap:16px;}
.cst-tierBox{position:relative;padding:28px 26px 26px;border:1px solid var(--hair);border-radius:18px;background:linear-gradient(180deg,rgba(201,163,86,.07),rgba(201,163,86,.015));}
.cst-tierBoxNo{border-color:var(--hair-soft);background:rgba(243,234,218,.02);}
.cst-tierBoxN{display:flex;align-items:center;justify-content:center;width:40px;height:40px;margin-bottom:16px;border:1px solid var(--gold-dim);border-radius:50%;font-family:var(--serif);font-weight:600;font-size:18px;color:var(--gold-bright);}
.cst-tierBoxNo .cst-tierBoxN{border-color:var(--hair-soft);color:var(--faint);}
.cst-tierBoxN svg{width:16px;height:16px;}
.cst-tierBox h3{margin:0 0 10px;font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.2;}
.cst-tierBox p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.7;}
.cst-tierBoxNo h3{color:var(--muted);}

/* ledger */
.cst-ledger{margin:0;padding:0;list-style:none;border-top:1px solid var(--hair);}
.cst-row{display:grid;grid-template-columns:72px 260px 1fr;gap:20px;align-items:baseline;padding:20px 6px;border-bottom:1px solid var(--hair-soft);transition:background 160ms;}
.cst-row:hover{background:rgba(201,163,86,.03);}
.cst-rowN{font-family:var(--serif);font-size:15px;color:var(--gold);letter-spacing:.1em;}
.cst-rowTitle{font-family:var(--serif);font-weight:600;font-size:24px;}
.cst-rowText{color:var(--muted);font-size:15px;line-height:1.7;max-width:58ch;}

/* what's next */
.cst-next{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.cst-nextCard{padding:26px 24px;border:1px solid var(--hair-soft);border-radius:18px;background:linear-gradient(180deg,var(--panel),var(--bg2));border-top:2px solid var(--gold-dim);}
.cst-nextN{display:block;margin-bottom:14px;font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.1em;}
.cst-nextCard h3{margin:0 0 10px;font-family:var(--serif);font-weight:600;font-size:23px;line-height:1.15;}
.cst-nextCard p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.7;}
/* catholicprojects band */
.cst-cp{display:grid;grid-template-columns:minmax(220px,.8fr) 1.6fr;gap:clamp(28px,5vw,64px);align-items:center;padding:clamp(28px,4vw,48px);border:1px solid var(--hair);border-radius:24px;background:linear-gradient(135deg,rgba(201,163,86,.1),rgba(201,163,86,.03) 55%,transparent);}
.cst-cpLogoWrap{display:flex;align-items:center;justify-content:center;aspect-ratio:1;max-width:260px;margin:0 auto;border-radius:20px;background:var(--tile);box-shadow:0 30px 60px -30px rgba(0,0,0,.9),inset 0 0 0 1px rgba(201,163,86,.25);padding:28px;}
.cst-cpLogo{width:100%;height:auto;display:block;}
.cst-h2Small{font-size:clamp(1.7rem,3vw,2.4rem);}
.cst-cpText{margin:14px 0 0;color:var(--muted);font-size:15.5px;line-height:1.75;}
.cst-cpLink{margin-top:18px;display:inline-flex;align-items:center;gap:8px;color:var(--gold-bright);font-size:14px;font-weight:700;}
.cst-cpLink svg{width:15px;height:15px;}

/* support */
.cst-support{padding-bottom:clamp(56px,8vh,88px);}
.cst-tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.cst-tier{position:relative;display:flex;flex-direction:column;gap:10px;padding:30px 24px 24px;border:1px solid var(--hair-soft);border-radius:20px;background:linear-gradient(180deg,var(--panel),var(--bg2));transition:transform 180ms,border-color 180ms,box-shadow 180ms;}
.cst-tier:hover{transform:translateY(-4px);border-color:var(--gold-dim);box-shadow:0 26px 54px -28px rgba(0,0,0,.95);}
.cst-tier.is-featured{border-color:var(--gold-dim);background:linear-gradient(180deg,rgba(201,163,86,.14),var(--panel) 60%);}
.cst-tierFlag{position:absolute;top:-11px;left:50%;transform:translateX(-50%);padding:4px 12px;border-radius:999px;background:var(--gold);color:#17110A;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;}
.cst-tierName{color:var(--gold-bright);font-size:11.5px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;}
.cst-tierAmt{font-family:var(--serif);font-weight:600;font-size:46px;line-height:1;}
.cst-tierAmt sup{font-size:.45em;vertical-align:.7em;margin-right:2px;color:var(--gold-bright);}
.cst-tierPer{margin-left:4px;font-family:var(--sans);font-size:13px;font-weight:500;color:var(--faint);}
.cst-tierLine{color:var(--muted);font-size:13.5px;line-height:1.55;min-height:3.1em;}
.cst-tierGo{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:13px;font-weight:800;transition:background 160ms,color 160ms;}
.cst-tier:hover .cst-tierGo,.cst-tier.is-featured .cst-tierGo{background:var(--gold);color:#17110A;border-color:var(--gold);}
.cst-tierGo svg{width:14px;height:14px;}
.cst-noPerks{max-width:62ch;margin:30px auto 0;text-align:center;color:var(--faint);font-size:13px;line-height:1.7;}
.cst-alt{margin:26px auto 0;display:flex;justify-content:center;flex-wrap:wrap;gap:10px;}
.cst-altBtn{padding:10px 18px;border:1px solid var(--hair-soft);border-radius:999px;color:var(--muted);font-size:13px;font-weight:700;transition:border-color 150ms,color 150ms,background 150ms;}
.cst-altBtn:hover{border-color:var(--gold-dim);color:var(--gold-bright);background:rgba(201,163,86,.05);}
.cst-fine{max-width:720px;margin:40px auto 0;padding:26px 28px;border:1px solid var(--hair-soft);border-radius:16px;background:rgba(243,234,218,.025);}
.cst-fine h3{margin:0 0 10px;font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;}
.cst-fine p{margin:0;color:var(--faint);font-size:13.5px;line-height:1.75;}
.cst-fine strong{color:var(--muted);}

/* footer */
.cst-foot{margin-top:auto;padding:56px 20px 60px;border-top:1px solid var(--hair-soft);text-align:center;background:linear-gradient(180deg,transparent,rgba(201,163,86,.05));}
.cst-footLogo{display:block;height:40px;width:auto;margin:0 auto 16px;padding:4px 8px;border-radius:8px;background:var(--tile);box-shadow:inset 0 0 0 1px rgba(201,163,86,.25);box-sizing:content-box;}
.cst-footLine{margin:0 0 14px;font-family:var(--serif);font-style:italic;font-size:19px;color:var(--muted);}
.cst-footMeta{margin:0 0 8px;color:var(--faint);font-size:13px;}
.cst-footMeta a{color:var(--muted);font-weight:650;}
.cst-footMeta a:hover{color:var(--gold-bright);}
.cst-footFine{margin:0 auto;max-width:60ch;color:#6E6250;font-size:11.5px;line-height:1.6;}

/* responsive */
@media (max-width:1040px){
  .cst-films{grid-template-columns:repeat(2,1fr);}
  .cst-tiers{grid-template-columns:repeat(2,1fr);}
  .cst-saintsGrid{grid-template-columns:repeat(2,1fr);}
  .cst-tiers2{grid-template-columns:1fr 1fr;}
  .cst-tierBoxNo{grid-column:1/-1;}
  .cst-next{grid-template-columns:1fr;}
  .cst-row{grid-template-columns:52px 1fr;}
  .cst-rowText{grid-column:2;}
}
@media (max-width:800px){
  .cst-mission{grid-template-columns:1fr;}
  .cst-missionStill{max-width:320px;}
  .cst-missionCopy .cst-missionCall{border-radius:16px;border-left-width:3px;}
  .cst-cp{grid-template-columns:1fr;text-align:center;}
  .cst-cpLogoWrap{max-width:200px;}
  .cst-band{grid-template-columns:repeat(2,1fr);}
  .cst-band>div:nth-child(3){border-left:0;}
  .cst-band>div:nth-child(n+3){border-top:1px solid var(--hair-soft);}
  .cst-break{background-attachment:scroll;min-height:44svh;}
  .cst-tiers2{grid-template-columns:1fr;}
}
@media (max-width:600px){
  .cst-barLink{display:none;}
  .cst-markText{display:none;}
  .cst-markDivider{display:none;}
  .cst-markLogo{height:30px;}
  .cst-markTile{padding:3px 5px;}
  .cst-heroInner{padding:100px 16px 120px;}
  .cst-kicker{letter-spacing:.22em;font-size:11px;}
  .cst-heroCtas{flex-direction:column;align-items:stretch;}
  .cst-cta,.cst-ghost{justify-content:center;width:100%;}
  .cst-litanyItem{font-size:15px;padding:0 20px;}
  .cst-films{grid-template-columns:1fr;}
  .cst-tiers{grid-template-columns:1fr;gap:14px;}
  .cst-tierLine{min-height:0;}
  .cst-saintsGrid{grid-template-columns:1fr;}
  .cst-row{padding:20px 2px;}
  .cst-fine{padding:20px;}
}
@media (prefers-reduced-motion:reduce){
  .cst *{transition:none!important;animation:none!important;}
  [data-reveal]{opacity:1;transform:none;}
}
`;
