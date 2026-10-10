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

import {Badge} from "@/shared/ui/display/badge.jsx"
import {Button} from "@/shared/ui/actions/button.jsx"
import {createPortal} from "react-dom";
import {AppSidebar} from "@/shared/ui/layout/aside/app-sidebar.jsx";
import {SidebarProvider} from "@/shared/ui/layout/aside/sidebar.jsx";

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
        isVariantPhoto && typeof onMakeVariantCover === "function" && !isVariantCover

// Внутри вашего компонента панели:
    useEffect(() => {
        // 1. Блокируем скролл на body при монтировании
        document.body.classList.add('overflow-hidden', 'touch-none');

        // 2. Возвращаем скролл обратно при размонтировании (закрытии)
        return () => {
            document.body.classList.remove('overflow-hidden', 'touch-none');
        };
    }, []);

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

    return createPortal(
        <div
            className="fixed inset-0 left-0 top-0 z-50 flex translate-x-0
                       translate-y-0 flex-col gap-0 rounded-none border-0 bg-white p-0 text-zinc-800
                       shadow-none sm:rounded-none"
        >
            <SidebarProvider>
                <AppSidebar activePhoto={photo} photos={photos} onOpenPhoto={onOpenPhoto}/>

                <div className="sr-only">{caption}</div>

                <div className="flex flex-col w-full p-4">
                    <header className="flex items-center justify-end">
                        <Button
                            variant="destructive"
                            size="icon-lg"
                            onClick={onClose}
                            aria-label="Закрыть просмотр"
                            className="mr-6"
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
                            className="absolute flex-col inset-x-2 inset-y-1 flex items-center
                                       justify-center sm:inset-x-20 sm:inset-y-4">
                            {status === "error" ? (
                                <div
                                    className="flex flex-col items-center gap-3 rounded-[20px]
                                               border border-white/10 bg-white/[0.06]
                                               px-10 py-12 text-white/70 backdrop-blur-xl">
                                    <ImageOff className="size-8"/>
                                    <p className="text-sm">
                                        Не удалось загрузить фото
                                    </p>
                                </div>
                            ) : (
                                <div className="relative w-fit h-fit max-h-full max-w-full">
                                    <div className="flex absolute gap-3 top-2 left-2">
                                        <Badge
                                            variant="secondary"
                                            className=""
                                        >
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
                                        className="max-h-full max-w-full select-none rounded-[18px] object-contain
                                               shadow-2xl ring-1 ring-white/10"
                                    />
                                    <div className="flex absolute gap-3 bottom-2 left-2">
                                        {isProductCover && (
                                            <Badge variant="secondary">
                                                <Star aria-hidden="true" className="text-yellow-500 size-3.5"/>
                                                Обложка карточки
                                            </Badge>
                                        )}
                                        {
                                            isVariantCover && (
                                                <Badge variant="secondary">
                                                    <Star aria-hidden="true" className="text-yellow-500 size-3.5"/>
                                                    Обложка варианта {photo.variantName}
                                                </Badge>
                                            )
                                        }

                                        {hasCounter && (
                                            <span
                                                aria-live="polite"
                                                className=""
                                            >
                                        {index + 1} / {total}
                                    </span>
                                        )}
                                    </div>
                                </div>

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
                    <footer
                        className="flex shrink-0 flex-wrap items-center justify-center gap-2
                                       px-3 pt-3 pb-4 sm:gap-3 sm:px-6 sm:pb-6">
                        <Button
                            disabled={!showProductCoverAction}
                            onClick={onMakeProductCover}
                        >
                            <Star/>
                            Сделать обложкой карточки
                        </Button>

                        <Button
                            disabled={!showVariantCoverAction}
                            variant="outline"
                            onClick={onMakeVariantCover}
                        >
                            <Tag/>
                            Сделать обложкой варианта «
                            {photo.variantName}»
                        </Button>
                    </footer>
                </div>
            </SidebarProvider>
        </div>, document.body
    )
}

function NavButton({direction, onClick}) {
    const isLeft = direction === "left"
    const Icon = isLeft ? ChevronLeft : ChevronRight

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={onClick}
            aria-label={isLeft ? "Предыдущее фото" : "Следующее фото"}
            className={`absolute top-1/2 z-10 ${
                isLeft ? "left-2 sm:left-6" : "right-2 sm:right-6"
            }`}
        >
            <Icon aria-hidden="true" className="size-6 sm:size-7"/>
        </Button>
    )
}