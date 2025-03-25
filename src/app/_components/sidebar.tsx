"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Home, Calendar, Lightbulb, Mail, MapPin, Plus } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

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

  const addButtons = [
    {
      label: "Add a new place",
      icon: <MapPin className="h-5 w-5" />,
      href: "/place/new",
    },
    {
      label: "Add a new event",
      icon: <Plus className="h-5 w-5" />,
      href: "/events/new",
    },
  ];

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r bg-background max-md:hidden">
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
          <div className="my-4 h-px bg-border" />
          {addButtons.map((button) => (
            <Link key={button.href} href={button.href}>
              <Button variant="outline" className="w-full justify-start gap-2">
                {button.icon}
                {button.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
