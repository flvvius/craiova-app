"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";

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

interface EventCardProps {
  event: EventItem;
  index: number;
  total: number;
}

export function EventCard({ event, index, total }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex-1 ${total === 1 ? "h-full" : ""}`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className={`cursor-pointer overflow-hidden border-gray-200 transition-all duration-300 dark:border-gray-800 ${
              isHovered
                ? "shadow-lg ring-1 ring-amber-200 dark:ring-amber-800"
                : "hover:shadow-md"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-2/5 lg:w-1/3">
                <div
                  className={`relative h-48 w-full transition-all duration-300 md:h-full ${
                    isHovered ? "brightness-110" : ""
                  }`}
                >
                  <Image
                    src={event.photo || "/placeholder.svg?height=300&width=400"}
                    alt={event.title}
                    className={`object-cover transition-transform duration-300 ${
                      isHovered ? "scale-105" : ""
                    }`}
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 md:opacity-100"></div>

                  <div className="absolute bottom-4 left-4 hidden rounded-lg bg-white/90 p-2 shadow-md backdrop-blur-sm dark:bg-gray-900/90 md:block">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {new Date(event.date).toLocaleDateString("ro-RO", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-xl font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle
                        className={`text-xl font-bold transition-colors duration-300 ${
                          isHovered ? "text-amber-600 dark:text-amber-400" : ""
                        }`}
                      >
                        {event.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </CardDescription>
                    </div>

                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 md:hidden">
                      <span className="text-xs font-medium">
                        {new Date(event.date).toLocaleDateString("ro-RO", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-lg font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span>{event.location}</span>
                    </div>

                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 ${
                        isHovered ? "bg-amber-100 dark:bg-amber-900/30" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()} // Prevent double trigger
                    >
                      Detalii
                    </Button>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {getCategoryFromTitle(event.title)}
                  </span>
                </CardFooter>
              </div>
            </div>
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString("ro-RO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
          </DialogHeader>

          <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg">
            <Image
              src={event.photo || "/placeholder.svg?height=400&width=600"}
              alt={event.title}
              className="object-cover"
              fill
            />
          </div>

          <p className="mt-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {event.description}
          </p>

          <DialogFooter className="mt-6 flex items-center justify-between">
            {event.externalLink && (
              <a
                href={event.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                More Info
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("concert") || lowerTitle.includes("music")) {
    return "Concert";
  } else if (lowerTitle.includes("expozitie") || lowerTitle.includes("art")) {
    return "Expoziție";
  } else if (lowerTitle.includes("festival")) {
    return "Festival";
  } else if (lowerTitle.includes("teatru")) {
    return "Teatru";
  } else if (lowerTitle.includes("film")) {
    return "Film";
  } else {
    return "Eveniment";
  }
}
