import {ArrowUp, Star, X} from "lucide-react"
import {AspectRatio} from "@/shared/ui/display/aspect-ratio.jsx"
import {Badge} from "@/shared/ui/display/badge.jsx"
import {Button} from "@/shared/ui/actions/button.jsx"
import {cn} from "@/shared/lib/utils" // Исправлен путь импорта


export function PhotoTile({
                              src,
                              alt,
                              badge = null,
                              onOpen,
                              onRemove,
                              onMakeCover,
                              makeCoverTitle = "Сделать обложкой",
                              fluid = false,
                              openLabel = null,
                              className = "",
                          }) {

    const imageElement = (
        <img
            src={src}
            alt={alt}
            draggable={false}
            className={cn(
                "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] rounded-xl"
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

            {/* Всплывающая плашка "Просмотр" при наведении */}
            {openLabel && (
                <div
                    className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                    <Badge
                        variant="secondary"
                        className="rounded-full border border-white/65 bg-white/90 px-3 py-1 text-xs font-semibold text-[#1C1C1E] opacity-0 shadow-md backdrop-blur-xl transition-all duration-300 group-hover:opacity-100 dark:border-white/10 dark:bg-[#2C2C2E]/90 dark:text-white"
                    >
                        {openLabel}
                    </Badge>
                </div>
            )}

            {/* Контекстные кнопки управления (Удалить / Сделать обложкой) */}
            {(onRemove || onMakeCover) && (
                <div className="
                    absolute right-2 top-2 z-10 flex gap-1.5 transition-all duration-300
                    opacity-100 translate-y-0
                    sm:opacity-0 sm:translate-y-1
                    sm:group-hover:opacity-100 sm:group-hover:translate-y-0
                    sm:group-focus-within:opacity-100 sm:group-focus-within:translate-y-0
                ">
                    {onRemove && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            title="Удалить фото"
                            aria-label="Удалить фото"
                            onClick={onRemove}
                            className="
                                h-8 w-8 rounded-full border border-black/5 bg-white/80 text-[#1C1C1E]
                                shadow-md backdrop-blur-md active:scale-90 transition-all duration-200
                                hover:bg-[#FF3B30] hover:text-white dark:border-white/10 dark:bg-black/70 dark:text-white dark:hover:bg-[#FF453A]
                            "
                        >
                            <X className="h-4 w-4"/>
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
                            className="
                                h-8 w-8 rounded-full border border-black/5 bg-white/80 text-[#1C1C1E]
                                shadow-md backdrop-blur-md active:scale-90 transition-all duration-200
                                hover:bg-[#007AFF] hover:text-white dark:border-white/10 dark:bg-black/70 dark:text-white dark:hover:bg-[#0A84FF]
                            "
                        >
                            <ArrowUp className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            )}

            {badge && (
                <div className="pointer-events-none absolute left-2 bottom-2 flex min-w-0 justify-center">
                    <Badge
                        variant="secondary"
                        className="
                max-w-min min-w-0 shrink rounded-full border border-black/5 bg-white/90
                px-2.5 py-1 text-[10px] font-bold text-[#1C1C1E] shadow-md backdrop-blur-md
                dark:border-white/10 dark:bg-black/80 dark:text-white
            "
                    >
                        <span className="">{badge}</span>
                    </Badge>
                </div>
            )}
        </>
    )

    return (
        <div
            className={cn(
                "group relative isolate block shrink-0 overflow-hidden rounded-[18px] bg-[#F2F2F7] dark:bg-[#1C1C1E]",
                "shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none border border-black/[0.04] dark:border-white/[0.08]",
                "transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)]",
                fluid ? "w-full" : ' h-28 w-28 lg:h-28 lg:w-28',
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
        </div>
    )
}