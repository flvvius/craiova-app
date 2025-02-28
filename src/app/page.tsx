import { db } from "~/server/db";
import { MapClient } from "./_components/MapClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const PLACES = await db.query.places.findMany();

  return (
    <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="h-full w-full">
        <MapClient places={PLACES} />
      </div>
    </main>
  );
}
