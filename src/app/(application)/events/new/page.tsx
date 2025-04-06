"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
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
} from "~/components/ui/card";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  date: z.date(),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  maxParticipants: z.coerce.number().min(1, "Must have at least 1 participant"),
  photo: z.string().min(1, "Please upload a photo"),
  externalLink: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewEventPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              You need to be logged in to create an event
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details below to create a new event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Event title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your event..."
                className={cn(
                  "min-h-[100px]",
                  errors.description ? "border-red-500" : "",
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Event location"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground",
                      errors.date && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date
                      ? format(formData.date, "PPP")
                      : "Pick a date"}
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
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className={errors.time ? "border-red-500" : ""}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="maxParticipants" className="text-sm font-medium">
                Maximum Participants
              </label>
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
                className={errors.maxParticipants ? "border-red-500" : ""}
              />
              {errors.maxParticipants && (
                <p className="text-sm text-red-500">{errors.maxParticipants}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Photo</label>
              <div className="flex flex-col gap-4">
                {formData.photo ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={formData.photo}
                      alt="Event photo"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => setFormData({ ...formData, photo: "" })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setFormData({ ...formData, photo: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setErrors({ ...errors, photo: error.message });
                    }}
                    className={cn(
                      "w-full",
                      errors.photo ? "border-red-500" : "",
                    )}
                  />
                )}
                {errors.photo && (
                  <p className="text-sm text-red-500">{errors.photo}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="externalLink" className="text-sm font-medium">
                External Link
              </label>
              <Input
                id="externalLink"
                type="url"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData({ ...formData, externalLink: e.target.value })
                }
                placeholder="https://example.com/event"
                className={errors.externalLink ? "border-red-500" : ""}
              />
              {errors.externalLink && (
                <p className="text-sm text-red-500">{errors.externalLink}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
