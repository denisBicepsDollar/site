import {productsClient} from "@/shared/api/products/productsClient.ts";

interface ProductVariantResponse {
    id: string;
    name: string;
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
        stock?: number | null;
        productVariantsInProducts?: ProductVariantResponse[];
    }>;
    meta?: {
        hasMore?: boolean;
    };
}

export interface AdminProduct {
    id: string;
    name: string;
    sku: string;
    category: string;
    description: string;
    status: string;
    updated: string;
    previewImage: string;
    price: number;
    stock: number;
    variants: Array<{
        id: string;
        name: string;
        price: number;
        stock: number;
        previewImage: string;
        images: string[];
    }>;
}

function mapProduct(product: ProductsPageResponse["data"][number]): AdminProduct {
    const variants = product.productVariantsInProducts ?? [];
    const variantRows = variants.map((variant) => {
        const images = (variant.productVariantsImagesInProducts ?? [])
            .map((image) => image.imgUrl)
            .filter((image): image is string => Boolean(image));
        const previewImage = variant.previewImage || images[0] || product.previewImage || "/default-image.png";

        return {
            id: variant.id,
            name: variant.name,
            price: Number(variant.price) || 0,
            stock: Number(variant.stock) || 0,
            previewImage,
            images: images.length > 0 ? images : [previewImage],
        };
    });

    return {
        id: product.id,
        name: product.name,
        sku: product.sku ?? "",
        category: product.category ?? "Без категории",
        description: product.description ?? "",
        status: product.status ?? "active",
        updated: product.updated ?? product.createdAt ?? "—",
        previewImage: product.previewImage || variantRows[0]?.previewImage || "/default-image.png",
        price: Number(product.price) || 0,
        stock: Number(product.stock) || variantRows.reduce((sum, variant) => sum + variant.stock, 0),
        variants: variantRows,
    };
}

async function list(): Promise<AdminProduct[]> {
    const products: AdminProduct[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await productsClient.get<ProductsPageResponse>("/", {
            params: {page},
        });
        const result = response.data;
        products.push(...result.data.map(mapProduct));
        hasMore = result.meta?.hasMore === true;
        page += 1;
    }

    return products;
}

export const productsApi = {list};
