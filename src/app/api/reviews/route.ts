import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { reviews } from "~/server/db/schema";

interface ReviewData {
  placeId: number;
  rating: number;
  comment: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review" },
        { status: 401 },
      );
    }

    const { placeId, rating, comment } = (await request.json()) as ReviewData;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        placeId,
        userId,
        userEmail,
        rating,
        comment,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newReview);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
  } catch (error: unknown) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
