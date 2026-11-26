"use client";

import { Plus, Minus, X, Heart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/entities/cart";
import { useState } from "react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/shared/ui/number-field";
import { Button, ButtonWithIcon } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { CardDescription } from "@site/ui/card";

export function CartItem({ variantId }) {
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const variant = useCartStore((state) =>
    state.cartItems.find((item) => item.variantId === variantId),
  );

  // Если товар удалили, чтобы не было ошибки до размонтирования
  if (!variant) return null;
  return (
    <Card key={variant.id}>
      <CardHeader className="flex justify-between">
        <Link
          className="block  w-30 self-stretch overflow-hidden border rounded-md "
          href={`product/${variant.slug}`}
        >
          <img
            className="h-full w-full object-cover"
            src={variant.previewImage}
            alt={variant.productName}
          />
        </Link>
        <div className="w-full h-full">
          <CardTitle>
            <Link
              className="flex items-center"
              href={"product/" + variant.slug}
            >
              {variant.productName}
            </Link>
          </CardTitle>
          <CardDescription className="flex flex-col gap-3">
            Размер: {variant.name}
            <div className="flex justify-between items-center">
              <NumberField
                size="sm"
                className="max-w-30"
                min="1"
                max={variant.stock}
              >
                <NumberFieldGroup>
                  <NumberFieldDecrement
                    onClick={() =>
                      changeQuantity(
                        variant.id,
                        variant.cartQuantity - 1,
                        variant.stock,
                      )
                    }
                    aria-label="Decrease quantity"
                  />
                  <NumberFieldInput
                    id="counter-input"
                    value={variant.cartQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      // Если поле очистили полностью, временно оставляем 1 или не обновляем, пока не введут цифру
                      if (!isNaN(val)) {
                        changeQuantity(variant.id, val, variant.stock);
                      }
                    }}
                  />
                  <NumberFieldIncrement
                    onClick={() =>
                      changeQuantity(
                        variant.id,
                        variant.cartQuantity + 1,
                        variant.stock,
                      )
                    }
                    aria-label="Increase quantity"
                  />
                </NumberFieldGroup>
              </NumberField>
              <span>{variant.price} ₽</span>
            </div>
          </CardDescription>
          <CardAction className="mt-3">
            <ButtonWithIcon
              variant={"ghost-destructive"}
              className="border --sp-rw-radius-control"
              size="xs"
              shape="pill"
              onClick={() => removeFromCart(variant.id)}
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
