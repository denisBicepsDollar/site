/* ============================================================================
   FORM STATE — состояние формы товара и чистые операции над ним.

   Здесь нет React: обычные функции «было состояние → стало состояние».
   Благодаря этому логику легко читать и покрывать тестами, а useGoodForm
   просто вызывает их и складывает результат в useState.
   ============================================================================ */

import {DEFAULT_CATEGORY, DEFAULT_STATUS} from '../constants.js';

/* crypto.randomUUID есть не во всех браузерах/контекстах — на всякий случай фолбэк */
export const createClientId = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/* Начальное состояние формы: берём товар и раскладываем его по полям */
export function createFormState(item) {
    return {
        name: item?.name ?? "",
        description: item?.description ?? "",
        status: item?.status ?? DEFAULT_STATUS,
        category: item?.category ?? DEFAULT_CATEGORY,
        basePrice: item?.price ?? "",
        note: item?.note ?? "",
        cover: item?.previewImage ?? "",
        variants: (item?.variants ?? []).map((variant, index) => ({
            ...variant,
            images: [variant.previewImage, ...variant.images.filter(img => img !== variant.previewImage)],

            /* clientId нужен как стабильный key в списках, пока вариант не сохранён на сервере */
            clientId: `existing-${index}`,
        })),
    };
}

/* Новый пустой вариант с ценой по умолчанию от базовой цены товара */
export function createVariant(name, basePrice) {
    return {
        clientId: createClientId(),
        name,
        stock: 0,
        price: Number(basePrice),
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
                    previewImage, // записываем строку-ссылку
                    // Переносим обложку на первое место в массиве, убирая дубликаты
                    images: [previewImage, ...variant.images.filter(img => img !== previewImage)],
                }
                : variant // остальные варианты возвращаем без изменений
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

    /* Если удалённое фото было обложкой товара и больше нигде не используется —
       переносим обложку на первое оставшееся фото */
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