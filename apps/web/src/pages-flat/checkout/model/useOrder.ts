import {useState} from "react";
import {useCartStore} from "@/entities/cart/model/cartStore";
import {useOrderStore} from "@/entities/order/orderStore";

export function useCheckoutSteps() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const shippingAddress = useOrderStore(state => state.shippingAddress);
    const paymentMethod = useOrderStore(state => state.paymentMethod);
    const selectedPaymentType = useOrderStore(state => state.selectedPaymentType);
    console.log(currentStep);

    const validateStep = (step) => {
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
    };
    console.log(validateStep(1));

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return {currentStep, nextStep, prevStep, validateStep};
}
