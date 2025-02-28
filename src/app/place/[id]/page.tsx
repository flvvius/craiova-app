import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { places } from "~/server/db/schema";
import { reviews } from "~/server/db/schema";
import { type Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Place Details",
  description: "Detailed info about a specific place",
};

interface PlacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params;
  const placeId = Number(id);

  const [place] = await db.select().from(places).where(eq(places.id, placeId));
  if (!place) {
    notFound();
  }

  const placeReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.placeId, placeId));

  return (
    <main className="mx-auto w-full max-w-4xl overflow-scroll p-4">
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-3xl">{place.name}</CardTitle>
          <CardDescription>
            Discover details, gallery, and reviews
          </CardDescription>
        </CardHeader>

        <CardContent>
          {place.mainPhoto && (
            <div className="mb-4 w-full overflow-hidden rounded-md">
              <Image
                src={place.mainPhoto}
                alt={place.name}
                width={1200}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <p className="text-lg">{place.description}</p>

          <Separator className="my-6" />

          <Tabs defaultValue="gallery">
            <TabsList className="mb-4">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              {Array.isArray(place.gallery) && place.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {place.gallery.map((url, i) => (
                    <div key={i} className="overflow-hidden rounded-md">
                      <Image
                        src={url}
                        alt={`Gallery item ${i}`}
                        width={600}
                        height={400}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No gallery images found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <h2 className="mb-2 text-2xl font-semibold">Reviews</h2>
              {placeReviews.length > 0 ? (
                placeReviews.map((review) => (
                  <div
                    key={review.id}
                    className="mb-4 rounded-md border p-3 dark:border-gray-700"
                  >
                    <p>{review.comment}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      By User #{review.userId}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No reviews yet.</p>
              )}

              <div className="mt-4">
                <p className="mb-2 text-sm italic">Add your review here:</p>
                {/* E.g. a future <ReviewForm placeId={place.id} /> */}
                <p className="text-muted-foreground text-sm">
                  (Review form not implemented)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
