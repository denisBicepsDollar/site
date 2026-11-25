import { useOrderStore } from "../../../entities/order/orderStore";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { useState } from "react";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

export function DeliveryAddress() {
  const [value, setValue] = useState();

  const sameAsShipping = useOrderStore((state) => state.sameAsShipping);
  const savePaymentMethod = useOrderStore((state) => state.savePaymentMethod);
  const appliedPromo = useOrderStore((state) => state.appliedPromo);
  const selectedShipping = useOrderStore((state) => state.selectedShipping);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const setSelectedShipping = useOrderStore(
    (state) => state.setSelectedShipping,
  );

  const calculateSummary = useOrderStore((state) => state.calculateSummary);
  const handleAddressChange = useOrderStore(
    (state) => state.handleAddressChange,
  );
  const handlePaymentChange = useOrderStore(
    (state) => state.handlePaymentChange,
  );
  const removePromo = useOrderStore((state) => state.removePromo);
  console.log(shippingAddress);
  const summary = calculateSummary();
  return (
    <Field>
      <FieldLabel htmlFor="address">
        Для расчёта стоимости доставки введите название вашего населённого
        пункта.<span className="destructive">*</span>
      </FieldLabel>

      <AddressSuggestions
        token={"1c7e7688522344e4a329ef6d21221a321e230ff1"}
        value={shippingAddress.fullAddress}
        onChange={({ value }) => handleAddressChange("fullAddress", value)}
      />
    </Field>
  );
}
