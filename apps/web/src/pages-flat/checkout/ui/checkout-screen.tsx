"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Check, ChevronRight, ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import {
  OrderSummary,
  PaymentInformation,
  ReviewOrder,
  ShippingInformation,
} from "@/features/checkout";
import { CheckoutSkeleton, OrderSummaryCard } from "@/widgets/checkout";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/siteplane/system/utils/cn";

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
      <div className="w-full py-6 md:py-10 flex flex-col gap-6">
        <OrderSummary order={createdOrder} />
      </div>
    );
  }

  const isWaitingForCart =
    !hasInitialized ||
    (cartStorage.length > 0 && isLoadingProducts && cartItems.length === 0);

  if (isWaitingForCart) {
    return <CheckoutSkeleton />;
  }

  if (isError && cartItems.length === 0 && cartStorage.length > 0) {
    return (
      <div className="w-full py-10 md:py-16 max-w-2xl mx-auto">
        <Card variant="error">
          <CardHeader>
            <CardMedia>
              <AlertCircle aria-hidden="true" />
            </CardMedia>
            <CardTitle>Не удалось загрузить корзину</CardTitle>
            <CardDescription>
              Проверьте соединение и повторите попытку для оформления заказа.
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t justify-end">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/cart">Вернуться в корзину</Link>}
            />
            <Button
              type="button"
              variant="accent"
              onClick={() => void fetchCartProducts()}
            >
              Повторить
            </Button>
          </CardFooter>
        </Card>
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
      <div className="w-full py-10 md:py-16 max-w-2xl mx-auto">
        <Card variant="header">
          <CardHeader>
            <CardMedia>
              <ShoppingBag aria-hidden="true" />
            </CardMedia>
            <CardTitle>
              {hasOutOfStock
                ? "В корзине есть недоступные товары"
                : "Корзина пуста"}
            </CardTitle>
            <CardDescription>
              {hasOutOfStock
                ? "Удалите товары, которых нет в наличии, прежде чем оформить заказ."
                : "Добавьте растения в корзину, чтобы перейти к оформлению."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t justify-end">
            {hasOutOfStock ? (
              <Button
                variant="accent"
                render={<Link href="/cart">Перейти в корзину</Link>}
              />
            ) : (
              <Button
                variant="accent"
                render={<Link href="/products">Перейти в каталог</Link>}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  const steps = [
    { step: 1, label: "Доставка и контакты" },
    { step: 2, label: "Оплата" },
    { step: 3, label: "Подтверждение" },
  ];

  return (
    <div className="w-full py-6 md:py-10 flex flex-col gap-6">
      <Card density="compact">
        <CardContent>
          <nav
            aria-label="Этапы оформления заказа"
            className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm"
          >
            {steps.map((item, idx) => {
              const isCurrent = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              return (
                <div
                  key={item.step}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  {idx > 0 && (
                    <ChevronRight
                      className="size-4 text-muted-foreground shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full py-1 px-2.5 text-sm",
                      isCurrent && "bg-forest/10 font-semibold text-forest",
                      !isCurrent &&
                        isCompleted &&
                        "font-medium text-foreground",
                      !isCurrent && !isCompleted && "text-muted-foreground",
                    )}
                  >
                    <Badge
                      size="sm"
                      variant={
                        isCurrent
                          ? "accent"
                          : isCompleted
                            ? "success"
                            : "secondary"
                      }
                      className="min-w-5 h-5 px-1.5"
                    >
                      {isCompleted ? (
                        <Check className="size-3" aria-hidden="true" />
                      ) : (
                        item.step
                      )}
                    </Badge>
                    <span>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {currentStep === 1 && <ShippingInformation />}
          {currentStep === 2 && <PaymentInformation />}
          {currentStep === 3 && <ReviewOrder />}
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
