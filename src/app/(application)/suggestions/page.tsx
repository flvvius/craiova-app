"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ThumbsUp, MapPin, Compass, Heart, Loader2, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Place {
  id: number;
  name: string;
  description: string;
  mainPhoto: string;
  category: string;
}

interface UserPreference {
  id: number;
  userId: string;
  placeId: number;
  interactionType: "like" | "view" | "review";
  rating?: number;
  createdAt: Date;
}

export default function SugestiiPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [places, setPlaces] = useState<Place[]>([]);
  const [preferences, setPreferences] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (isUserLoaded && !user) {
      void router.push("/sign-in");
      return;
    }

    async function loadData() {
      if (!user) return;

      try {
        const prefsRes = await fetch("/api/preferences");
        if (!prefsRes.ok) {
          if (prefsRes.status === 401) {
            void router.push("/sign-in");
            return;
          }
          throw new Error("Failed to load preferences");
        }

        const prefs = (await prefsRes.json()) as UserPreference[];

        const prefsMap = prefs.reduce(
          (acc, pref) => {
            if (pref.interactionType === "like" && pref.placeId) {
              acc[pref.placeId] = true;
            }
            return acc;
          },
          {} as Record<number, boolean>,
        );

        setPreferences(prefsMap);

        const placesRes = await fetch("/api/suggestions");
        if (!placesRes.ok) {
          if (placesRes.status === 401) {
            void router.push("/sign-in");
            return;
          }
          throw new Error("Failed to load suggestions");
        }

        const suggestedPlaces = (await placesRes.json()) as Place[];
        setPlaces(suggestedPlaces);
      } catch (error) {
        console.error("Error loading suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      void loadData();
    }
  }, [user, isUserLoaded, router]);

  async function handleLike(placeId: number) {
    if (!user) {
      void router.push("/sign-in");
      return;
    }

    try {
      const isLiked = preferences[placeId];
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId,
          interactionType: isLiked ? "unlike" : "like",
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          void router.push("/sign-in");
          return;
        }
        throw new Error("Failed to update preference");
      }

      setPreferences((prev) => ({
        ...prev,
        [placeId]: !isLiked,
      }));
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  }

  const categories = [
    "all",
    ...Array.from(new Set(places.map((place) => place.category))),
  ];

  const filteredPlaces =
    activeCategory === "all"
      ? places
      : places.filter((place) => place.category === activeCategory);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <div className="relative h-48 w-full overflow-hidden md:h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              Recomandări Personalizate
            </h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Se încarcă recomandările...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <div className="relative h-48 w-full overflow-hidden md:h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              Recomandări Personalizate
            </h1>
          </div>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="rounded-full bg-amber-100 p-4 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Autentificare necesară</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Trebuie să fiți autentificat pentru a vedea recomandările
              personalizate.
            </p>
            <Button
              onClick={() => router.push("/sign-in")}
              className="mt-2 bg-amber-500 text-white hover:bg-amber-600"
            >
              Autentificare
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <div className="relative h-48 w-full overflow-hidden md:h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Recomandări Personalizate
          </h1>
          <p className="max-w-2xl text-white/90 md:text-lg">
            Descoperă locuri bazate pe preferințele și activitatea ta anterioară
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="mb-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            {user.imageUrl && (
              <div className="h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={user.imageUrl ?? "/placeholder.svg"}
                  alt={user.fullName ?? "User"}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">
                Bună, {user.firstName ?? user.fullName ?? "Vizitator"}!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Iată recomandările tale personalizate pentru astăzi
              </p>
            </div>
          </div>
          <div className="hidden rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 md:block">
            {Object.values(preferences).filter(Boolean).length} locuri apreciate
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category === "all" ? "Toate" : category}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-8">
          {filteredPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
              <div className="rounded-full bg-amber-100 p-4 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Nu am găsit recomandări</h3>
              <p className="max-w-md text-gray-600 dark:text-gray-400">
                Apreciați câteva locuri pentru a primi sugestii personalizate
                sau încercați o altă categorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredPlaces.map((place, index) => {
                  const liked = !!preferences[place.id];
                  return (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group h-full overflow-hidden border-gray-200 transition-all duration-300 hover:shadow-md dark:border-gray-800">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={
                              place.mainPhoto ||
                              "/placeholder.svg?height=300&width=400"
                            }
                            alt={place.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-gray-800 backdrop-blur-sm dark:bg-gray-900/80 dark:text-gray-200">
                              {place.category}
                            </span>
                          </div>

                          <button
                            onClick={() => handleLike(place.id)}
                            className={`absolute right-4 top-4 rounded-full p-2 transition-all duration-300 ${
                              liked
                                ? "bg-amber-500 text-white"
                                : "bg-white/80 text-gray-700 hover:bg-white dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-900"
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 ${liked ? "fill-white" : ""}`}
                            />
                          </button>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            {place.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <MapPin className="h-4 w-4" />
                            Craiova
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                            {place.description}
                          </p>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            onClick={() => router.push(`/place/${place.id}`)}
                          >
                            Vezi detalii
                          </Button>

                          <Button
                            variant={liked ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleLike(place.id)}
                            className={
                              liked
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : ""
                            }
                          >
                            <ThumbsUp className="mr-1.5 h-4 w-4" />
                            {liked ? "Apreciat" : "Apreciază"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
