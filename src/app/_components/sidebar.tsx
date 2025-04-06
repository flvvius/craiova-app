"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Home,
  Calendar,
  Lightbulb,
  Mail,
  MapPin,
  Plus,
  Map,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { ThemeSwitch } from "./ThemeSwitch";
import { Separator } from "~/components/ui/separator";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const routes = [
    { label: "Homepage", icon: <Home className="h-5 w-5" />, href: "/" },
    {
      label: "Interactive Map",
      icon: <Map className="h-5 w-5" />,
      href: "/map",
    },
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
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r bg-background max-md:hidden">
      <div className="flex flex-1 flex-col p-4">
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
              <Button
                variant="outline"
                className="mt-4 w-full justify-start gap-2"
              >
                {button.icon}
                {button.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <ThemeSwitch />
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className="w-full">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    avatarImage: "w-full h-full object-cover rounded-full",
                  },
                }}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {user?.fullName ?? user?.username ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </aside>
  );
}
