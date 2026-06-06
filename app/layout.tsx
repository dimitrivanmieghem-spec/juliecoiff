import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import FloatingButtons from "@/components/FloatingButtons";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Julie Coiff | Coiffeuse à domicile",
  description:
    "L'expertise d'un salon de coiffure dans le confort de votre maison. Services de coupe, coloration et brushing à Seneffe et ses environs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-background-cream text-text-main font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pb-14 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <FloatingButtons />
      </body>
    </html>
  );
}
