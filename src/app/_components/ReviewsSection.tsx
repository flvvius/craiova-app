"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewForm } from "~/app/_components/ReviewForm";

interface Review {
  id: number;
  placeId: number;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

interface ReviewsSectionProps {
  placeId: number;
  initialReviews: Review[];
}

export function ReviewsSection({
  placeId,
  initialReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleNewReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <>
      <h2 className="mb-2 text-2xl font-semibold">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className="mb-4 rounded-md border p-3 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                by {review.userEmail.split("@")[0]}
              </span>
            </div>
            <p className="mt-2">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm italic">Add your review here:</p>
        <ReviewForm
          placeId={placeId}
          onReviewSubmittedAction={handleNewReview}
        />
      </div>
    </>
  );
}
