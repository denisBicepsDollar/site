import {ArrowUp, X} from "lucide-react"

import {AspectRatio} from "@/components/ui/aspect-ratio.jsx"
import {Badge} from "@/components/ui/badge.jsx"
import {Button} from "@/components/ui/button.jsx"
import {Card} from "@/components/ui/card.jsx"
import {cn} from "cn"

import {SIZES} from "../constants.js"

export function PhotoTile({
                              src,
                              alt,
                              size = "md",
                              badge = null,
                              onOpen,
                              onRemove,
                              onMakeCover,
                              makeCoverTitle = "Сделать обложкой",
                              fluid = false,
                              openLabel = null,
                              className = "",
                          }) {
    const {wrapper = "", image = ""} = SIZES[size] ?? {}

    const imageElement = (
        <img
            src={src}
            alt={alt}
            draggable={false}
            className={cn(
                "h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]",
                image,
            )}
        />
    )

    const content = (
        <>
            <div className="absolute inset-0 z-0">
                {onOpen ? (
                    <Button
                        type="button"
                        variant="ghost"
                        aria-label={openLabel || `Открыть: ${alt}`}
                        onClick={onOpen}
                        className="h-full w-full rounded-none border-0 bg-transparent p-0 text-inherit shadow-none hover:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#007AFF] dark:focus-visible:ring-[#0A84FF]"
                    >
                        {imageElement}
                    </Button>
                ) : (
                    imageElement
                )}
            </div>

            {openLabel && (
                <div
                    className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/10">
                    <Badge
                        variant="secondary"
                        className="rounded-full border border-white/60 bg-white/90 px-3 text-xs font-medium text-[#1C1C1E] opacity-0 shadow-sm backdrop-blur-xl transition-opacity group-hover:opacity-100 dark:border-white/15 dark:bg-[#2C2C2E]/90 dark:text-white"
                    >
                        {openLabel}
                    </Badge>
                </div>
            )}

            {(onRemove || onMakeCover) && (
                <div
                    className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-100 transition-all duration-200 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                    {onRemove && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            title="Удалить фото"
                            aria-label="Удалить фото"
                            onClick={onRemove}
                            className="rounded-full border border-white/40 bg-white/85 text-[#1C1C1E] shadow-md backdrop-blur-xl hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] active:scale-95 dark:border-white/10 dark:bg-[#2C2C2E]/90 dark:text-white dark:hover:bg-[#FF453A]/15 dark:hover:text-[#FF6961]"
                        >
                            <X className="size-4"/>
                        </Button>
                    )}

                    {onMakeCover && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            title={makeCoverTitle}
                            aria-label={makeCoverTitle}
                            onClick={onMakeCover}
                            className="rounded-full border border-white/40 bg-white/85 text-[#1C1C1E] shadow-md backdrop-blur-xl hover:bg-[#007AFF]/10 hover:text-[#007AFF] active:scale-95 dark:border-white/10 dark:bg-[#2C2C2E]/90 dark:text-white dark:hover:bg-[#0A84FF]/15 dark:hover:text-[#0A84FF]"
                        >
                            <ArrowUp className="size-4"/>
                        </Button>
                    )}
                </div>
            )}

            {badge && (
                <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 flex min-w-0">
                    <Badge
                        variant="secondary"
                        className="max-w-full truncate rounded-full border border-white/60 bg-white/90 px-2.5 text-[10px] font-medium text-[#1C1C1E] shadow-sm backdrop-blur-xl dark:border-white/15 dark:bg-[#2C2C2E]/90 dark:text-white"
                    >
                        {badge}
                    </Badge>
                </div>
            )}
        </>
    )

    return (
        <Card
            className={cn(
                "group relative isolate block shrink-0 overflow-hidden rounded-[18px] border-0 bg-[#F2F2F7] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.05] transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.16)] dark:bg-[#1C1C1E] dark:ring-white/[0.08]",
                fluid ? "w-full" : wrapper,
                className,
            )}
        >
            {fluid ? (
                <AspectRatio ratio={1} className="relative w-full">
                    {content}
                </AspectRatio>
            ) : (
                <div className="relative h-full w-full">
                    {content}
                </div>
            )}
        </Card>
    )
}