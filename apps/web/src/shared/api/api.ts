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
    return { data: [], isError: false };
  }

  try {
    const varIds = variantIds
      .map((id) => String(id).trim())
      .filter(Boolean)
      .map((variantId) => `variantId=${encodeURIComponent(variantId)}`);

    if (varIds.length === 0) {
      return { data: [], isError: false };
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
    if (!res.ok) return { data: [], isError: true };
    const raw = await res.json();
    return { data: Array.isArray(raw) ? raw : [], isError: false };
  } catch (err) {
    console.error(err);
    return { data: [], isError: true };
  }
}

export async function createOrder(payload: unknown) {
  try {
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser ? "/api/orders" : `${getBackendUrl()}/api/v1/orders`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false as const,
        status: res.status,
        code: typeof data?.code === "string" ? data.code : undefined,
        message:
          typeof data?.message === "string"
            ? data.message
            : "Не удалось оформить заказ",
        items: Array.isArray(data?.items) ? data.items : undefined,
      };
    }

    return {
      ok: true as const,
      status: res.status,
      data,
    };
  } catch (err) {
    const message =
      err instanceof Error &&
      (err.name === "TimeoutError" || err.name === "AbortError")
        ? "Превышено время ожидания сервера"
        : "Не удалось соединиться с сервером";
    return {
      ok: false as const,
      status: 500,
      message,
    };
  }
}
