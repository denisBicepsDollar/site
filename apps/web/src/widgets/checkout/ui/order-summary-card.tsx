"use client";

import { ShoppingBag } from "lucide-react";
import { calculateOrderSummary, useOrderStore } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

const DEFAULT_IMAGE = "/default-image.png";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

export function OrderSummaryCard() {
  const cartItems = useCartStore((state) => state.cartItems);
  const selectedShippingPath = useOrderStore(
    (state) => state.selectedShippingPath,
  );
  const deliveryMeta = useOrderStore((state) => state.deliveryMeta);

  const summary = calculateOrderSummary({
    cartItems,
    selectedShippingPath,
    deliveryMeta,
  });
  const availableItems = cartItems.filter(
    (item) => item.stock > 0 && !item.isOutOfStock,
  );
  const shippingLabel =
    selectedShippingPath[0] === "pickup"
      ? "Бесплатно"
      : summary.shipping > 0
        ? formatPrice(summary.shipping)
        : deliveryMeta.tariffName
          ? "Уточняется"
          : "0 ₽";

  return (
    <Card variant="header">
      <CardHeader>
        <CardMedia>
          <ShoppingBag aria-hidden="true" />
        </CardMedia>
        <CardTitle>Сводка заказа</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {availableItems.map((item) => (
            <div key={item.variantId || item.id} className="flex gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <img
                  src={item.previewImage || DEFAULT_IMAGE}
                  alt={`${item.productName} ${item.name}`}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith(DEFAULT_IMAGE)) {
                      img.src = DEFAULT_IMAGE;
                    }
                  }}
                  className="w-full h-full object-cover rounded-md"
                />
                <Badge
                  size="sm"
                  variant="accent"
                  className="absolute -top-1.5 -right-1.5 text-xs min-w-5 h-5 flex items-center justify-center"
                >
                  {item.cartQuantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {item.cartQuantity} × {formatPrice(item.price)}
                </span>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {formatPrice(item.price * item.cartQuantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Промежуточный итог</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Доставка</span>
            <span>{shippingLabel}</span>
          </div>
          {deliveryMeta.postOfficeCode && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Отделение</span>
              <span>ОПС {deliveryMeta.postOfficeCode}</span>
            </div>
          )}
          <Separator className="my-1" />
          <div className="flex justify-between font-semibold text-base">
            <span>Итого</span>
            <span>{formatPrice(summary.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
