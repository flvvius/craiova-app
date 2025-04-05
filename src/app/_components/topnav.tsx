"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ThemeSwitch } from "./ThemeSwitch";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Menu,
  Home,
  Calendar,
  Lightbulb,
  Mail,
  MapPin,
  Plus,
  Map,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { usePathname } from "next/navigation";

export function TopNavigation() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleCloseSheet = () => setSheetOpen(false);
    window.addEventListener("close-sheet", handleCloseSheet);
    return () => {
      window.removeEventListener("close-sheet", handleCloseSheet);
    };
  }, []);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      const event = new Event("close-sheet");
      window.dispatchEvent(event);
    }
  };

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
    {
      label: "Interactive Map",
      icon: <Map className="h-5 w-5" />,
      href: "/map",
      highlight: true,
    },
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

  const navigationLinks = (
    <nav className="space-y-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
            pathname === route.href
              ? "bg-accent text-accent-foreground"
              : route.highlight
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "hover:bg-accent/50",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
      <div className="my-4 h-px bg-border" />
      {addButtons.map((button) => (
        <Link key={button.href} href={button.href} onClick={handleClick}>
          <Button variant="outline" className="mt-4 w-full justify-start gap-2">
            {button.icon}
            {button.label}
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <nav className="z-10 flex h-20 w-full items-center justify-between bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-black drop-shadow-md transition-colors dark:from-yellow-900 dark:to-yellow-800 dark:text-white">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Image
            src="/assets/logo.png"
            alt="Craiova App"
            width={50}
            height={50}
            className="rounded-2xl"
          />
          <h1 className="hidden text-3xl sm:block">Craiova App</h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="items-center gap-4 max-md:hidden md:flex">
          <Link href="/map">
            <Button
              size="lg"
              className="bg-blue-600 font-medium text-white hover:bg-blue-700"
            >
              <Map className="mr-2 h-5 w-5" />
              Interactive Map
            </Button>
          </Link>

          <ThemeSwitch />

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-700 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12",
                  avatarImage: "w-full h-full object-cover rounded-full",
                },
              }}
            />
          </SignedIn>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTitle></SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col p-4">
            <div className="flex h-full flex-col">
              <div className="mb-auto mt-8">{navigationLinks}</div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <ThemeSwitch />

                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button size="sm" onClick={handleClick}>
                        Sign in
                      </Button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                          avatarImage:
                            "w-full h-full object-cover rounded-full",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
