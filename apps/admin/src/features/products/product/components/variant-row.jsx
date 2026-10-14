import {Trash2} from "lucide-react";
import {useCallback, useState} from "react";
import {VariantPhotosModal} from "./variant-photos-modal.jsx";
import {PhotoTile} from "../ui/photo-tile.jsx";
import {PriceInput} from "../ui/price-input.jsx";
import {StockStepper} from "../ui/stock-stepper.jsx";
import {UploadTile} from "../ui/upload-tile.jsx";
import {useBreakpoint} from "../model/useWindowWidth.js";
import {Input} from "@/shared/ui/forms/input.jsx";
import {Button} from "@/shared/ui/actions/button.jsx";

const MAX_PHOTOS_BY_BREAKPOINT = {
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
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
            className="
                grid min-w-0 grid-cols-[minmax(3rem,1fr)_minmax(5.5rem,1.1fr)_5rem]
                items-center gap-x-2 gap-y-2.5 rounded-xl p-2.5 bg-black/[0.01]
                border border-black/[0.05] transition-all duration-200
                hover:bg-black/[0.02]
                sm:grid-cols-[5rem_6.5rem_6.5rem_minmax(0,1fr)_2.5rem]
                sm:gap-x-3 sm:gap-y-0 sm:px-3 sm:py-2
            "
        >
            {/* Размер */}
            {/* Инпут размера товара */}
            <Input
                value={name}
                onChange={(event) => onUpdate({name: event.target.value})}
                placeholder="Размер"
                className="
        h-9 min-w-0 w-full rounded-full text-center text-sm font-semibold px-3
        border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E]
        transition-all duration-200 shadow-none outline-none
        focus-visible:border-[#007AFF]/35 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#007AFF]/15
        dark:border-white/[0.08] dark:bg-[#1C1C1E] dark:text-white
        dark:focus-visible:border-[#0A84FF]/40 dark:focus-visible:bg-[#2C2C2E] dark:focus-visible:ring-[#0A84FF]/20
    "
            />

            {/* Остаток (Степпер теперь не сжимается до искажения) */}
            <StockStepper
                className="w-full min-w-0"
                value={stock}
                onChange={(value) => onUpdate({stock: value})}
            />

            {/* Своя цена */}
            <PriceInput
                value={price}
                onChange={(value) => onUpdate({price: value})}
                wrapperClassName="w-full min-w-0 gap-1.5"
                inputClassName="w-full min-w-0 h-9"
            />

            {/* Фотографии варианта */}
            <div
                className="
                    col-span-full row-start-2 flex min-w-0 items-center justify-center gap-2
                    overflow-x-auto overscroll-x-contain pb-1.5 no-scrollbar
                    sm:col-auto sm:row-auto sm:pb-0 sm:pl-3
                "
            >
                {visibleImages.map((image, imageIndex) => (
                    <div key={`${clientId}-${imageIndex}`} className="shrink-0">
                        <PhotoTile
                            src={image}
                            alt={`Фото ${imageIndex + 1}`}
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
                            className="
                                h-28 w-28 shrink-0 flex-col gap-1
                                border border-dashed border-zinc-300
                                bg-zinc-100
                                active:scale-[0.95] transition-all duration-200
                            "
                        >
                            <span className="text-sm font-bold text-[#007AFF] dark:text-[#0A84FF]">
                                +{hiddenCount}
                            </span>
                            <span className="text-[9px] font-medium text-[#8E8E93] uppercase tracking-wider">
                                Ещё
                            </span>
                        </Button>
                    ) : (
                        <UploadTile className="h-28 w-28" size="sm" onFiles={onUploadPhotos}/>
                    )}
                </div>
            </div>

            {/* Кнопка "Удалить вариант" */}
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={onRemove}
                aria-label="Удалить вариант"
                className="
                    col-span-full w-full row-start-3 sm:row-start-1 sm:ml-auto rounded-full sm:h-8 sm:w-8
                    text-[#8E8E93] transition-all duration-200 active:scale-90
                    hover:bg-[#FF3B30]/10 hover:text-[#FF3B30]
                    sm:col-5
                "
            >
                <span className="sm:hidden mr-2">Удалить товар</span>
                <Trash2 aria-hidden="true" className="h-4 w-4 text-red-500"/>
            </Button>

            <VariantPhotosModal
                open={photosModalOpen}
                onClose={closePhotosModal}
                name={name}
                variant={variant}
                images={images}
                previewImage={previewImage}
                onOpenPhoto={onOpenPhoto}
                onRemovePhoto={onRemovePhoto}
                onMakeVariantCover={onMakeVariantCover}
            />
        </div>
    );
}