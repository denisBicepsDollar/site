export const CATALOG_STATUS_FILTERS = [
    {value: "all", label: "Все товары"},
    {value: "active", label: "Активные"},
    {value: "draft", label: "Черновики"},
    {value: "archived", label: "Архив"},
];

export const PRODUCT_STATUS_LABELS = {
    active: "Активен",
    draft: "Черновик",
    archived: "Архив",
};

export function getProductCounts(products) {
    return products.reduce((counts, product) => {
        counts.all += 1;
        counts[product.status] = (counts[product.status] ?? 0) + 1;
        return counts;
    }, {all: 0, active: 0, draft: 0, archived: 0});
}

export function getCatalogSummary(products) {
    return {
        total: products.length,
        active: products.filter(product => product.status === "active").length,
        lowStock: products.filter(product => product.stock > 0 && product.stock <= 5).length,
    };
}

export function filterProducts(products, status, query) {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    return products.filter(product => {
        const matchesStatus = status === "all" || product.status === status;
        const searchableText = `${product.name} ${product.sku} ${product.category}`
            .toLocaleLowerCase("ru-RU");

        return matchesStatus && searchableText.includes(normalizedQuery);
    });
}

export function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(value);
}