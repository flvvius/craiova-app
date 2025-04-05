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
import { Separator } from "~/components/ui/separator";
import { ThumbsUp, MapPin, Calendar } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

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

  if (!isUserLoaded || isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-4">
        <div className="text-center">Loading suggestions...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-4">
        <div className="text-center">
          <p>You need to be signed in to view suggestions.</p>
          <Button onClick={() => router.push("/sign-in")} className="mt-4">
            Sign In
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Recomandări Personalizate</h1>
        <p className="text-muted-foreground">
          Afișează locuri bazate pe preferințele și activitatea anterioară.
        </p>
      </header>

      <Separator />

      <section className="space-y-4">
        {places.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Nu am găsit recomandări. Apreciați câteva locuri pentru a primi
              sugestii personalizate.
            </p>
          </div>
        ) : (
          places.map((place) => {
            const liked = !!preferences[place.id];
            return (
              <Card key={place.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {place.name}
                  </CardTitle>
                  <CardDescription className="text-sm capitalize text-muted-foreground">
                    {place.category}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                    <Image
                      src={
                        place.mainPhoto === ""
                          ? "/placeholder.png"
                          : place.mainPhoto
                      }
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm">{place.description}</p>
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLike(place.id)}
                  >
                    <ThumbsUp className="mr-1.5 h-4 w-4" />
                    {liked ? "Apreciat" : "Like"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </section>
    </main>
  );
}
