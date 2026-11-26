/* ============================================================================
   PHOTOS — плоский список всех фото товара для просмотрщика (лайтбокса).
   ============================================================================ */

/* Превращает {cover + варианты} в один массив для листания стрелками.
   Если обложка — это фото одного из вариантов, отдельной карточки для неё не будет. */
export function collectPhotos(cover, variants) {
    const variantPhotos = variants.flatMap((variant, variantIndex) =>
        variant.images.map((src, imageIndex) => ({
            src,
            variantIndex,
            imageIndex,
            variantName: variant.name,
        })),
    );

    const coverIsVariantPhoto = variantPhotos.some(photo => photo.src === cover);

    if (!cover || coverIsVariantPhoto) return variantPhotos;

    return [{
        src: cover,
        variantIndex: null,
        imageIndex: null,
        variantName: null,
    }, ...variantPhotos];
}

/* Индекс фото варианта в общем списке */
export const findVariantPhotoIndex = (photos, variantIndex, imageIndex) =>
    photos.findIndex(photo => photo.variantIndex === variantIndex && photo.imageIndex === imageIndex);

/* Индекс текущей обложки в общем списке */
export const findCoverIndex = (photos, cover) => photos.findIndex(photo => photo.src === cover);

/* Следующее/предыдущее фото по кругу */
export const stepIndex = (index, direction, total) => (index + direction + total) % total;