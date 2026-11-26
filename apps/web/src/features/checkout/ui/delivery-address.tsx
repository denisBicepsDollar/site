"use client";

import { useEffect, useRef, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import type { DaDataAddress, DaDataSuggestion } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { useOrderStore } from "@/entities/order";
import { Field, FieldLabel } from "@/shared/ui/field";

const DADATA_TOKEN =
  process.env.NEXT_PUBLIC_DADATA_TOKEN ??
  "1c7e7688522344e4a329ef6d21221a321e230ff1";

export function DeliveryAddress() {
  const suggestionsRef = useRef<AddressSuggestions | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<
    DaDataSuggestion<DaDataAddress> | undefined
  >(undefined);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const handleAddressChange = useOrderStore(
    (state) => state.handleAddressChange,
  );

  // Keep DaData input synced if address changes externally (e.g. RussianPost widget or reset)
  useEffect(() => {
    const instance = suggestionsRef.current;
    if (!instance) return;
    if (instance.state.query !== shippingAddress.fullAddress) {
      instance.setInputValue(shippingAddress.fullAddress);
    }
  }, [shippingAddress.fullAddress]);

  return (
    <Field className="mt-3">
      <FieldLabel htmlFor="address">
        Введите населённый пункт и адрес доставки
        <span className="destructive">*</span>
      </FieldLabel>

      <AddressSuggestions
        ref={suggestionsRef}
        token={DADATA_TOKEN}
        value={selectedSuggestion}
        defaultQuery={shippingAddress.fullAddress}
        inputProps={{
          id: "address",
          name: "address",
          required: true,
          placeholder: "Например: Москва, ул. Тверская, д. 1",
          onChange: (event) => {
            setSelectedSuggestion(undefined);
            handleAddressChange("fullAddress", event.currentTarget.value);
          },
        }}
        onChange={(suggestion) => {
          setSelectedSuggestion(suggestion);
          if (suggestion?.value) {
            handleAddressChange("fullAddress", suggestion.value);
          }
          if (suggestion?.data?.city || suggestion?.data?.settlement) {
            handleAddressChange(
              "city",
              suggestion.data.city || suggestion.data.settlement || "",
            );
          }
          if (suggestion?.data?.postal_code) {
            handleAddressChange("postalCode", suggestion.data.postal_code);
          }
        }}
      />
    </Field>
  );
}
