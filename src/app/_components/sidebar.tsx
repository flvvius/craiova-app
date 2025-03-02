"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Home, Calendar, Lightbulb, Mail, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routes = [
    { label: "Homepage", icon: <Home className="h-5 w-5" />, href: "/" },
    {
      label: "Events",
      icon: <Calendar className="h-5 w-5" />,
      href: "/events",
    },
    {
      label: "Suggestions",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/suggestions",
    },
    { label: "Contact", icon: <Mail className="h-5 w-5" />, href: "/contact" },
  ];

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTitle></SheetTitle>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        {/* Mobile Sidebar Content */}
        <SheetContent side="left" className="w-72 p-4">
          <nav className="mt-8 space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "w-64 shrink-0 border-r bg-background",
          "hidden h-full md:!flex",
          className,
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 text-xl font-bold">Menu</div>
          <nav className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex-grow"></div>
        </div>
      </div>
    </>
  );
}
