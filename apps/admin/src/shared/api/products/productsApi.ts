import {productsClient} from "@/shared/api/products/productsClient.ts";

interface ProductVariantResponse {
    id: string;
    name: string | null;
    price: number | string;
    stock: number;
    previewImage?: string | null;
    productVariantsImagesInProducts?: Array<{imgUrl?: string | null}>;
}

interface ProductsPageResponse {
    data: Array<{
        id: string;
        name: string;
        sku?: string | null;
        category?: string | null;
        description?: string | null;
        status?: string | null;
        updated?: string | null;
        createdAt?: string | null;
        previewImage?: string | null;
        price?: number | string | null;
        productVariantsInProducts?: ProductVariantResponse[];
    }>;
    meta: {page: number; pageSize: number; total: number; pageCount: number; statusCounts: Record<string, number>};
}

export interface AdminProduct {
    id: string; name: string; sku: string; category: string; description: string;
    status: string; updated: string; previewImage: string; price: number; stock: number;
    variants: Array<{id: string; name: string; price: number; stock: number; previewImage: string; images: string[]}>;
}

export interface ProductsQuery {
    page: number; pageSize: number; q: string; status: string; lowStock?: boolean;
    sortBy: string; sortDirection: "asc" | "desc";
}

export interface ProductsPage {
    data: AdminProduct[];
    meta: ProductsPageResponse["meta"];
}

function mapProduct(product: ProductsPageResponse["data"][number]): AdminProduct {
    const variants = product.productVariantsInProducts ?? [];
    const variantRows = variants.map((variant) => {
        const images = (variant.productVariantsImagesInProducts ?? []).map((image) => image.imgUrl).filter((image): image is string => Boolean(image));
        const previewImage = variant.previewImage || images[0] || product.previewImage || "/default-image.png";
        return {id: variant.id, name: variant.name ?? "", price: Number(variant.price) || 0, stock: Number(variant.stock) || 0, previewImage, images: images.length ? images : [previewImage]};
    });
    return {
        id: product.id, name: product.name, sku: product.sku ?? "", category: product.category ?? "Без категории",
        description: product.description ?? "", status: product.status ?? "draft", updated: product.updated ?? product.createdAt ?? "—",
        previewImage: product.previewImage || variantRows[0]?.previewImage || "/default-image.png",
        price: Number(product.price) || variantRows[0]?.price || 0,
        stock: variantRows.reduce((sum, variant) => sum + variant.stock, 0), variants: variantRows,
    };
}

async function list(query: ProductsQuery): Promise<ProductsPage> {
    const response = await productsClient.get<ProductsPageResponse>("/", {
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

async function create(payload: Record<string, unknown>) {
    const response = await productsClient.post("/", payload);
    return response.data.data;
}

async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("image", file);
    const response = await productsClient.post("/images", form, {headers: {"Content-Type": "multipart/form-data"}});
    return response.data.url;
}

export const productsApi = {list, create, uploadImage};
