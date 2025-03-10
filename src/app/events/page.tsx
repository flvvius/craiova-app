import { Separator } from "~/components/ui/separator";
import { Calendar } from "lucide-react";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";
import { EventList } from "~/app/_components/EventList";

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
    const day = event.date.toISOString().split("T")[0] as string;
    if (!days[day]) {
      days[day] = [];
    }
    days[day].push(event);
  }

  Object.keys(days).forEach((day) => {
    const dayEvents = days[day];
    if (dayEvents) {
      dayEvents.sort((a, b) => {
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);
        if (
          hoursA === undefined ||
          minutesA === undefined ||
          hoursB === undefined ||
          minutesB === undefined
        ) {
          return 0;
        }
        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
      });
    }
  });

  const sortedDays = Object.entries(days).sort(([dayA], [dayB]) => {
    const dateA = new Date(dayA);
    const dateB = new Date(dayB);
    return dateA.getTime() - dateB.getTime();
  });

  return Object.fromEntries(sortedDays);
}

export default async function EventsPage() {
  const eventObjects: EventItem[] = await db.select().from(events);
  const grouped = groupEventsByDay(eventObjects);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Evenimente</h1>
      </header>
      <p className="text-muted-foreground">
        Pagina Evenimentelor: Prezintă evenimentele curente și viitoare,
        organizate pe zile.
      </p>

      <Separator />

      <section className="space-y-8">
        {Object.entries(grouped).map(([day, events]) => (
          <div key={day}>
            <h2 className="mb-2 text-lg font-semibold">
              {new Date(day).toLocaleDateString("ro-RO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <EventList events={events} />
          </div>
        ))}
      </section>
    </main>
  );
}
