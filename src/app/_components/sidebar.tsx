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
  Menu,
  X,
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
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const sidebarContent = (isMobile: boolean) => (
    <>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xl font-bold">Menu</span>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
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
    </>
  );

  return (
    <>
      {isMounted && !isMobileMenuOpen && ( // mobile menu button
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 top-4 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <aside className="h-full w-64 shrink-0 flex-col overflow-y-auto border-l bg-background max-md:hidden md:flex">
        {sidebarContent(false)}
      </aside>

      {isMounted && ( // mobile sidebar
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-30 flex h-full w-64 flex-col overflow-y-auto border-l bg-background transition-transform duration-300 md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {sidebarContent(true)}
        </aside>
      )}

      {isMounted && isMobileMenuOpen && ( // background dimmer when sidebar is open
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
