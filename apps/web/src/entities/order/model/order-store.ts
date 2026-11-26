import { create } from "zustand";
import { createOrder } from "@/shared/api/api";
import { useCartStore } from "@/entities/cart/@x/order";
import { shippingMethodsConfig } from "@/features/checkout/config/const";

export interface ShippingAddressState {
  fullAddress: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  comment: string;
}

export interface DeliveryMetaState {
  tariffId: string | null;
  tariffName: string | null;
  price: number;
}

export interface CreatedOrderItem {
  variantId: string;
  productId: string;
  name: string;
  volume: string;
  price: number;
  quantity: number;
  previewImage: string | null;
  slug: string | null;
}

export interface CreatedOrderRecord {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  deliveryCompany: string | null;
  deliveryType: string | null;
  deliveryPrice: number;
  address: string | null;
  pochtaTariffId: string | null;
  pochtaTariffName: string | null;
  cdekTariffId: string | null;
  cdekTariffName: string | null;
  paymentMethod?: string;
  comment: string | null;
  productsTotal: number;
  totalPrice: number;
  items: CreatedOrderItem[];
}

export interface ShippingConfigNode {
  id: string;
  name: string;
  price?: number;
  description?: string;
  time?: string;
  variants?: ShippingConfigNode[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function resolveShippingLeaf(
  path: string[],
  nodes: ShippingConfigNode[] = shippingMethodsConfig,
): { leaf: ShippingConfigNode | null; trail: ShippingConfigNode[]; isComplete: boolean } {
  if (!Array.isArray(path) || path.length === 0) {
    return { leaf: null, trail: [], isComplete: false };
  }

  let currentList = nodes;
  const trail: ShippingConfigNode[] = [];

  for (const id of path) {
    const found = currentList.find((item) => item.id === id);
    if (!found) {
      return { leaf: null, trail, isComplete: false };
    }
    trail.push(found);
    currentList = found.variants ?? [];
  }

  const last = trail[trail.length - 1] ?? null;
  const hasChildren = Boolean(last?.variants && last.variants.length > 0);
  return {
    leaf: last,
    trail,
    isComplete: Boolean(last) && !hasChildren,
  };
}

interface OrderStore {
  isLoading: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  currentStep: number;
  agreeToTerms: boolean;
  selectedPaymentType: string;
  selectedShippingPath: string[];
  shippingAddress: ShippingAddressState;
  deliveryMeta: DeliveryMetaState;
  createdOrder: CreatedOrderRecord | null;

  setAgreeToTerms: (agree: boolean) => void;
  setSelectedPaymentType: (paymentType: string) => void;
  setSelectedShippingPath: (path: string[]) => void;
  setDeliveryMeta: (meta: Partial<DeliveryMetaState>) => void;
  handleAddressChange: (
    field: keyof ShippingAddressState,
    value: string,
  ) => void;
  validateStep: (step: number) => boolean;
  getStep1ValidationMessage: () => string | null;
  nextStep: () => void;
  prevStep: () => void;
  calculateSummary: () => {
    subtotal: number;
    shipping: number;
    total: number;
  };
  submitOrder: () => Promise<boolean>;
  resetOrderFlow: () => void;
}

const initialAddress: ShippingAddressState = {
  fullAddress: "",
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phone: "",
  city: "",
  postalCode: "",
  comment: "",
};

const initialDeliveryMeta: DeliveryMetaState = {
  tariffId: null,
  tariffName: null,
  price: 0,
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  isSubmitting: false,
  submitError: null,
  currentStep: 1,
  agreeToTerms: false,
  selectedPaymentType: "email_confirmation",
  selectedShippingPath: [],
  shippingAddress: initialAddress,
  deliveryMeta: initialDeliveryMeta,
  createdOrder: null,

  setAgreeToTerms: (agree) => set({ agreeToTerms: agree, submitError: null }),

  setSelectedPaymentType: (paymentType) => {
    if (paymentType !== "email_confirmation") return;
    set({ selectedPaymentType: paymentType, submitError: null });
  },

  setSelectedShippingPath: (path) => {
    const resolved = resolveShippingLeaf(path);
    const leafPrice = resolved.leaf?.price ?? 0;
    const leafName =
      resolved.trail.length > 0
        ? resolved.trail.map((node) => node.name).join(" · ")
        : null;

    set({
      selectedShippingPath: path,
      submitError: null,
      deliveryMeta: {
        tariffId: resolved.isComplete ? resolved.leaf?.id ?? null : null,
        tariffName: resolved.isComplete ? leafName : null,
        price: Number.isFinite(leafPrice) ? Math.max(0, leafPrice) : 0,
      },
    });
  },

  setDeliveryMeta: (meta) =>
    set((state) => ({
      deliveryMeta: { ...state.deliveryMeta, ...meta },
    })),

  handleAddressChange: (field, value) =>
    set((state) => ({
      submitError: null,
      shippingAddress: {
        ...state.shippingAddress,
        [field]: value,
      },
    })),

  getStep1ValidationMessage: () => {
    const { shippingAddress, selectedShippingPath } = get();
    const cartItems = useCartStore.getState().cartItems;
    const availableItems = cartItems.filter(
      (item) => item.stock > 0 && !item.isOutOfStock,
    );
    const hasOutOfStock = cartItems.some(
      (item) => item.stock <= 0 || item.isOutOfStock,
    );

    if (availableItems.length === 0 || hasOutOfStock) {
      return "В корзине есть недоступные товары или она пуста";
    }
    if (!shippingAddress.firstName.trim()) {
      return "Укажите имя получателя";
    }
    if (!shippingAddress.lastName.trim()) {
      return "Укажите фамилию получателя";
    }
    if (shippingAddress.phone.replace(/\D/g, "").length < 10) {
      return "Укажите корректный номер телефона";
    }
    if (!EMAIL_RE.test(shippingAddress.email.trim())) {
      return "Укажите корректный e-mail";
    }

    const shippingResolution = resolveShippingLeaf(selectedShippingPath);
    if (!shippingResolution.isComplete) {
      if (selectedShippingPath[0] === "delivery") {
        if (!selectedShippingPath[1]) {
          return "Выберите службу доставки (Почта России или СДЭК)";
        }
        return "Выберите вариант доставки";
      }
      return "Выберите способ получения заказа";
    }

    if (
      selectedShippingPath[0] === "delivery" &&
      shippingAddress.fullAddress.trim().length < 3
    ) {
      return "Укажите адрес или населённый пункт доставки";
    }

    return null;
  },

  validateStep: (step) => {
    const { selectedPaymentType, agreeToTerms, isSubmitting } = get();

    switch (step) {
      case 1:
        return get().getStep1ValidationMessage() === null;
      case 2:
        return selectedPaymentType === "email_confirmation";
      case 3:
        return (
          !isSubmitting &&
          agreeToTerms &&
          get().validateStep(1) &&
          get().validateStep(2)
        );
      default:
        return false;
    }
  },

  nextStep: () => {
    const { currentStep, validateStep } = get();
    if (validateStep(currentStep)) {
      set({
        currentStep: Math.min(currentStep + 1, 4),
        submitError: null,
      });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    set({
      currentStep: Math.max(currentStep - 1, 1),
      submitError: null,
    });
  },

  calculateSummary: () => {
    const { selectedShippingPath, deliveryMeta } = get();
    const { cartItems } = useCartStore.getState();

    const subtotal = cartItems
      .filter((item) => item.stock > 0 && !item.isOutOfStock)
      .reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

    const shipping =
      selectedShippingPath[0] === "delivery"
        ? Math.max(0, Number(deliveryMeta.price) || 0)
        : 0;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  },

  submitOrder: async () => {
    const state = get();
    if (!state.validateStep(3)) {
      return false;
    }

    const cartStore = useCartStore.getState();
    const availableItems = cartStore.cartItems.filter(
      (item) => item.stock > 0 && !item.isOutOfStock,
    );

    if (availableItems.length === 0) {
      set({ submitError: "Корзина пуста" });
      return false;
    }

    const shippingResolution = resolveShippingLeaf(state.selectedShippingPath);
    const deliveryMethod = state.selectedShippingPath[0] ?? "pickup";
    const deliveryCompany = state.selectedShippingPath[1] ?? null;
    const deliveryType =
      deliveryMethod === "pickup"
        ? "pickup"
        : state.selectedShippingPath[2] ?? deliveryCompany ?? "delivery";

    const summary = state.calculateSummary();

    set({ isSubmitting: true, submitError: null });

    const result = await createOrder({
      customer: {
        firstName: state.shippingAddress.firstName.trim(),
        lastName: state.shippingAddress.lastName.trim(),
        middleName: state.shippingAddress.middleName.trim(),
        email: state.shippingAddress.email.trim(),
        phone: state.shippingAddress.phone.trim(),
        comment: state.shippingAddress.comment.trim(),
      },
      delivery: {
        method: deliveryMethod,
        company: deliveryCompany,
        type: deliveryType,
        tariffId:
          state.deliveryMeta.tariffId ?? shippingResolution.leaf?.id ?? null,
        tariffName:
          state.deliveryMeta.tariffName ??
          shippingResolution.leaf?.name ??
          null,
        address:
          deliveryMethod === "pickup"
            ? "Самовывоз: Брянская обл., Новозыбков"
            : state.shippingAddress.fullAddress.trim(),
        price: summary.shipping,
      },
      payment: {
        method: state.selectedPaymentType,
      },
      items: availableItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.cartQuantity,
      })),
    });

    if (!result.ok) {
      if (result.status === 409) {
        await useCartStore.getState().fetchCartProducts();
      }
      set({
        isSubmitting: false,
        submitError: result.message || "Не удалось оформить заказ",
      });
      return false;
    }

    useCartStore.getState().clearCart();
    set({
      isSubmitting: false,
      submitError: null,
      createdOrder: result.data as CreatedOrderRecord,
      currentStep: 4,
      agreeToTerms: false,
    });
    return true;
  },

  resetOrderFlow: () =>
    set({
      currentStep: 1,
      agreeToTerms: false,
      isSubmitting: false,
      submitError: null,
      createdOrder: null,
      selectedPaymentType: "email_confirmation",
      selectedShippingPath: [],
      shippingAddress: initialAddress,
      deliveryMeta: initialDeliveryMeta,
    }),
}));
