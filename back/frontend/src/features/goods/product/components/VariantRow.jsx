import {Trash2} from "lucide-react";
import {useCallback, useState} from "react";
import {VariantPhotosModal} from "./VariantPhotosModal.jsx";
import {PhotoTile} from "../ui/PhotoTile.jsx";
import {PriceInput} from "../ui/PriceInput.jsx";
import {StockStepper} from "../ui/StockStepper.jsx";
import {UploadTile} from "../ui/UploadTile.jsx";
import {useBreakpoint} from "../model/useWindowWidth.js";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";

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
            <Input
                value={name}
                onChange={(event) => onUpdate({name: event.target.value})}
                className="h-9 min-w-0 rounded-[12px] border-black/[0.08] bg-[#F2F2F7] text-center text-sm font-medium dark:border-white/[0.08] dark:bg-[#2C2C2E] dark:text-white"
            />

            {/* Остаток */}
            <StockStepper
                className="w-full min-w-0"
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPhotosModalOpen(true)}
                            aria-label={`Показать ещё ${hiddenCount} фото`}
                            className="h-28 w-24 shrink-0 flex-col rounded-[16px] border-dashed border-[#D1D1D6] bg-[#F2F2F7] text-[#6E6E73] hover:border-[#007AFF]/40 hover:bg-[#007AFF]/[0.04] dark:border-[#48484A] dark:bg-[#2C2C2E] dark:text-[#AEAEB2]"
                        >
    <span className="font-semibold text-[#007AFF] dark:text-[#0A84FF]">
        +{hiddenCount}
    </span>
                            <span>Ещё фото</span>
                        </Button>
                    ) : (
                        <UploadTile size="sm" onFiles={onUploadPhotos}/>
                    )}
                </div>
            </div>

            {/* Удалить вариант */}
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onRemove}
                aria-label="Удалить вариант"
                className="col-start-4 row-start-1 ml-auto rounded-full text-[#8E8E93] hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] sm:col-auto sm:row-auto sm:ml-0 dark:hover:bg-[#FF453A]/15 dark:hover:text-[#FF6961]"
            >
                <Trash2 aria-hidden="true" className="size-4"/>
            </Button>

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