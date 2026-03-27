import { ImageResponse } from "next/og";

export const alt = "Westernize — AI-powered CV optimization for Western tech companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const unbounded = await fetch("https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&display=swap").then(
    (res) => res.text(),
  );

  // Extract the font URL from the CSS
  const fontUrl = unbounded.match(/src: url\((.+?)\)/)?.[1];
  const fontData = fontUrl ? await fetch(fontUrl).then((res) => res.arrayBuffer()) : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0a0a0a 0%, #18181b 40%, #1a1020 100%)",
        fontFamily: fontData ? "Unbounded" : "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,68,34,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,68,34,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* Glow behind logo */}
      <div
        style={{
          position: "absolute",
          top: "160px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,68,34,0.08) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "3px solid #ff4422",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          fontWeight: 900,
          color: "#ff4422",
          marginBottom: "28px",
        }}
      >
        W
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "56px",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-1px",
          marginBottom: "16px",
          display: "flex",
        }}
      >
        WESTERNIZE
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "24px",
          color: "#a1a1aa",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: 1.5,
          fontWeight: 700,
          display: "flex",
        }}
      >
        Your CV. Rebuilt. Westernized.
      </div>

      {/* Divider */}
      <div
        style={{
          width: "60px",
          height: "3px",
          background: "#ff4422",
          borderRadius: "2px",
          marginTop: "32px",
          marginBottom: "32px",
          display: "flex",
        }}
      />

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          gap: "16px",
        }}
      >
        {["ATS Score", "Gap Analysis", "AI Rewrites", "DOCX Export"].map((item) => (
          <div
            key={item}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px",
              padding: "10px 24px",
              fontSize: "16px",
              color: "#d4d4d8",
              fontWeight: 700,
              display: "flex",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Domain */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          fontSize: "14px",
          color: "#52525b",
          letterSpacing: "2px",
          fontWeight: 700,
          display: "flex",
        }}
      >
        WESTERNIZE.DEV
      </div>
    </div>,
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: "Unbounded",
                data: fontData,
                style: "normal" as const,
                weight: 700 as const,
              },
            ],
          }
        : {}),
    },
  );
}
