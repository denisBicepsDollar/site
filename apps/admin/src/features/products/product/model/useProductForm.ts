/* ============================================================================
   useProductForm — вся «умная» часть страницы товара в одном хуке.
   ============================================================================ */

import {useEffect, useMemo, useRef, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useLocation} from "react-router-dom";
import {getSizePresets} from '../constants.ts';
import {
    addVariant as addVariantToState,
    addVariantPhotos as addVariantPhotosToState,
    createFormState,
    removeVariant as removeVariantFromState,
    removeVariantPhoto as removeVariantPhotoFromState,
    updateVariantAt,
    updateVariantCover,
} from './formState.ts';
import {buildSnapshot} from './snapshot.ts';
import {productsApi} from "@/shared/api/products/productsApi.ts";

export function useProductForm(id?: string) {
    const location = useLocation().pathname;
    const isCreateMode = location.includes('create');
    const queryClient = useQueryClient();

    const createItem = useMemo(() => ({
        sku: "Автоматически",
        updated: new Date().toISOString(),
    }), []);

    const productQuery = useQuery({
        queryKey: ["admin-product", id],
        queryFn: () => productsApi.getById(id as string),
        enabled: !isCreateMode && Boolean(id),
        retry: false,
    });

    const item = isCreateMode ? createItem : (productQuery.data ?? null);

    const [form, setForm] = useState(() => createFormState(isCreateMode ? createItem : null));
    const [savedSnapshot, setSavedSnapshot] = useState(() =>
        buildSnapshot(createFormState(isCreateMode ? createItem : null)),
    );
    const syncedSignatureRef = useRef<string | null>(isCreateMode ? "create" : null);

    useEffect(() => {
        if (isCreateMode || !productQuery.data) return;
        const signature = `${productQuery.data.id}:${productQuery.data.updated}`;
        if (syncedSignatureRef.current === signature) return;
        syncedSignatureRef.current = signature;
        const nextState = createFormState(productQuery.data);
        setForm(nextState);
        setSavedSnapshot(buildSnapshot(nextState));
    }, [isCreateMode, productQuery.data]);

    /* blob-ссылки на загруженные файлы, чтобы не течь при размонтировании */
    const objectUrlsRef = useRef<Set<string>>(new Set());
    const filesByObjectUrlRef = useRef<Map<string, File>>(new Map());
    const persistedImageUrlsRef = useRef<Map<string, string>>(new Map());

    /* Чистим blob-ссылки, когда уходим со страницы */
    useEffect(() => () => {
        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current.clear();
        filesByObjectUrlRef.current.clear();
        persistedImageUrlsRef.current.clear();
    }, []);

    const toObjectUrls = (files: File[]) => files
        .filter(file => file.type.startsWith('image/'))
        .map(file => {
            const url = URL.createObjectURL(file);
            objectUrlsRef.current.add(url);
            filesByObjectUrlRef.current.set(url, file);
            return url;
        });

    const persistImage = async (src: string | null | undefined): Promise<string | null> => {
        if (!src) return null;
        if (!src.startsWith('blob:')) return src || null;
        if (persistedImageUrlsRef.current.has(src)) {
            return persistedImageUrlsRef.current.get(src) ?? null;
        }
        const file = filesByObjectUrlRef.current.get(src);
        if (!file) throw new Error('Не удалось прочитать выбранное изображение');
        const url = await productsApi.uploadImage(file);
        persistedImageUrlsRef.current.set(src, url);
        filesByObjectUrlRef.current.delete(src);
        return url;
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!form.name.trim()) throw new Error('Введите название товара');
            if (!form.category.trim()) throw new Error('Выберите категорию товара');

            const variants = await Promise.all(form.variants.map(async (variant) => {
                const images = await Promise.all(variant.images.map(persistImage));
                const previewImage = await persistImage(variant.previewImage);
                return {
                    ...(variant.id ? {id: variant.id} : {}),
                    name: variant.name,
                    price: Number(variant.price === "" ? form.basePrice : variant.price) || 0,
                    stock: Number(variant.stock || 0),
                    previewImage,
                    images: images.filter(Boolean),
                };
            }));

            const cover = await persistImage(form.cover);
            const payload = {
                name: form.name.trim(),
                description: form.description,
                category: form.category,
                subcategory: form.category,
                status: form.status,
                price: Number(form.basePrice === "" ? variants[0]?.price : form.basePrice) || 0,
                previewImage: cover,
                careInstructions: form.note,
                variants,
            };

            const savedProduct = isCreateMode
                ? await productsApi.create(payload)
                : await productsApi.update(id as string, payload);

            return savedProduct;
        },
        onSuccess: async (savedProduct) => {
            const nextState = createFormState(savedProduct);
            syncedSignatureRef.current = `${savedProduct.id}:${savedProduct.updated}`;
            setForm(nextState);
            setSavedSnapshot(buildSnapshot(nextState));
            queryClient.setQueryData(["admin-product", savedProduct.id], savedProduct);
            await queryClient.invalidateQueries({queryKey: ["admin-products"]});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!id) throw new Error('Некорректный идентификатор товара');
            await productsApi.remove(id);
        },
        onSuccess: async () => {
            queryClient.removeQueries({queryKey: ["admin-product", id]});
            await queryClient.invalidateQueries({queryKey: ["admin-products"]});
        },
    });

    const setProductCover = (src: string) => setForm(prev => ({...prev, cover: src}));

    return {
        item,
        isLoading: !isCreateMode && productQuery.isLoading,
        isError: !isCreateMode && productQuery.isError,
        error: productQuery.error,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,

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
        isCreateMode,
        save: () => saveMutation.mutateAsync(),
        remove: () => deleteMutation.mutateAsync(),

        /* Простые поля */
        setName: (value: string) => setForm(prev => ({...prev, name: value})),
        setDescription: (value: string) => setForm(prev => ({...prev, description: value})),
        setStatus: (value: string) => setForm(prev => ({...prev, status: value})),
        setCategory: (value: string) => setForm(prev => ({...prev, category: value})),
        setBasePrice: (value: string) => setForm(prev => ({...prev, basePrice: value})),
        setNote: (value: string) => setForm(prev => ({...prev, note: value})),

        /* Варианты */
        addVariant: (name: string) => setForm(prev => addVariantToState(prev, name)),
        updateVariant: (index: number, patch: Record<string, unknown>) =>
            setForm(prev => updateVariantAt(prev, index, patch)),
        removeVariant: (index: number) => setForm(prev => removeVariantFromState(prev, index)),
        setVariantCover: (index: number, src: string) =>
            setForm(prev => updateVariantCover(prev, index, {previewImage: src})),

        /* Фотографии */
        removeVariantPhoto: (variantIndex: number, imageIndex: number) =>
            setForm(prev => removeVariantPhotoFromState(prev, variantIndex, imageIndex)),
        uploadCover: (file: File) => {
            const [url] = toObjectUrls([file]);
            if (url) setProductCover(url);
        },
        uploadVariantPhotos: (variantIndex: number, files: File[]) =>
            setForm(prev => addVariantPhotosToState(prev, variantIndex, toObjectUrls(files))),

        /* Обложка товара */
        setProductCover,
    };
}
