import { db } from "~/server/db";
import { MapClient } from "../_components/MapClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

async function PlacesMap() {
  const places = await db.query.places.findMany();
  return <MapClient places={places} />;
}

export default function HomePage() {
  return (
    <div className="relative h-full w-full">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        }
      >
        <PlacesMap />
      </Suspense>
    </div>
  );
}
