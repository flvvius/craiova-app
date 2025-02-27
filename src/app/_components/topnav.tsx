import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ThemeSwitch } from "./ThemeSwitch";

export function Navbar() {
  return (
    <nav className="flex h-20 items-center justify-between bg-gradient-to-r from-gray-200 to-gray-400 p-4 text-black drop-shadow-md transition-colors dark:from-gray-900 dark:to-gray-700 dark:text-white">
      <a
        href="/"
        className="flex items-center gap-2 text-xl font-semibold tracking-wide transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <Image
          src="/assets/logo.png"
          alt="Craiova App"
          width={50}
          height={50}
          className="rounded-2xl"
        />
        <h1 className="text-3xl">Craiova App</h1>
      </a>

      <div className="flex items-center gap-4">
        <ThemeSwitch />

        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-md bg-indigo-500 px-6 py-3 text-xl font-medium text-white shadow-lg transition-all hover:bg-indigo-400 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500">
              Sign in
            </button>
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
    </nav>
  );
}
