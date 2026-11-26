"use client";

import { ChevronLeft, ChevronRight, CreditCard, Mail } from "lucide-react";
import { useOrderStore, validateOrderStep } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { ButtonWithIcon } from "@/shared/ui/button";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";

export function PaymentInformation() {
  const nextStep = useOrderStore((state) => state.nextStep);
  const prevStep = useOrderStore((state) => state.prevStep);
  const selectedPaymentType = useOrderStore(
    (state) => state.selectedPaymentType,
  );
  const setSelectedPaymentType = useOrderStore(
    (state) => state.setSelectedPaymentType,
  );
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const selectedShippingPath = useOrderStore(
    (state) => state.selectedShippingPath,
  );
  const agreeToTerms = useOrderStore((state) => state.agreeToTerms);
  const isSubmitting = useOrderStore((state) => state.isSubmitting);
  const cartItems = useCartStore((state) => state.cartItems);

  const isStepValid = validateOrderStep(2, {
    shippingAddress,
    selectedShippingPath,
    selectedPaymentType,
    agreeToTerms,
    isSubmitting,
    cartItems,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" aria-hidden="true" />
          Оплата
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <CardTitle className="text-base font-medium">
          Выберите способ оплаты:
        </CardTitle>
        <RadioGroup
          value={selectedPaymentType}
          onValueChange={(value) => setSelectedPaymentType(String(value))}
          className="grid grid-cols-1 gap-3"
        >
          <Label variant="card" className="items-start gap-3">
            <Radio
              id="payment-email"
              value="email_confirmation"
              className="mt-1"
            />
            <Mail className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">Оплата после подтверждения</span>
              <span className="text-xs text-muted-foreground font-normal">
                На указанную почту
                {shippingAddress.email ? ` (${shippingAddress.email})` : ""}{" "}
                придёт письмо с подтверждением оформления заказа и деталями
                оплаты.
              </span>
            </div>
          </Label>

          <Label
            variant="card"
            className="items-center gap-3 opacity-55 cursor-not-allowed"
          >
            <Radio id="payment-sbp" value="sbp" disabled />
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 97 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M0 26.12l14.532 25.975v15.844L.017 93.863 0 26.12z"
                fill="#5B57A2"
              />
              <path
                d="M55.797 42.643l13.617-8.346 27.868-.026-41.485 25.414V42.643z"
                fill="#D90751"
              />
              <path
                d="M55.72 25.967l.077 34.39-14.566-8.95V0l14.49 25.967z"
                fill="#FAB718"
              />
              <path
                d="M97.282 34.271l-27.869.026-13.693-8.33L41.231 0l56.05 34.271z"
                fill="#ED6F26"
              />
              <path
                d="M55.797 94.007V77.322l-14.566-8.78.008 51.458 14.558-25.993z"
                fill="#63B22F"
              />
              <path
                d="M69.38 85.737L14.531 52.095 0 26.12l97.223 59.583-27.844.034z"
                fill="#1487C9"
              />
              <path
                d="M41.24 120l14.556-25.993 13.583-8.27 27.843-.034L41.24 120z"
                fill="#017F36"
              />
              <path
                d="M.017 93.863l41.333-25.32-13.896-8.526-12.922 7.922L.017 93.863z"
                fill="#984995"
              />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span>Перевод по СБП</span>
              <span className="text-xs text-muted-foreground font-normal">
                Скоро будет доступно
              </span>
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonWithIcon
          type="button"
          variant="outline"
          shape="pill"
          size="lg"
          onClick={prevStep}
          icon={<ChevronLeft className="h-4 w-4" />}
          iconPosition="start"
        >
          Назад
        </ButtonWithIcon>
        <ButtonWithIcon
          type="button"
          shape="pill"
          onClick={nextStep}
          disabled={!isStepValid}
          size="lg"
          variant="accent"
          icon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
          iconPosition="end"
        >
          Далее
        </ButtonWithIcon>
      </CardFooter>
    </Card>
  );
}
