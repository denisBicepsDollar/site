"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/entities/cart";
import { Button } from "@/shared/ui/button";

interface AddToCartButtonProps {
  variant: {
    id: string;
    stock: number;
    price: number;
  };
  quantity?: number;
  className?: string;
}

const priceFormatter = new Intl.NumberFormat("ru-RU");

export function AddToCartButton({
  variant,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [feedback, setFeedback] = useState<string | null>(null);

  const stock = Math.max(0, Math.trunc(Number(variant?.stock) || 0));
  const variantId = String(variant?.id ?? "").trim();
  const safeQuantity =
    Number.isFinite(quantity) && quantity >= 1
      ? Math.min(Math.trunc(quantity), Math.max(1, stock))
      : 1;
  const isAvailable = Boolean(variantId) && stock > 0;
  const totalPrice = (Number(variant?.price) || 0) * safeQuantity;

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleClick = () => {
    if (!isAvailable) return;
    const result = addToCart({
      variantId,
      stock,
      quantity: safeQuantity,
    });

    if (result.outOfStock) {
      setFeedback("Нет в наличии");
    } else if (result.added === 0 && result.reachedLimit) {
      setFeedback(`Уже максимум (${result.totalInCart} шт.)`);
    } else if (result.reachedLimit) {
      setFeedback(`Добавлено ${result.added} шт. (лимит ${result.totalInCart})`);
    } else {
      setFeedback("Добавлено");
    }
  };

  return (
    <Button
      type="button"
      variant="accent"
      shape="pill"
      disabled={!isAvailable}
      onClick={handleClick}
      className={className}
    >
      {feedback ? (
        <Check className="mr-2 size-4" aria-hidden="true" />
      ) : (
        <ShoppingBag className="mr-2 size-4" aria-hidden="true" />
      )}
      {!isAvailable
        ? "Нет в наличии"
        : feedback
          ? feedback
          : `Добавить в корзину · ${priceFormatter.format(totalPrice)} ₽`}
    </Button>
  );
}
