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
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { ThemeSwitch } from "./ThemeSwitch";
import { Separator } from "~/components/ui/separator";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const routes = [
    {
      label: "Acasă",
      icon: <Home className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "Hartă Interactivă",
      icon: <Map className="h-5 w-5" />,
      href: "/map",
    },
    {
      label: "Evenimente",
      icon: <Calendar className="h-5 w-5" />,
      href: "/events",
    },
    {
      label: "Recomandări",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/suggestions",
    },
    {
      label: "Contact",
      icon: <Mail className="h-5 w-5" />,
      href: "/contact",
    },
  ];

  const addButtons = [
    {
      label: "Adaugă un loc nou",
      icon: <MapPin className="h-5 w-5" />,
      href: "/place/new",
    },
    {
      label: "Adaugă un eveniment",
      icon: <Plus className="h-5 w-5" />,
      href: "/events/new",
    },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const sidebarContent = (isMobile: boolean) => (
    <>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
              <span className="text-lg font-bold">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">Craiova</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                City Guide
              </span>
            </div>
          </Link>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Navigare
          </h3>
          <nav className="space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60",
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300",
                    )}
                  >
                    {route.icon}
                  </span>
                  {route.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Adaugă conținut
          </h3>
          <div className="space-y-2">
            {addButtons.map((button) => (
              <Link key={button.href} href={button.href} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-amber-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-400"
                >
                  <span className="text-amber-500 dark:text-amber-400">
                    {button.icon}
                  </span>
                  {button.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-white">
          <h3 className="mb-2 font-semibold">Descoperă Craiova</h3>
          <p className="mb-3 text-sm text-white/80">
            Explorează cele mai frumoase locuri din orașul nostru.
          </p>
          <Link href="/map">
            <Button
              size="sm"
              className="w-full bg-white text-amber-600 hover:bg-white/90"
            >
              Deschide harta
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-200 p-6 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mod afișare
          </span>
          <ThemeSwitch />
        </div>

        <SignedOut>
          <SignInButton mode="modal">
            <Button
              size="sm"
              className="w-full bg-amber-500 text-white hover:bg-amber-600"
            >
              <User className="mr-2 h-4 w-4" />
              Autentificare
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="relative">
            <div
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    avatarImage: "w-full h-full object-cover rounded-full",
                    userButtonPopup: "hidden",
                  },
                }}
              />
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium">
                  {user?.fullName ?? user?.username ?? "Utilizator"}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-90" : ""}`}
              />
            </div>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="p-1">
                    <Link href="/profile">
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                        <User className="h-4 w-4 text-gray-500" />
                        Profil
                      </button>
                    </Link>
                    <Link href="/settings">
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                        <Settings className="h-4 w-4 text-gray-500" />
                        Setări
                      </button>
                    </Link>
                    <Separator className="my-1" />
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Deconectare
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SignedIn>
      </div>
    </>
  );

  return (
    <>
      {isMounted &&
        !isMobileMenuOpen && ( // mobile menu button
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-4 z-40 h-10 w-10 rounded-full border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

      <aside className="h-full w-72 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 max-md:hidden md:flex">
        {sidebarContent(false)}
      </aside>

      {isMounted && ( // mobile sidebar
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-30 flex h-full w-72 flex-col overflow-y-auto border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden"
              >
                {sidebarContent(true)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
