import { db } from "~/server/db";
import { MapClient } from "../../_components/MapClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

async function PlacesMap() {
  const places = await db.query.places.findMany();
  return <MapClient places={places} zoom={13} />;
}

export default function MapPage() {
  return (
    <div className="h-full w-full">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-yellow-500"></div>
          </div>
        }
      >
        <PlacesMap />
      </Suspense>
    </div>
  );
}
