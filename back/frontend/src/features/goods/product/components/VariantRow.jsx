import {Trash2} from "lucide-react";
import {useCallback, useState} from "react";
import {VariantPhotosModal} from "./VariantPhotosModal.jsx";
import {PhotoTile} from "../ui/PhotoTile.jsx";
import {PriceInput} from "../ui/PriceInput.jsx";
import {StockStepper} from "../ui/StockStepper.jsx";
import {UploadTile} from "../ui/UploadTile.jsx";
import {useBreakpoint} from "../model/useWindowWidth.js";

const MAX_PHOTOS_BY_BREAKPOINT = {
    xl: Infinity,
    lg: 6,
    md: 4,
    sm: 3,
    xs: 2,
};

export function VariantRow({
                               variant,
                               onUpdate,
                               onRemove,
                               onRemovePhoto,
                               onMakeVariantCover,
                               onUploadPhotos,
                               onOpenPhoto,
                           }) {
    const [photosModalOpen, setPhotosModalOpen] = useState(false);
    const closePhotosModal = useCallback(() => setPhotosModalOpen(false), []);

    const {clientId, name, stock, price, images, previewImage} = variant;


    const breakpoint = useBreakpoint();
    const maxPhotos = Math.min(
        images.length,
        MAX_PHOTOS_BY_BREAKPOINT[breakpoint] ?? 1,
    );

    const visibleImages = images.slice(0, maxPhotos);
    const hiddenCount = images.length - visibleImages.length;
    const hasMore = hiddenCount > 0;

    return (
        <div
            className="grid min-w-0 grid-cols-[minmax(3.5rem,1fr)_minmax(4.5rem,1.1fr)_5rem_1.75rem]
                       items-center gap-x-1.5 gap-y-2 rounded-xl border border-zinc-200
                       p-2
                       sm:grid-cols-[4.5rem_5rem_5rem_minmax(0,1fr)_2rem]
                       sm:gap-x-3 sm:gap-y-0 sm:p-2.5"
        >
            {/* Размер */}
            <input
                className="h-9 w-full min-w-0 rounded-lg border border-zinc-200 bg-white
                           text-center text-sm font-medium outline-none
                           transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                value={name}
                onChange={(event) => onUpdate({name: event.target.value})}
            />

            {/* Остаток */}
            <StockStepper
                className="h-9 w-full min-w-0"
                value={stock}
                onChange={(value) => onUpdate({stock: value})}
            />

            {/* Своя цена */}
            <PriceInput
                value={price}
                onChange={(value) => onUpdate({price: value})}
                wrapperClassName="w-full min-w-0 gap-2"
                inputClassName="w-full min-w-0"
            />

            {/* Фотографии варианта */}
            <div
                className="col-span-full row-start-2 flex min-w-0 items-center justify-start gap-2
                           overflow-x-auto overscroll-x-contain pb-1
                           sm:col-auto sm:row-auto sm:pb-0"
            >
                {visibleImages.map((image, imageIndex) => (
                    <div key={`${clientId}-${imageIndex}`} className="shrink-0">
                        <PhotoTile
                            src={image}
                            alt={`Фото ${imageIndex + 1}`}
                            size="sm"
                            badge={image === previewImage ? `Обложка ${name}` : null}
                            onOpen={() => onOpenPhoto(imageIndex)}
                            onRemove={() => onRemovePhoto(imageIndex)}
                            onMakeCover={() => onMakeVariantCover(image)}
                            makeCoverTitle={`Сделать обложкой варианта ${name}`}
                        />
                    </div>
                ))}

                <div className="shrink-0">
                    {hasMore ? (
                        <button
                            type="button"
                            onClick={() => setPhotosModalOpen(true)}
                            aria-label={`Показать ещё ${hiddenCount} фото`}
                            className="flex h-28 w-24 flex-col items-center justify-center gap-1
                                       rounded-xl border border-zinc-200 bg-zinc-50 p-2
                                       text-center text-xs leading-tight text-zinc-600
                                       transition-colors hover:border-zinc-300 hover:bg-zinc-100
                                       focus-visible:outline-none focus-visible:ring-2
                                       focus-visible:ring-zinc-400 cursor-pointer"
                        >
                            <span className="font-semibold text-zinc-900">
                                +{hiddenCount}
                            </span>
                            <span>Ещё фото</span>
                        </button>
                    ) : (
                        <UploadTile size="sm" onFiles={onUploadPhotos}/>
                    )}
                </div>
            </div>

            {/* Удалить вариант */}
            <button
                type="button"
                onClick={onRemove}
                aria-label="Удалить вариант"
                className="col-start-4 row-start-1 ml-auto flex h-7 w-7 shrink-0
                           items-center justify-center rounded-lg text-zinc-400
                           transition-colors hover:bg-zinc-100 hover:text-rose-600
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-zinc-400
                           sm:col-auto sm:row-auto sm:ml-0 sm:h-8 sm:w-8"
            >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true"/>
            </button>

            <VariantPhotosModal
                open={photosModalOpen}
                onClose={closePhotosModal}
                name={name}
                images={images}
                previewImage={previewImage}
                onOpenPhoto={onOpenPhoto}
                onRemovePhoto={onRemovePhoto}
                onMakeVariantCover={onMakeVariantCover}
            />
        </div>
    );
}