"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Mail,
  User,
  MessageSquare,
  Loader2,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactPage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("idle");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.emailAddresses[0].emailAddress,
        },
        body: JSON.stringify({
          name,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message.");

      setSubmitStatus("success");
      setName("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <Image
          src="/assets/craiova-hero.jpg"
          alt="Contact Craiova"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Contactează-ne
          </h1>
          <p className="max-w-2xl text-lg text-white/90 md:text-xl">
            Suntem aici pentru a răspunde întrebărilor și a primi feedback-ul
            tău
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Card className="border-gray-200 shadow-md dark:border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-5 w-5 text-amber-500" />
                  Trimite-ne un mesaj
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Completează formularul de mai jos pentru a ne contacta
                </CardDescription>
              </CardHeader>
              <Separator className="mb-6" />

              {!user?.emailAddresses?.[0]?.emailAddress ? (
                <CardContent className="pb-6">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                    <div className="rounded-full bg-amber-100 p-4 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <User className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold">
                      Autentificare necesară
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Trebuie să fii autentificat pentru a trimite un mesaj
                    </p>
                    <Button
                      className="mt-2 bg-amber-500 text-white hover:bg-amber-600"
                      onClick={() => (window.location.href = "/sign-in")}
                    >
                      Autentificare
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <User className="h-4 w-4 text-amber-500" />
                        Nume
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Numele tău"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <Mail className="h-4 w-4 text-amber-500" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.emailAddresses[0].emailAddress}
                        className="border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                        disabled
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vom folosi această adresă pentru a răspunde mesajului
                        tău
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <MessageSquare className="h-4 w-4 text-amber-500" />
                        Mesaj
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Scrie mesajul tău aici..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px] border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700"
                        required
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-amber-500 text-white hover:bg-amber-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Se trimite...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Trimite mesajul
                        </>
                      )}
                    </Button>

                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full items-center gap-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm">
                          Mesajul a fost trimis cu succes! Îți mulțumim pentru
                          feedback.
                        </p>
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full items-center gap-2 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm">
                          Nu am putut trimite mesajul. Te rugăm să încerci din
                          nou.
                        </p>
                      </motion.div>
                    )}
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border-gray-200 shadow-md dark:border-gray-800">
              <div className="relative h-40">
                <Image
                  src="/assets/craiova-hero.jpg"
                  alt="Craiova Map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">
                    Informații de contact
                  </h3>
                  <p className="text-white/80">Echipa Craiova City Guide</p>
                </div>
              </div>

              <CardContent className="space-y-6 pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Adresă</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Str. A.I. Cuza nr. 7, Craiova, România
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cod poștal: 200585
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      contact@craiova.ro
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      support@craiova.ro
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Telefon</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      +40 251 123 456
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      +40 251 789 012
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Program</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Luni - Vineri: 9:00 - 17:00
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sâmbătă - Duminică: Închis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-md dark:border-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Urmărește-ne</CardTitle>
                <CardDescription>
                  Conectează-te cu noi pe rețelele sociale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="rounded-full bg-amber-100 p-3 text-amber-600 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-amber-100 p-3 text-amber-600 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-amber-100 p-3 text-amber-600 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-amber-100 p-3 text-amber-600 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
