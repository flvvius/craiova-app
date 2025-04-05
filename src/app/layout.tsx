import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNavigation } from "./_components/topnav";
import { ThemeProvider } from "next-themes";

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
        className={`${GeistSans.variable} scroll-smooth`}
      >
        <body className="min-h-screen">
          <ThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem={true}
          >
            <div className="flex min-h-screen flex-col">
              <TopNavigation />
              <main className="w-full flex-1">{children}</main>
              <footer className="border-t bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>© 2025 Craiova App. Toate drepturile rezervate.</p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
