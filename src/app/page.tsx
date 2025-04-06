"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Lightbulb,
  ChevronDown,
  Map,
  Star,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  delay: number;
  isLoaded: boolean;
}

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  delay: number;
  isLoaded: boolean;
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/assets/craiova-hero.jpg"
          alt="Craiova city panorama"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="mb-6 text-5xl font-bold text-white drop-shadow-lg md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Descoperă <span className="text-yellow-400">Craiova</span>
          </motion.h1>

          <motion.p
            className="mb-10 max-w-2xl text-xl text-white drop-shadow-md md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Un oraș plin de istorie, cultură și oportunități de explorat
          </motion.p>

          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/map">
              <Button
                size="lg"
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Deschide Harta Interactivă
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1, y: [0, 10, 0] } : {}}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white" />
        </motion.div>
      </section>

      <section className="w-full bg-yellow-500 py-12 dark:bg-yellow-600">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <StatsCard
              number="100+"
              text="Locuri de Vizitat"
              icon={<MapPin className="h-8 w-8" />}
            />
            <StatsCard
              number="50+"
              text="Evenimente Anuale"
              icon={<Calendar className="h-8 w-8" />}
            />
            <StatsCard
              number="300+"
              text="Ani de Istorie"
              icon={<Clock className="h-8 w-8" />}
            />
            <StatsCard
              number="4.8"
              text="Rating Mediu"
              icon={<Star className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20">
        <h2 className="mb-6 text-center text-3xl font-bold md:text-5xl">
          Descoperă Experiențe Unice
        </h2>
        <p className="mx-auto mb-16 max-w-3xl text-center text-lg text-gray-600 dark:text-gray-400">
          Explorează orașul Craiova prin intermediul platformei noastre și
          descoperă locurile și evenimentele care fac acest oraș special.
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <Feature
            icon={<Calendar className="h-8 w-8 text-yellow-500" />}
            title="Evenimente Locale"
            description="Descoperă cele mai interesante evenimente din Craiova și împrejurimi."
            link="/events"
            delay={0.2}
            isLoaded={isLoaded}
          />

          <Feature
            icon={<MapPin className="h-8 w-8 text-yellow-500" />}
            title="Locuri de Vizitat"
            description="Explorează atracțiile turistice și locurile ascunse ale orașului."
            link="/map"
            delay={0.4}
            isLoaded={isLoaded}
          />

          <Feature
            icon={<Lightbulb className="h-8 w-8 text-yellow-500" />}
            title="Recomandări Personalizate"
            description="Primește sugestii adaptate preferințelor și intereselor tale."
            link="/suggestions"
            delay={0.6}
            isLoaded={isLoaded}
          />
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Explorează Craiova{" "}
              <span className="text-yellow-400">Interactiv</span>
            </h2>
            <div className="mx-auto h-1 w-24 bg-yellow-400"></div>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 md:flex-row lg:gap-16">
            <div className="w-full max-w-lg md:w-1/2">
              <div className="relative aspect-[4/3] transform overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 hover:rotate-0 md:rotate-2">
                <Image
                  src="/assets/featured-place.jpg"
                  alt="Harta interactivă"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>

                <div className="absolute left-1/3 top-1/4">
                  <div className="relative">
                    <div className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-yellow-400"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  </div>
                </div>
                <div className="absolute right-1/4 top-1/2">
                  <div className="relative">
                    <div className="animation-delay-500 absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-yellow-400"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/2">
                  <div className="relative">
                    <div className="animation-delay-1000 absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-yellow-400"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-1 flex items-center text-sm text-white/80">
                        <MapPin className="mr-1 h-4 w-4 text-yellow-400" />
                        Descoperă pe hartă
                      </div>
                      <div className="text-lg font-bold">
                        +100 locații de vizitat
                      </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-blue-900">
                      <Map className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-lg text-center md:w-1/2 md:text-left">
              <h3 className="mb-4 text-2xl font-bold text-white">
                Navighează cu ușurință prin oraș
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-white/80">
                Descoperă toate atracțiile, evenimentele și locurile ascunse ale
                Craiovei cu ajutorul hărții noastre interactive. Filtrează după
                categorii, vezi recenzii și planifică-ți perfect vizita.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <Link href="/map">
                  <Button
                    size="lg"
                    className="transform rounded-xl bg-yellow-500 px-8 py-6 font-bold text-black shadow-lg transition-transform hover:-translate-y-1 hover:bg-yellow-600"
                  >
                    <Map className="mr-2 h-5 w-5" />
                    Deschide Harta
                  </Button>
                </Link>
                <Link href="/suggestions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white px-8 py-6 text-black hover:bg-white/90 dark:text-white"
                  >
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Sugestii
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center text-white">
                  <div className="mr-3 rounded-full bg-blue-600 p-2">
                    <MapPin className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span>100+ locații</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-3 rounded-full bg-blue-600 p-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span>Recenzii la zi</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-3 rounded-full bg-blue-600 p-2">
                    <Compass className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span>Navigare GPS</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-3 rounded-full bg-blue-600 p-2">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span>Evenimente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-100 py-20 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-5xl">
            Locul Săptămânii
          </h2>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              className="relative h-[400px] overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src="/assets/featured-place.jpg"
                alt="Parcul Nicolae Romanescu"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="flex flex-col space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold md:text-3xl">
                Parcul Nicolae Romanescu
              </h3>
              <p className="text-lg">
                Unul dintre cele mai mari și mai frumoase parcuri din România,
                amenajat în stil englezesc și inaugurat în 1903.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Parcul Nicolae Romanescu este o capodoperă a artei peisagistice
                din România, având o suprafață de peste 90 de hectare. Construit
                după planurile arhitectului francez Édouard Redont, parcul
                include un lac, un hipodrom, și numeroase specii rare de arbori
                și plante.
              </p>
              <Link href="/place/1">
                <Button className="group w-fit">
                  Vizitează acum
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold md:text-4xl">
            Evenimente Viitoare
          </h2>
          <Link href="/events">
            <Button variant="ghost" className="group">
              Vezi toate
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <EventCard
            title="Festival de Film"
            date="15 Mai, 2024"
            image="/assets/event-film.jpg"
            delay={0.2}
            isLoaded={isLoaded}
          />
          <EventCard
            title="Expoziție de Artă"
            date="22 Mai, 2024"
            image="/assets/event-art.jpg"
            delay={0.4}
            isLoaded={isLoaded}
          />
          <EventCard
            title="Concert în Parc"
            date="1 Iunie, 2024"
            image="/assets/event-concert.jpg"
            delay={0.6}
            isLoaded={isLoaded}
          />
        </div>
      </section>

      <section className="w-full bg-yellow-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-5xl">
            Pregătit să Explorezi Craiova?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-black/80">
            Descoperă cele mai frumoase locuri, evenimente interesante și
            experiențe unice în orașul Craiova.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/map">
              <Button
                size="lg"
                className="bg-black px-8 text-white hover:bg-black/80"
              >
                Deschide Harta
                <Map className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/suggestions">
              <Button
                size="lg"
                className="border border-blue-700 bg-white px-8 text-blue-700 hover:bg-white/90 dark:border-yellow-600 dark:text-yellow-600"
              >
                Vezi Recomandări
                <Lightbulb className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
  link,
  delay,
  isLoaded,
}: FeatureProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="mb-5 rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{description}</p>
      <Link href={link}>
        <Button
          variant="link"
          className="group text-blue-700 hover:text-blue-900 dark:text-yellow-400 dark:hover:text-yellow-300"
        >
          Află mai multe
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

interface StatsCardProps {
  number: string;
  text: string;
  icon: ReactNode;
}

function StatsCard({ number, text, icon }: StatsCardProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-yellow-900">
        {icon}
      </div>
      <div className="mb-1 text-3xl font-bold text-white md:text-4xl">
        {number}
      </div>
      <div className="font-medium text-yellow-100">{text}</div>
    </div>
  );
}

function EventCard({ title, date, image, delay, isLoaded }: EventCardProps) {
  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-gray-800"
      initial={{ opacity: 0, y: 30 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="mb-2 text-sm text-yellow-600 dark:text-yellow-400">
          {date}
        </p>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <Link href="/events">
          <Button variant="ghost" size="sm" className="group">
            Detalii
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
