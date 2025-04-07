"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PlaceFormProvider } from "./components/PlaceFormProvider";
import PlaceForm from "./components/PlaceForm";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

export default function NewPlacePage() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  if (loadError) {
    return (
      <ErrorState message="Eroare la încărcarea hărții. Vă rugăm să încercați din nou mai târziu." />
    );
  }

  if (!isLoaded) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <Link
            href="/map"
            className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la hartă
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Adaugă o locație nouă
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Completează detaliile de mai jos pentru a adăuga o nouă locație în
            Craiova
          </p>
        </div>

        <PlaceFormProvider>
          <PlaceForm />
        </PlaceFormProvider>
      </div>
    </div>
  );
}
