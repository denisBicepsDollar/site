import {productsClient} from "@/shared/api/products/productsClient.ts";

interface ProductVariantResponse {
    id: string;
    name: string | null;
    price: number | string;
    stock: number;
    previewImage?: string | null;
    productVariantsImagesInProducts?: Array<{imgUrl?: string | null; isMain?: boolean | null}>;
}

interface RawAdminProduct {
    id: string;
    name: string;
    sku?: string | null;
    category?: string | null;
    description?: string | null;
    careInstructions?: string | null;
    status?: string | null;
    updated?: string | null;
    createdAt?: string | null;
    previewImage?: string | null;
    price?: number | string | null;
    productVariantsInProducts?: ProductVariantResponse[];
}

interface ProductsPageResponse {
    data: RawAdminProduct[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        pageCount: number;
        statusCounts: Record<string, number>;
        lowStockCount?: number;
    };
}

interface ProductOneResponse {
    data: RawAdminProduct;
}

export interface AdminProductVariant {
    id: string;
    name: string;
    price: number;
    stock: number;
    previewImage: string;
    images: string[];
}

export interface AdminProduct {
    id: string;
    name: string;
    sku: string;
    category: string;
    description: string;
    note: string;
    status: string;
    updated: string;
    previewImage: string;
    rawPreviewImage: string;
    price: number;
    stock: number;
    variants: AdminProductVariant[];
}

export interface ProductsQuery {
    page: number;
    pageSize: number;
    q: string;
    status: string;
    lowStock?: boolean;
    sortBy: string;
    sortDirection: "asc" | "desc";
}

export interface ProductsPage {
    data: AdminProduct[];
    meta: ProductsPageResponse["meta"];
}

function mapProduct(product: RawAdminProduct): AdminProduct {
    const variants = product.productVariantsInProducts ?? [];
    const variantRows: AdminProductVariant[] = variants.map((variant) => {
        const images = Array.from(
            new Set(
                (variant.productVariantsImagesInProducts ?? [])
                    .map((image) => image.imgUrl?.trim())
                    .filter((image): image is string => Boolean(image)),
            ),
        );
        const variantPreview = variant.previewImage?.trim() || images[0] || "";
        return {
            id: variant.id,
            name: variant.name ?? "",
            price: Number(variant.price) || 0,
            stock: Number(variant.stock) || 0,
            previewImage: variantPreview,
            images: variantPreview && !images.includes(variantPreview) ? [variantPreview, ...images] : images,
        };
    });

    const rawPreviewImage = product.previewImage?.trim() || "";
    const listPreviewImage = rawPreviewImage || variantRows[0]?.previewImage || "/default-image.png";

    return {
        id: product.id,
        name: product.name,
        sku: product.sku ?? "",
        category: product.category ?? "Без категории",
        description: product.description ?? "",
        note: product.careInstructions ?? "",
        status: product.status ?? "draft",
        updated: product.updated ?? product.createdAt ?? "—",
        previewImage: listPreviewImage,
        rawPreviewImage,
        price: Number(product.price) || variantRows[0]?.price || 0,
        stock: variantRows.reduce((sum, variant) => sum + variant.stock, 0),
        variants: variantRows,
    };
}

async function list(query: ProductsQuery): Promise<ProductsPage> {
    const response = await productsClient.get<ProductsPageResponse>("", {
        params: {
            page: query.page + 1,
            pageSize: query.pageSize,
            q: query.q || undefined,
            status: query.status && query.status !== "all" ? query.status : undefined,
            lowStock: query.lowStock ? "true" : undefined,
            sortBy: query.sortBy,
            sortDirection: query.sortDirection,
        },
    });
    return {...response.data, data: response.data.data.map(mapProduct)};
}

async function getById(id: string): Promise<AdminProduct> {
    const response = await productsClient.get<ProductOneResponse>(`/${encodeURIComponent(id)}`);
    return mapProduct(response.data.data);
}

async function create(payload: Record<string, unknown>): Promise<AdminProduct> {
    const response = await productsClient.post<ProductOneResponse>("", payload);
    return mapProduct(response.data.data);
}

async function update(id: string, payload: Record<string, unknown>): Promise<AdminProduct> {
    const response = await productsClient.patch<ProductOneResponse>(`/${encodeURIComponent(id)}`, payload);
    return mapProduct(response.data.data);
}

async function remove(id: string): Promise<void> {
    await productsClient.delete(`/${encodeURIComponent(id)}`);
}

async function bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    await productsClient.patch("/bulk", {ids, status});
}

async function bulkDelete(ids: string[]): Promise<void> {
    await productsClient.post("/bulk-delete", {ids});
}

async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("image", file);
    const response = await productsClient.post<{url: string}>("/images", form, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return response.data.url;
}

export const productsApi = {
    list,
    getById,
    create,
    update,
    remove,
    bulkUpdateStatus,
    bulkDelete,
    uploadImage,
};
