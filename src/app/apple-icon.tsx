import { ImageResponse } from "next/og";
import { MARK, MARK_VIEWBOX } from "@/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#04060d" }}>
        <svg viewBox={MARK_VIEWBOX.compact} width="140" height="140">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fdebc0" />
              <stop offset="0.5" stopColor="#f4c97a" />
              <stop offset="1" stopColor="#b9842f" />
            </linearGradient>
            <linearGradient id="t" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="-12" y2="0">
              <stop offset="0" stopColor="#7aa7ff" />
              <stop offset="1" stopColor="#7aa7ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform={MARK.transform}>
            <g fill="none" stroke="url(#t)" strokeWidth={2.6} strokeLinecap="round">
              {MARK.trails.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <path d={MARK.fish} fill="url(#g)" />
            <path d={MARK.eye} fill="#04060d" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
