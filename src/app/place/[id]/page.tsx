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
import { ReviewsSection } from "../../_components/ReviewsSection";

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

  const initialReviews = await db
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
                <p className="text-sm text-muted-foreground">
                  No gallery images found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsSection
                placeId={placeId}
                initialReviews={initialReviews}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
