import type { Metadata } from "next";
import SupportPage from "../_components/SupportPage";
import { buildMetadata, buildJsonLd } from "../_lib/seo";

export const metadata: Metadata = buildMetadata("es");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd("es")) }} />
      <SupportPage initialLang="es" />
    </>
  );
}
