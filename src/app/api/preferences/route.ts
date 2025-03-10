import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { userPreferences } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

interface PreferenceData {
  placeId?: number;
  eventId?: number;
  interactionType: "like" | "view" | "review" | "unlike";
  rating?: number;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to update preferences" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as PreferenceData;
    const { placeId, eventId, interactionType, rating } = data;

    if (!placeId && !eventId) {
      return NextResponse.json(
        { error: "Either placeId or eventId must be provided" },
        { status: 400 },
      );
    }

    if (interactionType === "unlike") {
      const conditions = [
        eq(userPreferences.userId, userId),
        eq(userPreferences.interactionType, "like"),
      ];

      if (placeId) {
        conditions.push(eq(userPreferences.placeId, placeId));
      } else if (eventId) {
        conditions.push(eq(userPreferences.eventId, eventId));
      }

      await db.delete(userPreferences).where(and(...conditions));

      return NextResponse.json({ success: true });
    }

    const [preference] = await db
      .insert(userPreferences)
      .values({
        userId,
        placeId,
        eventId,
        interactionType,
        rating,
      })
      .returning();

    return NextResponse.json(preference);
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to get preferences" },
        { status: 401 },
      );
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error getting preferences:", error);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 },
    );
  }
}
