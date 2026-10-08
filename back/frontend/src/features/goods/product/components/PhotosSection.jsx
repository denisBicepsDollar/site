import {CoverPanel} from "./CoverPanel.jsx"
import {PhotoTile} from "../ui/PhotoTile.jsx"
import {CardContent} from "@/components/ui/card.jsx"
import {Separator} from "@/components/ui/separator.jsx"
import {SectionCard} from "@/components/ui/section-card.jsx"
import {SectionTitle} from "@/components/ui/section-title.jsx"

/* Секция 3. Фото вариантов слева, обложка товара справа. */
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
        .filter(({variant}) => variant.images?.length > 0)

    return (
        <SectionCard className="min-w-0">
            <CardContent className="flex min-w-0 flex-col gap-4 p-4">
                <SectionTitle as="h2">Фотографии</SectionTitle>


                <div
                    className="grid min-w-0 grid-cols-1 items-stretch gap-6 sm:grid-cols-[minmax(0,1fr)_1px_280px] lg:grid-cols-[minmax(0,1fr)_1px_320px]">
                    {/* Фото вариантов */}
                    <div className="flex min-w-0 flex-col justify-center gap-6">
                        {variantsWithPhotos.length > 0 ? (
                            variantsWithPhotos.map(({variant, index}) => {
                                const sortedImages = variant.images
                                    .map((src, imageIndex) => ({
                                        src,
                                        imageIndex,
                                    }))
                                    .sort((a, b) => {
                                        const priority = (src) => {
                                            if (src === cover) return 0
                                            if (src === variant.previewImage) return 1
                                            return 2
                                        }

                                        return (
                                            priority(a.src) - priority(b.src)
                                        )
                                    })

                                return (
                                    <div
                                        key={variant.clientId}
                                        className="flex min-w-0 flex-col gap-3"
                                    >
                                        <h3 className="text-center text-sm font-semibold tracking-tight text-[#1C1C1E] dark:text-white lg:text-left">
                                            Фотографии {variant.name}
                                        </h3>

                                        <div className="flex min-w-0 flex-wrap justify-center gap-3 lg:justify-start">
                                            {sortedImages.map(
                                                ({src, imageIndex}) => {
                                                    const isProductCover =
                                                        cover === src
                                                    const isVariantCover =
                                                        variant.previewImage ===
                                                        src

                                                    let badgeText = null

                                                    if (
                                                        isProductCover &&
                                                        isVariantCover
                                                    ) {
                                                        badgeText = `Обложка товара и ${variant.name}`
                                                    } else if (isProductCover) {
                                                        badgeText =
                                                            "Обложка товара"
                                                    } else if (isVariantCover) {
                                                        badgeText = `Обложка ${variant.name}`
                                                    }

                                                    return (
                                                        <PhotoTile
                                                            key={`${variant.clientId}-${imageIndex}`}
                                                            src={src}
                                                            alt={`Фото ${variant.name}`}
                                                            size="md"
                                                            badge={badgeText}
                                                            onOpen={() =>
                                                                onOpenPhoto(
                                                                    index,
                                                                    imageIndex,
                                                                )
                                                            }
                                                            onRemove={() =>
                                                                onRemovePhoto(
                                                                    index,
                                                                    imageIndex,
                                                                )
                                                            }
                                                            onMakeCover={() =>
                                                                onMakeProductCover(
                                                                    src,
                                                                )
                                                            }
                                                            makeCoverTitle="Сделать обложкой всего товара"
                                                        />
                                                    )
                                                },
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div
                                className="rounded-[14px] border border-dashed border-[#D1D1D6] bg-[#F8F8FA] px-4 py-8 text-center text-[13px] text-[#8E8E93] dark:border-[#48484A] dark:bg-[#2C2C2E] dark:text-[#98989D]">
                                У вариантов пока нет фотографий
                            </div>
                        )}
                    </div>

                    {/* Разделитель появляется только при боковой раскладке */}
                    <Separator
                        orientation="vertical"
                        className="hidden h-full self-stretch bg-[#E5E5EA] dark:bg-[#38383A] sm:block"
                    />

                    {/* Обложка товара */}
                    <CoverPanel
                        cover={cover}
                        onOpen={onOpenCover}
                        onUpload={onCoverUpload}
                    />
                </div>
            </CardContent>
        </SectionCard>
    )
}