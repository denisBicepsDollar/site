"use client";

import { ChevronLeft, ChevronRight, CreditCard, Mail } from "lucide-react";
import { useOrderStore, validateOrderStep } from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import { Badge } from "@/shared/ui/badge";
import { ButtonWithIcon } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import { cn } from "@/siteplane/system/utils/cn";

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
    <Card variant="header">
      <CardHeader>
        <CardMedia>
          <CreditCard aria-hidden="true" />
        </CardMedia>
        <CardTitle>Оплата</CardTitle>
        <CardDescription>Выберите способ оплаты заказа.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          value={selectedPaymentType}
          onValueChange={(value) => setSelectedPaymentType(String(value))}
          className="grid grid-cols-1 gap-3"
        >
          <Card
            render={<label htmlFor="payment-email" />}
            density="compact"
            className={cn(
              "w-full cursor-pointer transition-[box-shadow]",
              selectedPaymentType === "email_confirmation"
                ? "ring-2 ring-forest"
                : "hover:ring-1 hover:ring-forest/30",
            )}
          >
            <CardHeader>
              <CardMedia className="min-h-5">
                <Radio id="payment-email" value="email_confirmation" />
              </CardMedia>
              <CardTitle className="text-sm font-medium leading-5">
                Оплата после подтверждения
              </CardTitle>
              <CardDescription className="text-xs">
                На указанную почту
                {shippingAddress.email ? ` (${shippingAddress.email})` : ""}{" "}
                придёт письмо с подтверждением оформления заказа и деталями
                оплаты.
              </CardDescription>
              <CardAction>
                <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              </CardAction>
            </CardHeader>
          </Card>

          <Card
            render={<label htmlFor="payment-sbp" />}
            density="compact"
            className={cn(
              "w-full cursor-not-allowed opacity-60",
              selectedPaymentType === "sbp" && "ring-2 ring-forest",
            )}
          >
            <CardHeader>
              <CardMedia className="min-h-5">
                <Radio id="payment-sbp" value="sbp" disabled />
              </CardMedia>
              <CardTitle className="text-sm font-medium leading-5">
                Перевод по СБП
              </CardTitle>
              <CardDescription className="text-xs">
                Скоро будет доступно
              </CardDescription>
              <CardAction className="items-center gap-2">
                <Badge size="sm" variant="secondary">
                  Скоро
                </Badge>
                <svg
                  className="size-5 shrink-0"
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
              </CardAction>
            </CardHeader>
          </Card>
        </RadioGroup>
      </CardContent>

      <CardFooter className="border-t justify-between gap-4">
        <ButtonWithIcon
          type="button"
          variant="outline"
          shape="pill"
          size="lg"
          onClick={prevStep}
          icon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />}
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
