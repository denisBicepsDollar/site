import ProductsScreen from "@/pages-flat/products/ui/products-screen";
import { Footer } from "../../widgets/footer/ui/footer";
import { Header } from "../../widgets/header/ui/header";
import { getProducts } from "@/shared/api/api";
import { useProductsStore } from "@/pages-flat/products/model/useProductsStore";

export async function generateMetadata({ searchParams }) {
  const { page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const storeName = "Имя Вашего Бренда";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com";

  const canonicalPath = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
  const fullCanonicalUrl = `${siteUrl}${canonicalPath}`;

  const title =
    pageNum > 1
      ? `Каталог товаров — Страница ${pageNum} | ${storeName}`
      : `Каталог товаров | Интернет-магазин ${storeName}`;

  const description = `Изучите полный каталог товаров от ${storeName}. На этой странице собраны лучшие предложения нашей коллекции. Страница ${pageNum}.`;

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
      images: [
        {
          url: `${siteUrl}/og-catalog-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Каталог товаров ${storeName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ИСПРАВЛЕНО: Принимаем searchParams из пропсов Next.js и передаем их дальше
export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const data = await getProducts(resolvedParams);

  return <ProductsScreen data={data} />;
}
