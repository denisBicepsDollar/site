"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/entities/cart";
import { CartList } from "@/features/manage-cart";
import { AsidePanel } from "@/widgets/cart";
import { Button, buttonVariants } from "@/shared/ui/button";

export function CartScreen() {
  const initCart = useCartStore((state) => state.initCart);
  const fetchCartProducts = useCartStore((state) => state.fetchCartProducts);
  const hasInitialized = useCartStore((state) => state.hasInitialized);
  const isLoadingProducts = useCartStore((state) => state.isLoadingProducts);
  const isError = useCartStore((state) => state.isError);
  const cartStorage = useCartStore((state) => state.cartStorage);
  const variants = useCartStore((state) => state.cartItems);
  const cartNotices = useCartStore((state) => state.cartNotices);
  const dismissNotices = useCartStore((state) => state.dismissNotices);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeUnavailableItems = useCartStore(
    (state) => state.removeUnavailableItems,
  );

  useEffect(() => {
    initCart();
  }, [initCart]);

  const variantsIds = variants.map(({ variantId }) => variantId);
  const hasOutOfStock = variants.some(
    (item) => item.stock <= 0 || item.isOutOfStock,
  );

  const isWaitingInitialLoad =
    !hasInitialized || (isLoadingProducts && variants.length === 0 && cartStorage.length > 0);

  if (isWaitingInitialLoad) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded" />
      </div>
    );
  }

  if (isError && variants.length === 0 && cartStorage.length > 0) {
    return (
      <section className="bg-white mt-10 py-16 antialiased dark:bg-gray-900">
        <div className="mx-auto max-w-screen-md px-4 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Не удалось загрузить корзину
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ваши товары сохранены, но сервер временно не отвечает. Попробуйте обновить.
          </p>
          <Button type="button" onClick={() => void fetchCartProducts()}>
            Повторить попытку
          </Button>
        </div>
      </section>
    );
  }

  if (variants.length === 0) {
    return (
      <section className="bg-white mt-10 py-16 antialiased dark:bg-gray-900">
        <div className="mx-auto max-w-screen-md px-4 text-center space-y-5">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <ShoppingBag className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Корзина пуста
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Вы ещё не добавили ни одного растения в корзину.
          </p>
          <Link href="/products" className={buttonVariants({ variant: "accent" })}>
            Перейти в каталог
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white mt-10 py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Корзина
          </h2>
          <div className="flex items-center gap-2">
            {hasOutOfStock && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeUnavailableItems}
              >
                Удалить отсутствующие
              </Button>
            )}
            <Button
              type="button"
              variant="ghost-destructive"
              size="sm"
              onClick={clearCart}
            >
              <Trash2 className="mr-1.5 size-4" aria-hidden="true" />
              Очистить корзину
            </Button>
          </div>
        </div>

        {cartNotices.length > 0 && (
          <div
            role="status"
            className="mt-4 flex items-start justify-between gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <ul className="list-disc pl-5 space-y-1">
              {cartNotices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={dismissNotices}
            >
              Скрыть
            </Button>
          </div>
        )}

        <div className="flex mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 gap-6">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <CartList variantsIds={variantsIds} />
            </div>
          </div>
          <AsidePanel />
        </div>
      </div>
    </section>
  );
}
