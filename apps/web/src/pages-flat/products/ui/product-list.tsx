"use client";
import { ProductCard } from "@/entities/product";
import { useProductsCatalog } from "../model/use-products-store";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";

export function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    products,
    counts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    isError,
    refetch,
  } = useProductsCatalog();

  // 1. Создаем ref для маячка внизу списка
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 2. Следим за появлением маячка на экране
  useEffect(() => {
    const currentTarget = loadMoreRef.current;
    if (
      !currentTarget ||
      !hasNextPage ||
      isFetching ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    let triggered = false;
    const triggerLoadMore = () => {
      if (triggered) return;
      triggered = true;
      void fetchNextPage();
    };

    const checkVisibility = () => {
      if (triggered) return;
      const rect = currentTarget.getBoundingClientRect();
      if (rect.height <= 0) return;

      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const docBottomDistance =
        document.documentElement.scrollHeight -
        (window.scrollY + viewportHeight);

      if (
        rect.top <= viewportHeight + 400 ||
        (document.documentElement.scrollHeight > 0 &&
          docBottomDistance <= 400)
      ) {
        triggerLoadMore();
      }
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const isIntersecting = entries.some(
                (entry) => entry.isIntersecting,
              );
              if (isIntersecting) {
                triggerLoadMore();
              }
            },
            {
              // Начинаем подгрузку заранее — за 400px до конца списка
              rootMargin: "400px 0px",
            },
          )
        : null;

    observer?.observe(currentTarget);

    let rafId = 0;
    const scheduleCheck = () => {
      if (triggered || rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        checkVisibility();
      });
    };

    scheduleCheck();
    window.addEventListener("scroll", scheduleCheck, {
      passive: true,
      capture: true,
    });
    document.addEventListener("scroll", scheduleCheck, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    return () => {
      observer?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleCheck, { capture: true });
      document.removeEventListener("scroll", scheduleCheck, { capture: true });
      window.removeEventListener("resize", scheduleCheck);
    };
  }, [
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    products.length,
    fetchNextPage,
  ]);

  if (isLoading && products.length === 0) {
    return <div>Загрузка товаров...</div>;
  }

  if (isError && products.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 py-8">
        <p className="text-sm text-muted-foreground">
          Не удалось загрузить товары.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Повторить
        </Button>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    const isScopedPath = pathname !== "/products";
    const queryText = searchParams.get("q")?.trim() ?? "";
    const hasFilterParams = Boolean(
      queryText ||
        searchParams.get("size") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice"),
    );

    const globalParams = new URLSearchParams(searchParams.toString());
    globalParams.delete("page");
    const globalQueryString = globalParams.toString();
    const globalCatalogHref = globalQueryString
      ? `/products?${globalQueryString}`
      : "/products";

    const globalQueryOnlyParams = new URLSearchParams();
    if (queryText) globalQueryOnlyParams.set("q", queryText);
    const sortParam = searchParams.get("sort");
    if (sortParam) globalQueryOnlyParams.set("sort", sortParam);
    const globalQueryOnlyHref = `/products?${globalQueryOnlyParams.toString()}`;

    const globalCount = counts?.total ?? 0;

    return (
      <div className="flex flex-col items-start gap-3 py-8">
        <p className="text-sm text-muted-foreground">
          {isScopedPath
            ? "В этой категории товары не найдены."
            : "Товары не найдены."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {isScopedPath && globalCount > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                router.push(globalCatalogHref, { scroll: false })
              }
            >
              Искать по всему каталогу ({globalCount})
            </Button>
          )}
          {isScopedPath && globalCount === 0 && queryText && (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                router.push(globalQueryOnlyHref, { scroll: false })
              }
            >
              Искать по всему каталогу
            </Button>
          )}
          {(isScopedPath || hasFilterParams) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/products", { scroll: false })}
            >
              Сбросить фильтры
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Элемент-маячок внизу под сеткой */}
      <div
        ref={loadMoreRef}
        className="w-full py-8 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <span className="text-sm text-muted-foreground">
            Загружаем еще товары...
          </span>
        )}
        {isFetchNextPageError && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Не удалось загрузить следующую страницу
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
            >
              Повторить
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
