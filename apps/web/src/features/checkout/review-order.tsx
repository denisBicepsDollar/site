import {Card, CardContent, CardFooter, CardHeader} from "@site/ui/card";
import {Building2, Check, ChevronLeft, Clock, Lock, Smartphone, Wallet} from "lucide-react";
import {Checkbox} from "@site/ui/checkbox";
import {Label} from "@site/ui/label";
import {Button} from "@site/ui/button";
import {useCheckoutSteps} from "@/pages-flat/checkout/model/useOrder";
import {useOrderStore} from "@/entities/order/orderStore";

export function ReviewOrder() {
    const {currentStep, nextStep, prevStep, validateStep} = useCheckoutSteps();
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
        <Card className="flex flex-col gap-6">
            <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Check className="h-5 w-5"/>
                    Review Your Order
                </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {/* Shipping Address Review */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Shipping Address</h3>
                    <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                        <p>
                            {shippingAddress.firstName} {shippingAddress.lastName}
                        </p>
                        <p>{shippingAddress.address}</p>
                        <p>
                            {shippingAddress.city}, {shippingAddress.state}{" "}
                            {shippingAddress.zipCode}
                        </p>
                        <p>{shippingAddress.email}</p>
                    </div>
                </div>
                {" "}
                {/* Payment Method Review */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Payment Method</h3>
                    <div className="text-sm text-muted-foreground p-3 bg-accent rounded-ele">
                        {selectedPaymentType === "card" && (
                            <>
                                <p>
                                    **** **** **** {paymentMethod.cardNumber.slice(-4)}
                                </p>
                                <p>{paymentMethod.nameOnCard}</p>
                            </>
                        )}
                        {selectedPaymentType === "paypal" && (
                            <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-blue-600"/>
                                <span>PayPal</span>
                            </div>
                        )}
                        {selectedPaymentType === "apple-pay" && (
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-gray-800"/>
                                <span>Apple Pay</span>
                            </div>
                        )}
                        {selectedPaymentType === "google-pay" && (
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-green-600"/>
                                <span>Google Pay</span>
                            </div>
                        )}
                        {selectedPaymentType === "bank-transfer" && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-800"/>
                                <span>Bank Transfer</span>
                            </div>
                        )}
                        {selectedPaymentType === "bnpl" && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600"/>
                                <span>
                        Buy Now Pay Later (4 payments of $
                                    {(summary.total / 4).toFixed(2)})
                      </span>
                            </div>
                        )}
                    </div>
                </div>
                {" "}
                {/* Terms and Conditions */}
                <div className="flex items-start gap-2 border-t pt-4">
                    <Checkbox
                        id="agreeTerms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) =>
                            setAgreeToTerms(checked === true)
                        }
                    />
                    <Label
                        htmlFor="agreeTerms"
                        className="text-sm leading-relaxed"
                    >
                        I agree to the{" "}
                        <Button variant="link" className="p-0 h-auto text-sm">
                            Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="p-0 h-auto text-sm">
                            Privacy Policy
                        </Button>
                    </Label>
                </div>
            </CardContent>{" "}
            <CardFooter className="flex justify-between">
                {" "}
                <Button
                    variant="outline"
                    size="lg"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4"/>
                    Back
                </Button>{" "}
                <Button
                    disabled={!validateStep(3)}
                    onClick={nextStep()}

                    size="lg"
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                    <Lock className="h-4 w-4"/>
                    Complete Order ${summary.total.toFixed(2)}
                </Button>
            </CardFooter>
        </Card>
    )
}