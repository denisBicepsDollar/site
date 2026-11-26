"use client";

import Link from "next/link";
import { AlertCircle, Check, ChevronLeft, Lock } from "lucide-react";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
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
import {
  calculateOrderSummary,
  resolveShippingLeaf,
  useOrderStore,
  validateOrderStep,
} from "@/entities/order";
import { useCartStore } from "@/entities/cart";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

export function ReviewOrder() {
  const prevStep = useOrderStore((state) => state.prevStep);
  const submitOrder = useOrderStore((state) => state.submitOrder);
  const isSubmitting = useOrderStore((state) => state.isSubmitting);
  const submitError = useOrderStore((state) => state.submitError);
  const selectedPaymentType = useOrderStore(
    (state) => state.selectedPaymentType,
  );
  const selectedShippingPath = useOrderStore(
    (state) => state.selectedShippingPath,
  );
  const deliveryMeta = useOrderStore((state) => state.deliveryMeta);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const agreeToTerms = useOrderStore((state) => state.agreeToTerms);
  const setAgreeToTerms = useOrderStore((state) => state.setAgreeToTerms);
  const cartItems = useCartStore((state) => state.cartItems);

  const summary = calculateOrderSummary({
    cartItems,
    selectedShippingPath,
    deliveryMeta,
  });
  const canSubmit = validateOrderStep(3, {
    shippingAddress,
    selectedShippingPath,
    selectedPaymentType,
    agreeToTerms,
    isSubmitting,
    cartItems,
  });

  const shippingResolution = resolveShippingLeaf(selectedShippingPath);
  const shippingTitle =
    shippingResolution.trail.map((node) => node.name).join(" · ") ||
    "Способ доставки";

  const fullName = [
    shippingAddress.lastName,
    shippingAddress.firstName,
    shippingAddress.middleName,
  ]
    .filter(Boolean)
    .join(" ");

  const paymentLabel =
    selectedPaymentType === "email_confirmation"
      ? "Оплата после подтверждения"
      : selectedPaymentType === "sbp"
        ? "Перевод по СБП"
        : selectedPaymentType;

  return (
    <Card variant="header">
      <CardHeader>
        <CardMedia>
          <Check aria-hidden="true" />
        </CardMedia>
        <CardTitle>Подтверждение заказа</CardTitle>
        <CardDescription>
          Проверьте данные получателя, выбранную доставку и способ оплаты.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <Card variant="inset" density="compact">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Получатель и доставка
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{fullName}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.email}</p>
            <p>{shippingTitle}</p>
            {selectedShippingPath[0] === "pickup" ? (
              <p>Адрес самовывоза: Брянская обл., Новозыбков</p>
            ) : (
              <p>Адрес доставки: {shippingAddress.fullAddress}</p>
            )}
            {deliveryMeta.postOfficeCode && (
              <p>Отделение: ОПС {deliveryMeta.postOfficeCode}</p>
            )}
            {shippingAddress.comment && (
              <p>Комментарий: {shippingAddress.comment}</p>
            )}
          </CardContent>
        </Card>

        <Card variant="inset" density="compact">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Способ оплаты
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{paymentLabel}</p>
            <p>
              На указанную почту ({shippingAddress.email}) придёт письмо с
              подтверждением оформления заказа и дальнейшими деталями.
            </p>
          </CardContent>
        </Card>

        {submitError && (
          <Card variant="error" density="compact" role="alert">
            <CardHeader>
              <CardMedia>
                <AlertCircle aria-hidden="true" />
              </CardMedia>
              <CardTitle className="text-sm font-semibold">
                Ошибка при оформлении заказа
              </CardTitle>
              <CardDescription>{submitError}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="outline"
                size="xs"
                render={<Link href="/cart">Вернуться в корзину</Link>}
              />
            </CardFooter>
          </Card>
        )}

        <Card variant="subtle" density="compact">
          <CardContent className="flex items-start gap-3">
            <Checkbox
              id="agreeTerms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
            />
            <Label
              htmlFor="agreeTerms"
              className="text-sm leading-relaxed cursor-pointer"
            >
              Я согласен с условиями обработки персональных данных и оформления
              заказа
            </Label>
          </CardContent>
        </Card>
      </CardContent>

      <CardFooter className="border-t justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={prevStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Назад
        </Button>
        <Button
          type="button"
          disabled={!canSubmit || isSubmitting}
          onClick={() => void submitOrder()}
          size="lg"
          variant="accent"
          className="flex items-center gap-2"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          {isSubmitting
            ? "Оформляем заказ…"
            : `Подтвердить заказ · ${formatPrice(summary.total)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
