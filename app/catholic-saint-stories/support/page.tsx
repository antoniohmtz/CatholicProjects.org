import type { Metadata } from "next";
import SupportPage from "../_components/SupportPage";
import { buildMetadata, buildJsonLd } from "../_lib/seo";

export const metadata: Metadata = buildMetadata("en");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd("en")) }} />
      <SupportPage initialLang="en" />
    </>
  );
}
