import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { places } from "~/server/db/schema";
import { reviews } from "~/server/db/schema";
import { PlaceClient } from "./PlaceClient";

export const dynamic = "force-dynamic";

interface PlacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const placeId = Number(id);

  const [place] = await db.select().from(places).where(eq(places.id, placeId));

  if (!place) {
    return (
      <div className="flex h-screen items-center justify-center">
        Place not found
      </div>
    );
  }

  const initialReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.placeId, placeId));

  const avgRating =
    initialReviews.length > 0
      ? initialReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        initialReviews.length
      : 0;

  const formattedRating = avgRating.toFixed(1);

  const serializedPlace = {
    ...place,
    createdAt: place.createdAt.toISOString(),
    updatedAt: place.updatedAt ? place.updatedAt.toISOString() : null,
  };

  const serializedReviews = initialReviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt ? review.updatedAt.toISOString() : null,
  }));

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <PlaceClient
        place={serializedPlace}
        initialReviews={serializedReviews}
        avgRating={avgRating}
        formattedRating={formattedRating}
      />
    </Suspense>
  );
}
