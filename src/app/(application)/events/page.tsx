import { Calendar, MapPin, Clock, Search, Filter } from "lucide-react";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";
import { EventList } from "~/app/_components/EventList";
import Image from "next/image";

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

function groupEventsByDay(events: EventItem[]) {
  const days: Record<string, EventItem[]> = {};
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const event of sortedEvents) {
    const day = event.date.toISOString().split("T")[0]!;
    if (!days[day]) {
      days[day] = [];
    }
    days[day].push(event);
  }

  Object.keys(days).forEach((day) => {
    days[day]?.sort((a, b) => {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      if (!hoursA || !minutesA || !hoursB || !minutesB) return 0;
      return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });
  });

  const sortedDays = Object.entries(days).sort(([dayA], [dayB]) => {
    return new Date(dayA).getTime() - new Date(dayB).getTime();
  });

  return Object.fromEntries(sortedDays);
}

function getUpcomingMonths(events: EventItem[]): string[] {
  const months = new Set<string>();
  const today = new Date();

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (eventDate >= today) {
      months.add(eventDate.toLocaleDateString("ro-RO", { month: "long" }));
    }
  });

  return Array.from(months).slice(0, 3);
}

export default async function EventsPage() {
  const eventObjects: EventItem[] = await db.select().from(events);
  const grouped = groupEventsByDay(eventObjects);
  const totalEvents = eventObjects.length;
  const upcomingMonths = getUpcomingMonths(eventObjects);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <Image
          src="/assets/event-art.jpg"
          alt="Evenimente în Craiova"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Evenimente în <span className="text-amber-400">Craiova</span>
          </h1>
          <p className="max-w-2xl text-lg text-white/90 md:text-xl">
            Descoperă cele mai interesante evenimente culturale, artistice și
            sociale din orașul nostru
          </p>
        </div>
      </div>

      <div className="border-b bg-white py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 md:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium md:text-base">
              <span className="font-bold">{totalEvents}</span> evenimente
              programate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium md:text-base">
              Evenimente în următoarele{" "}
              <span className="font-bold">{upcomingMonths.join(", ")}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium md:text-base">
              <span className="font-bold">Craiova</span> și împrejurimi
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-4 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Caută evenimente..."
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <button className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-1 text-sm hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500">
              <Filter className="h-3 w-3" />
              Toate
            </button>
            <button className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500">
              Concerte
            </button>
            <button className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500">
              Expoziții
            </button>
            <button className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500">
              Festivaluri
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="space-y-12">
          {Object.entries(grouped).map(([day, dayEvents]) => {
            const date = new Date(day);
            return (
              <section key={day} id={`day-${day}`} className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <span className="text-sm font-medium">
                      {date.toLocaleDateString("ro-RO", { month: "short" })}
                    </span>
                    <span className="text-2xl font-bold">{date.getDate()}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {date.toLocaleDateString("ro-RO", { weekday: "long" })}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {date.toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <EventList events={dayEvents} />
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
