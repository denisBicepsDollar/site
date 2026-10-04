import {Trash2} from "lucide-react";
import {PhotoTile} from "../ui/PhotoTile.jsx";
import {PriceInput} from "../ui/PriceInput.jsx";
import {StockStepper} from "../ui/StockStepper.jsx";
import {UploadTile} from "../ui/UploadTile.jsx";

/* Строка таблицы вариантов: размер, остаток, своя цена, фото, удаление.
   Компонент «глупый» — все действия уходят наверх через колбэки. */
export function VariantRow({
                               variant,
                               onUpdate,
                               onRemove,
                               onRemovePhoto,
                               onMakeVariantCover,
                               onUploadPhotos,
                               onOpenPhoto,
                           }) {
    const {clientId, name, stock, price, images, previewImage} = variant;

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
            <div className="flex flex-1 gap-2 overflow-x-auto">
                {images.map((image, imageIndex) => (
                    <PhotoTile
                        key={`${clientId}-${imageIndex}`}
                        src={image}
                        alt={`Фото ${image}`}
                        size="sm"
                        badge={image === previewImage ? `Обложка ${name}` : null}
                        onOpen={() => onOpenPhoto(imageIndex)}
                        onRemove={() => onRemovePhoto(imageIndex)}
                        onMakeCover={() => onMakeVariantCover(image)}
                        makeCoverTitle={`Сделать обложкой варианта ${name}`}
                    />
                ))}

                <UploadTile onFiles={onUploadPhotos}/>
            </div>

            {/* Удалить вариант */}
            <button
                type="button"
                onClick={onRemove}
                aria-label="Удалить вариант"
                className="ml-auto flex h-8 w-8 items-center rounded-lg text-zinc-400
                           hover:bg-zinc-100 hover:text-zinc-900">
                <Trash2 className="h-5 w-5" aria-hidden="true"/>
            </button>
        </div>
    );
}
