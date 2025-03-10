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
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Mail, User, MessageSquare, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

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

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <main className="mx-auto max-w-lg p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-5 w-5 text-primary" />
              Pagina de Contact
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Trebuie să fii autentificat pentru a trimite un mesaj
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-5 w-5 text-primary" />
            Pagina de Contact
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Trimite întrebări sau feedback echipei aplicației
          </CardDescription>
        </CardHeader>
        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nume
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Numele tău"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Mesaj
              </Label>
              <Textarea
                id="message"
                placeholder="Scrie mesajul tău aici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
            {submitStatus === "success" && (
              <p className="text-sm text-green-600">
                Message sent successfully!
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-sm text-red-600">
                Failed to send message. Please try again.
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
