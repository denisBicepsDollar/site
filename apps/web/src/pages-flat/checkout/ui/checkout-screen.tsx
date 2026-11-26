"use client";

import { useOrderStore } from "@/entities/order";
import {
  OrderSummary,
  PaymentInformation,
  ReviewOrder,
  ShippingInformation,
} from "@/features/checkout";
import { OrderSummaryCard } from "@/widgets/checkout";


export default function CheckoutScreen() {
    const nextStep = useOrderStore(state => state.nextStep);
    const validateStep = useOrderStore(state => state.validateStep);
    const currentStep = useOrderStore(state => state.currentStep);
    console.log('main1', currentStep)
    const orderItems = useOrderStore(state => state.orderItems);
    const isLoading = useOrderStore(state => state.isLoading);
    const selectedPaymentType = useOrderStore(state => state.selectedPaymentType);
    const sameAsShipping = useOrderStore(state => state.sameAsShipping);
    const savePaymentMethod = useOrderStore(state => state.savePaymentMethod);
    const appliedPromo = useOrderStore(state => state.appliedPromo);
    const selectedShipping = useOrderStore(state => state.selectedShipping);
    const shippingAddress = useOrderStore(state => state.shippingAddress);
    const paymentMethod = useOrderStore(state => state.paymentMethod);

    const calculateSummary = useOrderStore(state => state.calculateSummary);
    const handlePaymentChange = useOrderStore(state => state.handlePaymentChange);
    const removePromo = useOrderStore(state => state.removePromo);

    const summary = calculateSummary();


    return (

        <div className="w-full mt-20 mx-auto p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Step 1: Shipping Information */}
                    {
                        currentStep === 1 && (
                            <ShippingInformation/>
                        )
                    }
                    {/* Step 2: Payment Information */}
                    {
                        currentStep === 2 && (
                            <PaymentInformation/>
                        )
                    }
                    {/* Step 3: Review Order */}
                    {
                        currentStep === 3 && (
                            <ReviewOrder/>
                        )
                    }
                    {
                        currentStep === 4 && (
                            <OrderSummary/>
                        )
                    }
                </div>

                {/* Order Summary Sidebar */}
                {
                    currentStep !== 4 && (

                        <div className="flex flex-col gap-4">
                            <OrderSummaryCard/>
                        </div>
                    )}
            </div>
        </div>
    );
}
