"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ThumbsUp, MapPin, Calendar } from "lucide-react";


interface BaseRecommendation {
  id: number;
  title: string;
  type: "zona" | "eveniment";
  description: string;
}

const mockData: BaseRecommendation[] = [
  {
    id: 1,
    title: "Parcul Central",
    type: "zona",
    description:
      "Un parc ideal pentru plimbări lungi și relaxare în aer liber.",
  },
  {
    id: 2,
    title: "Teatrul Național",
    type: "eveniment",
    description:
      "Spectacol de teatru modern, cu actori renumiți și decoruri impresionante.",
  },
  {
    id: 3,
    title: "Cartier Studențesc",
    type: "zona",
    description:
      "O zonă vibrantă, cu cafenele și spații de socializare apreciate de tineri.",
  },
  {
    id: 4,
    title: "Concert Rock",
    type: "eveniment",
    description:
      "Concert energic de rock local, cu atmosferă incendiară și muzică live.",
  },
];

export default function SugestiiPage() {
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  function handleLike(id: number) {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Recomandări Personalizate</h1>
        <p className="text-muted-foreground">
          Afișează zone și evenimente bazate pe preferințele și activitatea
          anterioară a utilizatorilor.
        </p>
      </header>

      <Separator />

      <section className="space-y-4">
        {mockData.map((item) => {
          const liked = !!likes[item.id];
          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {item.type === "zona" ? (
                    <MapPin className="h-5 w-5 text-primary" />
                  ) : (
                    <Calendar className="h-5 w-5 text-primary" />
                  )}
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm capitalize text-muted-foreground">
                  {item.type === "zona"
                    ? "Zonă recomandată"
                    : "Eveniment propus"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm">{item.description}</p>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLike(item.id)}
                >
                  <ThumbsUp className="mr-1.5 h-4 w-4" />
                  {liked ? "Apreciat" : "Like"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
