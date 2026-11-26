"use client";

import { ShoppingBag } from "lucide-react";
import { useOrderStore } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

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
  const calculateSummary = useOrderStore((state) => state.calculateSummary);

  const summary = calculateSummary();
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
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Сводка заказа
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {availableItems.map((item) => (
            <div key={item.variantId || item.id} className="flex gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
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
                  className="absolute -top-1 -right-1 text-xs min-w-5 h-5 flex items-center justify-center"
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

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Промежуточный итог</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Доставка</span>
            <span>{shippingLabel}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Итого</span>
            <span>{formatPrice(summary.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
