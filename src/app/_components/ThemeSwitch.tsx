"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 active:scale-95 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
    >
      {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
