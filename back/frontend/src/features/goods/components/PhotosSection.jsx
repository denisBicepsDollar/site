import {CoverPanel} from "./CoverPanel.jsx";
import {PhotoTile} from "../ui/PhotoTile.jsx";

/* Секция 3. Фотографии: слева — фото по вариантам, справа — текущая обложка товара.
   Индексы вариантов берём ДО фильтрации, чтобы колбэки работали с реальным
   вариантом в массиве, а не с позицией внутри отфильтрованного списка. */
export function PhotosSection({
                                  variants,
                                  cover,
                                  onOpenPhoto,
                                  onRemovePhoto,
                                  onMakeProductCover,
                                  onCoverUpload,
                                  onOpenCover,
                              }) {
    const variantsWithPhotos = variants
        .map((variant, index) => ({variant, index}))
        .filter(({variant}) => variant.images?.length > 0);

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <span className="flex text-xs font-semibold uppercase text-zinc-500">
                Фотографии
            </span>

            <div
                className="grid grid-cols-1  gap-6 sm:grid-cols-[minmax(0,1fr)_1px_280px] lg:grid-cols-[minmax(0,1fr)_1px_320px]">
                <div className="flex min-w-0 flex-col justify-between gap-6">
                    {variantsWithPhotos.map(({variant, index}) => (
                        <div key={variant.clientId} className="flex flex-col gap-3">
                            <span className="text-sm font-semibold tracking-tight text-zinc-00">
                                Фотографии {variant.name} :
                            </span>

                            <div className="flex flex-wrap gap-3">
                                {variant.images.map((image, imageIndex) => (
                                    <PhotoTile
                                        key={`${variant.clientId}-${imageIndex}`}
                                        src={image}
                                        alt={`Фото ${variant.name}`}
                                        size="md"
                                        badge={cover === image ? "Обложка товара" : null}
                                        onOpen={() => onOpenPhoto(index, imageIndex)}
                                        onRemove={() => onRemovePhoto(index, imageIndex)}
                                        onMakeCover={() => onMakeProductCover(image)}
                                        makeCoverTitle="Сделать обложкой всего товара"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* разделитель */}
                <div className="hidden bg-zinc-200 sm:block"/>

                <CoverPanel
                    cover={cover}
                    onOpen={onOpenCover}
                    onUpload={onCoverUpload}
                />
            </div>
        </div>
    );
}