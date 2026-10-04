import {useEffect} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

/* Полноэкранный просмотр фото (лайтбокс).
   Умеет листать стрелками и закрываться по Esc. */
export function PhotoViewer({
                                photo,
                                isProductCover,
                                onClose,
                                onPrev,
                                onNext,
                                onMakeProductCover,
                                onMakeVariantCover,
                            }) {
    const isVariantPhoto = photo.variantIndex !== null;

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowLeft") onPrev();
            if (event.key === "ArrowRight") onNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фотографии"
        >
            <button
                type="button"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-white"
                onClick={onClose}
                aria-label="Закрыть просмотр"
            >
                <X className="h-7 w-7"/>
            </button>

            <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-3 text-white sm:left-8"
                onClick={onPrev}
                aria-label="Предыдущее фото"
            >
                <ChevronLeft className="h-8 w-8"/>
            </button>

            <div className="relative flex items-center justify-center">
                <img
                    src={photo.src}
                    alt={`Фото ${photo.variantName ?? "товара"}`}
                    className="max-h-[78vh] max-w-[85vw] object-contain"
                />

                <div className="left-1 flex flex-wrap gap-1">
                    <span className="text-sm text-white">
                        {isVariantPhoto ? `Фото варианта ${photo.variantName}` : "Общее фото товара"}
                    </span>
                </div>
            </div>

            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-3 text-white sm:right-8"
                onClick={onNext}
                aria-label="Следующее фото"
            >
                <ChevronRight className="h-8 w-8"/>
            </button>

            <div className="absolute inset-x-3 bottom-4 z-10 flex flex-wrap justify-center gap-2">
                {!isProductCover && (
                    <button
                        type="button"
                        className="rounded-lg bg-white px-3 py-2 text-sm"
                        onClick={onMakeProductCover}
                    >
                        Сделать обложкой карточки
                    </button>
                )}

                {isVariantPhoto && (
                    <button
                        type="button"
                        className="rounded-lg bg-white px-3 py-2 text-sm"
                        onClick={onMakeVariantCover}
                    >
                        Сделать обложкой варианта {photo.variantName}
                    </button>
                )}
            </div>
        </div>
    );
}