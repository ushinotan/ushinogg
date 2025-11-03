import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOLカスタムゲーム チーム分けツール",
  description: "League of Legendsのカスタムゲーム用チーム分けツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
