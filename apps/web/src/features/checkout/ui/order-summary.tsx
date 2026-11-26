"use client";

import Link from "next/link";
import {
  CheckCircle,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Truck,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/siteplane/system/utils/cn";
import type { CreatedOrderRecord } from "@/entities/order";

const DEFAULT_IMAGE = "/default-image.png";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

interface OrderSummaryProps {
  order: CreatedOrderRecord;
  className?: string;
}

export function OrderSummary({ order, className }: OrderSummaryProps) {
  const items = order.items ?? [];
  const deliveryTitle =
    order.deliveryMethod === "pickup"
      ? "Самовывоз"
      : order.pochtaTariffName ||
        order.cdekTariffName ||
        (order.deliveryCompany === "cdek"
          ? "СДЭК"
          : order.deliveryCompany === "russian_post"
            ? "Почта России"
            : "Доставка");

  return (
    <section className={cn("py-4 md:py-8", className)}>
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardContent className="text-center space-y-3">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle
                className="size-8 text-emerald-600"
                aria-hidden="true"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Спасибо за заказ!
            </h1>
            <p className="text-muted-foreground">
              Заказ успешно оформлен. Письмо с подтверждением оформления заказа
              придёт на указанную почту{" "}
              <span className="font-medium text-foreground">{order.email}</span>
            </p>
          </CardContent>
        </Card>

        <Card density="compact">
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Номер заказа</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 md:block"
              />
              <div>
                <p className="text-sm text-muted-foreground">Дата</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <Badge variant="success">Заказ принят</Badge>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card variant="header">
              <CardHeader>
                <CardMedia>
                  <Package aria-hidden="true" />
                </CardMedia>
                <CardTitle>Состав заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.variantId}-${index}`}>
                    <div className="flex gap-4">
                      <div className="w-20 shrink-0">
                        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.previewImage || DEFAULT_IMAGE}
                            alt={item.name}
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (!img.src.endsWith(DEFAULT_IMAGE)) {
                                img.src = DEFAULT_IMAGE;
                              }
                            }}
                            className="size-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Размер: {item.volume}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Количество: {item.quantity} шт.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} / шт.
                          </p>
                        )}
                      </div>
                    </div>
                    {index < items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары</span>
                  <span>{formatPrice(order.productsTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>
                    {order.deliveryPrice === 0
                      ? "Бесплатно"
                      : formatPrice(order.deliveryPrice)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="header">
              <CardHeader>
                <CardMedia>
                  <MapPin aria-hidden="true" />
                </CardMedia>
                <CardTitle>Доставка и получатель</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  {order.address && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.address}
                    </p>
                  )}
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Truck
                    className="mt-0.5 size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium">{deliveryTitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="header">
              <CardHeader>
                <CardMedia>
                  <CreditCard aria-hidden="true" />
                </CardMedia>
                <CardTitle>Оплата</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm font-medium">
                  {order.paymentMethod === "sbp"
                    ? "Перевод по СБП"
                    : "Оплата после подтверждения"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Подтверждение оформления заказа и детали оплаты придут на
                  указанную почту ({order.email})
                </p>
              </CardContent>
            </Card>

            <Card density="compact">
              <CardContent>
                <Button
                  type="button"
                  className="w-full gap-2"
                  variant="ghost"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" aria-hidden="true" />
                  Распечатать заказ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card variant="subtle" density="compact">
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Есть вопросы по вашему заказу?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                render={<Link href="/contact">Связаться с нами</Link>}
              />
              <Button
                variant="accent"
                render={<Link href="/products">Продолжить покупки</Link>}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
