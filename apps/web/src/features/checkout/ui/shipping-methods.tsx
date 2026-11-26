"use client";

import {
  shippingMethodsConfig,
  useOrderStore,
  type ShippingConfigNode,
} from "@/entities/order";
import { DeliveryAddress } from "./delivery-address";
import { RussianPost } from "@/shared/ui/russian-post";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/siteplane/system/utils/cn";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

function ShippingNode({
  item,
  level = 0,
}: {
  item: ShippingConfigNode;
  level?: number;
}) {
  const selectedPath = useOrderStore((state) => state.selectedShippingPath);
  const shippingAddress = useOrderStore((state) => state.shippingAddress);
  const deliveryMeta = useOrderStore((state) => state.deliveryMeta);
  const handleAddressChange = useOrderStore(
    (state) => state.handleAddressChange,
  );
  const setDeliveryMeta = useOrderStore((state) => state.setDeliveryMeta);

  const isSelected = selectedPath[level] === item.id;
  const hasChildren = Boolean(item.variants && item.variants.length > 0);
  const activeRussianPostType =
    selectedPath[2] === "courier" ? "courier" : "pickup_post_office";
  const activeTariffId = selectedPath[3] ?? selectedPath[2];
  const subtitle = [item.time, item.description].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-2">
      <Card
        render={<label htmlFor={item.id} />}
        density="compact"
        className={cn(
          "w-full cursor-pointer transition-[box-shadow]",
          isSelected
            ? "ring-2 ring-forest"
            : "hover:ring-1 hover:ring-forest/30",
        )}
      >
        <CardHeader>
          <CardMedia className="min-h-5">
            <Radio id={item.id} value={item.id} />
          </CardMedia>
          <CardTitle className="text-sm font-medium leading-5">
            {item.name}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-xs">{subtitle}</CardDescription>
          )}
          {item.price !== undefined && (
            <CardAction>
              <span className="text-sm font-semibold whitespace-nowrap text-forest">
                {item.price === 0 ? "Бесплатно" : formatPrice(item.price)}
              </span>
            </CardAction>
          )}
        </CardHeader>
      </Card>

      {item.id === "delivery" && isSelected && <DeliveryAddress />}
      {item.id === "russian_post" && isSelected && (
        <div className="ml-0 sm:ml-6">
          <RussianPost
            selectedType={activeRussianPostType}
            selectedTariffId={activeTariffId}
            cityHint={shippingAddress.city}
            postalCodeHint={shippingAddress.postalCode}
            addressHint={shippingAddress.fullAddress}
            selectedOfficeCode={deliveryMeta.postOfficeCode}
            onSelectAddress={(data) => {
              const parts = [
                data.indexTo,
                data.regionTo,
                data.areaTo,
                data.cityTo,
                data.addressTo,
              ].filter((part): part is string =>
                Boolean(part && String(part).trim()),
              );
              if (parts.length > 0 && data.addressTo) {
                handleAddressChange("fullAddress", parts.join(", "));
              }
              if (data.cityTo) {
                handleAddressChange("city", String(data.cityTo));
              }
              if (data.indexTo) {
                handleAddressChange("postalCode", String(data.indexTo));
              }
              setDeliveryMeta({
                price:
                  typeof data.cashOfDelivery === "number"
                    ? Math.max(0, Math.round(data.cashOfDelivery / 100))
                    : deliveryMeta.price,
                postOfficeCode: data.indexTo ? String(data.indexTo) : null,
                postOfficeAddress: parts.length > 0 ? parts.join(", ") : null,
                estimatedTime:
                  typeof data.estimatedTime === "string"
                    ? data.estimatedTime
                    : deliveryMeta.estimatedTime,
              });
            }}
          />
        </div>
      )}
      {item.id === "cdek" && isSelected && (
        <Card variant="inset" density="compact" className="ml-0 sm:ml-6">
          <CardContent className="text-xs text-muted-foreground">
            Доставка СДЭК по указанному выше адресу или до ближайшего пункта
            выдачи.
          </CardContent>
        </Card>
      )}

      {isSelected && hasChildren && item.variants && (
        <ChildRadioGroup items={item.variants} level={level + 1} />
      )}
    </div>
  );
}

function ChildRadioGroup({
  items,
  level,
}: {
  items: ShippingConfigNode[];
  level: number;
}) {
  const selectedPath = useOrderStore((state) => state.selectedShippingPath);
  const setSelectedPath = useOrderStore(
    (state) => state.setSelectedShippingPath,
  );

  const handleSelect = (value: unknown) => {
    const strValue = String(value);
    const nextPath = selectedPath.slice(0, level);
    nextPath[level] = strValue;
    setSelectedPath(nextPath);
  };

  return (
    <RadioGroup
      value={selectedPath[level] ?? ""}
      onValueChange={handleSelect}
      className="ml-3 sm:ml-6 pl-3 border-l-2 border-forest/15 flex flex-col gap-2"
    >
      {items.map((child) => (
        <ShippingNode key={child.id} item={child} level={level} />
      ))}
    </RadioGroup>
  );
}

export function ShippingMethods() {
  const selectedPath = useOrderStore((state) => state.selectedShippingPath);
  const setSelectedPath = useOrderStore(
    (state) => state.setSelectedShippingPath,
  );

  const handleSelect = (value: unknown) => {
    setSelectedPath([String(value)]);
  };

  return (
    <RadioGroup
      value={selectedPath[0] ?? ""}
      onValueChange={handleSelect}
      className="flex flex-col gap-3"
    >
      {shippingMethodsConfig.map((method) => (
        <ShippingNode key={method.id} item={method} level={0} />
      ))}
    </RadioGroup>
  );
}
