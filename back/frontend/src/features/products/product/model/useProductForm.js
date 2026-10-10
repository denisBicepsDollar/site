/* ============================================================================
   useProductForm — вся «умная» часть страницы товара в одном хуке.

   Хук ничего не рисует: он хранит состояние формы, умеет его менять
   и сообщает, есть ли несохранённые изменения. Компоненты-секции получают
   отсюда готовые значения и колбэки.
   ============================================================================ */

import {useEffect, useMemo, useRef, useState} from 'react';
import {getSizePresets} from '../constants.js';
import {findGoodById} from '../constants.js';
import {
    addVariant as addVariantToState,
    addVariantPhotos as addVariantPhotosToState,
    createFormState,
    removeVariant as removeVariantFromState,
    removeVariantPhoto as removeVariantPhotoFromState,
    updateVariantAt,
    updateVariantCover,
} from './formState.js';
import {buildSnapshot} from './snapshot.js';
import {useLocation} from "react-router-dom";

export function useProductForm(id) {
    const location = useLocation().pathname;
    const isCreateMode = location.includes('create');

    // 1. Избавляемся от let. Если это создание, создаем базовый каркас с sku
    const item = useMemo(() => {
        if (isCreateMode) {
            return {
                sku: "Автоматически",
                updated: new Date().toISOString(),
                // Другие поля можно не писать, так как в createFormState стоит защита с ??
            };
        }
        return findGoodById(id);
    }, [id, isCreateMode]);


    const [form, setForm] = useState(() => createFormState(item));
    const [savedSnapshot, setSavedSnapshot] = useState(() => buildSnapshot(createFormState(item)));

    /* blob-ссылки на загруженные файлы, чтобы не течь при размонтировании */
    const objectUrlsRef = useRef(new Set());

    /* Чистим blob-ссылки, когда уходим со страницы */
    useEffect(() => () => {
        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current.clear();
    }, []);

    const toObjectUrls = files => files
        .filter(file => file.type.startsWith('image/'))
        .map(file => {
            const url = URL.createObjectURL(file);
            objectUrlsRef.current.add(url);
            return url;
        });

    /* ── Готовые действия для секций ─────────────────────────────────────── */
    const setProductCover = src => setForm(prev => ({...prev, cover: src}));

    return {
        item,

        /* Поля формы */
        name: form.name,
        description: form.description,
        status: form.status,
        category: form.category,
        basePrice: form.basePrice,
        note: form.note,
        cover: form.cover,
        variants: form.variants,

        /* Размеры для кнопок «быстро добавить» под текущую категорию */
        sizePresets: getSizePresets(form.category),

        /* Изменения */
        hasChanges: buildSnapshot(form) !== savedSnapshot,
        save: () => setSavedSnapshot(buildSnapshot(form)),

        /* Простые поля */
        setName: value => setForm(prev => ({...prev, name: value})),
        setDescription: value => setForm(prev => ({...prev, description: value})),
        setStatus: value => setForm(prev => ({...prev, status: value})),
        setCategory: value => setForm(prev => ({...prev, category: value})),
        setBasePrice: value => setForm(prev => ({...prev, basePrice: value})),
        setNote: value => setForm(prev => ({...prev, note: value})),

        /* Варианты */
        addVariant: name => setForm(prev => addVariantToState(prev, name)),
        updateVariant: (index, patch) => setForm(prev => updateVariantAt(prev, index, patch)),
        removeVariant: index => setForm(prev => removeVariantFromState(prev, index)),
        setVariantCover: (index, src) => setForm(prev => updateVariantCover(prev, index, {previewImage: src})),

        /* Фотографии */
        removeVariantPhoto: (variantIndex, imageIndex) =>
            setForm(prev => removeVariantPhotoFromState(prev, variantIndex, imageIndex)),
        uploadCover: file => {
            const [url] = toObjectUrls([file]);
            if (url) setProductCover(url);
        },
        uploadVariantPhotos: (variantIndex, files) =>
            setForm(prev => addVariantPhotosToState(prev, variantIndex, toObjectUrls(files))),

        /* Обложка товара */
        setProductCover,
    };
}