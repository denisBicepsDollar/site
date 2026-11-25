export async function getProducts(resolvedParams) {
  try {
    console.log(resolvedParams);
    const queryString = new URLSearchParams(resolvedParams).toString();

    const res = await fetch(
      `http://localhost:3000/api/v1/products?${queryString ? `${queryString}` : ""}`,
      {
        next: { revalidate: 60 }, // ISR: кэш на 60 секунд
      },
    );

    if (!res.ok) return [];

    const allProducts = await res.json();
    console.log(allProducts);
    return allProducts;
  } catch (error) {
    console.error("Ошибка загрузки хитов недели:", error.message);
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    console.log(slug);
    const res = await fetch("http://localhost:3000/api/v1/products/" + slug, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const allProducts = { data: await res.json() };
    console.log(allProducts);
    return allProducts;
  } catch (error) {
    console.error("Ошибка загрузки хитов недели:", error.message);
    return [];
  }
}

export async function getProductsByVariant(variantIds) {
  try {
    console.log("api", variantIds);
    const varIds = variantIds.map((variantId) => "variantId=" + variantId);
    const url =
      "http://localhost:3000/api/v1/products/variants/by-ids?" +
      varIds.join("&");
    console.log(url);
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const products = { data: await res.json() };
    return products;
  } catch (err) {
    console.error(err);
  }
}
