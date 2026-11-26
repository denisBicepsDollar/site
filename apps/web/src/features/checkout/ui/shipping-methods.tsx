"use client";

import {
  shippingMethodsConfig,
  useOrderStore,
  type ShippingConfigNode,
} from "@/entities/order";
import { DeliveryAddress } from "./delivery-address";
import { RussianPost } from "@/shared/ui/russian-post";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";

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

  return (
    <div>
      <Label variant="card">
        <Radio id={item.id} value={item.id} />
        {item.name}
        {item.time && (
          <span className="text-sm text-muted-foreground">{item.time}</span>
        )}
        {item.description && (
          <span className="text-sm text-muted-foreground">
            {item.description}
          </span>
        )}
        {item.price !== undefined && (
          <span className="font-semibold">
            {item.price === 0 ? "Бесплатно" : formatPrice(item.price)}
          </span>
        )}
      </Label>

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
        <p className="ml-0 sm:ml-6 mt-2 text-xs text-muted-foreground">
          Доставка СДЭК по указанному выше адресу или до ближайшего пункта выдачи.
        </p>
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
      className="ml-4 sm:ml-6 mt-2 flex flex-col gap-3"
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
