"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Loader2, Star } from "lucide-react";

interface Review {
  id: number;
  placeId: number;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

interface ReviewFormProps {
  placeId: number;
  onReviewSubmittedAction: (review: Review) => void;
}

export function ReviewForm({
  placeId,
  onReviewSubmittedAction,
}: ReviewFormProps) {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.emailAddresses[0].emailAddress,
        },
        body: JSON.stringify({
          placeId,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review.");

      const newReview = (await res.json()) as Review;
      onReviewSubmittedAction(newReview);
      setSubmitStatus("success");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-center text-muted-foreground">
          Trebuie să fii autentificat pentru a lăsa un review
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl transition-colors hover:text-yellow-400"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Comentariu</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Scrie un review pentru acest loc..."
          className="mt-1"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Se trimite...
          </>
        ) : (
          "Trimite Review"
        )}
      </Button>

      {submitStatus === "success" && (
        <p className="text-sm text-green-600">
          Review-ul a fost trimis cu succes!
        </p>
      )}
      {submitStatus === "error" && (
        <p className="text-sm text-red-600">
          A apărut o eroare. Te rugăm să încerci din nou.
        </p>
      )}
    </form>
  );
}
