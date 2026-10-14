import {Commerce} from "commerce-kit";
import {cacheLife} from "next/cache";
import {try_} from "safe-try";
import {products as MY_LOCAL_PRODUCTS} from "@/shared/data/products";

const endpoint = process.env.YNS_API_URL || undefined;

// 1. Мокаем данные магазина (для SEO и поддоменов)
const MOCK_ME_DATA = {
    store: {
        name: "My Mock Store",
        subdomain: "mock-store",
        settings: {
            storeDescription: "This is a local mock development store environment",
            favicon: {imageUrl: null},
            logo: null
        }
    },
    publicUrl: "http://localhost:3000"
};

// 2. Мокаем данные списка товаров (для страницы /products)
const MOCK_PRODUCTS_DATA = {
    data: MY_LOCAL_PRODUCTS, // <-- Подставляем ваш массив
    meta: {
        total: MY_LOCAL_PRODUCTS.length, // Динамически считаем количество
        limit: 20,
        offset: 0
    }
};

// 3. Создаем базовый клиент (чтобы не ломать импорты)
const realCommerce = Commerce({
    token: process.env.YNS_API_KEY || "mock-token",
    endpoint,
});

// 4. Магия Прокси: перехватываем методы SDK "на лету"
export const commerce = new Proxy(realCommerce, {
    get(target, prop) {
        // Если вызывают productBrowse (ваш случай в ошибке)
        if (prop === "productBrowse") {
            return async () => MOCK_PRODUCTS_DATA;
        }
        // Если вызывают meGet
        if (prop === "meGet") {
            return async () => MOCK_ME_DATA;
        }
        // Если вызывают фильтры (помните EMPTY_FACETS?)
        if (prop === "productFilters") {
            return async () => ({
                priceBounds: {min: 0, max: 20000},
                variantTypes: [],
                categories: [{name: "Тестовая категория", slug: "test"}],
                collections: [],
                brands: [],
            });
        }
        // Для всех остальных методов возвращаем пустую функцию-заглушку
        return target[prop] || (async () => ({data: []}));
    }
});

// Оставляем остальные кэш-функции без изменений, они теперь будут использовать наш прокси
export const meGetCached = async (token) => {
    "use cache";
    return commerce.meGet();
};

export async function getStoreSeo() {
    "use cache";
    cacheLife("hours");

    const [error, me] = await try_(meGetCached());
    if (error) {
        return {storeName: "Your Next Store", storeDescription: null};
    }
    return {
        storeName: me.store.name || "Your Next Store",
        storeDescription: me.store.settings?.storeDescription || null,
    };
}

export function getStoreFaviconUrl(settings) {
    const faviconUrl =
        settings?.favicon?.imageUrl ??
        (typeof settings?.logo === "string" ? settings.logo : settings?.logo?.imageUrl) ??
        null;
    return faviconUrl;
}

export function getCanonicalUrl() {
    return "http://localhost:3000";
}

let subdomainPublicUrlPromise;
export const getSubdomainPublicUrl = () => {
    subdomainPublicUrlPromise ??= resolveSubdomainPublicUrl().catch((error) => {
        subdomainPublicUrlPromise = null;
        throw error;
    });
    return subdomainPublicUrlPromise;
};

const resolveSubdomainPublicUrl = async () => {
    return {
        subdomain: MOCK_ME_DATA.store.subdomain,
        publicUrl: MOCK_ME_DATA.publicUrl
    };
};
