"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { EventCard } from "./EventCard";

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

interface EventListProps {
  events: EventItem[];
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {event.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <Image
              src={event.photo}
              alt={event.title}
              className="aspect-video w-full rounded-md object-cover md:max-w-[40%]"
              width={100}
              height={100}
            />

            <div className="flex flex-col gap-2 md:flex-1 md:pl-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <EventCard event={event} />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Detalii
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                      <div>
                        <div className="mt-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </DialogHeader>

                    <p className="mt-4 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4">
                      <Image
                        src={event.photo}
                        alt={event.title}
                        className="aspect-video w-full rounded-md object-cover"
                        width={100}
                        height={100}
                      />
                    </div>

                    <DialogFooter className="mt-4 space-x-2">
                      <EventCard event={event} />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
