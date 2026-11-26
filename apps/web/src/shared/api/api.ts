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
      {
        ...(options?.noStore
          ? { cache: "no-store" as const }
          : { next: { revalidate: 60 } }),
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) return { data: [], meta: {}, isError: true };

    const allProducts = await res.json();
    return allProducts;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Ошибка загрузки товаров:", message);
    return { data: [], meta: {}, isError: true };
  }
}

export async function getCatalogLabels(options?: { noStore?: boolean }) {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/products/labels`, {
      ...(options?.noStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(
      `${getBackendUrl()}/api/v1/products/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) return { data: null };

    const allProducts = { data: await res.json() };
    return allProducts;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Ошибка загрузки товара:", message);
    return { data: null };
  }
}

export async function getProductsByVariant(variantIds: Array<string | number>) {
  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return { data: [] };
  }

  try {
    const varIds = variantIds
      .map((id) => String(id).trim())
      .filter(Boolean)
      .map((variantId) => `variantId=${encodeURIComponent(variantId)}`);

    if (varIds.length === 0) {
      return { data: [] };
    }

    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser
      ? "/api/products/variants/by-ids"
      : `${getBackendUrl()}/api/v1/products/variants/by-ids`;
    const url = `${baseUrl}?${varIds.join("&")}`;

    const res = await fetch(
      url,
      isBrowser
        ? { cache: "no-store", signal: AbortSignal.timeout(8000) }
        : { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return { data: [] };
    const products = { data: await res.json() };
    return products;
  } catch (err) {
    console.error(err);
    return { data: [] };
  }
}
