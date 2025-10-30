import type { Metadata } from "next";
import "./globals.css";
import { Work_Sans } from "next/font/google";
import { Room } from "./Room";

const work_sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Figma Clone",
  description:
    "A minimalist Figma clone using fabric.js and Liveblocks for real-time collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-primary-grey-200 ${work_sans.className} `}>
        <Room>{children}</Room>
      </body>
    </html>
  );
}
