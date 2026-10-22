import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyForge AI — Your Exam Copilot",
  description: "Turn chapters into notes, visual study packs, practice questions and revision sheets.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
