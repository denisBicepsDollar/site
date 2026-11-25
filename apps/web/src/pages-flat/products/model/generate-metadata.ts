export async function generateMetadata({ searchParams }) {
  // 1. Получаем текущую страницу из параметров строки (URL)
  const { page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  // 2. Настройки вашего бренда (замените на свои значения)
  const storeName = "Имя Вашего Бренда";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  // 3. Формируем канонический URL и заголовки в зависимости от пагинации
  const canonicalPath = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
  const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;

  const title =
    pageNum > 1
      ? `Каталог товаров — Страница ${pageNum} | ${storeName}`
      : `Каталог товаров | Интернет-магазин ${storeName}`;

  const description = `Изучите полный каталог товаров от ${storeName}. На этой странице собраны лучшие предложения нашей коллекции. Страница ${pageNum}.`;

  // 4. Возвращаем структурированный объект для поисковых систем
  return {
    title,
    description,
    alternates: {
      canonical: fullCanonicalUrl,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: fullCanonicalUrl,
      siteName: storeName,
      // Сюда можно добавить общую картинку-превью для соцсетей (лежащую в папке public)
      images: [
        {
          url: `${siteUrl}/og-catalog-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Каталог товаров ${storeName}`,
        },
      ],
    },
    // Настройки для Twitter/X
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
