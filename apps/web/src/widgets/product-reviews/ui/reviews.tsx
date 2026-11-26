import { BadgeCheck } from "lucide-react";
import { cn } from "@/shared/lib";
import { Rating } from "./rating";
import { Avatar, AvatarFallback } from "@site/ui/avatar";
import { Separator } from "@/shared/ui/separator";

export interface ProductReviewItem {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  date: string;
  verified: boolean;
}

export interface ReviewsProps {
  reviews?: ProductReviewItem[];
  title?: string;
  className?: string;
}

export const Reviews1 = ({
  reviews = [],
  title = "Отзывы покупателей",
  className,
}: ReviewsProps) => {
  if (!reviews.length) return null;

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tight md:text-3xl">
            {title}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <Rating rate={averageRating} className="[&_svg]:size-5" />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} из 5 · {reviews.length} отзывов
            </span>
          </div>
        </div>

        <div className="space-y-0">
          {reviews.map((review, index) => (
            <div key={review.id}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-3">
                <div>
                  <Rating rate={review.rating} className="[&_svg]:size-4" />
                  <h3 className="mt-2 font-medium">{review.title}</h3>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {review.content}
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {review.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{review.author.name}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <BadgeCheck className="size-4" />
                        <span className="text-xs">Покупка подтверждена</span>
                      </span>
                    )}
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
