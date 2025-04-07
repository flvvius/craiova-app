"use client";

import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-amber-500" />
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Se încarcă harta...
      </p>
    </div>
  );
}
