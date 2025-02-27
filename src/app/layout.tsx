import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/topnav";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Craiova App",
  description: "Interactive presentation of Craiova",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} h-full w-full`}>
        <body className="flex flex-col h-full w-full overflow-hidden">
          <ThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem={true}
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
