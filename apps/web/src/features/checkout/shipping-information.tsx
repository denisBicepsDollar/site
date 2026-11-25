import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { ArrowRightIcon, Mail, MapPin, Phone, User } from "lucide-react";
import { useCheckoutSteps } from "@/pages-flat/checkout/model/useOrder";
import { useOrderStore } from "@/entities/order/orderStore";
import { ShippingMethods } from "../../widgets/checkout/shipping-methods";
import { Form } from "@/shared/ui/form";
import { Fieldset } from "@/shared/ui/fieldset";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Button, ButtonWithIcon } from "@/shared/ui/button";

export function ShippingInformation() {
  const nextStep = useOrderStore((state) => state.nextStep);
  const validateStep = useOrderStore((state) => state.validateStep);
  const currentStep = useOrderStore((state) => state.currentStep);
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
  const summary = calculateSummary();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <MapPin className="h-5 w-5" />
          Информация о доставке
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form validationMode="onBlur">
          <Fieldset>
            <div className="grid grid-cols-3 gap-3">
              <Field
                labelPlacement="floating"
                name="firstName"
                requiredIndicator
              >
                <FieldLabel>Имя</FieldLabel>
                <Input autoComplete="given-name" required />
                <FieldError match="valueMissing">
                  Enter your first name.
                </FieldError>
              </Field>
              <Field
                labelPlacement="floating"
                name="lastName"
                requiredIndicator
              >
                <FieldLabel>Фамилия</FieldLabel>
                <Input autoComplete="family-name" required />
                <FieldError match="valueMissing">
                  Enter your last name.
                </FieldError>
              </Field>
              <Field
                labelPlacement="floating"
                name="lastName"
                requiredIndicator
              >
                <FieldLabel>Отчество</FieldLabel>
                <Input autoComplete="family-name" />
                <FieldError match="valueMissing">
                  Enter your last name.
                </FieldError>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field labelPlacement="floating" name="phone" requiredIndicator>
                <FieldLabel>Номер телефона</FieldLabel>
                <Input
                  autoComplete="tel"
                  placeholder="+49 123 4567"
                  required
                  type="tel"
                />
                <FieldError match="valueMissing">
                  Enter your phone number.
                </FieldError>
              </Field>
              <Field labelPlacement="floating" name="email">
                <FieldLabel>Эл. Почта</FieldLabel>
                <Input />
              </Field>
            </div>
          </Fieldset>
        </Form>
      </CardContent>

      <Separator />

      <CardContent>
        {/* Shipping Methods */}
        <CardTitle>Как хотите получить заказ</CardTitle>
        <ShippingMethods />
      </CardContent>

      <CardFooter>
        <ButtonWithIcon
          onClick={nextStep}
          disabled={!validateStep(1)}
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
  );
}
