import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import GhostCursor from "../components/ui/GhostCursor";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Synapse — Your Mental Wellness Companion",
  description:
    "A calm, safe digital space to track your mood, journal your thoughts, and access compassionate AI support.",
  keywords: ["mental health", "wellness", "mood tracker", "journal", "therapy", "mindfulness"],
  authors: [{ name: "Synapse" }],
  openGraph: {
    title: "Synapse — Your Mental Wellness Companion",
    description: "A calm, safe digital space crafted for your mental well-being.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f7f3ee" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", zIndex: 1 }}>
          <GhostCursor 
            color="#96c4a8"
            brightness={1.1}
            edgeIntensity={0.2}
            trailLength={65}
            inertia={0.7}
            grainIntensity={0.05}
            bloomStrength={0.15}
            bloomRadius={1.0}
            zIndex={-1}
          />
          {children}
        </div>
      </body>
    </html>
  );
}