import { renderOg, OG_SIZE, OG_TYPE } from "../_lib/og";

export const runtime = "nodejs";
export const alt = "Catholic Saint Stories — es";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() { return renderOg("es"); }
