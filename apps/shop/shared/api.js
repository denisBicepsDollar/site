export async function getProducts(params = {}) {
    const products = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const query = new URLSearchParams({...params, page: String(page)});
        const response = await fetch(`/api/v1/products?${query}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки товаров: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const pageItems = Array.isArray(result) ? result : result.data;
        if (!Array.isArray(pageItems)) {
            throw new Error("API вернул некорректный список товаров");
        }

        products.push(...pageItems);
        hasMore = !Array.isArray(result) && result.meta?.hasMore === true;
        page += 1;
    }

    return products;
}
