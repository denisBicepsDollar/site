/* ============================================================================
   useProductForm — вся «умная» часть страницы товара в одном хуке.
   ============================================================================ */

import {useEffect, useMemo, useRef, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useLocation} from "react-router-dom";
import {CATEGORIES, getSizePresets} from '../constants.ts';
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

const SUPPORTED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/pjpeg",
    "image/png",
    "image/webp",
    "image/avif",
]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function useProductForm(id?: string) {
    const location = useLocation().pathname;
    const isCreateMode = location.includes('create');
    const queryClient = useQueryClient();

    const createItem = useMemo(() => ({
        isCreate: true,
        sku: "Автоматически",
        updated: new Date().toISOString(),
    }), []);

    const productQuery = useQuery({
        queryKey: ["admin-product", id],
        queryFn: () => productsApi.getById(id as string),
        enabled: !isCreateMode && Boolean(id),
        retry: false,
    });

    const labelsQuery = useQuery({
        queryKey: ["admin-catalog-labels"],
        queryFn: productsApi.getCatalogLabels,
        staleTime: 60_000,
    });

    const item = isCreateMode ? createItem : (productQuery.data ?? null);

    const [form, setForm] = useState(() => createFormState(isCreateMode ? createItem : null));
    const [savedSnapshot, setSavedSnapshot] = useState(() =>
        buildSnapshot(createFormState(isCreateMode ? createItem : null)),
    );
    const [uploadError, setUploadError] = useState<string | null>(null);
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
    const inFlightUploadsRef = useRef<Map<string, Promise<string>>>(new Map());

    /* Чистим blob-ссылки, когда уходим со страницы */
    useEffect(() => {
        const objectUrls = objectUrlsRef.current;
        const filesMap = filesByObjectUrlRef.current;
        const persistedMap = persistedImageUrlsRef.current;
        const inFlightMap = inFlightUploadsRef.current;
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
            objectUrls.clear();
            filesMap.clear();
            persistedMap.clear();
            inFlightMap.clear();
        };
    }, []);

    const toObjectUrls = (files: File[]): string[] => {
        const errors: string[] = [];
        const urls: string[] = [];

        for (const file of files) {
            if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
                errors.push(`Формат файла «${file.name}» не поддерживается (нужны JPG, PNG, WEBP или AVIF)`);
                continue;
            }
            if (file.size > MAX_IMAGE_BYTES) {
                errors.push(`Файл «${file.name}» слишком большой (максимум 8 МБ)`);
                continue;
            }
            const url = URL.createObjectURL(file);
            objectUrlsRef.current.add(url);
            filesByObjectUrlRef.current.set(url, file);
            urls.push(url);
        }

        setUploadError(errors.length ? errors[0] ?? null : null);
        return urls;
    };

    const persistImage = async (src: string | null | undefined): Promise<string | null> => {
        if (!src) return null;
        if (!src.startsWith('blob:')) return src || null;
        if (persistedImageUrlsRef.current.has(src)) {
            return persistedImageUrlsRef.current.get(src) ?? null;
        }
        const inFlight = inFlightUploadsRef.current.get(src);
        if (inFlight) {
            return inFlight;
        }

        const file = filesByObjectUrlRef.current.get(src);
        if (!file) throw new Error('Не удалось прочитать выбранное изображение');

        const uploadPromise = productsApi.uploadImage(file)
            .then((url) => {
                persistedImageUrlsRef.current.set(src, url);
                filesByObjectUrlRef.current.delete(src);
                inFlightUploadsRef.current.delete(src);
                return url;
            })
            .catch((err) => {
                inFlightUploadsRef.current.delete(src);
                throw err;
            });

        inFlightUploadsRef.current.set(src, uploadPromise);
        return uploadPromise;
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!form.name.trim()) throw new Error('Введите название товара');
            if (!form.category.trim()) throw new Error('Выберите категорию товара');

            if (form.basePrice !== "") {
                const parsedBase = Number(form.basePrice);
                if (!Number.isFinite(parsedBase) || parsedBase < 0) {
                    throw new Error('Цена должна быть неотрицательным числом');
                }
            }

            for (const variant of form.variants) {
                if (variant.price !== "") {
                    const parsedVariantPrice = Number(variant.price);
                    if (!Number.isFinite(parsedVariantPrice) || parsedVariantPrice < 0) {
                        throw new Error('Некорректная цена варианта');
                    }
                }
                const parsedStock = Number(variant.stock === "" ? 0 : variant.stock);
                if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                    throw new Error('Остаток варианта должен быть целым неотрицательным числом');
                }
            }

            const firstExplicitVariantPrice = form.variants.find(
                (v) => v.price !== "" && v.price !== null && v.price !== undefined,
            )?.price;
            if (form.basePrice === "" && firstExplicitVariantPrice === undefined) {
                throw new Error('Укажите базовую цену товара или цену хотя бы для одного варианта');
            }
            const resolvedBasePrice = form.basePrice === ""
                ? Number(firstExplicitVariantPrice)
                : Number(form.basePrice);

            const variants = await Promise.all(form.variants.map(async (variant) => {
                const images = await Promise.all(variant.images.map(persistImage));
                const previewImage = await persistImage(variant.previewImage);
                return {
                    ...(variant.id ? {id: variant.id} : {}),
                    name: variant.name,
                    price: Number(variant.price === "" ? resolvedBasePrice : variant.price) || 0,
                    stock: Math.max(0, Math.trunc(Number(variant.stock || 0))),
                    previewImage,
                    images: images.filter((url): url is string => Boolean(url)),
                };
            }));

            const cover = await persistImage(form.cover);
            const subcategory = form.subcategory.trim() || form.category.trim();
            const payload: Record<string, unknown> = {
                name: form.name.trim(),
                description: form.description,
                category: form.category.trim(),
                subcategory,
                ...(form.type.trim() ? {type: form.type.trim()} : {}),
                status: form.status,
                price: resolvedBasePrice,
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
            setUploadError(null);
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

    const categoryOptions = useMemo(() => {
        const dbCategories = Object.keys(labelsQuery.data?.categories ?? {});
        return Array.from(
            new Set([
                ...CATEGORIES,
                ...dbCategories,
                ...(form.category ? [form.category] : []),
            ].filter(Boolean)),
        );
    }, [labelsQuery.data?.categories, form.category]);

    const subcategoryOptions = useMemo(() => {
        const dbSubcategories = Object.keys(labelsQuery.data?.subcategories ?? {});
        return Array.from(
            new Set([
                ...dbSubcategories,
                ...(form.subcategory ? [form.subcategory] : []),
            ].filter(Boolean)),
        );
    }, [labelsQuery.data?.subcategories, form.subcategory]);

    const setProductCover = (src: string) => setForm(prev => ({...prev, cover: src}));

    return {
        item,
        isLoading: !isCreateMode && productQuery.isLoading,
        isError: !isCreateMode && productQuery.isError,
        error: productQuery.error,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
        uploadError,
        clearUploadError: () => setUploadError(null),

        /* Поля формы */
        name: form.name,
        description: form.description,
        status: form.status,
        category: form.category,
        subcategory: form.subcategory,
        categoryOptions,
        subcategoryOptions,
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
        setCategory: (value: string) => setForm(prev => ({
            ...prev,
            category: value,
            subcategory: !prev.subcategory || prev.subcategory === prev.category ? "" : prev.subcategory,
        })),
        setSubcategory: (value: string) => setForm(prev => ({...prev, subcategory: value})),
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
        uploadVariantPhotos: (variantIndex: number, files: File[]) => {
            const urls = toObjectUrls(files);
            if (urls.length) {
                setForm(prev => addVariantPhotosToState(prev, variantIndex, urls));
            }
        },

        /* Обложка товара */
        setProductCover,
    };
}
