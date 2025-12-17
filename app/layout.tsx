import type { Metadata } from "next";
import "./globals.css";
import { StoryProvider } from "@/context/StoryContext";

export const metadata: Metadata = {
  title: "Lubab",
  description: "Interactive storybook experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoryProvider>
          {children}
        </StoryProvider>
      </body>
    </html>
  );
}
