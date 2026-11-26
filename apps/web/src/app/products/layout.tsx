import { Suspense, type ReactNode } from "react";
import { ProductsLayoutShell } from "@/widgets/catalog-sidebar";
import {
  getCachedCatalogLabels,
  getCachedCatalogProducts,
} from "@/shared/api/server";

async function ProductsLayoutLoader({ children }: { children: ReactNode }) {
  const [initialLabels, firstPage] = await Promise.all([
    getCachedCatalogLabels(),
    getCachedCatalogProducts({ page: "1" }),
  ]);

  const initialMeta = firstPage?.isError ? undefined : firstPage?.meta;

  return (
    <ProductsLayoutShell
      initialLabels={initialLabels}
      initialMeta={initialMeta}
    >
      {children}
    </ProductsLayoutShell>
  );
}

function ProductsLayoutFallback() {
  return (
    <div aria-hidden="true">
      <div className="h-10" />
      <p className="mt-2 text-muted-foreground">
        Посмотрите нашу коллекцию товаров
      </p>
      <div className="mb-8 min-h-svh w-full" />
    </div>
  );
}

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ProductsLayoutFallback />}>
      <ProductsLayoutLoader>{children}</ProductsLayoutLoader>
    </Suspense>
  );
}
