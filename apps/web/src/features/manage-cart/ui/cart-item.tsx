"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/entities/cart";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/shared/ui/number-field";
import { ButtonWithIcon } from "@/shared/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/shared/ui/card";
import { CardDescription } from "@site/ui/card";

const DEFAULT_IMAGE = "/default-image.png";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

interface CartItemProps {
  variantId: string;
}

export function CartItem({ variantId }: CartItemProps) {
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const variant = useCartStore((state) =>
    state.cartItems.find((item) => item.variantId === variantId),
  );

  if (!variant) return null;

  const isOutOfStock = variant.stock <= 0 || variant.isOutOfStock;
  const productHref = `/product/${encodeURIComponent(variant.slug)}`;
  const lineTotal = variant.price * variant.cartQuantity;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start gap-4">
        <Link
          className="block w-full h-44 sm:w-30 sm:h-30 shrink-0 overflow-hidden border rounded-md"
          href={productHref}
        >
          <img
            className="h-full w-full object-cover"
            src={variant.previewImage || DEFAULT_IMAGE}
            alt={variant.productName}
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.endsWith(DEFAULT_IMAGE)) {
                img.src = DEFAULT_IMAGE;
              }
            }}
          />
        </Link>
        <div className="min-w-0 flex-1 w-full">
          <CardTitle>
            <Link
              className="flex items-center hover:underline"
              href={productHref}
            >
              {variant.productName}
            </Link>
          </CardTitle>
          <CardDescription className="flex flex-col gap-3">
            <span>Размер: {variant.name}</span>
            {isOutOfStock ? (
              <span className="text-sm font-semibold text-destructive">
                Нет в наличии — удалите позицию для оформления заказа
              </span>
            ) : (
              <div className="flex flex-wrap justify-between items-center gap-3">
                <NumberField
                  size="sm"
                  width="fit"
                  min={1}
                  max={Math.max(1, variant.stock)}
                  value={variant.cartQuantity}
                  onValueChange={(val) => {
                    if (
                      typeof val === "number" &&
                      Number.isFinite(val) &&
                      val >= 1
                    ) {
                      changeQuantity(variant.variantId, val, variant.stock);
                    }
                  }}
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement aria-label="Уменьшить количество" />
                    <NumberFieldInput aria-label="Количество" />
                    <NumberFieldIncrement aria-label="Увеличить количество" />
                  </NumberFieldGroup>
                </NumberField>
                <div className="text-right">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatPrice(lineTotal)}
                  </div>
                  {variant.cartQuantity > 1 && (
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(variant.price)} / шт.
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardDescription>
          <CardAction className="mt-3">
            <ButtonWithIcon
              type="button"
              variant="ghost-destructive"
              className="border"
              size="xs"
              shape="pill"
              onClick={() => removeFromCart(variant.variantId)}
              icon={<X />}
            >
              Удалить
            </ButtonWithIcon>
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
}
