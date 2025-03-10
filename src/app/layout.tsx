import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/topnav";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Craiova App",
  description: "Interactive presentation of Craiova",
  icons: [{ rel: "icon", url: "/assets/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${GeistSans.variable}`}
      >
        <body className="min-h-screen">
          <ThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem={true}
          >
            <div className="flex h-screen min-h-screen flex-col">
              <Navbar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-auto p-4">{children}</main>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
