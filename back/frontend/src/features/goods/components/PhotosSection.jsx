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
        .flatMap(
            (variant, index) =>
                [
                    {
                        variant,
                        index,
                    },
                ]
        )
        .filter(({variant: {images}}) => images.length > 0)


    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <span className="flex text-xs font-semibold uppercase text-zinc-500">
                Фотографии
            </span>

            <div
                className="grid grid-cols-1  gap-6 sm:grid-cols-[minmax(0,1fr)_1px_280px] lg:grid-cols-[minmax(0,1fr)_1px_320px]">
                <div className="flex min-w-0 flex-col justify-center gap-6">
                    {variantsWithPhotos.map(({variant, index}) => {
                        const sorted = [...variant.images].sort((a, b) => {
                            // Функция для определения «веса» картинки
                            const getWeight = (img) => {
                                if (img === cover) return 1;               // Самый высокий приоритет (1 место)
                                if (img === variant.previewImage) return 2; // Второй приоритет (2 место)
                                return 3;                                  // Обычная фотка
                            };

                            // Сравниваем веса: у кого вес меньше, тот встает раньше
                            return getWeight(a) - getWeight(b);
                        });
                        return (
                            <div key={variant.clientId} className="flex flex-col gap-3">
                            <span
                                className="text-sm text-center lg:text-start font-semibold tracking-tight text-zinc-00">
                                Фотографии {variant.name} :
                            </span>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                    {
                                        sorted.map((image, imageIndex) => {
                                            const isProductCover = cover === image;
                                            const isVariantCover = variant.previewImage === image;

                                            let badgeText = null;
                                            if (isProductCover && isVariantCover) badgeText = `Обложка товара и ${variant.name}`;
                                            else if (isProductCover) badgeText = "Обложка товара";
                                            else if (isVariantCover) badgeText = `Обложка ${variant.name}`;

                                            return (
                                                <PhotoTile
                                                    key={`${variant.clientId}-${imageIndex}`}
                                                    src={image}
                                                    alt={`Фото ${variant.name}`}
                                                    size="md"
                                                    badge={badgeText}
                                                    onOpen={() => onOpenPhoto(index, variant.images.indexOf(image))}
                                                    onRemove={() => onRemovePhoto(index, variant.images.indexOf(image))}
                                                    onMakeCover={() => onMakeProductCover(image)}
                                                    makeCoverTitle="Сделать обложкой всего товара"
                                                />
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })}
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