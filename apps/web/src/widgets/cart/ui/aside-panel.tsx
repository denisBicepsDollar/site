"use client";

import Link from "next/link";
import { useCartStore } from "@/entities/cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/shared/ui/button";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

export function AsidePanel() {
  const cartItems = useCartStore((state) => state.cartItems);
  const isLoadingProducts = useCartStore((state) => state.isLoadingProducts);
  const isError = useCartStore((state) => state.isError);

  const hasOutOfStock = cartItems.some(
    (item) => item.stock <= 0 || item.isOutOfStock,
  );
  const availableItems = cartItems.filter(
    (item) => item.stock > 0 && !item.isOutOfStock,
  );
  const subtotal = availableItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0,
  );
  const canCheckout =
    availableItems.length > 0 &&
    !hasOutOfStock &&
    !isError &&
    !isLoadingProducts;

  return (
    <Card variant="header">
      <CardHeader>
        <CardTitle>Ваша корзина</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="space-y-2">
          {cartItems.map((item) => {
            const isOos = item.stock <= 0 || item.isOutOfStock;
            return (
              <div
                key={item.variantId || item.id}
                className="flex items-center justify-between gap-4"
              >
                <dt className="text-base font-medium text-gray-900 dark:text-white">
                  {item.productName}
                  <span className="block text-sm font-normal text-gray-500 dark:text-gray-400">
                    {item.name}
                    {isOos ? " · Нет в наличии" : ""}
                  </span>
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {isOos
                    ? "—"
                    : `${item.cartQuantity} × ${formatPrice(item.price)}`}
                </dd>
              </div>
            );
          })}
        </dl>

        <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <dt className="text-base font-bold text-gray-900 dark:text-white">
            Итого
          </dt>
          <dd className="text-base font-bold text-gray-900 dark:text-white">
            {formatPrice(subtotal)}
          </dd>
        </dl>

        {hasOutOfStock && (
          <p className="text-xs font-medium text-destructive">
            Для оформления заказа удалите товары, которых нет в наличии.
          </p>
        )}

        {canCheckout ? (
          <Link
            className={buttonVariants({ variant: "accent", width: "full" })}
            href="/cart/checkout"
          >
            Оформить заказ
          </Link>
        ) : (
          <Button type="button" variant="accent" width="full" disabled>
            Оформить заказ
          </Button>
        )}

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            или
          </span>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
          >
            Продолжить покупки
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
