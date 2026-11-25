"use client";
import { ProductCard } from "@/entities/product/ui/product-card/product-card";
import { useProductsCatalog } from "../model/useProductsStore";
import { useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";

export function ProductList() {
  const {
    products,
    fetchNextPage,
    hasNextPage,
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
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    let triggered = false;
    const triggerLoadMore = () => {
      if (triggered) return;
      triggered = true;
      fetchNextPage();
    };

    const checkVisibility = () => {
      if (triggered) return;
      const rect = currentTarget.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.height > 0 && rect.top <= viewportHeight + 300) {
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
              // Начинаем подгрузку заранее — за 300px до конца списка, чтобы юзер не видел пустоту
              rootMargin: "300px",
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
    window.addEventListener("resize", scheduleCheck, { passive: true });

    return () => {
      observer?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleCheck, { capture: true });
      window.removeEventListener("resize", scheduleCheck);
    };
  }, [
    hasNextPage,
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
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Товары не найдены.
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
        {!isFetchingNextPage && hasNextPage && !isFetchNextPageError && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
          >
            Загрузить еще
          </Button>
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
