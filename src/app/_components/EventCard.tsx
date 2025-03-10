"use client";

import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  time: string;
  location: string;
  date: Date;
  description: string;
  photo: string;
  externalLink: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(event.externalLink, "_blank")}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      More Info
    </Button>
  );
}
