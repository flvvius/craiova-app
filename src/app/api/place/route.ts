import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { places } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user)
    return NextResponse.json(
      { message: "User not logged in" },
      { status: 400 },
    );

  try {
    const body = await request.json();
    const [newPlace] = await db
      .insert(places)
      .values({
        name: body.name,
        description: body.description,
        lat: body.lat,
        lng: body.lng,
        mainPhoto: body.mainPhotoUrl,
        gallery: body.gallery,
        category: body.category,
      })
      .returning();
    return NextResponse.json(newPlace, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error creating place" },
      { status: 500 },
    );
  }
}
