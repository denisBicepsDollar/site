"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useOrderStore } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import {
  OrderSummary,
  PaymentInformation,
  ReviewOrder,
  ShippingInformation,
} from "@/features/checkout";
import { OrderSummaryCard } from "@/widgets/checkout";
import { Button, buttonVariants } from "@/shared/ui/button";

export default function CheckoutScreen() {
  const currentStep = useOrderStore((state) => state.currentStep);
  const createdOrder = useOrderStore((state) => state.createdOrder);
  const resetOrderFlow = useOrderStore((state) => state.resetOrderFlow);

  const initCart = useCartStore((state) => state.initCart);
  const fetchCartProducts = useCartStore((state) => state.fetchCartProducts);
  const hasInitialized = useCartStore((state) => state.hasInitialized);
  const isLoadingProducts = useCartStore((state) => state.isLoadingProducts);
  const isError = useCartStore((state) => state.isError);
  const cartStorage = useCartStore((state) => state.cartStorage);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    initCart();

    return () => {
      if (useOrderStore.getState().currentStep === 4) {
        useOrderStore.getState().resetOrderFlow();
      }
    };
  }, [initCart]);

  // If user added new items after completing a previous order, start a fresh checkout
  useEffect(() => {
    if (cartStorage.length > 0 && currentStep === 4) {
      resetOrderFlow();
    }
  }, [cartStorage.length, currentStep, resetOrderFlow]);

  if (currentStep === 4 && createdOrder && cartStorage.length === 0) {
    return (
      <div className="w-full mt-20 mx-auto p-6 flex flex-col gap-6">
        <OrderSummary order={createdOrder} />
      </div>
    );
  }

  const isWaitingForCart =
    !hasInitialized ||
    (cartStorage.length > 0 && isLoadingProducts && cartItems.length === 0);

  if (isWaitingForCart) {
    return (
      <div className="w-full mt-20 mx-auto p-6">
        <div className="animate-pulse bg-gray-200 h-24 w-full rounded" />
      </div>
    );
  }

  if (isError && cartItems.length === 0 && cartStorage.length > 0) {
    return (
      <div className="w-full mt-20 mx-auto max-w-xl p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold">Не удалось загрузить корзину</h1>
        <p className="text-sm text-muted-foreground">
          Проверьте соединение и повторите попытку для оформления заказа.
        </p>
        <div className="flex justify-center gap-3">
          <Button type="button" onClick={() => void fetchCartProducts()}>
            Повторить
          </Button>
          <Link href="/cart" className={buttonVariants({ variant: "outline" })}>
            Вернуться в корзину
          </Link>
        </div>
      </div>
    );
  }

  const hasOutOfStock = cartItems.some(
    (item) => item.stock <= 0 || item.isOutOfStock,
  );
  const availableItems = cartItems.filter(
    (item) => item.stock > 0 && !item.isOutOfStock,
  );

  if (availableItems.length === 0 || hasOutOfStock) {
    return (
      <div className="w-full mt-20 mx-auto max-w-xl p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold">
          {hasOutOfStock
            ? "В корзине есть недоступные товары"
            : "Корзина пуста"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {hasOutOfStock
            ? "Удалите товары, которых нет в наличии, прежде чем оформить заказ."
            : "Добавьте растения в корзину, чтобы перейти к оформлению."}
        </p>
        <div className="flex justify-center gap-3">
          {hasOutOfStock ? (
            <Link href="/cart" className={buttonVariants({ variant: "accent" })}>
              Перейти в корзину
            </Link>
          ) : (
            <Link
              href="/products"
              className={buttonVariants({ variant: "accent" })}
            >
              Перейти в каталог
            </Link>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    { step: 1, label: "Доставка и контакты" },
    { step: 2, label: "Оплата" },
    { step: 3, label: "Подтверждение" },
  ];

  return (
    <div className="w-full mt-20 mx-auto p-6 flex flex-col gap-6">
      <nav
        aria-label="Этапы оформления заказа"
        className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
      >
        {steps.map((item, idx) => (
          <div key={item.step} className="flex items-center gap-2">
            <span
              className={
                currentStep === item.step
                  ? "font-semibold text-foreground"
                  : currentStep > item.step
                    ? "text-foreground/70"
                    : ""
              }
            >
              {item.step}. {item.label}
            </span>
            {idx < steps.length - 1 && <span aria-hidden="true">→</span>}
          </div>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentStep === 1 && <ShippingInformation />}
          {currentStep === 2 && <PaymentInformation />}
          {currentStep === 3 && <ReviewOrder />}
        </div>

        <div className="flex flex-col gap-4">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
