"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PATHS } from "../_lib/seo";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

const ui = Inter({ subsets: ["latin"], variable: "--cst-ui", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"],
  variable: "--cst-serif", display: "swap",
});

/* =============================================================
   Catholic Saint Stories — Support   (v26 · cinematic · bilingual · SEO routes)

   Client component. Rendered by two server pages that own the metadata:
     /catholic-saint-stories/support  → <SupportPage initialLang="en" />
     /catholic-saint-stories/apoyo    → <SupportPage initialLang="es" />

   No image files required. Films play as embedded Facebook players
   (autoplay, muted); the hero is a CSS phone with the lead reel inside.

   Optional, only if WITNESS_PORTRAITS is flipped to true:
     /public/saint-stories/witness-<slug>.jpg   4:5 portrait frames
   ============================================================= */

const A = "/saint-stories";
const CP_LOGO = "https://app.catholicprojects.org/brand/catholicprojects-logo.png";
const CONTACT = "team@catholicprojects.org";
/* Per-tier Stripe Payment Links, indexed to match TIER_AMOUNTS / COPY.tiers:
   0 Friend $5 · 1 Patron $15 · 2 Benefactor $25 · 3 Founding Patron $50 */
const TIER_LINKS = [
  "https://buy.stripe.com/8x2aEW3G01yN6ic0yg0Ba02", // Friend $5/mo
  "https://buy.stripe.com/bJe7sK5O8cdr7mggxe0Ba04", // Patron $15/mo
  "https://buy.stripe.com/7sYeVcb8selzeOI2Go0Ba05", // Benefactor $25/mo
  "https://buy.stripe.com/6oU28q5O87Xb9uo94M0Ba03", // Founding Patron $50/mo
];
const GIVE_ONCE_LINK = "https://buy.stripe.com/28EbJ0ekEa5jdKE3Ks0Ba06"; // one-time gift
const FACEBOOK_URL = "https://www.facebook.com/people/Catholicsaintstories/61592672761916/";
const INSTAGRAM_URL = "https://instagram.com/catholicsaintstories";
const TIKTOK_URL = "https://tiktok.com/@catholicsaintstories2";
const YOUTUBE_URL = "https://youtube.com/@catholicsaintstories2";

/* Follower counts — update by hand now and then. */
const SOCIALS = [
  { key: "instagram", name: "Instagram", handle: "@catholicsaintstories", count: "5.2K", href: INSTAGRAM_URL },
  { key: "facebook", name: "Facebook", handle: "Catholicsaintstories", count: "6.9K", href: FACEBOOK_URL },
  { key: "tiktok", name: "TikTok", handle: "@catholicsaintstories2", count: "1K", href: TIKTOK_URL },
  { key: "youtube", name: "YouTube", handle: "@catholicsaintstories2", count: "1K", href: YOUTUBE_URL },
];

type Lang = "en" | "es";
type Stats = { likes: string; comments: string; shares: string };
type Film = { slug: string; title: string; lang: "English" | "Español"; logline: string; stats: Stats; ig: string; fb: string };

const FILMS: Film[] = [
  { slug: "sebastian", title: "Saint Sebastian", lang: "English",
    logline: "A captain of the Emperor's guard who served another King — and would not deny Him, even under the arrows.",
    stats: { likes: "1.8K", comments: "134", shares: "243" },
    ig: "https://www.instagram.com/reel/DdmraoEBnF8/", fb: "https://fb.watch/v/79fkexHl-/" },
  { slug: "sheen", title: "Venerable Fulton Sheen", lang: "English",
    logline: "A bishop, a chalkboard, and a television camera — and thirty million people listening.",
    stats: { likes: "1.9K", comments: "61", shares: "245" },
    ig: "https://www.instagram.com/reel/DduZyldBW9M/", fb: "https://fb.watch/v/6tDwOkXld/" },
  { slug: "alacoque", title: "Santa Margarita María de Alacoque", lang: "Español",
    logline: "Jesús le mostró Su Corazón ardiendo de amor — y le confió una misión para toda la Iglesia.",
    stats: { likes: "3.6K", comments: "269", shares: "418" },
    ig: "https://www.instagram.com/reel/Dd4tluZBbbc/", fb: "https://fb.watch/v/84XezVsW2/" },
  { slug: "vicente", title: "San Vicente de Paúl", lang: "Español",
    logline: "Quiso dejar atrás la pobreza — pero Dios lo llevó de nuevo hacia los pobres.",
    stats: { likes: "3.8K", comments: "82", shares: "653" },
    ig: INSTAGRAM_URL, fb: "https://fb.watch/v/8TdVcu_P_/" }, // TODO: Instagram reel link
];

const MISSION_FILM: Film = {
  slug: "damian", title: "San Damián de Molokai", lang: "Español", logline: "",
  stats: { likes: "4.8K", comments: "179", shares: "716" },
  ig: "https://www.instagram.com/reel/DeAb99UBwNT/", fb: "https://www.facebook.com/reel/2563206477478130",
};

/* Witnesses: a printed litany by default. Flip to true once the
   witness-<slug>.jpg portraits are in /public/saint-stories/. */
const WITNESS_PORTRAITS = false;
const WITNESS_SLUGS = ["mary", "joseph", "vincent", "gines", "damien", "sebastian", "frassati", "acutis", "pio", "anthony", "kolbe", "alacoque", "therese", "sheen"];

/* ═══════════════════════ COPY ═══════════════════════ */
const COPY = {
  en: {
    barCta: "Support",
    kicker: "Real saints · True stories · Eternal inspiration",
    h1a: "Stories of the Saints.", h1b: "Made for a new generation.",
    heroSub: "Cinematic films about the men and women who gave their lives to Christ — martyrs, servants, mystics — told faithfully, released free, and carried to the feeds where the whole world now lives.",
    ctaPrimary: "Be part of the mission", ctaWatch: "Watch the stories",
    trust: ["Grounded in Tier 1 & Tier 2 Catholic sources", "Free to watch, always", "English & Español"],
    phoneCap: "Now playing", prevFilm: "Previous story", nextFilm: "Next story", stop: "Stop",
    followEyebrow: "Follow & share", followH2: "The free way to help",
    followLede: "Every follow and every share carries a saint into a feed where he wasn't before. If you can't give, do this — it matters just as much.",
    followers: "followers", follow: "Follow",
    litany: ["Holy Mary, Mother of God, pray for us", "St. Joseph, pray for us", "St. Vincent de Paul, pray for us", "St. Genesius of Rome, pray for us", "St. Damien of Molokai, pray for us", "St. Pier Giorgio Frassati, pray for us", "St. Carlo Acutis, pray for us", "St. Padre Pio, pray for us", "St. Anthony of Padua, pray for us", "St. Maximilian Kolbe, pray for us", "St. Sebastian, pray for us", "St. Margaret Mary Alacoque, pray for us", "Venerable Fulton Sheen, pray for us", "All you holy men and women, pray for us"],
    band: [["435K", "monthly views"], ["14K", "followers"], ["102", "stories released"], ["EN · ES", "two languages"]],
    showingEyebrow: "Now showing", showingH2: "Stories people can't stop sharing",
    showingLede: "Every film is free to watch. These are the ones traveling furthest right now.",
    play: "Play", likes: "likes", comments: "comments", shares: "shares",
    openFb: "Open on Facebook", openIg: "Open on Instagram", close: "Close",
    seeAll: "All 102 stories, free, on Instagram & Facebook →",
    quote: "Verso l'alto — To the heights.", quoteBy: "St. Pier Giorgio Frassati",
    missionEyebrow: "Why we tell these stories",
    missionVerse: "Since we are surrounded by so great a cloud of witnesses…", missionVerseRef: "Hebrews 12:1",
    missionH2: "Lives that belonged to Christ",
    missionP1: "For two thousand years the Church has held up the saints — in Scripture, in the liturgy, on the altars of every parish — because they are the proof that the Gospel can actually be lived. Not in theory. In a body, in a century, in a city, by a person with a name.",
    missionP2: "People get the saints wrong. They imagine plaster statues — serene, distant, born holy. The truth is harder and far more beautiful. Augustine ran from God for years. Genesius was mocking the faith on stage when grace found him mid-play. Vincent de Paul wanted a comfortable career before Christ led him to the poor of Paris. Damien chose the lepers of Molokai knowing he would die among them. The saints were not born saints. They were sinners who said yes — and kept saying it.",
    missionP3: "That is why we tell their stories: holiness is not reserved for a few. It is the vocation of every baptized person. The saints are not only to be admired. They are to be followed — all the way to Christ, and home to His Church.",
    missionCap: "San Damián de Molokai — from the film",
    saintsEyebrow: "Martyrs · Servants · Mystics · Saints", saintsH2: "A cloud of witnesses",
    saintsLede: "The saints we have told, and the ones we are telling next. A litany — and a promise of what is coming.",
    saints: [
      ["Holy Mary, Mother of God", "Queen of all saints · Our Lady of Guadalupe"],
      ["St. Joseph", "Patron of the universal Church · guardian of the Redeemer"],
      ["St. Vincent de Paul", "Servant of the poor · Paris, 1660"],
      ["St. Genesius of Rome", "Martyr · the actor who believed · Rome, 303"],
      ["St. Damien of Molokai", "Apostle to the lepers · Hawaiʻi, 1889"],
      ["St. Sebastian", "Martyr · soldier of Christ · Rome, 288"],
      ["St. Pier Giorgio Frassati", "Verso l'alto · Turin, 1925"],
      ["St. Carlo Acutis", "The Eucharist, his highway to heaven · 2006"],
      ["St. Padre Pio", "The stigmata, the confessional · 1968"],
      ["St. Anthony of Padua", "Doctor of the Church · finder of the lost · 1231"],
      ["St. Maximilian Kolbe", "Martyr of charity · Auschwitz, 1941"],
      ["St. Margaret Mary Alacoque", "Apostle of the Sacred Heart · 1690"],
      ["St. Thérèse of Lisieux", "The Little Way · Doctor of the Church · 1897"],
      ["Venerable Fulton Sheen", "Life is worth living · 1979"],
    ],
    prayForUs: "pray for us",
    litanyClose: "All you holy men and women of God,", litanyCloseR: "pray for us.",
    measuredEyebrow: "The mission, measured", measuredH2: "What your support is held to",
    measuredLede: "We are Catholics who want to give back to the Church. So we hold this work to three things you can see for yourself.",
    measured: [
      ["Delivery", "102 stories in our first nine weeks. New films every week, in two languages, without a missed week."],
      ["Quality", "Cinematic production and Tier 1 & Tier 2 Catholic sources on every story. If it isn't beautiful and faithful, it doesn't ship."],
      ["Free", "Every film — and every resource at CatholicProjects.org — free for viewers, catechists, and parishes. Always."],
    ],
    sourcesEyebrow: "Faithful to the sources", sourcesH2: "How every story is researched",
    sourcesLede: "A saint's story is sacred. Before a single frame is made, each film is built from two tiers of Catholic sources — and nothing else.",
    tier1: "Primary sources", tier1Text: "Sacred Scripture. The saint's own writings, letters, and diaries. The Church's official record: decrees and homilies of beatification and canonization, the Roman Martyrology, and documents of the Holy See.",
    tier2: "Trusted Catholic scholarship", tier2Text: "Biographies by established Catholic authors and publishers, Butler's Lives of the Saints, the Catholic Encyclopedia, and the archives of the religious orders and dioceses that knew the saint.",
    notUsed: "Not used:", notUsedText: "unattested legends, anonymous posts, or anything that contradicts the teaching of the Church. Where sources differ, we say so — or leave it out.",
    ledgerEyebrow: "Where your support goes", ledgerH2: "What your support makes possible",
    ledgerLede: "Each story costs real money — and real time — to make. Your support sustains the mission: the films, the free resources we build for parishes, and the people who make them.",
    ledger: [["Research", "Weeks in Tier 1 and Tier 2 sources, so the saint is portrayed faithfully."], ["Script & production", "Cinematic visuals, careful writing, and editing worthy of the life being told."], ["Narration", "Voice performances that carry reverence, in every language we publish."], ["Translation & captions", "Every story crosses languages — subtitled, translated, accessible."], ["Distribution", "Published where people are — Instagram, Facebook, TikTok, YouTube — so each story travels as far as it can."]],
    nextEyebrow: "What's next", nextH2: "Where the mission is going",
    next: [["From 60 seconds to five minutes", "Our films today are a minute or less. Next: five-minute films that tell a saint's whole story — childhood, conversion, mission, death — with the care each life deserves."], ["Saint Stories for Kids", "Age-appropriate films for families, classrooms, and parish programs — so children meet the saints the way they meet everything else: with wonder."], ["More languages", "English and Spanish today. As support grows, the saints in more languages — so no one is left out because of the language they pray in."]],
    cpEyebrow: "A project of CatholicProjects.org", cpH2: "Built to give back to parishes",
    cpText: "Catholic Saint Stories is one of two projects at CatholicProjects.org. The other builds free tools and classroom resources for parishes — registration software, worksheets, saint activities — so that no parish is held back by cost. Everything we make is free, and stays free. Your support here keeps both alive.",
    cpLink: "Explore the free resource hub",
    supportEyebrow: "Be part of the mission", supportH2: "Help carry the saints to the world",
    supportLede: "You're not funding a channel. You're helping tell the stories of the saints to people who have never heard them — and pointing them home: to their parish, to the sacraments, to Christ. Every gift carries real impact. It becomes research, production, narration, translation — the next story, reaching the next person.",
    tiers: [["Friend", "Keeps the research going."], ["Patron", "Helps carry a story through production."], ["Benefactor", "Funds narration and translation — in every language."], ["Founding Patron", "Sustains the whole slate, month after month."]],
    featured: "Most common", perMo: "/mo", support: "Support",
    noPerks: "Support is a voluntary gift to the creator of this work. It earns our deep gratitude and our prayers — but no rewards, ownership, or exclusive access. The films remain free, for everyone, always. A Mass is offered each month for all who support this work.",
    recurringNote: "Monthly tiers renew each month until you cancel — cancel anytime in one click. One-time gifts are charged once.",
    giveOnce: "Give once", paypal: "PayPal", ask: "Questions? Write to us",
    fineH: "Transparency about your gift",
    fine: "CatholicProjects is not a tax-exempt charitable organization, and contributions are not tax-deductible. Your support is voluntary creator support — received as ordinary income, reported properly, and spent on the work described above. No contribution funds a specific film, and no outcome is promised beyond this: more stories of the saints, made well, released free.",
    notDeductible: "not tax-deductible",
    footLine: "All you holy men and women of God, pray for us.", footProject: "A project of",
    footFine: "CatholicProjects is an independent Catholic project and does not imply parish, diocesan, or ecclesial endorsement unless specifically stated.",
  },
  es: {
    barCta: "Apoyar",
    kicker: "Santos reales · Historias verdaderas · Inspiración eterna",
    h1a: "Historias de los Santos.", h1b: "Hechas para una nueva generación.",
    heroSub: "Películas cinematográficas sobre los hombres y mujeres que entregaron su vida a Cristo — mártires, siervos, místicos — contadas con fidelidad, publicadas gratis y llevadas a las redes donde hoy vive el mundo entero.",
    ctaPrimary: "Sé parte de la misión", ctaWatch: "Ver las historias",
    trust: ["Fuentes católicas de Nivel 1 y 2", "Gratis, siempre", "Español e inglés"],
    phoneCap: "En reproducción", prevFilm: "Historia anterior", nextFilm: "Siguiente historia", stop: "Detener",
    followEyebrow: "Sigue y comparte", followH2: "La forma gratuita de ayudar",
    followLede: "Cada seguidor y cada compartido lleva a un santo a una pantalla donde antes no estaba. Si no puedes aportar, haz esto — importa igual.",
    followers: "seguidores", follow: "Seguir",
    litany: ["Santa María, Madre de Dios, ruega por nosotros", "San José, ruega por nosotros", "San Vicente de Paúl, ruega por nosotros", "San Ginés de Roma, ruega por nosotros", "San Damián de Molokai, ruega por nosotros", "San Pier Giorgio Frassati, ruega por nosotros", "San Carlo Acutis, ruega por nosotros", "San Pío de Pietrelcina, ruega por nosotros", "San Antonio de Padua, ruega por nosotros", "San Maximiliano Kolbe, ruega por nosotros", "San Sebastián, ruega por nosotros", "Santa Margarita María de Alacoque, ruega por nosotros", "Venerable Fulton Sheen, ruega por nosotros", "Santos y santas de Dios, rueguen por nosotros"],
    band: [["435K", "vistas al mes"], ["14K", "seguidores"], ["102", "historias publicadas"], ["ES · EN", "dos idiomas"]],
    showingEyebrow: "En cartelera", showingH2: "Historias que la gente no deja de compartir",
    showingLede: "Todas las películas son gratis. Estas son las que más lejos están llegando ahora.",
    play: "Reproducir", likes: "me gusta", comments: "comentarios", shares: "compartidos",
    openFb: "Abrir en Facebook", openIg: "Abrir en Instagram", close: "Cerrar",
    seeAll: "Las 102 historias, gratis, en Instagram y Facebook →",
    quote: "Verso l'alto — Hacia lo alto.", quoteBy: "San Pier Giorgio Frassati",
    missionEyebrow: "Por qué contamos estas historias",
    missionVerse: "Teniendo en torno nuestro tan gran nube de testigos…", missionVerseRef: "Hebreos 12:1",
    missionH2: "Vidas que pertenecieron a Cristo",
    missionP1: "Durante dos mil años la Iglesia ha puesto a los santos ante nuestros ojos — en la Escritura, en la liturgia, en los altares de cada parroquia — porque son la prueba de que el Evangelio sí se puede vivir. No en teoría. En un cuerpo, en un siglo, en una ciudad, por una persona con nombre.",
    missionP2: "La gente se equivoca con los santos. Los imagina como estatuas de yeso — serenos, lejanos, santos de nacimiento. La verdad es más dura y mucho más hermosa. Agustín huyó de Dios durante años. Ginés se burlaba de la fe en escena cuando la gracia lo alcanzó a mitad de la obra. Vicente de Paúl buscaba una carrera cómoda antes de que Cristo lo llevara a los pobres de París. Damián eligió a los leprosos de Molokai sabiendo que moriría entre ellos. Los santos no nacieron santos. Fueron pecadores que dijeron sí — y lo siguieron diciendo.",
    missionP3: "Por eso contamos sus historias: la santidad no está reservada a unos pocos. Es la vocación de todo bautizado. A los santos no solo se les admira. Se les sigue — hasta Cristo, y de vuelta a casa, a su Iglesia.",
    missionCap: "San Damián de Molokai — de la película",
    saintsEyebrow: "Mártires · Siervos · Místicos · Santos", saintsH2: "Una nube de testigos",
    saintsLede: "Los santos que ya hemos contado, y los que vienen. Una letanía — y una promesa de lo que está por llegar.",
    saints: [
      ["Santa María, Madre de Dios", "Reina de todos los santos · Nuestra Señora de Guadalupe"],
      ["San José", "Patrono de la Iglesia universal · custodio del Redentor"],
      ["San Vicente de Paúl", "Siervo de los pobres · París, 1660"],
      ["San Ginés de Roma", "Mártir · el actor que creyó · Roma, 303"],
      ["San Damián de Molokai", "Apóstol de los leprosos · Hawái, 1889"],
      ["San Sebastián", "Mártir · soldado de Cristo · Roma, 288"],
      ["San Pier Giorgio Frassati", "Verso l'alto · Turín, 1925"],
      ["San Carlo Acutis", "La Eucaristía, su autopista al cielo · 2006"],
      ["San Pío de Pietrelcina", "Los estigmas, el confesionario · 1968"],
      ["San Antonio de Padua", "Doctor de la Iglesia · hallador de lo perdido · 1231"],
      ["San Maximiliano Kolbe", "Mártir de la caridad · Auschwitz, 1941"],
      ["Santa Margarita María de Alacoque", "Apóstol del Sagrado Corazón · 1690"],
      ["Santa Teresita de Lisieux", "El Caminito · Doctora de la Iglesia · 1897"],
      ["Venerable Fulton Sheen", "La vida vale la pena vivirla · 1979"],
    ],
    prayForUs: "ruega por nosotros",
    litanyClose: "Santos y santas de Dios,", litanyCloseR: "rueguen por nosotros.",
    measuredEyebrow: "La misión, en cifras", measuredH2: "A qué responde tu apoyo",
    measuredLede: "Somos católicos que queremos devolverle a la Iglesia. Por eso medimos este trabajo con tres cosas que puedes ver por ti mismo.",
    measured: [
      ["Entrega", "102 historias en nuestras primeras nueve semanas. Películas nuevas cada semana, en dos idiomas, sin fallar una."],
      ["Calidad", "Producción cinematográfica y fuentes católicas de Nivel 1 y 2 en cada historia. Si no es bella y fiel, no se publica."],
      ["Gratis", "Cada película — y cada recurso de CatholicProjects.org — gratis para espectadores, catequistas y parroquias. Siempre."],
    ],
    sourcesEyebrow: "Fieles a las fuentes", sourcesH2: "Cómo se investiga cada historia",
    sourcesLede: "La historia de un santo es sagrada. Antes de crear un solo cuadro, cada película se construye con dos niveles de fuentes católicas — y nada más.",
    tier1: "Fuentes primarias", tier1Text: "La Sagrada Escritura. Los escritos, cartas y diarios del propio santo. El registro oficial de la Iglesia: decretos y homilías de beatificación y canonización, el Martirologio Romano y los documentos de la Santa Sede.",
    tier2: "Estudios católicos de confianza", tier2Text: "Biografías de autores y editoriales católicas reconocidas, las Vidas de los Santos de Butler, la Enciclopedia Católica y los archivos de las órdenes religiosas y diócesis que conocieron al santo.",
    notUsed: "No se usa:", notUsedText: "leyendas sin respaldo, publicaciones anónimas o cualquier cosa que contradiga la enseñanza de la Iglesia. Cuando las fuentes difieren, lo decimos — o lo dejamos fuera.",
    ledgerEyebrow: "A dónde va tu apoyo", ledgerH2: "Lo que tu apoyo hace posible",
    ledgerLede: "Cada historia cuesta dinero real — y tiempo real. Tu apoyo sostiene la misión: las películas, los recursos gratuitos que creamos para las parroquias y las personas que las hacen.",
    ledger: [["Investigación", "Semanas en fuentes de Nivel 1 y 2, para retratar al santo con fidelidad."], ["Guion y producción", "Imágenes cinematográficas, escritura cuidada y edición a la altura de la vida que se cuenta."], ["Narración", "Voces que transmiten reverencia, en cada idioma que publicamos."], ["Traducción y subtítulos", "Cada historia cruza idiomas — subtitulada, traducida, accesible."], ["Distribución", "Publicadas donde está la gente — Instagram, Facebook, TikTok, YouTube — para que cada historia llegue lo más lejos posible."]],
    nextEyebrow: "Lo que viene", nextH2: "Hacia dónde va la misión",
    next: [["De 60 segundos a cinco minutos", "Hoy nuestras películas duran un minuto o menos. Lo próximo: películas de cinco minutos que cuenten la historia completa de un santo — infancia, conversión, misión, muerte — con el cuidado que cada vida merece."], ["Historias de Santos para Niños", "Películas adecuadas para familias, aulas y programas parroquiales — para que los niños conozcan a los santos como conocen todo lo demás: con asombro."], ["Más idiomas", "Hoy, español e inglés. Conforme crezca el apoyo, los santos en más idiomas — para que nadie quede fuera por el idioma en que reza."]],
    cpEyebrow: "Un proyecto de CatholicProjects.org", cpH2: "Hecho para devolverle a las parroquias",
    cpText: "Catholic Saint Stories es uno de los dos proyectos de CatholicProjects.org. El otro construye herramientas y recursos gratuitos para parroquias — software de inscripción, fichas, actividades de santos — para que ninguna parroquia se quede atrás por falta de recursos. Todo lo que hacemos es gratis, y seguirá siéndolo. Tu apoyo aquí mantiene vivos a los dos.",
    cpLink: "Explorar los recursos gratuitos",
    supportEyebrow: "Sé parte de la misión", supportH2: "Ayuda a llevar a los santos al mundo",
    supportLede: "No estás financiando un canal. Estás ayudando a contar las historias de los santos a personas que nunca las han oído — y a orientarlas de vuelta a casa: a su parroquia, a los sacramentos, a Cristo. Cada aporte tiene un impacto real. Se convierte en investigación, producción, narración, traducción — la próxima historia, llegando a la próxima persona.",
    tiers: [["Amigo", "Mantiene viva la investigación."], ["Patrono", "Ayuda a llevar una historia hasta su producción."], ["Benefactor", "Financia narración y traducción — en cada idioma."], ["Patrono fundador", "Sostiene toda la cartelera, mes tras mes."]],
    featured: "El más elegido", perMo: "/mes", support: "Apoyar",
    noPerks: "El apoyo es un regalo voluntario al creador de esta obra. Recibe nuestra profunda gratitud y nuestras oraciones — pero no recompensas, propiedad ni acceso exclusivo. Las películas siguen siendo gratis, para todos, siempre. Cada mes se ofrece una Misa por todos los que apoyan esta obra.",
    recurringNote: "Los niveles mensuales se renuevan cada mes hasta que canceles — cancela cuando quieras con un clic. Las donaciones únicas se cobran una sola vez.",
    giveOnce: "Donar una vez", paypal: "PayPal", ask: "¿Preguntas? Escríbenos",
    fineH: "Transparencia sobre tu aporte",
    fine: "CatholicProjects no es una organización benéfica exenta de impuestos, y los aportes no son deducibles de impuestos. Tu apoyo es apoyo voluntario a un creador — se recibe como ingreso ordinario, se declara correctamente y se destina al trabajo descrito arriba. Ningún aporte financia una película específica, y no se promete otro resultado que este: más historias de los santos, bien hechas, publicadas gratis.",
    notDeductible: "no son deducibles de impuestos",
    footLine: "Santos y santas de Dios, rueguen por nosotros.", footProject: "Un proyecto de",
    footFine: "CatholicProjects es un proyecto católico independiente y no implica respaldo parroquial, diocesano ni eclesial salvo que se indique expresamente.",
  },
} as const;
type T = (typeof COPY)[Lang];
const TIER_AMOUNTS = [5, 15, 25, 50];

/* ═══════════════════════ HELPERS ═══════════════════════ */
function Svg({ children, sw = 1.6, className }: { children: ReactNode; sw?: number; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}
const I = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  play: (<><polygon points="6 4 20 12 6 20 6 4" /></>),
  x: (<><path d="M18 6 6 18M6 6l12 12" /></>),
};

/* Each language is its own URL (see _lib/seo.ts) so Google indexes both.
   The URL always wins. On the English page we send Spanish browsers to the
   Spanish page once, unless they've already chosen a language by hand. */
function useLang(initial: Lang): [Lang, string, () => void] {
  const router = useRouter();
  const lang = initial;
  const other: Lang = lang === "en" ? "es" : "en";
  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang !== "en") return;
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "es") { router.replace(PATHS.es); return; } // legacy ?lang=es links
    let saved: string | null = null; try { saved = localStorage.getItem("cst-lang"); } catch {}
    if (saved) return;
    if ((navigator.language || "").toLowerCase().startsWith("es")) router.replace(PATHS.es);
  }, [lang, router]);
  const remember = () => { try { localStorage.setItem("cst-lang", other); } catch {} };
  return [lang, PATHS[other], remember];
}

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/* Still image with a title-card fallback if the file isn't there yet */
function Still({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return ok
    ? <img className={`cst-still ${className ?? ""}`} src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
    : <div className={`cst-still cst-stillFallback ${className ?? ""}`} aria-label={alt}><span>✠</span><b>{alt}</b></div>;
}

/* ═══════════════════════ FACEBOOK PLAYER (as in v15) ═══════════════════════ */
declare global { interface Window { FB?: { XFBML: { parse: (el?: Element) => void } }; fbAsyncInit?: () => void } }

function useFacebookSdk() {
  useEffect(() => {
    if (window.FB) { window.FB.XFBML.parse(); return; }
    if (!document.getElementById("fb-root")) { const r = document.createElement("div"); r.id = "fb-root"; document.body.prepend(r); }
    if (!document.getElementById("fb-sdk")) {
      const s = document.createElement("script");
      s.id = "fb-sdk"; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
      s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
      document.body.appendChild(s);
    }
  }, []);
}

function Player({ film }: { film: Film }) {
  return (
    <div className="fb-video cst-fbVideo" data-href={film.fb} data-width="auto" data-autoplay="true"
      data-show-text="false" data-show-captions="false" data-allowfullscreen="true" data-lazy="true" />
  );
}

/* ═══════════════════════ PHONE FEED ═══════════════════════ */
const SOCIAL_ICON: Record<string, ReactNode> = {
  instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>),
  facebook: (<><path d="M14 8h2.5V4.5H14c-2.5 0-4 1.6-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V8.8c0-.5.2-.8.5-.8Z" /></>),
  tiktok: (<><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.4 2.6 2.2 4.4 5 4.6" /></>),
  youtube: (<><rect x="3" y="6" width="18" height="12" rx="4" /><polygon points="10 9.5 15 12 10 14.5 10 9.5" fill="currentColor" stroke="none" /></>),
};
const I2 = {
  up: (<><path d="m6 15 6-6 6 6" /></>),
  down: (<><path d="m6 9 6 6 6-6" /></>),
};

function PhoneFeed({ films, t }: { films: Film[]; t: T }) {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [userControlled, setUserControlled] = useState(false); // stop auto-advance once they engage
  const [engaged, setEngaged] = useState(false);               // a video has been tapped (may have sound)
  const [reloadKey, setReloadKey] = useState(0);               // bump to tear players down = kill audio
  const wrapRef = useRef<HTMLDivElement>(null);
  const n = films.length;
  const sel = (k: number) => { setI(k); setUserControlled(true); };
  const go = (d: number) => { setI((x) => (x + d + n) % n); setUserControlled(true); };

  // Auto-advance ONLY while idle — never while hovering, in-control, or watching.
  useEffect(() => {
    if (hover || userControlled || engaged) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), 14000);
    return () => window.clearInterval(id);
  }, [hover, userControlled, engaged, n]);

  // The reel is a cross-origin iframe, so we can't see the click — but when someone
  // taps into it the window blurs and the iframe becomes the active element.
  useEffect(() => {
    const onBlur = () => window.setTimeout(() => {
      const a = document.activeElement;
      if (a && a.tagName === "IFRAME" && wrapRef.current?.contains(a)) { setEngaged(true); setUserControlled(true); }
    }, 0);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // Stop = remount the players (destroys the playing iframe, killing its audio) then re-render muted.
  useEffect(() => {
    if (!reloadKey) return;
    const el = wrapRef.current ?? undefined;
    window.setTimeout(() => window.FB?.XFBML.parse(el), 0);
  }, [reloadKey]);
  const stop = () => { setReloadKey((k) => k + 1); setEngaged(false); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };
  const f = films[i];
  return (
   <>
    <div className="cst-heroPhoneWrap" ref={wrapRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onKeyDown={onKey} tabIndex={0} aria-label={`${t.phoneCap}: ${f.title}`}>
      <div className="cst-phoneGlow" aria-hidden="true" />
      <div className="cst-phone">
        <span className="cst-phoneBtn cst-phoneBtnMute" aria-hidden="true" />
        <span className="cst-phoneBtn cst-phoneBtnVolUp" aria-hidden="true" />
        <span className="cst-phoneBtn cst-phoneBtnVolDn" aria-hidden="true" />
        <span className="cst-phoneBtn cst-phoneBtnPower" aria-hidden="true" />
        <div className="cst-phoneScreen">
          <div className="cst-statusBar" aria-hidden="true">
            <span className="cst-statusTime">9:41</span>
            <span className="cst-statusIsland" />
            <span className="cst-statusIcons">
              <svg viewBox="0 0 18 12" className="cst-statusSignal"><rect x="0" y="8" width="3" height="4" rx=".6"/><rect x="5" y="5.5" width="3" height="6.5" rx=".6"/><rect x="10" y="3" width="3" height="9" rx=".6"/><rect x="15" y="0" width="3" height="12" rx=".6"/></svg>
              <svg viewBox="0 0 16 12" className="cst-statusWifi"><path d="M8 11.2 1.3 4.6a9.4 9.4 0 0 1 13.4 0Z"/><path d="M8 11.2 4 7.3a5.7 5.7 0 0 1 8 0Z" opacity=".55"/></svg>
              <span className="cst-statusBattery"><i /></span>
            </span>
          </div>
          <div className="cst-feedArea">
            <div className="cst-feedTrack" key={reloadKey} style={{ transform: `translateY(-${i * 100}%)` }}>
              {films.map((film) => (
                <div key={film.slug} className="cst-feedSlide"><Player film={film} /></div>
              ))}
            </div>
            <span className="cst-homeBar" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="cst-feedNav" aria-hidden="false">
        <button className="cst-feedBtn" onClick={() => go(-1)} aria-label={t.prevFilm}><Svg sw={2}>{I2.up}</Svg></button>
        <div className="cst-feedDots">
          {films.map((film, k) => (
            <button key={film.slug} className={`cst-feedDot ${k === i ? "is-on" : ""}`} onClick={() => sel(k)} aria-label={film.title} />
          ))}
        </div>
        <button className="cst-feedBtn" onClick={() => go(1)} aria-label={t.nextFilm}><Svg sw={2}>{I2.down}</Svg></button>
      </div>

      <div className="cst-chip cst-chipA" key={`a${i}`}><b>{f.stats.likes}</b> {t.likes}</div>
      <div className="cst-chip cst-chipB" key={`b${i}`}><b>{f.stats.shares}</b> {t.shares}</div>
      <div className="cst-chip cst-chipC" key={`c${i}`}><span className="cst-chipDot" aria-hidden="true" />{t.phoneCap} · {f.title}</div>
    </div>

    {engaged && (
      <div className="cst-nowBar" role="status">
        <span className="cst-nowDot" aria-hidden="true" />
        <span className="cst-nowText">{t.phoneCap} · {f.title}</span>
        <button className="cst-nowStop" onClick={stop}>{t.stop}</button>
      </div>
    )}
   </>
  );
}

/* ═══════════════════════ FILM CARD ═══════════════════════ */
function FilmCard({ film, t }: { film: Film; t: T }) {
  return (
    <article className="cst-film" data-reveal>
      <div className="cst-poster">
        <Player film={film} />
        <span className="cst-lang">{film.lang}</span>
      </div>
      <div className="cst-filmBody">
        <h3 className="cst-filmTitle">{film.title}</h3>
        <p className="cst-filmLogline">{film.logline}</p>
        <dl className="cst-stats">
          <div><dt>{film.stats.likes || "—"}</dt><dd>{t.likes}</dd></div>
          <div><dt>{film.stats.comments || "—"}</dt><dd>{t.comments}</dd></div>
          <div><dt>{film.stats.shares || "—"}</dt><dd>{t.shares}</dd></div>
        </dl>
        <a className="cst-filmWatch" href={film.ig && film.ig !== INSTAGRAM_URL ? film.ig : film.fb} target="_blank" rel="noopener noreferrer">
          {film.ig && film.ig !== INSTAGRAM_URL ? t.openIg : t.openFb} <Svg sw={2.2}>{I.arrow}</Svg>
        </a>
      </div>
    </article>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function SupportPage({ initialLang = "en" }: { initialLang?: Lang }) {
  const [lang, otherPath, rememberChoice] = useLang(initialLang);
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
          <Link className="cst-langBtn" href={otherPath} hrefLang={lang === "en" ? "es" : "en"} onClick={rememberChoice} aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}>
            <span className={lang === "en" ? "is-on" : ""}>EN</span><i /><span className={lang === "es" ? "is-on" : ""}>ES</span>
          </Link>
          <a className="cst-barCta" href="#support">{t.barCta}</a>
        </nav>
      </header>

      <main>
        {/* ═══ HERO ═══ */}
        <section className="cst-hero">
          <div className="cst-heroDawn" aria-hidden="true" />
          <div className="cst-heroRays" aria-hidden="true" />
          <div className="cst-heroGrid">
            <div className="cst-heroCopy">
              <p className="cst-kicker">{t.kicker}</p>
              <h1 className="cst-h1">{t.h1a}<em>{t.h1b}</em></h1>
              <p className="cst-heroSub">{t.heroSub}</p>
              <div className="cst-heroCtas">
                <a className="cst-cta" href="#support">{t.ctaPrimary} <Svg sw={2}>{I.arrow}</Svg></a>
                <a className="cst-ghost" href="#films"><Svg sw={2} className="cst-ghostIcon">{I.play}</Svg>{t.ctaWatch}</a>
              </div>
              <ul className="cst-trust">
                {t.trust.map((line) => <li key={line}><i aria-hidden="true">✠</i>{line}</li>)}
              </ul>
            </div>

            <PhoneFeed films={FILMS} t={t} />
          </div>
          <div className="cst-litany" aria-hidden="true">
            <div className="cst-litanyTrack">
              {[...t.litany, ...t.litany].map((line, i) => <span key={i} className="cst-litanyItem"><i>✠</i>{line}</span>)}
            </div>
          </div>
        </section>

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
            {FILMS.map((f) => <FilmCard key={f.slug} film={f} t={t} />)}
          </div>
          <p className="cst-seeAll" data-reveal><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{t.seeAll}</a></p>
        </section>

        {/* ═══ STORY BREAK ═══ */}
        <section className="cst-break">
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
              <Player film={MISSION_FILM} />
            </div>
            <span className="cst-missionCap">{t.missionCap}</span>
          </div>
          <div className="cst-missionCopy" data-reveal>
            <p className="cst-eyebrow">{t.missionEyebrow}</p>
            <blockquote className="cst-verse"><p>“{t.missionVerse}”</p><cite>{t.missionVerseRef}</cite></blockquote>
            <h2 className="cst-h2">{t.missionH2}</h2>
            <p>{t.missionP1}</p>
            <p>{t.missionP2}</p>
            <p className="cst-missionCall">{t.missionP3}</p>
          </div>
        </section>

        {/* ═══ WITNESSES — a printed litany (or portraits, when the frames exist) ═══ */}
        <section className="cst-witnesses">
          <div className="cst-witnessGlow" aria-hidden="true" />
          <div className="cst-head cst-headCenter" data-reveal>
            <p className="cst-eyebrow">{t.saintsEyebrow}</p>
            <h2 className="cst-h2">{t.saintsH2}</h2>
            <p className="cst-lede">{t.saintsLede}</p>
          </div>

          {WITNESS_PORTRAITS ? (
            <ul className="cst-portraits">
              {t.saints.map(([name, role], i) => (
                <li key={name} className="cst-portrait" data-reveal>
                  <Still src={`${A}/witness-${WITNESS_SLUGS[i]}.jpg`} alt={name} />
                  <span className="cst-portraitShade" aria-hidden="true" />
                  <span className="cst-portraitText">
                    <span className="cst-portraitName">{name}</span>
                    <span className="cst-portraitRole">{role}</span>
                    <span className="cst-portraitPray">{t.prayForUs}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="cst-litanyList">
              {t.saints.map(([name, role], i) => (
                <li key={name} className="cst-litanyRow" data-reveal style={{ transitionDelay: `${(i % 6) * 60}ms` }}>
                  <span className="cst-litanyN" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cst-litanyCall">
                    <span className="cst-litanyName"><i aria-hidden="true">✠</i>{name}</span>
                    <span className="cst-litanyRole">{role}</span>
                  </span>
                  <span className="cst-litanyDots" aria-hidden="true" />
                  <span className="cst-litanyResp">{t.prayForUs}</span>
                </li>
              ))}
              <li className="cst-litanyRow cst-litanyFinal" data-reveal>
                <span className="cst-litanyN" aria-hidden="true">✠</span>
                <span className="cst-litanyCall"><span className="cst-litanyName">{t.litanyClose}</span></span>
                <span className="cst-litanyDots" aria-hidden="true" />
                <span className="cst-litanyResp">{t.litanyCloseR}</span>
              </li>
            </ol>
          )}
        </section>

        {/* ═══ THE MISSION, MEASURED ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.measuredEyebrow}</p>
            <h2 className="cst-h2">{t.measuredH2}</h2>
            <p className="cst-lede">{t.measuredLede}</p>
          </div>
          <div className="cst-measured">
            {t.measured.map(([title, text], i) => (
              <div key={title} className="cst-measure" data-reveal>
                <span className="cst-measureN">{["I", "II", "III"][i]}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SOURCES — editorial two-column ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.sourcesEyebrow}</p>
            <h2 className="cst-h2">{t.sourcesH2}</h2>
            <p className="cst-lede">{t.sourcesLede}</p>
          </div>
          <div className="cst-sources">
            <div className="cst-source" data-reveal>
              <span className="cst-sourceTier">Tier 1</span>
              <h3>{t.tier1}</h3>
              <p>{t.tier1Text}</p>
            </div>
            <div className="cst-source" data-reveal>
              <span className="cst-sourceTier">Tier 2</span>
              <h3>{t.tier2}</h3>
              <p>{t.tier2Text}</p>
            </div>
          </div>
          <p className="cst-sourceNote" data-reveal><strong>{t.notUsed}</strong> {t.notUsedText}</p>
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
              <div key={title} className="cst-nextItem" data-reveal>
                <span className="cst-nextN">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FOLLOW & SHARE ═══ */}
        <section className="cst-section">
          <div className="cst-head" data-reveal>
            <p className="cst-eyebrow">{t.followEyebrow}</p>
            <h2 className="cst-h2">{t.followH2}</h2>
            <p className="cst-lede">{t.followLede}</p>
          </div>
          <ul className="cst-socials">
            {SOCIALS.map((s) => (
              <li key={s.key} data-reveal>
                <a className="cst-social" href={s.href} target="_blank" rel="noopener noreferrer">
                  <span className="cst-socialIcon"><Svg sw={1.7}>{SOCIAL_ICON[s.key]}</Svg></span>
                  <span className="cst-socialBody">
                    <span className="cst-socialName">{s.name}</span>
                    <span className="cst-socialHandle">{s.handle}</span>
                  </span>
                  <span className="cst-socialCount"><b>{s.count}</b>{t.followers}</span>
                  <span className="cst-socialGo">{t.follow} <Svg sw={2.2}>{I.arrow}</Svg></span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ═══ CATHOLICPROJECTS ═══ */}
        <section className="cst-section">
          <div className="cst-cp" data-reveal>
            <div className="cst-cpLogoWrap"><img className="cst-cpLogo" src={CP_LOGO} alt="CatholicProjects.org" /></div>
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
              <a key={name} className={`cst-tier ${i === 1 ? "is-featured" : ""}`} href={TIER_LINKS[i]} target="_blank" rel="noopener noreferrer" data-reveal>
                {i === 1 && <span className="cst-tierFlag">{t.featured}</span>}
                <span className="cst-tierName">{name}</span>
                <span className="cst-tierAmt"><sup>$</sup>{TIER_AMOUNTS[i]}<span className="cst-tierPer">{t.perMo}{i === 3 ? "+" : ""}</span></span>
                <span className="cst-tierLine">{line}</span>
                <span className="cst-tierGo">{t.support} <Svg sw={2.2}>{I.arrow}</Svg></span>
              </a>
            ))}
          </div>
          <p className="cst-recurringNote" data-reveal>{t.recurringNote}</p>
          <p className="cst-noPerks" data-reveal>{t.noPerks}</p>
          <div className="cst-alt" data-reveal>
            <a className="cst-altBtn" href={GIVE_ONCE_LINK} target="_blank" rel="noopener noreferrer">{t.giveOnce}</a>
            <a className="cst-altBtn" href={`mailto:${CONTACT}`}>{t.ask}</a>
          </div>
          <div className="cst-fine" data-reveal>
            <h3>{t.fineH}</h3>
            <p>{t.fine.split(t.notDeductible).map((part, i, arr) => <span key={i}>{part}{i < arr.length - 1 && <strong>{t.notDeductible}</strong>}</span>)}</p>
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
  --text:#F4ECDD;--muted:#BBAB94;--faint:#8F8069;--tile:#D8CBB2;
  --serif:var(--cst-serif),"Cormorant Garamond",Georgia,serif;--sans:var(--cst-ui),Inter,system-ui,sans-serif;
  position:relative;isolation:isolate;min-height:100svh;display:flex;flex-direction:column;overflow-x:clip;
  background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;-webkit-font-smoothing:antialiased;
}
.cst,.cst *,.cst *::before,.cst *::after{box-sizing:border-box;}
.cst :where(a){color:inherit;text-decoration:none;}
.cst :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;}
.cst a:focus-visible,.cst button:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px;}
.cst ::selection{background:rgba(201,163,86,.3);}
.cst-grain{position:fixed;inset:0;z-index:40;pointer-events:none;opacity:.055;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");}
[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity 900ms cubic-bezier(.2,.65,.2,1),transform 900ms cubic-bezier(.2,.65,.2,1);}
[data-reveal].is-in{opacity:1;transform:none;}

/* still + fallback */
.cst-still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 18%;display:block;}
.cst-stillFallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:20px;text-align:center;
  background:radial-gradient(80% 60% at 50% 30%,rgba(201,163,86,.18),transparent 70%),linear-gradient(180deg,var(--panel2),var(--bg));}
.cst-stillFallback span{font-family:var(--serif);font-size:56px;color:rgba(201,163,86,.35);}
.cst-stillFallback b{font-family:var(--serif);font-weight:600;font-size:22px;color:var(--muted);}

/* bar */
.cst-bar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px clamp(20px,4vw,44px);
  background:rgba(18,13,9,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(201,163,86,.1);}
.cst-mark{display:inline-flex;align-items:center;gap:16px;}
.cst-markTile{display:inline-flex;align-items:center;padding:3px 6px;border-radius:8px;background:var(--tile);box-shadow:0 6px 18px -8px rgba(0,0,0,.8),inset 0 0 0 1px rgba(201,163,86,.25);}
.cst-markLogo{height:40px;width:auto;display:block;}
.cst-markDivider{width:1px;height:22px;background:var(--hair);}
.cst-markText{font-family:var(--serif);font-weight:600;font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-bright);}
.cst-barNav{display:flex;align-items:center;gap:18px;}
.cst-langBtn{text-decoration:none;display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid var(--hair-soft);border-radius:999px;background:rgba(18,13,9,.4);font-size:11.5px;font-weight:800;letter-spacing:.12em;color:var(--faint);transition:border-color 150ms;}
.cst-langBtn:hover{border-color:var(--gold-dim);}
.cst-langBtn span.is-on{color:var(--gold-bright);}
.cst-langBtn i{width:1px;height:12px;background:var(--hair);}
.cst-barCta{padding:9px 18px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:background 160ms,color 160ms;}
.cst-barCta:hover{background:var(--gold);color:#17110A;}

/* hero — split: the ask on the left, the feed on the right */
.cst-hero{position:relative;min-height:min(92svh,880px);display:flex;align-items:center;overflow:hidden;background:radial-gradient(70% 60% at 70% 40%,rgba(201,163,86,.12),transparent 70%),linear-gradient(180deg,#241A10 0%,#1A130D 50%,var(--bg) 100%);}
.cst-heroDawn{position:absolute;inset:0;z-index:0;mix-blend-mode:screen;animation:cst-breathe 9s ease-in-out infinite alternate;pointer-events:none;
  background:radial-gradient(50% 45% at 72% 0%,rgba(255,220,140,.35),rgba(230,180,90,.12) 40%,transparent 72%);}
@keyframes cst-breathe{from{opacity:.8}to{opacity:1}}
.cst-heroRays{position:absolute;inset:-20% 0 0;z-index:0;mix-blend-mode:screen;opacity:.22;pointer-events:none;
  background:conic-gradient(from 180deg at 72% 0%,transparent 0 8%,rgba(255,225,160,.18) 10%,transparent 12%,transparent 20%,rgba(255,225,160,.14) 22%,transparent 24%,transparent 30%,rgba(255,225,160,.2) 32%,transparent 34%,transparent 40%,rgba(255,225,160,.12) 42%,transparent 44%,transparent 56%,rgba(255,225,160,.12) 58%,transparent 60%,transparent 66%,rgba(255,225,160,.2) 68%,transparent 70%,transparent 76%,rgba(255,225,160,.14) 78%,transparent 80%);
  -webkit-mask-image:radial-gradient(60% 90% at 72% 0%,#000 30%,transparent 100%);mask-image:radial-gradient(60% 90% at 72% 0%,#000 30%,transparent 100%);}
.cst-heroGrid{position:relative;z-index:2;width:min(1200px,calc(100% - 40px));margin:0 auto;padding:110px 0 150px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(32px,5vw,72px);align-items:center;}
.cst-heroCopy{max-width:640px;}
.cst-kicker{margin:0 0 24px;color:var(--gold-bright);font-size:12px;font-weight:700;letter-spacing:.34em;text-transform:uppercase;}
.cst-h1{margin:0 0 22px;font-family:var(--serif);font-weight:600;font-size:clamp(3rem,6.4vw,5.4rem);line-height:1.0;letter-spacing:-.015em;color:#FBF4E6;}
.cst-h1 em{display:block;margin-top:10px;font-style:italic;font-weight:500;font-size:.56em;background:linear-gradient(100deg,#E6C97F 10%,#FFF0C8 45%,#E6C97F 90%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.cst-heroSub{margin:0;max-width:54ch;color:#D9CDB8;font-size:clamp(1rem,1.4vw,1.12rem);line-height:1.75;}
.cst-heroCtas{margin:34px 0 0;display:flex;flex-wrap:wrap;gap:14px;}
.cst-trust{margin:30px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:10px 26px;}
.cst-trust li{display:inline-flex;align-items:center;gap:9px;color:var(--muted);font-size:13px;font-weight:600;}
.cst-trust i{font-style:normal;font-size:11px;color:var(--gold);}

/* the phone */
.cst-heroPhoneWrap{position:relative;display:flex;justify-content:center;align-items:center;padding:20px 0;}
.cst-phoneGlow{position:absolute;width:120%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(201,163,86,.28),rgba(201,163,86,.08) 40%,transparent 68%);filter:blur(10px);pointer-events:none;animation:cst-breathe 7s ease-in-out infinite alternate;}
.cst-phone{position:relative;width:min(300px,78vw);border-radius:48px;padding:12px;background:linear-gradient(160deg,#3A2D20 0%,#1A130D 40%,#0E0A07 100%);
  box-shadow:0 0 0 1.5px rgba(201,163,86,.45),0 0 0 3px rgba(0,0,0,.7),inset 0 0 0 1px rgba(255,255,255,.08),inset 0 1px 0 rgba(255,255,255,.12),0 60px 110px -40px rgba(0,0,0,1),0 30px 60px -30px rgba(201,163,86,.25);
  animation:cst-float 8s ease-in-out infinite;}
@keyframes cst-float{0%,100%{transform:translateY(0) rotate(-1.2deg)}50%{transform:translateY(-10px) rotate(-1.2deg)}}
/* physical buttons on the bezel */
.cst-phoneBtn{position:absolute;width:3px;border-radius:2px;background:linear-gradient(180deg,#5A4A36,#2A2018);box-shadow:0 0 0 1px rgba(0,0,0,.6);}
.cst-phoneBtnMute{left:-4px;top:17%;height:26px;}
.cst-phoneBtnVolUp{left:-4px;top:25%;height:48px;}
.cst-phoneBtnVolDn{left:-4px;top:35%;height:48px;}
.cst-phoneBtnPower{right:-4px;top:27%;height:72px;}
/* screen with glass highlight */
.cst-phoneScreen{position:relative;width:100%;border-radius:37px;overflow:hidden;background:#000;display:flex;flex-direction:column;}
.cst-phoneScreen::after{content:"";position:absolute;inset:0;z-index:6;pointer-events:none;border-radius:inherit;
  background:linear-gradient(115deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.02) 28%,transparent 45%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);}
/* status bar */
.cst-statusBar{position:relative;z-index:5;height:44px;flex:0 0 44px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 22px 0 26px;background:#000;color:#F4ECDD;}
.cst-statusTime{font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:-.01em;}
.cst-statusIsland{width:92px;height:26px;border-radius:999px;background:#0A0806;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05);}
.cst-statusIcons{display:flex;align-items:center;justify-content:flex-end;gap:6px;}
.cst-statusSignal{width:17px;height:11px;fill:#F4ECDD;}
.cst-statusWifi{width:15px;height:11px;fill:#F4ECDD;}
.cst-statusBattery{position:relative;width:25px;height:12px;border:1.5px solid rgba(244,236,221,.5);border-radius:4px;padding:1.5px;}
.cst-statusBattery::after{content:"";position:absolute;right:-4px;top:3px;width:2px;height:5px;border-radius:0 1px 1px 0;background:rgba(244,236,221,.5);}
.cst-statusBattery i{display:block;width:80%;height:100%;border-radius:2px;background:#F4ECDD;}
/* feed area */
.cst-feedArea{position:relative;width:100%;aspect-ratio:9/16;overflow:hidden;background:#000;}
.cst-homeBar{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:5;width:38%;height:5px;border-radius:999px;background:rgba(244,236,221,.85);pointer-events:none;}
.cst-feedTrack{position:absolute;inset:0;transition:transform 700ms cubic-bezier(.65,0,.2,1);}
.cst-feedSlide{position:relative;width:100%;height:100%;}
.cst-feedSlide .cst-fbVideo{position:absolute;inset:0;}
.cst-heroPhoneWrap:focus-visible{outline:none;}
.cst-heroPhoneWrap:focus-visible .cst-phone{box-shadow:0 0 0 2px var(--gold),0 60px 110px -40px rgba(0,0,0,1);}
/* feed controls */
.cst-feedNav{position:absolute;right:calc(50% - min(300px,78vw)/2 - 58px);top:50%;transform:translateY(-50%);z-index:5;display:flex;flex-direction:column;align-items:center;gap:12px;}
.cst-feedBtn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,163,86,.35);border-radius:50%;background:rgba(18,13,9,.7);backdrop-filter:blur(8px);color:var(--gold-bright);transition:background 160ms,color 160ms,transform 160ms;}
.cst-feedBtn:focus-visible,.cst-feedDot:focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:999px;}
.cst-feedBtn:focus:not(:focus-visible){outline:none;}
.cst-feedBtn:hover{background:var(--gold);color:#17110A;transform:scale(1.06);}
.cst-feedBtn svg{width:16px;height:16px;}
.cst-feedDots{display:flex;flex-direction:column;gap:8px;padding:6px 0;}
.cst-feedDot{width:6px;height:6px;border-radius:50%;background:rgba(201,163,86,.3);transition:background 200ms,transform 200ms,height 200ms;}
.cst-feedDot.is-on{background:var(--gold-bright);height:18px;border-radius:999px;}
.cst-feedDot:hover{background:var(--gold);}
.cst-chip{position:absolute;z-index:4;display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid rgba(201,163,86,.35);border-radius:999px;background:rgba(18,13,9,.78);backdrop-filter:blur(10px);color:var(--muted);font-size:12px;font-weight:600;box-shadow:0 14px 30px -14px rgba(0,0,0,.9);white-space:nowrap;}
.cst-chip b{font-family:var(--serif);font-weight:600;font-size:17px;color:var(--gold-bright);}
.cst-chipA{top:18%;left:calc(50% - min(300px,78vw)/2 - 70px);animation:cst-float 9s ease-in-out infinite,cst-chipIn 500ms ease;animation-delay:-2s,0s;}
.cst-chipB{top:62%;left:calc(50% - min(300px,78vw)/2 - 54px);animation:cst-float 10s ease-in-out infinite,cst-chipIn 500ms ease;animation-delay:-5s,0s;}
.cst-chipC{bottom:-8px;left:50%;transform:translateX(-50%);font-family:var(--serif);font-style:italic;font-size:14px;color:var(--text);animation:cst-chipIn 500ms ease;}
@keyframes cst-chipIn{from{opacity:0}to{opacity:1}}
.cst-chipDot{width:7px;height:7px;border-radius:50%;background:#E25D4B;box-shadow:0 0 0 3px rgba(226,93,75,.25);animation:cst-pulse 1.6s ease-in-out infinite;}
@keyframes cst-pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* sticky "now playing — stop" bar (appears once a reel is tapped, findable even after scrolling) */
.cst-nowBar{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:60;display:inline-flex;align-items:center;gap:12px;max-width:calc(100% - 32px);padding:9px 10px 9px 16px;border:1px solid var(--gold-dim);border-radius:999px;background:rgba(18,13,9,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 18px 44px -16px rgba(0,0,0,.95);animation:cst-nowIn 300ms cubic-bezier(.2,.65,.2,1);}
@keyframes cst-nowIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.cst-nowDot{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:#E25D4B;box-shadow:0 0 0 3px rgba(226,93,75,.25);animation:cst-pulse 1.6s ease-in-out infinite;}
.cst-nowText{min-width:0;color:var(--muted);font-family:var(--serif);font-style:italic;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cst-nowStop{flex:0 0 auto;display:inline-flex;align-items:center;padding:8px 18px;border-radius:999px;background:var(--gold);color:#17110A;font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;transition:background 150ms;}
.cst-nowStop:hover{background:var(--gold-bright);}
.cst-cta{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 26px;border-radius:999px;background:linear-gradient(135deg,#E6C97F,#C9A356 55%,#A8823C);color:#17110A;font-size:15px;font-weight:800;box-shadow:0 10px 36px -10px rgba(201,163,86,.6);transition:transform 160ms,box-shadow 160ms;}
.cst-cta:hover{transform:translateY(-2px);box-shadow:0 16px 44px -10px rgba(201,163,86,.7);}
.cst-cta svg{width:17px;height:17px;}
.cst-ghost{display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:15px 24px;border:1px solid rgba(243,234,218,.28);border-radius:999px;background:rgba(18,13,9,.35);backdrop-filter:blur(8px);font-size:15px;font-weight:700;transition:border-color 160ms,background 160ms;}
.cst-ghost:hover{border-color:var(--gold-dim);background:rgba(201,163,86,.12);}
.cst-ghostIcon{width:14px;height:14px;color:var(--gold-bright);}

/* litany — now with real presence */
.cst-litany{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:22px 0 24px;border-top:1px solid rgba(201,163,86,.22);background:linear-gradient(180deg,rgba(18,13,9,0),rgba(18,13,9,.75));overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);}
.cst-litanyTrack{display:flex;width:max-content;animation:cst-litany 120s linear infinite;}
.cst-litanyItem{display:inline-flex;align-items:center;gap:16px;padding:0 32px;white-space:nowrap;font-family:var(--serif);font-style:italic;font-size:22px;color:var(--gold-bright);letter-spacing:.01em;text-shadow:0 2px 16px rgba(0,0,0,.7);}
.cst-litanyItem i{font-style:normal;font-size:12px;color:var(--gold);}
@keyframes cst-litany{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cst-litany:hover .cst-litanyTrack{animation-play-state:paused;}

/* band */
.cst-band{width:min(840px,calc(100% - 40px));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--hair);}
.cst-band>div{padding:22px 10px;display:flex;flex-direction:column;gap:5px;text-align:center;}
.cst-band>div+div{border-left:1px solid var(--hair-soft);}
.cst-band dt{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(1.6rem,2.8vw,2.2rem);color:var(--gold-bright);line-height:1;}
.cst-band dd{margin:0;color:var(--faint);font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;}

/* sections */
.cst-section{width:min(1200px,calc(100% - 40px));margin:0 auto;padding:clamp(56px,8vh,96px) 0 0;scroll-margin-top:40px;}
.cst-head{max-width:680px;margin-bottom:clamp(24px,4vh,40px);}
.cst-headCenter{margin-left:auto;margin-right:auto;text-align:center;}
.cst-headWide{max-width:780px;}
.cst-eyebrow{margin:0 0 14px;color:var(--gold);font-size:11.5px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;}
.cst-h2{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(2.1rem,4.4vw,3.4rem);line-height:1.08;letter-spacing:-.01em;}
.cst-h2Small{font-size:clamp(1.7rem,3vw,2.4rem);}
.cst-lede{margin:16px 0 0;color:var(--muted);font-size:16.5px;line-height:1.7;}

/* films */
.cst-films{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.cst-film{display:flex;flex-direction:column;border:1px solid var(--hair-soft);border-radius:20px;overflow:hidden;background:var(--panel);transition:transform 260ms ease,border-color 260ms,box-shadow 260ms;}
.cst-film:hover{transform:translateY(-6px);border-color:var(--gold-dim);box-shadow:0 36px 70px -34px rgba(0,0,0,.95),0 0 0 1px rgba(201,163,86,.08);}
.cst-poster{position:relative;display:block;width:100%;aspect-ratio:9/16;background:#000;overflow:hidden;}
.cst-fbVideo{position:absolute;inset:0;width:100%;height:100%;}
.cst-fbVideo>span,.cst-fbVideo iframe{width:100%!important;height:100%!important;display:block;}
.cst-lang{position:absolute;left:14px;bottom:14px;z-index:2;pointer-events:none;padding:5px 11px;border:1px solid rgba(230,201,127,.4);border-radius:999px;background:rgba(18,13,9,.65);backdrop-filter:blur(6px);color:var(--gold-bright);font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;}
.cst-filmBody{display:flex;flex-direction:column;flex:1;padding:18px 18px 18px;}
.cst-filmWatch{margin-top:14px;display:inline-flex;align-items:center;gap:6px;color:var(--gold-bright);font-size:13px;font-weight:700;white-space:nowrap;}
.cst-filmWatch svg{width:14px;height:14px;transition:transform 160ms;}
.cst-film:hover .cst-filmWatch svg{transform:translateX(3px);}
.cst-filmTitle{margin:0;font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.15;}
.cst-filmLogline{margin:8px 0 0;color:var(--muted);font-family:var(--serif);font-style:italic;font-size:16px;line-height:1.5;}
.cst-stats{margin:auto 0 0;padding:14px 0 0;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--hair-soft);margin-top:16px;}
.cst-stats>div{display:flex;flex-direction:column;gap:2px;}
.cst-stats>div+div{border-left:1px solid var(--hair-soft);padding-left:12px;}
.cst-stats dt{margin:0;font-family:var(--serif);font-weight:600;font-size:20px;line-height:1;color:var(--gold-bright);}
.cst-stats dd{margin:0;color:var(--faint);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;}
.cst-seeAll{margin:28px 0 0;text-align:center;}
.cst-seeAll a{color:var(--muted);font-size:14px;font-weight:600;border-bottom:1px solid var(--hair);padding-bottom:3px;transition:color 150ms,border-color 150ms;}
.cst-seeAll a:hover{color:var(--gold-bright);border-color:var(--gold-dim);}

/* story break */
.cst-break{position:relative;margin-top:clamp(48px,7vh,80px);padding:clamp(40px,6vh,64px) 0;display:flex;align-items:center;justify-content:center;background:var(--bg);}
.cst-breakShade{position:absolute;inset:0;background:radial-gradient(50% 80% at 50% 50%,rgba(201,163,86,.09),transparent 70%);}
.cst-quote{position:relative;width:min(860px,calc(100% - 40px));margin:0;padding:0;text-align:center;}
.cst-quote blockquote{margin:0;font-family:var(--serif);font-style:italic;font-weight:500;color:var(--gold-bright);font-size:clamp(1.9rem,4.2vw,3.2rem);line-height:1.3;text-shadow:0 4px 40px rgba(0,0,0,.85);}
.cst-quote figcaption{margin-top:20px;color:var(--text);font-size:12px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;opacity:.85;}
.cst-quote::before,.cst-quote::after{content:"";display:block;width:56px;height:1px;margin:0 auto;background:var(--gold-dim);}
.cst-quote::before{margin-bottom:24px}.cst-quote::after{margin-top:24px}

/* mission */
.cst-mission{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,5vw,72px);align-items:center;}
.cst-missionStill{position:relative;max-width:400px;margin:0 auto;padding:10px;border-radius:26px;background:linear-gradient(160deg,rgba(201,163,86,.35),rgba(201,163,86,.06) 50%,rgba(201,163,86,.25));box-shadow:0 50px 100px -40px rgba(0,0,0,.95),0 0 0 1px rgba(201,163,86,.12);}
.cst-missionFrame{position:relative;display:block;width:100%;aspect-ratio:9/16;border-radius:18px;background:#000;overflow:hidden;}
.cst-missionCap{display:block;padding:14px 6px 2px;text-align:center;color:var(--faint);font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;}
.cst-verse{margin:0 0 22px;padding:0;}
.cst-verse p{margin:0;font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,1.9vw,1.5rem);line-height:1.4;color:var(--gold-bright);}
.cst-verse cite{display:block;margin-top:6px;color:var(--faint);font-style:normal;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;}
.cst-missionCopy p:not(.cst-eyebrow){margin:18px 0 0;color:var(--muted);font-size:16.5px;line-height:1.85;}
.cst-missionCopy .cst-missionCall{margin-top:26px;padding:22px 24px;border:1px solid var(--hair);border-left:3px solid var(--gold);border-radius:0 16px 16px 0;background:linear-gradient(90deg,rgba(201,163,86,.09),transparent);color:var(--text);font-family:var(--serif);font-size:21px;line-height:1.55;}

/* witnesses */
.cst-witnesses{position:relative;margin-top:clamp(56px,8vh,96px);padding:clamp(40px,6vh,72px) 0 8px;}
.cst-witnesses .cst-head{padding:0 20px;}
.cst-witnessGlow{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(60% 50% at 50% 0%,rgba(201,163,86,.1),transparent 70%);}

/* the printed litany */
.cst-litanyList{width:min(960px,calc(100% - 40px));margin:0 auto;padding:0;list-style:none;border-top:1px solid var(--hair);}
.cst-litanyRow{display:grid;grid-template-columns:48px 1fr auto auto;align-items:baseline;gap:18px;padding:22px 8px;border-bottom:1px solid var(--hair-soft);transition:background 200ms,opacity 900ms cubic-bezier(.2,.65,.2,1),transform 900ms cubic-bezier(.2,.65,.2,1);}
.cst-litanyRow:hover{background:rgba(201,163,86,.035);}
.cst-litanyN{font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.1em;}
.cst-litanyCall{display:flex;flex-direction:column;gap:4px;min-width:0;}
.cst-litanyName{font-family:var(--serif);font-weight:600;font-size:clamp(1.45rem,2.4vw,2.1rem);line-height:1.1;color:var(--text);}
.cst-litanyName i{display:inline-block;width:0;overflow:hidden;margin-right:0;font-style:normal;font-size:.65em;color:var(--gold);vertical-align:.1em;opacity:0;transition:width 220ms ease,margin-right 220ms ease,opacity 220ms ease;}
.cst-litanyRow:hover .cst-litanyName i{width:.9em;margin-right:.35em;opacity:1;}
.cst-litanyRole{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.35;color:var(--faint);}
.cst-litanyDots{flex:1;align-self:center;min-width:40px;height:1px;background:repeating-linear-gradient(90deg,var(--gold-dim) 0 2px,transparent 2px 7px);opacity:.6;}
.cst-litanyResp{font-family:var(--serif);font-style:italic;font-size:clamp(1.05rem,1.5vw,1.3rem);color:var(--gold-bright);white-space:nowrap;}
.cst-litanyFinal{margin-top:14px;padding-top:30px;padding-bottom:30px;border-top:1px solid var(--hair);border-bottom:0;}
.cst-litanyFinal .cst-litanyN{font-size:18px;}
.cst-litanyFinal .cst-litanyName{font-size:clamp(1.6rem,2.8vw,2.4rem);font-style:italic;font-weight:500;}
.cst-litanyFinal .cst-litanyResp{font-size:clamp(1.2rem,1.9vw,1.6rem);}
.cst-portraits{margin:0;padding:0 clamp(12px,2vw,24px);list-style:none;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;}
.cst-portrait{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:12px;background:var(--panel2);}
.cst-portrait .cst-still{object-position:center 15%;transition:transform 1100ms cubic-bezier(.2,.65,.2,1),filter 400ms;filter:saturate(.85) brightness(.92);}
.cst-portrait:hover .cst-still{transform:scale(1.06);filter:saturate(1) brightness(1);}
.cst-portraitShade{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,transparent 40%,rgba(18,13,9,.55) 70%,rgba(18,13,9,.95) 100%);}
.cst-portraitText{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 12px 14px;display:flex;flex-direction:column;gap:3px;}
.cst-portraitName{font-family:var(--serif);font-weight:600;font-size:clamp(14px,1.25vw,19px);line-height:1.15;color:var(--text);}
.cst-portraitRole{font-family:var(--serif);font-style:italic;font-size:clamp(11px,.95vw,14px);line-height:1.3;color:var(--muted);}
.cst-portraitPray{margin-top:4px;color:var(--gold);font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;}
.cst-portrait .cst-stillFallback span{font-size:32px}.cst-portrait .cst-stillFallback b{display:none}

/* measured */
.cst-measured{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--hair);}
.cst-measure{padding:30px clamp(16px,2.5vw,36px) 26px 0;border-bottom:1px solid var(--hair);}
.cst-measure+.cst-measure{padding-left:clamp(16px,2.5vw,36px);border-left:1px solid var(--hair-soft);}
.cst-measureN{display:block;margin-bottom:18px;font-family:var(--serif);font-size:38px;line-height:1;color:var(--gold);}
.cst-measure h3{margin:0 0 10px;font-family:var(--serif);font-weight:600;font-size:30px;line-height:1.1;}
.cst-measure p{margin:0;color:var(--muted);font-size:15px;line-height:1.7;}

/* sources — editorial */
.cst-sources{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,64px);border-top:1px solid var(--hair);padding-top:28px;}
.cst-sourceTier{display:block;margin-bottom:10px;color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;}
.cst-source h3{margin:0 0 12px;font-family:var(--serif);font-weight:600;font-size:28px;line-height:1.1;}
.cst-source p{margin:0;color:var(--muted);font-size:15.5px;line-height:1.75;}
.cst-sourceNote{margin:28px 0 0;padding-top:20px;border-top:1px solid var(--hair-soft);color:var(--faint);font-size:14px;line-height:1.7;max-width:80ch;}
.cst-sourceNote strong{color:var(--muted);font-weight:700;}

/* ledger */
.cst-ledger{margin:0;padding:0;list-style:none;border-top:1px solid var(--hair);}
.cst-row{display:grid;grid-template-columns:72px 260px 1fr;gap:20px;align-items:baseline;padding:20px 6px;border-bottom:1px solid var(--hair-soft);transition:background 160ms;}
.cst-row:hover{background:rgba(201,163,86,.03);}
.cst-rowN{font-family:var(--serif);font-size:15px;color:var(--gold);letter-spacing:.1em;}
.cst-rowTitle{font-family:var(--serif);font-weight:600;font-size:24px;}
.cst-rowText{color:var(--muted);font-size:15px;line-height:1.7;max-width:58ch;}

/* next — ruled columns, not boxes */
.cst-next{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,48px);border-top:1px solid var(--hair);padding-top:28px;}
.cst-nextN{display:block;margin-bottom:12px;font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.1em;}
.cst-nextItem h3{margin:0 0 10px;font-family:var(--serif);font-weight:600;font-size:24px;line-height:1.15;}
.cst-nextItem p{margin:0;color:var(--muted);font-size:14.5px;line-height:1.7;}

/* follow & share */
.cst-socials{margin:0;padding:0;list-style:none;border-top:1px solid var(--hair);}
.cst-social{display:grid;grid-template-columns:52px 1fr auto auto;align-items:center;gap:22px;padding:20px 8px;border-bottom:1px solid var(--hair-soft);transition:background 160ms;}
.cst-social:hover{background:rgba(201,163,86,.035);}
.cst-socialIcon{width:52px;height:52px;display:flex;align-items:center;justify-content:center;border:1px solid var(--hair);border-radius:14px;background:rgba(201,163,86,.06);color:var(--gold-bright);transition:background 160ms,color 160ms,border-color 160ms;}
.cst-socialIcon svg{width:24px;height:24px;}
.cst-social:hover .cst-socialIcon{background:var(--gold);color:#17110A;border-color:var(--gold);}
.cst-socialBody{display:flex;flex-direction:column;gap:2px;min-width:0;}
.cst-socialName{font-family:var(--serif);font-weight:600;font-size:24px;line-height:1.1;}
.cst-socialHandle{color:var(--faint);font-size:13px;}
.cst-socialCount{display:flex;align-items:baseline;gap:7px;color:var(--faint);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;}
.cst-socialCount b{font-family:var(--serif);font-weight:600;font-size:24px;letter-spacing:0;color:var(--gold-bright);}
.cst-socialGo{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:1px solid var(--gold-dim);border-radius:999px;color:var(--gold-bright);font-size:13px;font-weight:800;white-space:nowrap;transition:background 160ms,color 160ms;}
.cst-social:hover .cst-socialGo{background:var(--gold);color:#17110A;}
.cst-socialGo svg{width:14px;height:14px;}

/* catholicprojects */
.cst-cp{display:grid;grid-template-columns:auto 1fr;gap:clamp(28px,5vw,64px);align-items:center;padding:clamp(28px,4vw,48px);border:1px solid var(--hair);border-radius:24px;background:linear-gradient(135deg,rgba(201,163,86,.1),rgba(201,163,86,.03) 55%,transparent);}
.cst-cpLogoWrap{display:flex;align-items:center;justify-content:center;padding:18px 26px;border-radius:16px;background:var(--tile);box-shadow:0 30px 60px -30px rgba(0,0,0,.9),inset 0 0 0 1px rgba(201,163,86,.25);}
.cst-cpLogo{height:64px;width:auto;display:block;}
.cst-cpText{margin:14px 0 0;color:var(--muted);font-size:15.5px;line-height:1.75;max-width:64ch;}
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
.cst-recurringNote{max-width:62ch;margin:24px auto 0;text-align:center;color:var(--muted);font-size:13.5px;line-height:1.6;}
.cst-noPerks{max-width:62ch;margin:14px auto 0;text-align:center;color:var(--faint);font-size:13px;line-height:1.7;}
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
@media (max-width:1100px){
  .cst-portraits{grid-template-columns:repeat(4,1fr);}
}
@media (max-width:1040px){
  .cst-films{grid-template-columns:repeat(2,1fr);}
  .cst-tiers{grid-template-columns:repeat(2,1fr);}
  .cst-measured{grid-template-columns:1fr;}
  .cst-measure+.cst-measure{padding-left:0;border-left:0;}
  .cst-next{grid-template-columns:1fr;}
  .cst-row{grid-template-columns:52px 1fr;}
  .cst-rowText{grid-column:2;}
}
@media (max-width:900px){
  .cst-heroGrid{grid-template-columns:1fr;padding:100px 0 140px;gap:48px;text-align:center;}
  .cst-heroCopy{max-width:640px;margin:0 auto;}
  .cst-heroSub{margin:0 auto;}
  .cst-heroCtas,.cst-trust{justify-content:center;}
  .cst-phone{width:min(260px,70vw);}
  .cst-chipA{left:calc(50% - min(260px,70vw)/2 - 60px);}
  .cst-chipB{left:calc(50% - min(260px,70vw)/2 - 46px);}
  .cst-feedNav{right:calc(50% - min(260px,70vw)/2 - 54px);}
}
@media (max-width:800px){
  .cst-mission{grid-template-columns:1fr;}
  .cst-missionStill{max-width:320px;}
  .cst-missionCopy .cst-missionCall{border-radius:16px;}
  .cst-band{grid-template-columns:repeat(2,1fr);}
  .cst-band>div:nth-child(3){border-left:0;}
  .cst-band>div:nth-child(n+3){border-top:1px solid var(--hair-soft);}
  .cst-break{background-attachment:scroll;}
  .cst-sources{grid-template-columns:1fr;}
  .cst-cp{grid-template-columns:1fr;text-align:center;}
  .cst-cpLogoWrap{width:fit-content;margin:0 auto;}
  .cst-cpText{margin-left:auto;margin-right:auto;}
}
@media (max-width:600px){
  .cst-markText,.cst-markDivider{display:none;}
  .cst-markLogo{height:30px;}
  .cst-markTile{padding:3px 5px;}
  .cst-heroGrid{padding:96px 0 130px;}
  .cst-kicker{letter-spacing:.22em;font-size:11px;}
  .cst-heroCtas{flex-direction:column;align-items:stretch;}
  .cst-cta,.cst-ghost{justify-content:center;width:100%;}
  .cst-trust{flex-direction:column;align-items:center;gap:8px;}
  .cst-chipA,.cst-chipB{display:none;}
  .cst-heroPhoneWrap{padding-bottom:70px;}
  .cst-feedNav{right:auto;left:50%;top:auto;bottom:0;transform:translateX(-50%);flex-direction:row;gap:10px;}
  .cst-feedDots{flex-direction:row;padding:0 6px;}
  .cst-feedDot.is-on{height:6px;width:18px;}
  .cst-chipC{bottom:auto;top:-10px;}
  .cst-social{grid-template-columns:44px 1fr;gap:12px 16px;}
  .cst-socialIcon{width:44px;height:44px;}
  .cst-socialCount,.cst-socialGo{grid-column:2;justify-self:start;}
  .cst-litanyItem{font-size:17px;padding:0 20px;}
  .cst-litanyRow{grid-template-columns:1fr;gap:6px;padding:18px 4px;}
  .cst-litanyN,.cst-litanyDots{display:none;}
  .cst-litanyResp{white-space:normal;}
  .cst-films{grid-template-columns:1fr;}
  .cst-portraits{grid-template-columns:repeat(2,1fr);}
  .cst-tiers{grid-template-columns:1fr;gap:14px;}
  .cst-tierLine{min-height:0;}
  .cst-row{padding:20px 2px;}
  .cst-fine{padding:20px;}
}
@media (prefers-reduced-motion:reduce){
  .cst *{transition:none!important;animation:none!important;}
  [data-reveal]{opacity:1;transform:none;}
}
`;