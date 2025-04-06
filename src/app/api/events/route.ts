import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";

interface EventData {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  maxParticipants: number;
  photo: string;
  externalLink: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to create an event" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as EventData;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        ...data,
        date: new Date(data.date),
        userId,
        userEmail,
        createdAt: new Date(),
        photo: data.photo ?? "",
        externalLink: data.externalLink ?? "",
      })
      .returning();

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const eventObjects = await db.select().from(events);
    return NextResponse.json(eventObjects);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
