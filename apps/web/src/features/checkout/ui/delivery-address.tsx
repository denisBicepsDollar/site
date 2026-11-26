"use client";

import { useEffect, useRef, useState } from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import "./delivery-address.css";
import { useOrderStore } from "@/entities/order";
import { Field, FieldLabel } from "@/shared/ui/field";

const DADATA_TOKEN =
  process.env.NEXT_PUBLIC_DADATA_TOKEN ??
  "1c7e7688522344e4a329ef6d21221a321e230ff1";

export function DeliveryAddress() {
  const suggestionsRef = useRef<AddressSuggestions | null>(null);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const handleAddressChange = useOrderStore(
    (state) => state.handleAddressChange,
  );
  const lastSyncedAddressRef = useRef(shippingAddress.fullAddress);
  const [touched, setTouched] = useState(false);

  // Sync input only when address changed externally (e.g. RussianPost stub or order reset)
  useEffect(() => {
    if (shippingAddress.fullAddress === lastSyncedAddressRef.current) {
      return;
    }
    lastSyncedAddressRef.current = shippingAddress.fullAddress;
    const instance = suggestionsRef.current;
    if (instance && instance.state.query !== shippingAddress.fullAddress) {
      instance.setInputValue(shippingAddress.fullAddress);
    }
  }, [shippingAddress.fullAddress]);

  const showAddressError =
    touched && shippingAddress.fullAddress.trim().length < 3;

  return (
    <Field className="mt-3 w-full">
      <FieldLabel htmlFor="address">
        Введите населённый пункт и адрес доставки
        <span className="destructive">*</span>
      </FieldLabel>

      <div
        className="sp-dadata-field"
        data-invalid={showAddressError ? "true" : undefined}
      >
        <AddressSuggestions
          ref={suggestionsRef}
          token={DADATA_TOKEN}
          defaultQuery={shippingAddress.fullAddress}
          inputProps={{
            id: "address",
            name: "address",
            required: true,
            autoComplete: "street-address",
            placeholder: "Например: г Москва, ул Тверская, д 1",
            "aria-invalid": showAddressError || undefined,
            onBlur: () => setTouched(true),
            onChange: (event) => {
              const nextValue = event.currentTarget.value;
              lastSyncedAddressRef.current = nextValue;
              handleAddressChange("fullAddress", nextValue);
            },
          }}
          onChange={(suggestion) => {
            const nextValue = suggestion?.value ?? "";
            lastSyncedAddressRef.current = nextValue;
            if (nextValue) {
              handleAddressChange("fullAddress", nextValue);
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
      </div>

      {showAddressError && (
        <p className="text-xs text-destructive-foreground">
          Укажите полный адрес доставки (минимум 3 символа) или выберите подсказку.
        </p>
      )}
    </Field>
  );
}
