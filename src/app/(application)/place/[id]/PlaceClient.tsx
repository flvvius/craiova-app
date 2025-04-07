"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { ReviewsSection } from "../../../_components/ReviewsSection";
import {
  MapPin,
  Clock,
  Star,
  Info,
  ImageIcon,
  MessageSquare,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import Link from "next/link";

interface PlaceData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  mainPhoto: string;
  description: string | null;
  category: string;
  gallery: string[] | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ReviewItemFromDB {
  id: number;
  placeId: number;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface Review {
  id: number;
  placeId: number;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface Preference {
  id: number;
  userId: string;
  placeId: number | null;
  eventId: number | null;
  interactionType: "like" | "view" | "review";
  rating: number | null;
  createdAt: string;
}

interface PlaceClientProps {
  place: PlaceData;
  initialReviews: ReviewItemFromDB[];
  avgRating: number;
  formattedRating: string;
}

export function PlaceClient({
  place,
  initialReviews: reviewsFromDB,
  avgRating,
  formattedRating,
}: PlaceClientProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  const initialReviews = reviewsFromDB.map((review) => ({
    ...review,
    createdAt: new Date(review.createdAt),
    updatedAt: review.updatedAt ? new Date(review.updatedAt) : null,
  })) as Review[];

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const prefsResponse = await fetch("/api/preferences");
        if (prefsResponse.ok) {
          const prefs = (await prefsResponse.json()) as Preference[];
          const isAlreadyLiked = prefs.some(
            (pref) =>
              pref.placeId === place.id && pref.interactionType === "like",
          );
          setIsLiked(isAlreadyLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    void checkIfLiked();
  }, [place.id]);

  const handleLike = async () => {
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId: place.id,
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

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh]">
        <Image
          src={place.mainPhoto || "/placeholder.svg?height=800&width=1200"}
          alt={place.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute left-4 top-4 z-10">
          <Link
            href="/map"
            className="flex items-center gap-1 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </Link>
        </div>

        <div className="absolute bottom-20 right-4 z-10 flex gap-2 md:bottom-auto md:right-4 md:top-4">
          <button className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
            <Share2 className="h-5 w-5" />
          </button>
          <button
            className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
            />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                {place.category}
              </Badge>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-sm backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{formattedRating}</span>
                  <span className="text-white/70">
                    ({initialReviews.length})
                  </span>
                </div>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl lg:text-5xl">
              {place.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>Craiova, România</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-white/80">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Program: 9:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Card className="border-gray-200 shadow-sm dark:border-gray-800">
          <CardContent className="p-6 pt-6">
            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-2">
                <Info className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                <div>
                  <h2 className="text-xl font-bold">Despre acest loc</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {place.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Categorie
                  </div>
                  <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                    {place.category}
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rating
                  </div>
                  <div className="flex items-center text-lg font-semibold text-amber-700 dark:text-amber-400">
                    {formattedRating}
                    <Star className="ml-1 h-4 w-4 fill-amber-500 text-amber-500" />
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recenzii
                  </div>
                  <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                    {initialReviews.length}
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Adăugat
                  </div>
                  <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                    {new Date(place.createdAt).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="mb-6 w-full justify-start gap-4 bg-transparent p-0">
                <TabsTrigger
                  value="gallery"
                  className="flex items-center gap-2 border-b-2 border-transparent px-1 py-2 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400"
                >
                  <ImageIcon className="h-4 w-4" />
                  Galerie
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex items-center gap-2 border-b-2 border-transparent px-1 py-2 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400"
                >
                  <MessageSquare className="h-4 w-4" />
                  Recenzii ({initialReviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="mt-0">
                {Array.isArray(place.gallery) && place.gallery.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {place.gallery.map((url, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`${place.name} - Imagine ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p className="text-sm font-medium">
                            {place.name} - Imagine {i + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 dark:border-gray-700">
                    <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Nu există imagini în galerie pentru acest loc.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ReviewsSection
                  placeId={place.id}
                  initialReviews={initialReviews}
                />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-gray-200 p-6 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {place.id} • Actualizat:{" "}
              {new Date(place.updatedAt ?? place.createdAt).toLocaleDateString(
                "ro-RO",
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href="/map"
                className="flex items-center gap-1 rounded-md bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
              >
                <MapPin className="h-4 w-4" />
                Vezi pe hartă
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
