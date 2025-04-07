"use client";

import type React from "react";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  CalendarIcon,
  Upload,
  ArrowLeft,
  Save,
  Clock,
  MapPin,
  Link2,
  Users,
  FileText,
  X,
  Info,
  AlertCircle,
  User,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { UploadButton } from "~/utils/uploadthing";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const formSchema = z.object({
  title: z.string().min(2, "Titlul trebuie să aibă cel puțin 2 caractere"),
  description: z
    .string()
    .min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
  location: z.string().min(2, "Locația trebuie să aibă cel puțin 2 caractere"),
  date: z.date(),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format de timp invalid"),
  maxParticipants: z.coerce
    .number()
    .min(1, "Trebuie să existe cel puțin 1 participant"),
  photo: z.string().min(1, "Vă rugăm să încărcați o fotografie"),
  externalLink: z.string().url("Vă rugăm să introduceți un URL valid"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewEventPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [formData, setFormData] = useState<FormValues>({
    title: "",
    description: "",
    location: "",
    date: new Date(),
    time: "",
    maxParticipants: 1,
    photo: "",
    externalLink: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    try {
      const validatedData = formSchema.parse(formData);
      setErrors({});

      setIsSubmitting(true);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.emailAddresses[0].emailAddress,
        },
        body: JSON.stringify({
          ...validatedData,
          date: validatedData.date.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create event");

      router.push("/events");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormValues] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error(error);
        setErrors({
          title:
            "A apărut o eroare la crearea evenimentului. Vă rugăm să încercați din nou.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="min-h-screen bg-white py-12 dark:bg-gray-950">
        <div className="relative h-48 w-full overflow-hidden md:h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              Creare Eveniment Nou
            </h1>
            <p className="max-w-2xl text-white/90 md:text-lg">
              Adaugă un nou eveniment în calendarul orașului Craiova
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-2xl px-4 py-12">
          <Card className="border-gray-200 shadow-sm dark:border-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-amber-500" />
                Autentificare necesară
              </CardTitle>
              <CardDescription>
                Trebuie să fiți autentificat pentru a crea un eveniment
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center border-t border-gray-200 p-6 dark:border-gray-800">
              <Button
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={() => router.push("/sign-in")}
              >
                Autentificare
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="relative h-48 w-full overflow-hidden md:h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Creare Eveniment Nou
          </h1>
          <p className="max-w-2xl text-white/90 md:text-lg">
            Adaugă un nou eveniment în calendarul orașului Craiova
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la evenimente
          </Link>
        </div>

        <Card className="border-gray-200 shadow-sm dark:border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5 text-amber-500" />
              Detalii eveniment
            </CardTitle>
            <CardDescription>
              Completați toate câmpurile pentru a crea un eveniment nou
            </CardDescription>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <FileText className="h-4 w-4 text-amber-500" />
                    Titlu
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Titlul evenimentului"
                    className={cn(
                      "border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.title ? "border-red-500 dark:border-red-500" : "",
                    )}
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Info className="h-4 w-4 text-amber-500" />
                    Descriere
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descrieți evenimentul..."
                    className={cn(
                      "min-h-[150px] border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.description
                        ? "border-red-500 dark:border-red-500"
                        : "",
                    )}
                  />
                  {errors.description && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <MapPin className="h-4 w-4 text-amber-500" />
                    Locație
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Locația evenimentului"
                    className={cn(
                      "border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.location
                        ? "border-red-500 dark:border-red-500"
                        : "",
                    )}
                  />
                  {errors.location && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="h-4 w-4 text-amber-500" />
                    Data
                  </Label>
                  <div className="z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start border-gray-300 bg-white text-left font-normal hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800",
                            !formData.date && "text-muted-foreground",
                            errors.date && "border-red-500 dark:border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
                          {formData.date
                            ? format(formData.date, "PPP", { locale: ro })
                            : "Alegeți o dată"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date: Date | undefined) =>
                            date && setFormData({ ...formData, date })
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={ro}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {errors.date && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="time"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Clock className="h-4 w-4 text-amber-500" />
                    Ora
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className={cn(
                      "border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.time ? "border-red-500 dark:border-red-500" : "",
                    )}
                  />
                  {errors.time && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="maxParticipants"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Users className="h-4 w-4 text-amber-500" />
                    Participanți maxim
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: Number(e.target.value),
                      })
                    }
                    className={cn(
                      "border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.maxParticipants
                        ? "border-red-500 dark:border-red-500"
                        : "",
                    )}
                  />
                  {errors.maxParticipants && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.maxParticipants}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="externalLink"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Link2 className="h-4 w-4 text-amber-500" />
                    Link extern
                  </Label>
                  <Input
                    id="externalLink"
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) =>
                      setFormData({ ...formData, externalLink: e.target.value })
                    }
                    placeholder="https://example.com/event"
                    className={cn(
                      "border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-700",
                      errors.externalLink
                        ? "border-red-500 dark:border-red-500"
                        : "",
                    )}
                  />
                  {errors.externalLink && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      {errors.externalLink}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Upload className="h-4 w-4 text-amber-500" />
                  Fotografie eveniment
                </Label>

                {formData.photo ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <Image
                      src={formData.photo || "/placeholder.svg"}
                      alt="Event photo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full"
                      onClick={() => setFormData({ ...formData, photo: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <div
                    className={cn(
                      "flex aspect-[3/2] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6",
                      errors.photo
                        ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
                    )}
                  >
                    <Upload className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Încărcați o fotografie pentru eveniment
                    </p>
                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG sau WEBP (max. 4MB)
                    </p>

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          setFormData({ ...formData, photo: res[0].url });
                          setErrors((prev) => ({ ...prev, photo: undefined }));
                        }
                        setIsPhotoUploading(false);
                      }}
                      onUploadBegin={() => {
                        setIsPhotoUploading(true);
                      }}
                      onUploadError={(error: Error) => {
                        setErrors({ ...errors, photo: error.message });
                        setIsPhotoUploading(false);
                      }}
                      className="ut-button:bg-amber-500 ut-button:hover:bg-amber-600 ut-button:text-white ut-button:rounded-md ut-button:font-medium"
                    />

                    {errors.photo && (
                      <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {errors.photo}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/10">
                  <h3 className="mb-2 font-medium text-amber-800 dark:text-amber-400">
                    Sfaturi pentru fotografie
                  </h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li>Folosiți o imagine de calitate bună</li>
                    <li>Alegeți o imagine relevantă pentru eveniment</li>
                    <li>Dimensiunea recomandată este de 1200x800 pixeli</li>
                    <li>Evitați textul în imagine</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                  Previzualizare eveniment
                </h3>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <h4 className="text-lg font-bold">
                    {formData.title || "Titlul evenimentului"}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-amber-500" />
                      <span>
                        {formData.date
                          ? format(formData.date, "dd MMMM yyyy", {
                              locale: ro,
                            })
                          : "Data"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>{formData.time || "00:00"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span>{formData.location || "Locația"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {Object.keys(errors).length > 0 &&
                errors.title &&
                errors.title.includes("eroare") && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errors.title}</AlertDescription>
                  </Alert>
                )}

              <div className="flex items-center justify-end gap-4 pt-4">
                <Link href="/events">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700"
                  >
                    Anulează
                  </Button>
                </Link>

                <Button
                  type="submit"
                  className="bg-amber-500 text-white hover:bg-amber-600"
                  disabled={isSubmitting || isPhotoUploading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se creează...
                    </>
                  ) : isPhotoUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se încarcă...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Creează eveniment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
