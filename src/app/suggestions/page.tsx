"use client";

import { useState, useEffect } from "react";
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
  const { user } = useUser();
  const [places, setPlaces] = useState<Place[]>([]);
  const [preferences, setPreferences] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const prefsRes = await fetch("/api/preferences");
        const prefs: UserPreference[] = await prefsRes.json();

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
        const suggestedPlaces = await placesRes.json();
        setPlaces(suggestedPlaces);
      } catch (error) {
        console.error("Error loading suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  async function handleLike(placeId: number) {
    if (!user) return;

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

      if (!response.ok) throw new Error("Failed to update preference");

      setPreferences((prev) => ({
        ...prev,
        [placeId]: !isLiked,
      }));
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-4">
        <div className="text-center">Loading suggestions...</div>
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
        {places.map((place) => {
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
        })}
      </section>
    </main>
  );
}
