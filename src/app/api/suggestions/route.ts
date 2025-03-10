import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { places, userPreferences } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to get suggestions" },
        { status: 401 },
      );
    }

    const userPrefs = await db
      .select({
        placeId: userPreferences.placeId,
      })
      .from(userPreferences)
      .where(
        and(
          eq(userPreferences.userId, userId),
          eq(userPreferences.interactionType, "like"),
        ),
      );

    const firstLikedPlaceId = userPrefs[0]?.placeId;
    const likedPlace =
      firstLikedPlaceId && typeof firstLikedPlaceId === "number"
        ? await db.select().from(places).where(eq(places.id, firstLikedPlaceId))
        : null;

    const suggestedPlaces = await db
      .select()
      .from(places)
      .where(eq(places.category, likedPlace?.[0]?.category ?? "restaurant"))
      .limit(5);

    return NextResponse.json(suggestedPlaces);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 },
    );
  }
}
