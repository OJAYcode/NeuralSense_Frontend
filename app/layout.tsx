import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuralSense - Student Stress Detection",
  description:
    "AI-powered student stress detection using facial and voice analysis",
  keywords: [
    "stress detection",
    "mental health",
    "student wellness",
    "AI analysis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
