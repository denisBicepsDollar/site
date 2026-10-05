import {createElement, useEffect, useRef, useState} from "react";
import {ChevronLeft, ChevronRight, ImageOff, Loader2, Star, Tag, X} from "lucide-react";

/* Полноэкранный просмотр фото (лайтбокс).
   Листается стрелками клавиатуры и свайпом, закрывается по Esc или клику по фону.

   Новые необязательные пропсы (можно не передавать — всё продолжит работать как раньше):
   index — индекс текущего фото, total — всего фото.
   Если передать — появится счётчик «3 / 12», а при total === 1 стрелки и свайпы отключатся. */
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
    const isVariantPhoto = photo?.variantIndex != null;
    const hasCounter = typeof index === "number" && typeof total === "number" && total > 1;
    const canNavigate = total == null || total > 1;

    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const swipeStartX = useRef(null);

    const [entered, setEntered] = useState(false);
    const [imageState, setImageState] = useState(() => ({src: photo?.src, status: "loading"}));
    const status = imageState.src === photo?.src ? imageState.status : "loading";

    /* Плавное появление оверлея */
    useEffect(() => {
        const frame = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    /* Блокируем прокрутку страницы, уводим фокус в диалог и возвращаем его при закрытии */
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus({preventScroll: true});

        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.({preventScroll: true});
        };
    }, []);

    /* Esc — закрыть, ← / → — листать, Tab — не выпускаем фокус из диалога */
    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key === "Tab") {
                const focusable = dialogRef.current?.querySelectorAll(
                    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
                );
                if (!focusable || focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (!dialogRef.current?.contains(document.activeElement)) {
                    event.preventDefault();
                    first.focus();
                } else if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
                return;
            }

            if (!canNavigate) return;

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                onPrev();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                onNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [canNavigate, onClose, onNext, onPrev]);


    const handleTouchStart = event => {
        swipeStartX.current = event.changedTouches[0]?.clientX ?? null;
    };

    const handleTouchEnd = event => {
        const startX = swipeStartX.current;
        swipeStartX.current = null;

        if (startX == null || !canNavigate) return;

        const deltaX = (event.changedTouches[0]?.clientX ?? startX) - startX;
        if (Math.abs(deltaX) < 60) return;

        if (deltaX > 0) {
            onPrev();
        } else {
            onNext();
        }
    };

    /* Клик по пустому месту (но не по фото и не по кнопке) закрывает просмотр */
    const handleStageClick = event => {
        if (event.target?.closest?.("img, button")) return;
        onClose();
    };

    if (!photo) return null;

    const caption = isVariantPhoto ? `Фото варианта «${photo.variantName}»` : "Общее фото товара";
    const showProductCoverAction = !isProductCover && typeof onMakeProductCover === "function";
    const showVariantCoverAction = isVariantPhoto && typeof onMakeVariantCover === "function";

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={caption}
            className={`fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md transition-opacity duration-200 motion-reduce:transition-none ${
                entered ? "opacity-100" : "opacity-0"
            }`}
        >
            {/* Шапка: подпись фото, бейджи и закрытие */}
            <header className="flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className="truncate rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-inset ring-white/15 sm:text-sm">
                        {caption}
                    </span>

                    {isProductCover && (
                        <span
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-300/15 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-200/30 sm:text-sm">
                            <Star className="h-3.5 w-3.5"/>
                            Обложка карточки
                        </span>
                    )}

                    {hasCounter && (
                        <span
                            aria-live="polite"
                            className="shrink-0 px-2 py-1.5 text-xs font-medium tabular-nums text-white/60 sm:text-sm"
                        >
                            {index + 1} / {total}
                        </span>
                    )}
                </div>

                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть просмотр"
                    className="shrink-0 cursor-pointer rounded-full bg-white/10 p-2 text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
                >
                    <X className="h-6 w-6"/>
                </button>
            </header>

            {/* Сцена: фото по центру свободного места */}
            <div
                className="relative min-h-0 flex-1"
                onClick={handleStageClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {canNavigate && <NavButton direction="left" onClick={onPrev}/>}

                <div
                    className="absolute inset-x-2 inset-y-1 flex items-center justify-center sm:inset-x-20 sm:inset-y-4">
                    {status === "error" ? (
                        <div
                            className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-10 py-12 text-white/70 ring-1 ring-inset ring-white/10">
                            <ImageOff className="h-8 w-8"/>
                            <p className="text-sm">Не удалось загрузить фото</p>
                        </div>
                    ) : (
                        <img
                            key={photo.src}
                            src={photo.src}
                            alt={caption}
                            draggable={false}
                            onLoad={() => setImageState({src: photo.src, status: "ready"})}
                            onError={() => setImageState({src: photo.src, status: "error"})}
                            className={`max-h-full max-w-full cursor-default select-none rounded-xl object-contain shadow-2xl ring-1 ring-white/10 transition duration-200 motion-reduce:transition-none ${
                                entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
                            }`}
                        />
                    )}
                </div>

                {status === "loading" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white/50"/>
                    </div>
                )}

                {canNavigate && <NavButton direction="right" onClick={onNext}/>}
            </div>

            {/* Действия */}
            {(showProductCoverAction || showVariantCoverAction) && (
                <footer
                    className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 pt-3 pb-4 sm:gap-3 sm:px-6 sm:pb-6">
                    {showProductCoverAction && (
                        <ActionButton icon={Star} onClick={onMakeProductCover}>
                            Сделать обложкой карточки
                        </ActionButton>
                    )}

                    {showVariantCoverAction && (
                        <ActionButton icon={Tag} variant="glass" onClick={onMakeVariantCover}>
                            Сделать обложкой варианта «{photo.variantName}»
                        </ActionButton>
                    )}
                </footer>
            )}
        </div>
    );
}

/* Круглая кнопка-стрелка поверх фото */
function NavButton({direction, onClick}) {
    const isLeft = direction === "left";
    const Icon = isLeft ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={isLeft ? "Предыдущее фото" : "Следующее фото"}
            className={`absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2.5 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 sm:p-3 ${
                isLeft ? "left-2 sm:left-6" : "right-2 sm:right-6"
            }`}
        >
            {createElement(Icon, {className: "h-6 w-6 sm:h-7 sm:w-7", "aria-hidden": true})}
        </button>
    );
}

/* Кнопка действия в нижней панели */
function ActionButton({icon: Icon, children, onClick, variant = "solid"}) {
    const styles =
        variant === "glass"
            ? "bg-white/10 text-white ring-1 ring-inset ring-white/20 backdrop-blur hover:bg-white/20"
            : "bg-white text-slate-900 hover:bg-white/90";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98] ${styles}`}
        >
            {createElement(Icon, {className: "h-4 w-4", "aria-hidden": true})}
            {children}
        </button>
    );
}
