import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "../_components/sidebar";

export const metadata: Metadata = {
  title: "Harta Craiova",
  description: "Harta interactivă a orașului Craiova",
  icons: [{ rel: "icon", url: "/assets/logo.png" }],
};

export default function MapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 top-20 flex h-[calc(100vh-5rem)]">
      <aside className="z-10 h-full">
        <Sidebar />
      </aside>
      <main className="relative w-full flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
