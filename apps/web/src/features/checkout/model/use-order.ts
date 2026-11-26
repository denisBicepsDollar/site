"use client";

import { useOrderStore } from "@/entities/order";

export function useCheckoutSteps() {
  const currentStep = useOrderStore((state) => state.currentStep);
  const nextStep = useOrderStore((state) => state.nextStep);
  const prevStep = useOrderStore((state) => state.prevStep);
  const validateStep = useOrderStore((state) => state.validateStep);

  return { currentStep, nextStep, prevStep, validateStep };
}
