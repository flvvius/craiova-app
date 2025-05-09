"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ThemeSwitch } from "./ThemeSwitch";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function TopNavigation() {
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
        {/* Desktop View */}
        <div className="hidden items-center gap-4 md:flex">
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

        {/* Mobile View */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitch />

          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  avatarImage: "w-full h-full object-cover rounded-full",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
