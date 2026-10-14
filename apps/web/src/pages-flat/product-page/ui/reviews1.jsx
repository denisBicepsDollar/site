import {BadgeCheck} from "lucide-react";
import {cn} from "cn";

import {Rating} from "./rating";
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/ui/avatar";
import {Separator} from "@/shared/ui/separator";

const person1 = {
    name: "Jack Walsh",
    firstName: "Jack",
    lastName: "Walsh",
    initials: "JW",
    email: "jack.walsh@example.com",
    username: "jackwalsh",
    role: "Product Designer",
    company: "Cartwright",
    location: "Brisbane, Australia",
    avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar1.webp",
};
const person2 = {
    name: "Ilze Pērkone",
    firstName: "Ilze",
    lastName: "Pērkone",
    initials: "MK",
    email: "iperkone@example.com",
    username: "iperkone",
    role: "Brand Director",
    company: "Kivit",
    location: "Rīga, Latvia",
    avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar2.webp",
};
const person3 = {
    name: "Vernon Desilets",
    firstName: "Vernon",
    lastName: "Desilets",
    initials: "VD",
    email: "vernod@example.com",
    username: "vernod",
    role: "Creative Director",
    company: "Soho Logix",
    location: "Paris, France",
    avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar3.webp",
};
const person4 = {
    name: "Lín Wàngshū",
    firstName: "Lín",
    lastName: "Wangshu",
    initials: "LW",
    email: "linwang4@example.com",
    username: "liwang",
    role: "Graphic Designer",
    company: "Tenxcloud",
    location: "Shanghai, China",
    avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar4.webp",
};
const person5 = {
    name: "Rajesh Bhatt",
    firstName: "Rajesh",
    lastName: "Bhatt",
    initials: "RB",
    email: "rajesh.bhatt@example.com",
    username: "rajeshbhatt",
    role: "UX Researcher",
    company: "Mindtree",
    location: "Mumbai, India",
    avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar5.webp",
};

const DEFAULT_REVIEWS = [
    {
        id: "1",
        rating: 5,
        title: "Exceeded my expectations",
        content:
            "I was a bit skeptical at first, but this product really delivered. The quality is outstanding and it arrived faster than expected. Would definitely recommend to anyone on the fence.",
        author: {
            name: person1.name,
            avatar: person1.avatar,
        },
        date: "Dec 10, 2024",
        verified: true,
    },
    {
        id: "2",
        rating: 4,
        title: "Great value for money",
        content:
            "Solid product overall. Does exactly what it's supposed to do. Took off one star because the packaging could be better, but the product itself is great.",
        author: {
            name: person2.name,
            avatar: person2.avatar,
        },
        date: "Dec 8, 2024",
        verified: true,
    },
    {
        id: "3",
        rating: 5,
        title: "Perfect for everyday use",
        content:
            "I've been using this daily for a month now and it still looks and works like new. The build quality is impressive at this price point. Already bought one for my sister.",
        author: {
            name: person3.name,
            avatar: person3.avatar,
        },
        date: "Dec 5, 2024",
        verified: true,
    },
    {
        id: "4",
        rating: 4,
        title: "Good but not perfect",
        content:
            "The product is nice and works well. My only minor complaint is that the color is slightly different from the photos, but it's still a great purchase overall.",
        author: {
            name: person4.name,
        },
        date: "Dec 2, 2024",
        verified: false,
    },
    {
        id: "5",
        rating: 5,
        title: "Best purchase I've made this year",
        content:
            "Absolutely love it! The attention to detail is remarkable. Customer service was also very helpful when I had questions. Five stars all around.",
        author: {
            name: person5.name,
            avatar: person5.avatar,
        },
        date: "Nov 28, 2024",
        verified: true,
    },
];

export const Reviews1 = ({
                             reviews = DEFAULT_REVIEWS,
                             title = "Customer Reviews",
                             className
                         }) => {
    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <section className={cn("py-16 md:py-24", className)}>
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                        <Rating rate={averageRating} className="[&_svg]:size-5"/>
                        <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 · {reviews.length} reviews
            </span>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-0">
                    {reviews.map((review, index) => (
                        <div key={review.id}>
                            {index > 0 && <Separator className="my-6"/>}
                            <div className="space-y-3">
                                {/* Rating & Title */}
                                <div>
                                    <Rating rate={review.rating} className="[&_svg]:size-4"/>
                                    <h3 className="mt-2 font-medium">{review.title}</h3>
                                </div>

                                {/* Content */}
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {review.content}
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={review.author.avatar}
                                            alt={review.author.name}
                                        />
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
                        <BadgeCheck className="size-4"/>
                        <span className="text-xs">Verified Purchase</span>
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