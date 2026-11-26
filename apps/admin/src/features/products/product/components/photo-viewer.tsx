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

import {Badge} from "@site/ui/badge"
import {Button} from "@site/ui/button"
import {createPortal} from "react-dom";
import {AppSidebar, type ViewerPhoto} from "@/shared/ui/layout/aside/app-sidebar.tsx";
import {SidebarProvider} from "@/shared/ui/layout/aside/sidebar.tsx";

export interface PhotoViewerProps {
    photo: ViewerPhoto | null
    photos: ViewerPhoto[]
    isProductCover: boolean
    isVariantCover: boolean
    onClose: () => void
    onPrev?: () => void
    onNext?: () => void
    onOpenPhoto: (variantIndex: number | null, imageIndex: number | null) => void
    onMakeProductCover?: () => void
    onMakeVariantCover?: () => void
    index?: number
    total?: number
}

export function PhotoViewer({
                                photo,
                                photos,
                                isProductCover,
                                isVariantCover,
                                onClose,
                                onPrev,
                                onNext,
                                onOpenPhoto,
                                onMakeProductCover,
                                onMakeVariantCover,
                                index,
                                total,
                            }: PhotoViewerProps) {
    const isVariantPhoto = photo?.variantIndex != null
    const variantLabel = photo?.variantName?.trim() || "Стандарт"

    const hasCounter =
        typeof index === "number" &&
        index >= 0 &&
        typeof total === "number" &&
        total > 1
    const canNavigate = total == null || total > 1

    const swipeStartX = useRef<number | null>(null)

    const [imageState, setImageState] = useState(() => ({
        src: photo?.src,
        status: "loading",
    }))

    const status =
        imageState.src === photo?.src ? imageState.status : "loading"

    const caption = isVariantPhoto
        ? `Фото варианта «${variantLabel}»`
        : "Общее фото товара"

    const showProductCoverAction =
        !isProductCover && typeof onMakeProductCover === "function"

    const showVariantCoverAction =
        isVariantPhoto && typeof onMakeVariantCover === "function" && !isVariantCover

    useEffect(() => {
        document.body.classList.add('overflow-hidden', 'touch-none');
        return () => {
            document.body.classList.remove('overflow-hidden', 'touch-none');
        };
    }, []);

    useEffect(() => {
        if (!photo) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault()
                onClose()
                return
            }
            if (!canNavigate) return
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
    }, [photo, canNavigate, onClose, onPrev, onNext])

    const handleTouchStart = (event: React.TouchEvent) => {
        swipeStartX.current = event.changedTouches[0]?.clientX ?? null
    }

    const handleTouchEnd = (event: React.TouchEvent) => {
        const startX = swipeStartX.current
        swipeStartX.current = null

        if (startX == null || !canNavigate) return

        const endX = event.changedTouches[0]?.clientX ?? startX
        const deltaX = endX - startX

        if (Math.abs(deltaX) < 60) return

        if (deltaX > 0) onPrev?.()
        else onNext?.()
    }

    const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement)?.closest?.("img, button")) return
        onClose()
    }

    if (!photo) return null

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={caption}
            className="fixed inset-0 left-0 top-0 z-50 flex translate-x-0
                       translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 text-zinc-800
                       shadow-none dark:bg-[#1C1C1E] dark:text-white sm:rounded-none"
        >
            <SidebarProvider>
                <AppSidebar activePhoto={photo} photos={photos} onOpenPhoto={onOpenPhoto}/>

                <div className="sr-only">{caption}</div>

                <div className="flex min-h-0 flex-1 flex-col w-full p-4">
                    <header className="flex items-center justify-end">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon-lg"
                            onClick={onClose}
                            aria-label="Закрыть просмотр"
                            className="mr-2 sm:mr-6"
                        >
                            <X className="size-5"/>
                        </Button>
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
                            className="absolute inset-x-2 inset-y-1 flex flex-col items-center justify-center sm:inset-x-20 sm:inset-y-4">
                            {status === "error" ? (
                                <div
                                    className="flex flex-col items-center gap-3 rounded-[20px]
                                               border border-zinc-200 bg-zinc-100
                                               px-10 py-12 text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80">
                                    <ImageOff className="size-8"/>
                                    <p className="text-sm font-medium">
                                        Не удалось загрузить фото
                                    </p>
                                </div>
                            ) : (
                                <div className="relative flex max-h-full max-w-full items-center justify-center">
                                    <div className="flex absolute gap-2 top-2 left-2 z-10">
                                        <Badge variant="secondary">
                                            <Star aria-hidden="true" className="text-yellow-500 size-3.5"/>
                                            {caption}
                                        </Badge>
                                    </div>
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
                                        className="max-h-[calc(100vh-190px)] max-w-full select-none rounded-[18px] object-contain
                                               shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
                                    />
                                    <div className="flex flex-wrap items-center gap-2 absolute bottom-2 left-2 z-10">
                                        {isProductCover && (
                                            <Badge variant="secondary">
                                                <Star aria-hidden="true" className="text-yellow-500 size-3.5"/>
                                                Обложка карточки
                                            </Badge>
                                        )}
                                        {isVariantCover && (
                                            <Badge variant="secondary">
                                                <Star aria-hidden="true" className="text-yellow-500 size-3.5"/>
                                                Обложка варианта «{variantLabel}»
                                            </Badge>
                                        )}
                                        {hasCounter && (
                                            <span
                                                aria-live="polite"
                                                className="rounded-full bg-black/75 px-2.5 py-0.5 text-xs font-medium tabular-nums text-white"
                                            >
                                                {(index ?? 0) + 1} / {total}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {status === "loading" && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-8 animate-spin text-zinc-500 dark:text-white/60"/>
                            </div>
                        )}

                        {canNavigate && (
                            <NavButton direction="right" onClick={onNext}/>
                        )}
                    </div>
                    <footer
                        className="flex shrink-0 flex-wrap items-center justify-center gap-2
                                       px-3 pt-3 pb-4 sm:gap-3 sm:px-6 sm:pb-6">
                        <Button
                            type="button"
                            disabled={!showProductCoverAction}
                            onClick={onMakeProductCover}
                        >
                            <Star/>
                            {isProductCover ? "Обложка карточки" : "Сделать обложкой карточки"}
                        </Button>

                        {isVariantPhoto && (
                            <Button
                                type="button"
                                disabled={!showVariantCoverAction}
                                variant="outline"
                                onClick={onMakeVariantCover}
                            >
                                <Tag/>
                                {isVariantCover
                                    ? `Обложка варианта «${variantLabel}»`
                                    : `Сделать обложкой варианта «${variantLabel}»`}
                            </Button>
                        )}
                    </footer>
                </div>
            </SidebarProvider>
        </div>, document.body
    )
}

function NavButton({direction, onClick}: {direction: "left" | "right"; onClick?: () => void}) {
    const isLeft = direction === "left"
    const Icon = isLeft ? ChevronLeft : ChevronRight

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={onClick}
            aria-label={isLeft ? "Предыдущее фото" : "Следующее фото"}
            className={`absolute top-1/2 -translate-y-1/2 z-10 ${
                isLeft ? "left-2 sm:left-6" : "right-2 sm:right-6"
            }`}
        >
            <Icon aria-hidden="true" className="size-6 sm:size-7"/>
        </Button>
    )
}
