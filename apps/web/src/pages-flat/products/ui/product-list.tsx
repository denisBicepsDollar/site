"use client";
import { ProductCard } from "@/entities/product/ui/product-card/product-card";
import { useProductsCatalog } from "../model/useProductsStore";
import { useEffect, useRef } from "react";

export function ProductList() {
  const {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProductsCatalog();

  // 1. Создаем ref для маячка внизу списка
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 2. Следим за появлением маячка на экране
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Если маячок попал в зону видимости, есть еще страницы и сейчас ничего не грузится
        if (entries.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        // Начинаем подгрузку заранее — за 300px до конца списка, чтобы юзер не видел пустоту
        rootMargin: "300px",
      },
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && products.length === 0) {
    return <div>Загрузка товаров...</div>;
  }

  return (
    <>
      {/* Ваша текущая сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 3. Тот самый элемент-маячок в самом низу под сеткой */}
      <div
        ref={loadMoreRef}
        className="w-full py-8 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <span className="text-sm text-muted-foreground">
            Загружаем еще товары...
          </span>
        )}
      </div>
    </>
  );
}
