"use client";

import { Star } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface CustomerReviewsProps {
  productId: string;
}

export const CustomerReviews = ({ productId }: CustomerReviewsProps) => {
  const trpc = useTRPC();
  
  const { data: stats } = useSuspenseQuery(
    trpc.reviews.getProductStats.queryOptions({ productId })
  );
  
  const { data: reviews } = useSuspenseQuery(
    trpc.reviews.getByProduct.queryOptions({ 
      productId,
      limit: 6,
      status: 'approved'
    })
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} ${Math.floor(diffInDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ${Math.floor(diffInDays / 30) === 1 ? 'month' : 'months'} ago`;
    return `${Math.floor(diffInDays / 365)} ${Math.floor(diffInDays / 365) === 1 ? 'year' : 'years'} ago`;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  if (stats.totalReviews === 0) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              No Reviews Yet
            </h2>
            <p className="text-muted-foreground">
              Be the first to review this product!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Customer Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
              What People Say
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(stats.averageRating)
                      ? "fill-foreground text-foreground"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-foreground text-foreground"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(new Date(review.createdAt))}
                  </span>
                </div>
                
                {review.title && (
                  <h3 className="font-semibold text-sm mb-2">{review.title}</h3>
                )}
                
                {review.comment && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                    {getInitials(review.userName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{review.userName}</span>
                    {review.verifiedPurchase && (
                      <span className="text-xs text-brand font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No approved reviews to display.</p>
          </div>
        )}
      </div>
    </section>
  );
};