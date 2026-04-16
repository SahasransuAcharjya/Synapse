import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}