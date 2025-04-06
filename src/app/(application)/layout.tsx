import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { type Metadata } from "next";
import { Sidebar } from "../_components/sidebar";

export const metadata: Metadata = {
  title: "Descopera Craiova",
  description: "Descopera frumusetile Craiovei",
  icons: [{ rel: "icon", url: "/assets/logo.png" }],
};

export default function ApplicationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="relative flex-1 overflow-auto">{children}</main>
    </div>
  );
}
