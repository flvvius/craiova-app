import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { places } from "~/server/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const placeId = Number(id);

    if (isNaN(placeId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const [place] = await db
      .select()
      .from(places)
      .where(eq(places.id, placeId));

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error("Error fetching place:", error);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 },
    );
  }
}
