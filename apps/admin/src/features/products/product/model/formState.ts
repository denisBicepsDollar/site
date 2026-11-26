/* ============================================================================
   FORM STATE — состояние формы товара и чистые операции над ним.
   ============================================================================ */

import {DEFAULT_CATEGORY, DEFAULT_STATUS} from '../constants.ts';

/* crypto.randomUUID есть не во всех браузерах/контекстах — на всякий случай фолбэк */
export const createClientId = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const cleanImage = (url) => {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed || trimmed === '/default-image.png') return '';
    return trimmed;
};

/* Начальное состояние формы: берём товар и раскладываем его по полям */
export function createFormState(item) {
    const rawCover = item?.rawPreviewImage !== undefined
        ? cleanImage(item.rawPreviewImage)
        : cleanImage(item?.previewImage);

    return {
        name: item?.name ?? "",
        description: item?.description ?? "",
        status: item?.status ?? DEFAULT_STATUS,
        category: item?.category ?? DEFAULT_CATEGORY,
        basePrice: item?.price ?? "",
        note: item?.note ?? item?.careInstructions ?? "",
        cover: rawCover,
        variants: (item?.variants ?? []).map((variant, index) => {
            const previewImage = cleanImage(variant.previewImage);
            const rawImages = (variant.images ?? []).map(cleanImage).filter(Boolean);
            const images = previewImage
                ? [previewImage, ...rawImages.filter(img => img !== previewImage)]
                : Array.from(new Set(rawImages));

            return {
                ...(variant.id ? {id: variant.id} : {}),
                name: variant.name ?? "",
                stock: Number(variant.stock) || 0,
                price: variant.price ?? "",
                previewImage,
                images,
                clientId: variant.id || `existing-${index}`,
            };
        }),
    };
}

/* Новый пустой вариант с ценой по умолчанию от базовой цены товара */
export function createVariant(name, basePrice) {
    return {
        clientId: createClientId(),
        name,
        stock: 0,
        price: basePrice === "" || basePrice === null || basePrice === undefined ? 0 : Number(basePrice),
        images: [],
        previewImage: "",
    };
}

/* Точечное изменение варианта по индексу */
export function updateVariantAt(state, index, patch) {
    return {
        ...state,
        variants: state.variants.map((variant, i) => (i === index ? {...variant, ...patch} : variant)),
    };
}

export function updateVariantCover(state, index, {previewImage}) {
    return {
        ...state,
        variants: state.variants.map((variant, i) =>
            i === index
                ? {
                    ...variant,
                    previewImage,
                    images: previewImage
                        ? [previewImage, ...variant.images.filter(img => img !== previewImage)]
                        : variant.images,
                }
                : variant
        )
    };
}

/* Добавление варианта: пустое имя разрешено ("Свой вариант"),
   но дубликат уже существующего размера не добавляем */
export function addVariant(state, name) {
    const normalizedName = name.trim();

    if (normalizedName && state.variants.some(variant => variant.name === normalizedName)) {
        return state;
    }

    return {...state, variants: [...state.variants, createVariant(normalizedName, state.basePrice)]};
}

export function removeVariant(state, index) {
    return {...state, variants: state.variants.filter((_, i) => i !== index)};
}

export function removeVariantPhoto(state, variantIndex, imageIndex) {
    const target = state.variants[variantIndex];
    if (!target) return state;

    const removedSrc = target.images[imageIndex];

    const variants = state.variants.map((variant, index) => {
        if (index !== variantIndex) return variant;

        const images = variant.images.filter((_, i) => i !== imageIndex);
        const previewStillExists = images.includes(variant.previewImage);

        return {
            ...variant,
            images,
            previewImage: previewStillExists ? variant.previewImage : images[0] ?? "",
        };
    });

    const stillUsed = variants.some(variant => variant.images.includes(removedSrc));

    return {
        ...state,
        variants,
        cover: state.cover === removedSrc && !stillUsed
            ? variants.flatMap(variant => variant.images)[0] ?? ""
            : state.cover,
    };
}

export function addVariantPhotos(state, variantIndex, urls) {
    const target = state.variants[variantIndex];
    if (!target || !urls.length) return state;

    return updateVariantAt(state, variantIndex, {
        images: [...target.images, ...urls],
    });
}
