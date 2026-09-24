import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Constellation from "@/components/Constellation";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroller from "@/components/SmoothScroller";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} antialiased min-h-[100dvh] flex flex-col bg-blue-base text-white selection:bg-blue-main/30 font-sans`}
      >
        <SmoothScroller />
        <CustomCursor />
        <Constellation />
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
