import { Percent, ShoppingBag, X } from "lucide-react";
import { useCheckoutSteps } from "@/pages-flat/checkout/model/useOrder";
import { useOrderStore } from "@/entities/order/orderStore";
import { useCartStore } from "@/entities/cart/model/cartStore";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export function OrderSummaryCard() {
  const { currentStep, nextStep, prevStep, validateStep } = useCheckoutSteps();
  const initCart = useCartStore((state) => state.initCart);
  const cartItems = useCartStore((state) => state.cartItems);
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
  console.log(summary);
  console.log(cartItems);
  return (
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Сводка заказа
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Order Items */}
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={item.previewImage}
                  alt={`${item.productName}-${item.name}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <Badge
                  size="sm"
                  className="absolute -top-1 -right-1 text-xs min-w-5 h-5 flex items-center justify-center"
                >
                  {item.cartQuantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.productName} {item.name}
                </p>
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{item.price} ₽</span>
                  {item.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {item.price} ₽
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold">
                {(item.price * item.cartQuantity).toFixed(2)} ₽
              </div>
            </div>
          ))}
        </div>
        {/* Applied Promo */}
        {/*{appliedPromo && (*/}
        {/*    <div*/}
        {/*        className="flex items-center justify-between p-3 bg-green-50 rounded-ele border border-green-200">*/}
        {/*        <div className="flex items-center gap-2">*/}
        {/*            <Percent className="h-4 w-4 text-green-600"/>*/}
        {/*            <span className="text-sm font-medium text-green-800">*/}
        {/*                {appliedPromo}*/}
        {/*            </span>*/}
        {/*        </div>*/}
        {/*        <Button*/}
        {/*            variant="ghost"*/}
        {/*            size="sm"*/}
        {/*            onClick={removePromo}*/}
        {/*            className="h-6 w-6 p-0 text-green-600 hover:text-green-800"*/}
        {/*        >*/}
        {/*            <X className="h-3 w-3"/>*/}
        {/*        </Button>*/}
        {/*    </div>*/}
        {/* Pricing Breakdown */}
        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Промежуточный итог</span>
            <span>{summary.subtotal.toFixed(2)} ₽</span>
          </div>
          {/*{summary.discount > 0 && (*/}
          {/*    <div className="flex justify-between text-sm text-green-600">*/}
          {/*        <span>Discount</span>*/}
          {/*        <span>-${summary.discount.toFixed(2)}</span>*/}
          {/*    </div>*/}
          {/*)}*/}
          <div className="flex justify-between text-sm">
            <span>Доставка</span>
            <span>{summary.shipping.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Итого</span>
            <span>{summary.total.toFixed(2)} ₽</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
