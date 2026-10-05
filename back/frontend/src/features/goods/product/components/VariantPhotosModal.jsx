import {useEffect} from "react";
import {createPortal} from "react-dom";
import {ArrowUp, Check, X} from "lucide-react";
import {PhotoTile} from "../ui/PhotoTile.jsx";

export function VariantPhotosModal({
                                       open,
                                       onClose,
                                       name,
                                       images = [],
                                       previewImage,
                                       onOpenPhoto,
                                       onRemovePhoto,
                                       onMakeVariantCover,
                                   }) {
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[25] flex items-center justify-center
                       bg-zinc-950/50 p-3 backdrop-blur-sm sm:p-6"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="variant-photos-title"
                className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden
                           rounded-2xl border border-white/70 bg-white shadow-2xl"
            >
                <header className="flex shrink-0 items-center justify-between gap-4
                                   border-b border-zinc-100 p-4 sm:px-5 sm:py-4"
                >
                    <div className="min-w-0">
                        <h2
                            id="variant-photos-title"
                            className="truncate text-base font-semibold text-zinc-900"
                        >
                            Фотографии размера {name}
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500">
                            {images.length} фото · Нажмите «Сделать обложкой» для выбора
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="flex cursor-pointer h-9 w-9 shrink-0 items-center justify-center
                                   rounded-xl text-zinc-500 transition-colors
                                   hover:bg-zinc-100 hover:text-zinc-900
                                   focus-visible:outline-none focus-visible:ring-2
                                   focus-visible:ring-zinc-400"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4
                                        lg:grid-cols-4"
                        >
                            {images.map((src, imageIndex) => {
                                const isCover = src === previewImage;

                                return (
                                    <div
                                        key={`${name}-${imageIndex}`}
                                        className="min-w-0"
                                    >
                                        <PhotoTile
                                            src={src}
                                            alt={`Фото ${imageIndex + 1} размера ${name}`}
                                            fluid
                                            badge={isCover ? "Обложка" : null}
                                            openLabel="Просмотр"
                                            onOpen={
                                                onOpenPhoto
                                                    ? () => onOpenPhoto(imageIndex)
                                                    : undefined
                                            }
                                            onRemove={
                                                onRemovePhoto
                                                    ? () => onRemovePhoto(imageIndex)
                                                    : undefined
                                            }
                                        />

                                        {isCover ? (
                                            <div
                                                className="mt-2 flex min-h-9 items-center
                                                           justify-center gap-1.5 rounded-xl
                                                           bg-emerald-50 px-2 py-2 text-xs
                                                           font-medium text-emerald-700"
                                            >
                                                <Check className="h-4 w-4"/>
                                                Текущая обложка
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onMakeVariantCover?.(src);
                                                    onClose();
                                                }}
                                                className="mt-2 flex min-h-9 w-full
                                                           items-center justify-center gap-1.5
                                                           rounded-xl border border-zinc-200
                                                           bg-white px-2 py-2 text-xs
                                                           font-medium text-zinc-700
                                                           transition-colors hover:bg-zinc-50
                                                           hover:text-zinc-900
                                                           focus-visible:outline-none
                                                           focus-visible:ring-2
                                                           focus-visible:ring-zinc-400
                                                           cursor-pointer
                                                           "
                                            >
                                                <ArrowUp className="h-4 w-4"/>
                                                Сделать обложкой
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-zinc-200
                                        p-10 text-center text-sm text-zinc-500"
                        >
                            В этом варианте пока нет фотографий
                        </div>
                    )}
                </div>
            </section>
        </div>,
        document.body,
    );
}