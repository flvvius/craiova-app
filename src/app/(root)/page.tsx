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
  Camera,
  Coffee,
  Ticket,
  Users,
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
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3030&q=80"
            alt="Craiova city panorama"
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.h1
              className="mb-6 text-6xl font-bold text-white drop-shadow-lg md:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-yellow-400">Craiova</span>
            </motion.h1>
            <motion.p
              className="mx-auto mb-8 max-w-2xl text-xl text-white/90 md:text-2xl lg:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Descoperă farmecul orașului unde istoria se întâlnește cu
              modernitatea
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/map">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-yellow-500 px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-yellow-400"
              >
                <span className="relative z-10 flex items-center">
                  <Map className="mr-2 h-5 w-5" />
                  Explorează Orașul
                </span>
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden rounded-full border-2 border-white px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-white/20 dark:text-white"
              >
                <span className="relative z-10 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Evenimente
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 transform"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1, y: [0, 10, 0] } : {}}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-12 w-12 text-white opacity-80" />
        </motion.div>
      </section>

      {/* Quick Stats Section */}
      <section className="relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <StatsCard
              number="100+"
              text="Locuri de Vizitat"
              icon={<Camera className="h-8 w-8" />}
            />
            <StatsCard
              number="50+"
              text="Evenimente Anuale"
              icon={<Ticket className="h-8 w-8" />}
            />
            <StatsCard
              number="300+"
              text="Ani de Istorie"
              icon={<Clock className="h-8 w-8" />}
            />
            <StatsCard
              number="1M+"
              text="Vizitatori Anual"
              icon={<Users className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-white py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Descoperă <span className="text-yellow-500">Experiențe</span>{" "}
              Unice
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              Explorează orașul Craiova prin intermediul platformei noastre și
              descoperă locurile și evenimentele care fac acest oraș special.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <Feature
              icon={<Calendar className="h-8 w-8 text-yellow-500" />}
              title="Evenimente Locale"
              description="Descoperă cele mai interesante evenimente culturale, concerte și festivaluri din Craiova."
              link="/events"
              delay={0.2}
              isLoaded={isLoaded}
            />
            <Feature
              icon={<Coffee className="h-8 w-8 text-yellow-500" />}
              title="Experiențe Gastronomice"
              description="Savurează bucătăria locală în cele mai bune restaurante și cafenele din oraș."
              link="/food"
              delay={0.4}
              isLoaded={isLoaded}
            />
            <Feature
              icon={<Compass className="h-8 w-8 text-yellow-500" />}
              title="Tururi Ghidate"
              description="Explorează orașul cu ghizi locali și descoperă secretele ascunse ale Craiovei."
              link="/tours"
              delay={0.6}
              isLoaded={isLoaded}
            />
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 py-32">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-16 text-center">
            <motion.h2
              className="mb-6 text-5xl font-bold text-white md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              Explorează <span className="text-yellow-400">Interactiv</span>
            </motion.h2>
            <div className="mx-auto h-1 w-24 bg-yellow-400" />
          </div>

          <div className="flex flex-col items-center justify-center gap-16 md:flex-row">
            <div className="w-full max-w-xl">
              <motion.div
                className="relative aspect-[4/3] transform overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:rotate-0 hover:shadow-yellow-400/20 md:rotate-2"
                initial={{ opacity: 0, x: -50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80"
                  alt="Harta interactivă"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />

                {/* Interactive Points */}
                <div className="absolute left-1/3 top-1/4">
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 h-4 w-4 animate-ping rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  </div>
                </div>
                <div className="absolute right-1/4 top-1/2">
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 h-4 w-4 animate-ping rounded-full bg-yellow-400 [animation-delay:500ms]" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/2">
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 h-4 w-4 animate-ping rounded-full bg-yellow-400 [animation-delay:1000ms]" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  </div>
                </div>

                {/* Card Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-2 flex items-center text-sm text-white/90">
                        <MapPin className="mr-2 h-4 w-4 text-yellow-400" />
                        Descoperă pe hartă
                      </div>
                      <div className="text-xl font-bold">
                        +100 locații de vizitat
                      </div>
                    </div>
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-blue-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Map className="h-6 w-6" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="w-full max-w-xl text-center md:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Navighează cu ușurință prin oraș
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-white/80">
                Descoperă toate atracțiile, evenimentele și locurile ascunse ale
                Craiovei cu ajutorul hărții noastre interactive. Filtrează după
                categorii, vezi recenzii și planifică-ți perfect vizita.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <Link href="/map">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden rounded-full bg-yellow-500 px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-yellow-400"
                  >
                    <span className="relative z-10 flex items-center">
                      <Map className="mr-2 h-5 w-5" />
                      Deschide Harta
                    </span>
                  </Button>
                </Link>
                <Link href="/suggestions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative overflow-hidden rounded-full border-2 border-white px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-white/20 dark:text-white"
                  >
                    <span className="relative z-10 flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      Sugestii
                    </span>
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="flex items-center text-white">
                  <div className="mr-4 rounded-full bg-blue-800 p-3">
                    <MapPin className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-lg">100+ locații</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-4 rounded-full bg-blue-800 p-3">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-lg">Recenzii la zi</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-4 rounded-full bg-blue-800 p-3">
                    <Compass className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-lg">Navigare GPS</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="mr-4 rounded-full bg-blue-800 p-3">
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-lg">Evenimente</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Place Section */}
      <section className="w-full bg-gray-50 py-32 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            className="mb-16 text-center text-4xl font-bold md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Locul <span className="text-yellow-500">Săptămânii</span>
          </motion.h2>

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80"
                alt="Parcul Nicolae Romanescu"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="flex flex-col space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Parcul Nicolae Romanescu
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Unul dintre cele mai mari și mai frumoase parcuri din România,
                amenajat în stil englezesc și inaugurat în 1903.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Parcul Nicolae Romanescu este o capodoperă a artei peisagistice
                din România, având o suprafață de peste 90 de hectare. Construit
                după planurile arhitectului francez Édouard Redont, parcul
                include un lac, un hipodrom, și numeroase specii rare de arbori
                și plante.
              </p>
              <Link href="/place/1">
                <Button
                  size="lg"
                  className="group relative w-fit overflow-hidden rounded-full bg-yellow-500 px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-yellow-400"
                >
                  <span className="relative z-10 flex items-center">
                    Vizitează acum
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-32">
        <div className="mb-16 flex items-center justify-between">
          <motion.h2
            className="text-4xl font-bold md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Evenimente <span className="text-yellow-500">Viitoare</span>
          </motion.h2>
          <Link href="/events">
            <Button
              variant="ghost"
              size="lg"
              className="group text-lg font-semibold"
            >
              Vezi toate
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <EventCard
            title="Festival de Film"
            date="15 Mai, 2024"
            image="https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            delay={0.2}
            isLoaded={isLoaded}
          />
          <EventCard
            title="Expoziție de Artă"
            date="22 Mai, 2024"
            image="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            delay={0.4}
            isLoaded={isLoaded}
          />
          <EventCard
            title="Concert în Parc"
            date="1 Iunie, 2024"
            image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            delay={0.6}
            isLoaded={isLoaded}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.h2
            className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Pregătit să Explorezi Craiova?
          </motion.h2>
          <motion.p
            className="mx-auto mb-12 max-w-2xl text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Descoperă cele mai frumoase locuri, evenimente interesante și
            experiențe unice în orașul Craiova.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/map">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-white px-8 py-6 text-lg font-semibold text-yellow-500 transition-all hover:bg-white/90"
              >
                <span className="relative z-10 flex items-center">
                  Deschide Harta
                  <Map className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
            <Link href="/suggestions">
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden rounded-full border-2 border-white px-8 py-6 text-lg font-semibold text-black transition-all hover:bg-white/20 dark:text-white"
              >
                <span className="relative z-10 flex items-center">
                  Vezi Recomandări
                  <Lightbulb className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </motion.div>
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
      className="group flex flex-col items-center rounded-3xl bg-gray-50 p-8 text-center transition-all hover:bg-yellow-500/5 dark:bg-gray-800 dark:hover:bg-yellow-500/5"
      initial={{ opacity: 0, y: 30 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="mb-6 rounded-2xl bg-yellow-500/10 p-4 transition-colors group-hover:bg-yellow-500/20">
        {icon}
      </div>
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <p className="mb-6 text-gray-600 dark:text-gray-400">{description}</p>
      <Link href={link}>
        <Button
          variant="link"
          size="lg"
          className="group text-yellow-500 hover:text-yellow-600"
        >
          Află mai multe
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

function StatsCard({
  number,
  text,
  icon,
}: {
  number: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-400/20 text-white">
        {icon}
      </div>
      <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
        {number}
      </div>
      <div className="text-lg font-medium text-white/90">{text}</div>
    </motion.div>
  );
}

function EventCard({ title, date, image, delay, isLoaded }: EventCardProps) {
  return (
    <motion.div
      className="group overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
      initial={{ opacity: 0, y: 30 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="mb-2 text-sm font-medium text-yellow-400">{date}</p>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <Link href="/events">
          <Button
            variant="ghost"
            size="lg"
            className="group w-full justify-center text-lg font-semibold"
          >
            Detalii
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
