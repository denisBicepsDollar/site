"use client";
;
import Link from "next/link";
import {ArrowLeft, ArrowRight, ArrowUpRight} from "lucide-react";
import {useEffect, useState} from "react";
import {cn} from "cn";

import {Button} from "@site/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@site/ui/carousel";

export interface BlogArticleItem {
    id: string;
    title: string;
    summary: string;
    url: string;
    image: string;
}

export const BlogScreen = ({
                               heading = "Блог",
                               items = [] as BlogArticleItem[],
                               className,
                           }: {
                               heading?: string;
                               items?: BlogArticleItem[];
                               className?: string;
                           }) => {
    const [carouselApi, setCarouselApi] = useState<{
        canScrollPrev: () => boolean;
        canScrollNext: () => boolean;
        scrollPrev: () => void;
        scrollNext: () => void;
        on: (event: string, cb: () => void) => void;
        off: (event: string, cb: () => void) => void;
    } | undefined>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
            carouselApi.off("select", updateSelection);
        };
    }, [carouselApi]);

    if (!items.length) {
        return (
            <section className={cn("py-24", className)}>
                <div className="container">
                    <h2 className="mb-3 text-3xl font-semibold md:text-4xl">{heading}</h2>
                    <p className="mb-6 text-muted-foreground">
                        Статьи об уходе за растениями появятся здесь скоро.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        Перейти в каталог
                        <ArrowUpRight className="size-4"/>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={cn("py-32", className)}>
            <div className="container">
                <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
                    <div>
                        <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
                            {heading}
                        </h2>
                    </div>
                    <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowLeft className="size-5"/>
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowRight className="size-5"/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-full">
                <Carousel
                    setApi={setCarouselApi}
                    plugins={[]}
                    opts={{
                        breakpoints: {
                            "(max-width: 768px)": {
                                dragFree: true,
                            },
                        },
                    }}
                    className="relative w-full max-w-full md:left-[-1rem]"
                >
                    <CarouselContent
                        className="hide-scrollbar w-full max-w-full md:-mr-4 md:ml-8 2xl:mr-[max(0rem,calc(50vw-700px-1rem))] 2xl:ml-[max(8rem,calc(50vw-700px+1rem))]">
                        {items.map((item) => (
                            <CarouselItem key={item.id} className="ml-8 md:max-w-[452px]">
                                <a
                                    href={item.url}
                                    className="group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex aspect-3/2 overflow-clip rounded-xl">
                                            <div className="flex-1">
                                                <div
                                                    className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="mb-2 line-clamp-3 pt-4 text-lg font-medium break-words md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                                        {item.title}
                                    </div>
                                    <div
                                        className="mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-base lg:mb-9">
                                        {item.summary}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        Читать далее{" "}
                                        <ArrowRight
                                            className="ml-2 size-5 transition-transform group-hover:translate-x-1"/>
                                    </div>
                                </a>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};
