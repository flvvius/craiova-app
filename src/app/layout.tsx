import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
        <body className="min-h-screen overflow-x-hidden">
          <ThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem={true}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
