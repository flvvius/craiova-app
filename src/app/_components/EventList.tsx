"use client";

import { EventCard } from "./EventCard";

interface EventItem {
  id: number;
  title: string;
  time: string;
  location: string;
  date: string;
  description: string;
  photo: string;
  externalLink: string;
  createdAt: string;
  updatedAt: string | null;
}

interface EventListProps {
  events: EventItem[];
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="flex min-h-full flex-col justify-between space-y-6">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          index={index}
          total={events.length}
        />
      ))}
    </div>
  );
}
