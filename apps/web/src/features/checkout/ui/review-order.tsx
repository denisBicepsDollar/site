"use client";

import Link from "next/link";
import { AlertCircle, Check, ChevronLeft, Lock } from "lucide-react";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Check className="h-5 w-5" aria-hidden="true" />
          Подтверждение заказа
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Recipient & Delivery */}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Получатель и доставка</h3>
          <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele space-y-1">
            <p className="font-medium text-foreground">{fullName}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.email}</p>
            <p>{shippingTitle}</p>
            {selectedShippingPath[0] === "pickup" ? (
              <p>Адрес самовывоза: Брянская обл., Новозыбков</p>
            ) : (
              <p>Адрес доставки: {shippingAddress.fullAddress}</p>
            )}
            {shippingAddress.comment && (
              <p>Комментарий: {shippingAddress.comment}</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Способ оплаты</h3>
          <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele space-y-1">
            <p className="font-medium text-foreground">{paymentLabel}</p>
            <p>
              На указанную почту ({shippingAddress.email}) придёт письмо с
              подтверждением оформления заказа и дальнейшими деталями.
            </p>
          </div>
        </div>

        {submitError && (
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                className="size-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{submitError}</span>
            </div>
            <div>
              <Button
                variant="outline"
                size="xs"
                render={<Link href="/cart" />}
              >
                Вернуться в корзину
              </Button>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="flex items-start gap-2 border-t pt-4">
          <Checkbox
            id="agreeTerms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
          />
          <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
            Я согласен с условиями обработки персональных данных и оформления
            заказа
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={prevStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
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
