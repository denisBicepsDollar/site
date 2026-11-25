import {create} from 'zustand';
import {useState} from "react";
import {useCartStore} from "@/entities/cart/model/cartStore";

export const useOrderStore = create((set, get) => ({
    isLoading: true,
    currentStep: 1,
    agreeToTerms: false,

    validateStep: (step) => {
        const {
            shippingAddress,
            selectedPaymentType,
            paymentMethod,
            agreeToTerms,
        } = get();

        switch (step) {
            case 1:
                return !!(
                    true
                    // shippingAddress.firstName &&
                    // shippingAddress.lastName &&
                    // shippingAddress.email &&
                    // shippingAddress.address &&
                    // shippingAddress.city &&
                    // shippingAddress.state &&
                    // shippingAddress.zipCode
                );
            case 2:
                return selectedPaymentType === "card"
                    ? !!(
                        paymentMethod.cardNumber &&
                        paymentMethod.expiryMonth &&
                        paymentMethod.expiryYear &&
                        paymentMethod.cvv &&
                        paymentMethod.nameOnCard
                    )
                    : !!selectedPaymentType;
            case 3:
                return agreeToTerms;
            default:
                return false;
        }
    },

    nextStep: () => {
        const {currentStep, validateStep} = get();

        if (validateStep(currentStep)) {
            set({currentStep: Math.min(currentStep + 1, 4)});
        }
    },

    prevStep: () => {
        const {currentStep} = get();
        set({currentStep: Math.max(currentStep - 1, 1)});
    },

    selectedPaymentType: "card",
    sameAsShipping: true,
    savePaymentMethod: false,
    appliedPromo: "SAVE10",
    selectedShippingPath: [],
    shippingAddress: {
        fullAddress: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "RU",
    },
    paymentMethod: {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        nameOnCard: "",
    },

    calculateSummary: () => {
        const {appliedPromo, selectedShipping} = get();
        const {cartItems} = useCartStore.getState();
        const subtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.cartQuantity,
            0
        );
        const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
        const shipping =
            selectedShipping === "standard"
                ? 9.99
                : selectedShipping === "express"
                    ? 19.99
                    : 39.99;
        const tax = (subtotal - discount) * 0.08; // 8% tax
        const total = subtotal + shipping;

        return {
            subtotal,
            discount,
            shipping,
            tax,
            total,
        };
    },

    handleAddressChange: (field, value) => {
        set((state) => ({
            shippingAddress: {
                ...state.shippingAddress,
                [field]: value,
            },
        }))
    },


    handlePaymentChange: (field, value) =>
        set((state) => ({
            paymentMethod: {
                ...state.paymentMethod,
                [field]: value,
            },
        })),

    removePromo: () => set({appliedPromo: ""}),

    setSelectedShippingPath: (path) => set({selectedShippingPath: path}),

}))