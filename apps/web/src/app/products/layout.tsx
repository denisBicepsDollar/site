import { Suspense, type ReactNode } from "react";
import { ProductsLayoutShell } from "@/pages-flat/products";
import { getCatalogLabels } from "@/shared/api";

async function ProductsLayoutLoader({ children }: { children: ReactNode }) {
  const initialLabels = await getCatalogLabels({ noStore: true });

  return (
    <ProductsLayoutShell initialLabels={initialLabels}>
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
