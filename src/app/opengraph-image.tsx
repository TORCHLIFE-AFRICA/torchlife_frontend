import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const publicFile = (fileName: string) => join(process.cwd(), "public", fileName);

async function toDataUri(fileName: string) {
  const buffer = await readFile(publicFile(fileName));
  const mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [heroImage, logoImage] = await Promise.all([
    toDataUri("andrae-ricketts-Q9_zv0LN4jU-unsplash.jpg"),
    toDataUri("torchlife-logo.png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#f7f2ea",
          color: "#132726",
          fontFamily: "Inter, sans-serif",
          padding: "36px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: "36px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 34px 120px -52px rgba(10,30,28,0.48)",
            background: "#ffffff",
          }}
        >
          <img
            src={heroImage}
            alt="TorchLife hero"
            style={{
              position: "absolute",
              inset: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: "0",
              background:
                "linear-gradient(90deg, rgba(8,31,28,0.82) 0%, rgba(15,118,110,0.58) 45%, rgba(15,118,110,0.36) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              padding: "40px 48px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src={logoImage}
                alt="TorchLife"
                style={{
                  width: "260px",
                  height: "auto",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "650px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.92)",
                  color: "#0f766e",
                  padding: "10px 18px",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Africa's First Pregnancy Crowdfund
              </div>

              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  flexDirection: "column",
                  color: "#ffffff",
                  fontSize: "66px",
                  lineHeight: 1.02,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", flexWrap: "wrap" }}>
                  <span>The</span>
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                    }}
                  >
                    Trusted
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        bottom: "-10px",
                        height: "14px",
                        borderBottom: "8px solid rgba(200,154,43,0.98)",
                        borderRadius: "999px",
                        transform: "rotate(-1.8deg)",
                      }}
                    />
                  </span>
                </div>
                <span>Way To Solve</span>
                <span>Pregnancy Crisis</span>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  maxWidth: "600px",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "28px",
                  lineHeight: 1.35,
                }}
              >
                Fast, transparent fundraising for pregnancy care with verified campaigns and a public-friendly donation flow.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  background: "#0f766e",
                  color: "#ffffff",
                  padding: "16px 28px",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                Start giving now
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.9)",
                  color: "#183330",
                  padding: "16px 28px",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                torchlife.co
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
