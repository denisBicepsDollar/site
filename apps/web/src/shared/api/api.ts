const getBackendUrl = () =>
  process.env.BACKEND_URL || "http://localhost:3000";

export async function getProducts(
  resolvedParams: Record<string, string> = {},
  options?: { noStore?: boolean },
) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(resolvedParams)) {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    }
    const queryString = new URLSearchParams(cleanParams).toString();

    const res = await fetch(
      `${getBackendUrl()}/api/v1/products${queryString ? `?${queryString}` : ""}`,
      options?.noStore
        ? { cache: "no-store" }
        : { next: { revalidate: 60 } },
    );

    if (!res.ok) return { data: [], meta: {}, isError: true };

    const allProducts = await res.json();
    return allProducts;
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error.message);
    return { data: [], meta: {}, isError: true };
  }
}

export async function getCatalogLabels(options?: { noStore?: boolean }) {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/products/labels`, {
      ...(options?.noStore
        ? { cache: "no-store" }
        : { next: { revalidate: 60 } }),
    });

    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function getProductBySlug(slug) {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return { data: null };

    const allProducts = { data: await res.json() };
    return allProducts;
  } catch (error) {
    console.error("Ошибка загрузки товара:", error.message);
    return { data: null };
  }
}

export async function getProductsByVariant(variantIds) {
  try {
    const varIds = variantIds.map((variantId) => "variantId=" + variantId);
    const url =
      `${getBackendUrl()}/api/v1/products/variants/by-ids?` +
      varIds.join("&");
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [] };
    const products = { data: await res.json() };
    return products;
  } catch (err) {
    console.error(err);
    return { data: [] };
  }
}
