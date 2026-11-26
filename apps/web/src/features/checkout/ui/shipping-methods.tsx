"use client";

import { shippingMethodsConfig } from "../config/const";
import { RadioGroupItem } from "@site/ui/radio-group";
import { useOrderStore } from "@/entities/order";
import { DeliveryAddress } from "./delivery-address";
import { RussianPost } from "@/shared/ui/russian-post";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label/label";

function ShippingNode({ item, level = 0 }) {
  const selectedPath = useOrderStore((state) => state.selectedShippingPath);
  const setSelectedPath = useOrderStore(
    (state) => state.setSelectedShippingPath,
  );

  const isSelected = selectedPath[level] === item.id;
  const hasChildren = item.variants && item.variants.length > 0;

  // Больше НЕ оборачиваем в RadioGroup здесь!
  // Radio принадлежит группе родителя.

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
          <span className="font-semibold">${item.price}</span>
        )}
      </Label>

      {item.id === "delivery" && isSelected && <DeliveryAddress />}
      {item.id === "russian_post" && isSelected && (
        <div className="ml-6">
          <RussianPost />
        </div>
      )}
      {item.id === "cdek" && isSelected && (
        <div className="ml-6">cdek widget</div>
      )}

      {/* Подварианты — отдельная группа на level+1 */}
      {isSelected && hasChildren && (
        <ChildRadioGroup items={item.variants} level={level + 1} />
      )}
    </div>
  );
}

/** Отдельный компонент, чтобы RadioGroup был только вокруг детей */
function ChildRadioGroup({ items, level }: { items: any[]; level: number }) {
  const selectedPath = useOrderStore((state) => state.selectedShippingPath);
  const setSelectedPath = useOrderStore(
    (state) => state.setSelectedShippingPath,
  );

  const handleSelect = (value: string) => {
    const nextPath = selectedPath.slice(0, level);
    nextPath[level] = value;
    setSelectedPath(nextPath);
  };

  return (
    <RadioGroup
      value={selectedPath[level] ?? ""}
      onValueChange={handleSelect}
      className="ml-6 flex flex-col gap-3"
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

  const handleSelect = (value: string) => {
    // Сбрасываем вложенные выборы при смене метода верхнего уровня
    setSelectedPath([value]);
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
