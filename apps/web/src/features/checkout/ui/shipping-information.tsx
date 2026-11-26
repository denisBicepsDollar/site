"use client";

import { ArrowRightIcon, MapPin, User } from "lucide-react";
import {
  getStep1ValidationMessage,
  useOrderStore,
  validateOrderStep,
} from "@/entities/order";
import { useCartStore } from "@/entities/cart";
import { ShippingMethods } from "./shipping-methods";
import { Form } from "@/shared/ui/form";
import { Fieldset } from "@/shared/ui/fieldset";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { ButtonWithIcon } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShippingInformation() {
  const nextStep = useOrderStore((state) => state.nextStep);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const selectedShippingPath = useOrderStore(
    (state) => state.selectedShippingPath,
  );
  const selectedPaymentType = useOrderStore(
    (state) => state.selectedPaymentType,
  );
  const agreeToTerms = useOrderStore((state) => state.agreeToTerms);
  const isSubmitting = useOrderStore((state) => state.isSubmitting);
  const cartItems = useCartStore((state) => state.cartItems);
  const handleAddressChange = useOrderStore(
    (state) => state.handleAddressChange,
  );

  const validationHint = getStep1ValidationMessage({
    shippingAddress,
    selectedShippingPath,
    cartItems,
  });
  const isStepValid = validateOrderStep(1, {
    shippingAddress,
    selectedShippingPath,
    selectedPaymentType,
    agreeToTerms,
    isSubmitting,
    cartItems,
  });

  return (
    <div className="flex flex-col gap-6">
      <Card variant="header">
        <CardHeader>
          <CardMedia>
            <User aria-hidden="true" />
          </CardMedia>
          <CardTitle>Информация о доставке</CardTitle>
          <CardDescription>
            Контактные данные получателя для оформления и подтверждения заказа.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            validationMode="onBlur"
            onSubmit={(e) => {
              e.preventDefault();
              if (isStepValid) nextStep();
            }}
          >
            <Fieldset>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field
                  labelPlacement="floating"
                  name="firstName"
                  requiredIndicator
                >
                  <FieldLabel>Имя</FieldLabel>
                  <Input
                    autoComplete="given-name"
                    required
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      handleAddressChange("firstName", e.currentTarget.value)
                    }
                  />
                  <FieldError match="valueMissing">Укажите имя.</FieldError>
                </Field>
                <Field
                  labelPlacement="floating"
                  name="lastName"
                  requiredIndicator
                >
                  <FieldLabel>Фамилия</FieldLabel>
                  <Input
                    autoComplete="family-name"
                    required
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      handleAddressChange("lastName", e.currentTarget.value)
                    }
                  />
                  <FieldError match="valueMissing">Укажите фамилию.</FieldError>
                </Field>
                <Field labelPlacement="floating" name="middleName">
                  <FieldLabel>Отчество</FieldLabel>
                  <Input
                    autoComplete="additional-name"
                    value={shippingAddress.middleName}
                    onChange={(e) =>
                      handleAddressChange("middleName", e.currentTarget.value)
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  labelPlacement="floating"
                  name="phone"
                  requiredIndicator
                  validate={(value) => {
                    const str = String(value ?? "");
                    if (!str.trim()) return null;
                    return str.replace(/\D/g, "").length >= 10
                      ? null
                      : "Укажите не менее 10 цифр номера телефона.";
                  }}
                >
                  <FieldLabel>Номер телефона</FieldLabel>
                  <Input
                    autoComplete="tel"
                    required
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      handleAddressChange("phone", e.currentTarget.value)
                    }
                  />
                  <FieldError match="valueMissing">
                    Укажите номер телефона.
                  </FieldError>
                  <FieldError match="customError">
                    Укажите не менее 10 цифр номера телефона.
                  </FieldError>
                </Field>
                <Field
                  labelPlacement="floating"
                  name="email"
                  requiredIndicator
                  validate={(value) => {
                    const str = String(value ?? "").trim();
                    if (!str) return null;
                    return EMAIL_RE.test(str)
                      ? null
                      : "Укажите корректную почту, например name@example.com.";
                  }}
                >
                  <FieldLabel>Эл. Почта (для подтверждения)</FieldLabel>
                  <Input
                    autoComplete="email"
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) =>
                      handleAddressChange("email", e.currentTarget.value)
                    }
                  />
                  <FieldError match="valueMissing">
                    Укажите электронную почту.
                  </FieldError>
                  <FieldError match="typeMismatch">
                    Некорректный формат электронной почты.
                  </FieldError>
                  <FieldError match="customError">
                    Укажите корректную почту, например name@example.com.
                  </FieldError>
                </Field>
              </div>
              <Field labelPlacement="floating" name="comment">
                <FieldLabel>Комментарий к заказу</FieldLabel>
                <Input
                  value={shippingAddress.comment}
                  onChange={(e) =>
                    handleAddressChange("comment", e.currentTarget.value)
                  }
                />
              </Field>
            </Fieldset>
          </Form>
        </CardContent>
      </Card>

      <Card variant="header">
        <CardHeader>
          <CardMedia>
            <MapPin aria-hidden="true" />
          </CardMedia>
          <CardTitle>Как хотите получить заказ</CardTitle>
          <CardDescription>
            Выберите самовывоз или удобную службу доставки.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ShippingMethods />
        </CardContent>

        <CardFooter className="border-t flex-wrap items-center justify-between gap-3">
          {validationHint && (
            <p className="text-xs text-muted-foreground">{validationHint}</p>
          )}
          <ButtonWithIcon
            type="button"
            onClick={nextStep}
            disabled={!isStepValid}
            className="ml-auto"
            variant="accent"
            size="lg"
            iconPosition="end"
            shape="pill"
            icon={<ArrowRightIcon aria-hidden="true" />}
          >
            К оплате
          </ButtonWithIcon>
        </CardFooter>
      </Card>
    </div>
  );
}
