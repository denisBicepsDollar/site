"use client";

import { useOrderStore, validateOrderStep } from "@/entities/order";
import { useCartStore } from "@/entities/cart";

export function useCheckoutSteps() {
  const currentStep = useOrderStore((state) => state.currentStep);
  const nextStep = useOrderStore((state) => state.nextStep);
  const prevStep = useOrderStore((state) => state.prevStep);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const selectedShippingPath = useOrderStore(
    (state) => state.selectedShippingPath,
  );
  const selectedPaymentType = useOrderStore(
    (state) => state.selectedPaymentType,
  );
  const agreeToTerms = useOrderStore((state) => state.agreeToTerms);
  const isSubmitting = useOrderStore((state) => state.isSubmitting);
  const cartItems = useCartStore((state) => state.cartItems);

  const validateStep = (step: number) =>
    validateOrderStep(step, {
      shippingAddress,
      selectedShippingPath,
      selectedPaymentType,
      agreeToTerms,
      isSubmitting,
      cartItems,
    });

  return { currentStep, nextStep, prevStep, validateStep };
}
