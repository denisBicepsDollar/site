import {
  Building2,
  ChevronLeft,
  Clock,
  CreditCard,
  Lock,
  Smartphone,
  User,
  Wallet,
} from "lucide-react";

import { cn } from "@site/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@site/ui/select";
import { Checkbox } from "@site/ui/checkbox";

import { useCheckoutSteps } from "@/pages-flat/checkout/model/useOrder";
import { useOrderStore } from "@/entities/order/orderStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button, ButtonWithIcon } from "@/shared/ui/button";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";

export function PaymentInformation() {
  const nextStep = useOrderStore((state) => state.nextStep);
  const prevStep = useOrderStore((state) => state.prevStep);
  const validateStep = useOrderStore((state) => state.validateStep);

  const orderItems = useOrderStore((state) => state.orderItems);
  const isLoading = useOrderStore((state) => state.isLoading);
  const selectedPaymentType = useOrderStore(
    (state) => state.selectedPaymentType,
  );
  const sameAsShipping = useOrderStore((state) => state.sameAsShipping);
  const savePaymentMethod = useOrderStore((state) => state.savePaymentMethod);
  const appliedPromo = useOrderStore((state) => state.appliedPromo);
  const selectedShipping = useOrderStore((state) => state.selectedShipping);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);

  const calculateSummary = useOrderStore((state) => state.calculateSummary);
  const handlePaymentChange = useOrderStore(
    (state) => state.handlePaymentChange,
  );
  const removePromo = useOrderStore((state) => state.removePromo);

  const summary = calculateSummary();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Оплата
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Payment Method Selection */}
        <CardTitle className="text-base font-medium">
          Выберите способ оплаты:
        </CardTitle>
        <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Credit/Debit Card */}
          <Label variant="card">
            <Radio value="t" />
            <svg
              className="w-5 h-5"
              viewBox="0 0 97 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            Перевод по СБП
          </Label>

          {/* Bank Transfer */}
          {/*<button
              type="button"
              onClick={() => setSelectedPaymentType("bank-transfer")}
              className={cn(
                  "flex items-center gap-3 p-4 border-2 rounded-ele transition-colors text-left",
                  selectedPaymentType === "bank-transfer"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
              )}
          >
              <Building2 className="h-5 w-5 text-blue-800"/>
              <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-xs text-muted-foreground">
                      Direct bank payment
                  </div>
              </div>
          </button>*/}
        </RadioGroup>

        {/* Credit Card Form - Only show when card is selected */}
        {/*{selectedPaymentType === "card" && (
          <div className="flex flex-col gap-4 border-t pt-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameOnCard">Name on Card *</Label>{" "}
              <Input
                id="nameOnCard"
                size="lg"
                placeholder="John Doe"
                value={paymentMethod.nameOnCard}
                onChange={(e) =>
                  handlePaymentChange("nameOnCard", e.target.value)
                }
                leftIcon={<User className="h-4 w-4" />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cardNumber">Card Number *</Label>{" "}
              <Input
                id="cardNumber"
                size="lg"
                placeholder="1234 5678 9012 3456"
                value={paymentMethod.cardNumber}
                onChange={(e) =>
                  handlePaymentChange("cardNumber", e.target.value)
                }
                leftIcon={<CreditCard className="h-4 w-4" />}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expiryMonth">Month *</Label>
                <Select
                  value={paymentMethod.expiryMonth}
                  onValueChange={(value) =>
                    handlePaymentChange("expiryMonth", value)
                  }
                >
                  <SelectTrigger className="text-sm" size={"lg"}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="expiryYear">Year *</Label>
                <Select
                  value={paymentMethod.expiryYear}
                  onValueChange={(value) =>
                    handlePaymentChange("expiryYear", value)
                  }
                >
                  <SelectTrigger className="text-sm" size={"lg"}>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={2024 + i} value={String(2024 + i)}>
                        {2024 + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cvv">CVV *</Label>{" "}
                <Input
                  id="cvv"
                  size="lg"
                  placeholder="123"
                  maxLength={4}
                  value={paymentMethod.cvv}
                  onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        )}*/}
      </CardContent>{" "}
      <CardFooter className="flex justify-between">
        <ButtonWithIcon
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
          shape="pill"
          onClick={nextStep}
          disabled={!validateStep(2)}
          size="lg"
          variant="accent"
        >
          Далее
        </ButtonWithIcon>
      </CardFooter>
    </Card>
  );
}
