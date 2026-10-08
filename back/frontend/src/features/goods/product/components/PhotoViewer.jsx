import {useEffect, useRef, useState} from "react"
import {
    ChevronLeft,
    ChevronRight,
    ImageOff,
    Loader2,
    Star,
    Tag,
    X,
} from "lucide-react"

import {Badge} from "@/components/ui/badge.jsx"
import {Button} from "@/components/ui/button.jsx"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog.jsx"

export function PhotoViewer({
                                photo,
                                isProductCover,
                                onClose,
                                onPrev,
                                onNext,
                                onMakeProductCover,
                                onMakeVariantCover,
                                index,
                                total,
                            }) {
    const isVariantPhoto = photo?.variantIndex != null
    const hasCounter =
        typeof index === "number" &&
        typeof total === "number" &&
        total > 1
    const canNavigate = total == null || total > 1

    const swipeStartX = useRef(null)

    const [imageState, setImageState] = useState(() => ({
        src: photo?.src,
        status: "loading",
    }))

    const status =
        imageState.src === photo?.src ? imageState.status : "loading"

    const caption = isVariantPhoto
        ? `Фото варианта «${photo.variantName}»`
        : "Общее фото товара"

    const showProductCoverAction =
        !isProductCover && typeof onMakeProductCover === "function"

    const showVariantCoverAction =
        isVariantPhoto && typeof onMakeVariantCover === "function"

    useEffect(() => {
        if (!photo || !canNavigate) return

        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault()
                onPrev?.()
            }

            if (event.key === "ArrowRight") {
                event.preventDefault()
                onNext?.()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [photo, canNavigate, onPrev, onNext])

    const handleTouchStart = (event) => {
        swipeStartX.current = event.changedTouches[0]?.clientX ?? null
    }

    const handleTouchEnd = (event) => {
        const startX = swipeStartX.current
        swipeStartX.current = null

        if (startX == null || !canNavigate) return

        const endX = event.changedTouches[0]?.clientX ?? startX
        const deltaX = endX - startX

        if (Math.abs(deltaX) < 60) return

        if (deltaX > 0) onPrev?.()
        else onNext?.()
    }

    const handleStageClick = (event) => {
        if (event.target?.closest?.("img, button")) return
        onClose()
    }

    if (!photo) return null

    return (
        <Dialog
            open={Boolean(photo)}
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
        >
            <DialogContent
                showCloseButton={false}
                className="fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-[#09090B]/95 p-0 text-white shadow-none backdrop-blur-xl sm:rounded-none"
            >
                <DialogTitle className="sr-only">{caption}</DialogTitle>

                <header className="flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-6">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="max-w-[45vw] truncate rounded-full border-white/15 bg-white/10 text-white/90"
                        >
                            {caption}
                        </Badge>

                        {isProductCover && (
                            <Badge className="shrink-0 rounded-full border-amber-200/20 bg-amber-300/15 text-amber-200">
                                <Star aria-hidden="true" className="size-3.5"/>
                                Обложка карточки
                            </Badge>
                        )}

                        {hasCounter && (
                            <span
                                aria-live="polite"
                                className="shrink-0 px-2 text-xs font-medium tabular-nums text-white/60 sm:text-sm"
                            >
                                {index + 1} / {total}
                            </span>
                        )}
                    </div>

                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-lg"
                            aria-label="Закрыть просмотр"
                            className="shrink-0 rounded-full border border-white/15 bg-white/10 text-white shadow-none backdrop-blur-xl hover:bg-white/20 active:scale-95"
                        >
                            <X className="size-5"/>
                        </Button>
                    </DialogClose>
                </header>

                <div
                    className="relative min-h-0 flex-1"
                    onClick={handleStageClick}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {canNavigate && (
                        <NavButton direction="left" onClick={onPrev}/>
                    )}

                    <div
                        className="absolute inset-x-2 inset-y-1 flex items-center justify-center sm:inset-x-20 sm:inset-y-4">
                        {status === "error" ? (
                            <div
                                className="flex flex-col items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.06] px-10 py-12 text-white/70 backdrop-blur-xl">
                                <ImageOff className="size-8"/>
                                <p className="text-sm">
                                    Не удалось загрузить фото
                                </p>
                            </div>
                        ) : (
                            <img
                                key={photo.src}
                                src={photo.src}
                                alt={caption}
                                draggable={false}
                                onLoad={() =>
                                    setImageState({
                                        src: photo.src,
                                        status: "ready",
                                    })
                                }
                                onError={() =>
                                    setImageState({
                                        src: photo.src,
                                        status: "error",
                                    })
                                }
                                className="max-h-full max-w-full select-none rounded-[18px] object-contain shadow-2xl ring-1 ring-white/10"
                            />
                        )}
                    </div>

                    {status === "loading" && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-8 animate-spin text-white/50"/>
                        </div>
                    )}

                    {canNavigate && (
                        <NavButton direction="right" onClick={onNext}/>
                    )}
                </div>

                {(showProductCoverAction || showVariantCoverAction) && (
                    <footer
                        className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 pt-3 pb-4 sm:gap-3 sm:px-6 sm:pb-6">
                        {showProductCoverAction && (
                            <ActionButton
                                icon={Star}
                                onClick={onMakeProductCover}
                            >
                                Сделать обложкой карточки
                            </ActionButton>
                        )}

                        {showVariantCoverAction && (
                            <ActionButton
                                icon={Tag}
                                variant="glass"
                                onClick={onMakeVariantCover}
                            >
                                Сделать обложкой варианта «
                                {photo.variantName}»
                            </ActionButton>
                        )}
                    </footer>
                )}
            </DialogContent>
        </Dialog>
    )
}

function NavButton({direction, onClick}) {
    const isLeft = direction === "left"
    const Icon = isLeft ? ChevronLeft : ChevronRight

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            onClick={onClick}
            aria-label={isLeft ? "Предыдущее фото" : "Следующее фото"}
            className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 text-white shadow-none backdrop-blur-xl hover:bg-white/25 active:scale-95 ${
                isLeft ? "left-2 sm:left-6" : "right-2 sm:right-6"
            }`}
        >
            <Icon aria-hidden="true" className="size-6 sm:size-7"/>
        </Button>
    )
}

function ActionButton({icon: Icon, children, onClick, variant = "solid"}) {
    const isGlass = variant === "glass"

    return (
        <Button
            type="button"
            variant={isGlass ? "outline" : "default"}
            onClick={onClick}
            className={
                isGlass
                    ? "min-h-11 rounded-full border-white/20 bg-white/10 px-4 text-white shadow-lg backdrop-blur-xl hover:bg-white/20"
                    : "min-h-11 rounded-full bg-white px-4 text-[#1C1C1E] shadow-lg hover:bg-white/90"
            }
        >
            <Icon aria-hidden="true" className="size-4"/>
            {children}
        </Button>
    )
}