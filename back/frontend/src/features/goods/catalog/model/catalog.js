export const CATALOG_STATUS_FILTERS = [
    {value: "all", label: "all"},
    {value: "active", label: "active"},
    {value: "warning", label: "warning"},
    {value: "inactive", label: "inactive"},
];

export function getProductCounts(products) {
    return products.reduce((counts, product) => {
        counts.all += 1;
        counts[product.status] = (counts[product.status] ?? 0) + 1;
        return counts;
    }, {all: 0, active: 0, warning: 0, inactive: 0});
}

export function filterProducts(products, status, query) {
    const normalizedQuery = query.toLowerCase().trim();

    return products
        .filter(product => status === "all" || product.status === status)
        .filter(product => {
            const name = product.name.toLowerCase().trim();
            const sku = product.sku.toLowerCase().trim();
            return name.includes(normalizedQuery) || sku.includes(normalizedQuery);
        });
}

export function formatPrice(value) {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}