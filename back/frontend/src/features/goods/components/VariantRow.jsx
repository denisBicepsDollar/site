import {Trash2} from "lucide-react";
import {PhotoTile} from "../ui/PhotoTile.jsx";
import {PriceInput} from "../ui/PriceInput.jsx";
import {StockStepper} from "../ui/StockStepper.jsx";
import {UploadTile} from "../ui/UploadTile.jsx";
import {useEffect, useState} from "react";

export function VariantRow({
                               variant,
                               onUpdate,
                               onRemove,
                               onRemovePhoto,
                               onMakeVariantCover,
                               onUploadPhotos,
                               onOpenPhoto,
                               onOpenMorePhotos,
                           }) {
    const {clientId, name, stock, price, images, previewImage} = variant;

    const [maxPhotos, setMaxPhotos] = useState(1);


    useEffect(() => {
        let timeoutId = null;

        const update = () => {
            const currentWidth = window.innerWidth;

            if (currentWidth > 1920) {
                setMaxPhotos(images.length);
            } else if (currentWidth > 1366) {
                setMaxPhotos(3);
            } else if (currentWidth > 1200) {
                setMaxPhotos(2);
            } else {
                setMaxPhotos(1);
            }
        };

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(update, 150); // задержка 150мс
        };

        update();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", update);
    }, [images.length]);

    const visibleImages = images.slice(0, maxPhotos);
    const hiddenCount = images.length - visibleImages.length;
    const hasMore = hiddenCount > 0;

    return (
        <div className="flex flex-row items-center gap-3 rounded-xl border border-zinc-200 p-2">
            {/* Размер */}
            <input
                className="h-9 w-1/12 rounded-lg border border-zinc-200 bg-white text-center text-sm
                           font-medium outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                value={name}
                onChange={event => onUpdate({name: event.target.value})}
            />

            {/* Остаток */}
            <StockStepper
                className="h-9 w-1/6"
                value={stock}
                onChange={value => onUpdate({stock: value})}
            />

            {/* Своя цена */}
            <PriceInput
                value={price}
                onChange={value => onUpdate({price: value})}
                wrapperClassName="w-32 shrink-0 gap-2"
                inputClassName="min-w-0 w-full"
            />

            {/* Фотографии варианта */}
            <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden">
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
                            onClick={() => onOpenMorePhotos?.()}
                            aria-label={`Показать ещё ${hiddenCount} фото`}
                            className="flex h-28 w-24 shrink-0 flex-col items-center justify-center
                           rounded-lg border border-zinc-200 bg-zinc-50 text-center
                           text-xs leading-tight hover:bg-zinc-100"
                        >
                            <span className="font-semibold text-zinc-900">+{hiddenCount}</span>
                            <span className="text-zinc-500">Ещё фото</span>
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
                className="shrink-0 flex h-8 w-8 items-center rounded-lg text-zinc-400
                           hover:bg-zinc-100 hover:text-zinc-900">
                <Trash2 className="h-5 w-5" aria-hidden="true"/>
            </button>
        </div>
    );
}