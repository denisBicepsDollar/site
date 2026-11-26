"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MapPin, Package, Search, Truck } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
  CardTitleMeta,
} from "@/shared/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { cn } from "@/siteplane/system/utils/cn";

export interface RussianPostAddressData {
  indexTo?: string;
  regionTo?: string;
  areaTo?: string;
  cityTo?: string;
  addressTo?: string;
  pvzType?: string;
  cashOfDelivery?: number;
  sumoc?: number;
  schedule?: string;
  estimatedTime?: string;
  [key: string]: unknown;
}

interface RussianPostProps {
  onSelectAddress?: (data: RussianPostAddressData) => void;
  selectedType?: "pickup_post_office" | "courier";
  selectedTariffId?: string;
  cityHint?: string;
  postalCodeHint?: string;
  addressHint?: string;
  selectedOfficeCode?: string | null;
}

interface StubPostOffice {
  indexTo: string;
  regionTo: string;
  cityTo: string;
  addressTo: string;
  schedule: string;
  zoneMarkupRub: number;
  standardDays: string;
  firstClassDays: string;
}

const STUB_POST_OFFICES: StubPostOffice[] = [
  {
    indexTo: "101000",
    regionTo: "г Москва",
    cityTo: "Москва",
    addressTo: "ул Мясницкая, д 26А, стр 1",
    schedule: "Пн–Вс 08:00–22:00",
    zoneMarkupRub: 0,
    standardDays: "3–5 рабочих дней",
    firstClassDays: "1–3 рабочих дня",
  },
  {
    indexTo: "119019",
    regionTo: "г Москва",
    cityTo: "Москва",
    addressTo: "ул Новый Арбат, д 2",
    schedule: "Пн–Сб 09:00–21:00",
    zoneMarkupRub: 0,
    standardDays: "3–5 рабочих дней",
    firstClassDays: "1–3 рабочих дня",
  },
  {
    indexTo: "190000",
    regionTo: "г Санкт-Петербург",
    cityTo: "Санкт-Петербург",
    addressTo: "ул Почтамтская, д 9",
    schedule: "Пн–Вс 08:00–21:00",
    zoneMarkupRub: 40,
    standardDays: "4–6 рабочих дней",
    firstClassDays: "2–3 рабочих дня",
  },
  {
    indexTo: "243020",
    regionTo: "Брянская обл",
    cityTo: "Новозыбков",
    addressTo: "ул Первомайская, д 12",
    schedule: "Пн–Сб 08:00–19:00",
    zoneMarkupRub: -50,
    standardDays: "1–3 рабочих дня",
    firstClassDays: "1–2 рабочих дня",
  },
  {
    indexTo: "420111",
    regionTo: "Респ Татарстан",
    cityTo: "Казань",
    addressTo: "ул Кремлёвская, д 8",
    schedule: "Пн–Сб 08:00–20:00",
    zoneMarkupRub: 60,
    standardDays: "4–7 рабочих дней",
    firstClassDays: "2–4 рабочих дня",
  },
  {
    indexTo: "620014",
    regionTo: "Свердловская обл",
    cityTo: "Екатеринбург",
    addressTo: "пр-кт Ленина, д 39",
    schedule: "Пн–Вс 08:00–20:00",
    zoneMarkupRub: 90,
    standardDays: "5–8 рабочих дней",
    firstClassDays: "3–4 рабочих дня",
  },
  {
    indexTo: "630099",
    regionTo: "Новосибирская обл",
    cityTo: "Новосибирск",
    addressTo: "ул Советская, д 33",
    schedule: "Пн–Сб 08:00–20:00",
    zoneMarkupRub: 130,
    standardDays: "6–9 рабочих дней",
    firstClassDays: "3–5 рабочих дней",
  },
];

function formatRub(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTariffBaseRub(tariffId?: string): number {
  if (tariffId === "first_class") return 490;
  if (tariffId === "courier") return 650;
  return 320;
}

declare global {
  interface Window {
    callbackAddress?: (data: RussianPostAddressData) => void;
    ecomStartWidget?: (config: {
      id: string;
      callbackFunction: (data: RussianPostAddressData) => void;
      containerId: string;
    }) => void;
  }
}

export function RussianPost({
  onSelectAddress,
  selectedType = "pickup_post_office",
  selectedTariffId,
  cityHint,
  postalCodeHint,
  addressHint,
  selectedOfficeCode,
}: RussianPostProps) {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onSelectAddress);
  callbackRef.current = onSelectAddress;

  const widgetId = process.env.NEXT_PUBLIC_POCHTA_WIDGET_ID ?? "";
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedIndex, setLocalSelectedIndex] = useState<string | null>(
    selectedOfficeCode ?? null,
  );
  const [courierApplied, setCourierApplied] = useState(false);

  useEffect(() => {
    if (selectedOfficeCode !== undefined) {
      setLocalSelectedIndex(selectedOfficeCode);
    }
  }, [selectedOfficeCode]);

  useEffect(() => {
    if (!widgetId) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.pochta.ru/map/widget/widget.js";
    script.async = true;

    script.onload = () => {
      window.callbackAddress = (data) => {
        if (callbackRef.current) callbackRef.current(data);
      };

      if (window.ecomStartWidget && widgetRef.current) {
        window.ecomStartWidget({
          id: widgetId,
          callbackFunction: window.callbackAddress,
          containerId: "ecom-widget",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.callbackAddress;
    };
  }, [widgetId]);

  const offices = useMemo(() => {
    const cleanCity = cityHint?.trim();
    const cleanIndex = postalCodeHint?.trim();
    const hasCustomCity =
      Boolean(cleanCity) &&
      !STUB_POST_OFFICES.some(
        (office) => office.cityTo.toLowerCase() === cleanCity!.toLowerCase(),
      );

    if (!hasCustomCity || !cleanCity) {
      return STUB_POST_OFFICES;
    }

    const dynamicOffice: StubPostOffice = {
      indexTo: cleanIndex && /^\d{6}$/.test(cleanIndex) ? cleanIndex : "140000",
      regionTo: cleanCity,
      cityTo: cleanCity,
      addressTo: "Центральное отделение почтовой связи (ОПС №1)",
      schedule: "Пн–Сб 08:00–20:00",
      zoneMarkupRub: 50,
      standardDays: "5–7 рабочих дней",
      firstClassDays: "2–4 рабочих дня",
    };

    return [dynamicOffice, ...STUB_POST_OFFICES];
  }, [cityHint, postalCodeHint]);

  const filteredOffices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return offices;
    return offices.filter(
      (office) =>
        office.cityTo.toLowerCase().includes(q) ||
        office.regionTo.toLowerCase().includes(q) ||
        office.indexTo.toLowerCase().includes(q) ||
        office.addressTo.toLowerCase().includes(q),
    );
  }, [offices, searchQuery]);

  if (widgetId) {
    return <div id="ecom-widget" ref={widgetRef} style={{ height: 500 }} />;
  }

  const basePriceRub = getTariffBaseRub(selectedTariffId);

  const handleSelectOffice = (office: StubPostOffice) => {
    const computedPrice = Math.max(190, basePriceRub + office.zoneMarkupRub);
    const estimatedTime =
      selectedTariffId === "first_class"
        ? office.firstClassDays
        : office.standardDays;

    setLocalSelectedIndex(office.indexTo);
    setCourierApplied(false);

    callbackRef.current?.({
      indexTo: office.indexTo,
      regionTo: office.regionTo,
      cityTo: office.cityTo,
      addressTo: `ОПС ${office.indexTo}, ${office.addressTo}`,
      pvzType: "russian_post",
      cashOfDelivery: computedPrice * 100,
      schedule: office.schedule,
      estimatedTime,
    });
  };

  if (selectedType === "courier") {
    const cleanCity = cityHint?.trim() || "Москва";
    const remoteCity = /новосибир|екатерин|владивосток|краснояр|хабаров/i.test(
      cleanCity,
    );
    const courierPrice = remoteCity ? basePriceRub + 140 : basePriceRub;
    const hasAddress = Boolean(addressHint && addressHint.trim().length >= 3);

    return (
      <Card data-testid="russian-post-stub" variant="inset" className="mt-3">
        <CardHeader>
          <CardMedia>
            <Truck aria-hidden="true" />
          </CardMedia>
          <CardTitle className="text-sm font-semibold">
            Курьер Почты России (предварительный расчёт)
          </CardTitle>
          <CardDescription className="text-xs">
            {hasAddress
              ? `Доставка до двери по адресу: ${addressHint}.`
              : "Введите адрес в поле выше или используйте расчёт по умолчанию."}
          </CardDescription>
          <CardAction>
            <Badge size="sm" variant="outline">
              Демо-режим
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Card density="compact">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                {formatRub(courierPrice)} · 2–5 рабочих дней
              </CardTitle>
              <CardDescription className="text-xs">
                Предварительный тариф курьерской службы Почты России
              </CardDescription>
              <CardAction>
                <Button
                  type="button"
                  size="sm"
                  variant={courierApplied ? "outline" : "accent"}
                  onClick={() => {
                    setCourierApplied(true);
                    callbackRef.current?.({
                      indexTo:
                        postalCodeHint || (!hasAddress ? "101000" : undefined),
                      regionTo: !hasAddress ? "г Москва" : undefined,
                      cityTo: cityHint || (!hasAddress ? "Москва" : undefined),
                      addressTo: hasAddress ? undefined : "ул Тверская, д 1",
                      pvzType: "russian_post_courier",
                      cashOfDelivery: courierPrice * 100,
                      estimatedTime: "2–5 рабочих дней",
                    });
                  }}
                >
                  {courierApplied ? "Тариф применён" : "Применить расчёт"}
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="russian-post-stub" variant="inset" className="mt-3">
      <CardHeader>
        <CardMedia>
          <Package aria-hidden="true" />
        </CardMedia>
        <CardTitle className="text-sm font-semibold">
          Выбор отделения Почты России
        </CardTitle>
        <CardDescription className="text-xs">
          Выберите отделение из списка ниже — индекс, адрес и предварительная
          стоимость подставятся в заказ автоматически.
        </CardDescription>
        <CardAction>
          <Badge size="sm" variant="outline">
            Демо-виджет
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Поиск отделения Почты России"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder="Поиск по городу, индексу или улице..."
          />
        </InputGroup>

        {filteredOffices.length === 0 ? (
          <Card density="compact" variant="subtle">
            <CardContent className="text-center text-xs text-muted-foreground">
              Отделения по запросу «{searchQuery}» не найдены. Очистите поиск
              или введите адрес вручную в поле выше.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto p-0.5">
            {filteredOffices.map((office) => {
              const isSelected = localSelectedIndex === office.indexTo;
              const computedPrice = Math.max(
                190,
                basePriceRub + office.zoneMarkupRub,
              );
              const estimatedTime =
                selectedTariffId === "first_class"
                  ? office.firstClassDays
                  : office.standardDays;

              return (
                <Card
                  key={`${office.indexTo}-${office.cityTo}`}
                  render={
                    <button
                      type="button"
                      onClick={() => handleSelectOffice(office)}
                      aria-pressed={isSelected}
                    />
                  }
                  density="compact"
                  className={cn(
                    "w-full text-left cursor-pointer transition-[box-shadow]",
                    isSelected
                      ? "ring-2 ring-forest"
                      : "hover:ring-1 hover:ring-forest/30",
                  )}
                >
                  <CardHeader>
                    <CardMedia className="min-h-5">
                      <MapPin aria-hidden="true" />
                    </CardMedia>
                    <CardTitle className="text-sm font-medium leading-5">
                      <span>ОПС {office.indexTo}</span>
                      <CardTitleMeta>{office.cityTo}</CardTitleMeta>
                      {isSelected && (
                        <Badge size="sm" variant="accent" className="gap-1">
                          <Check className="size-3" aria-hidden="true" />
                          Выбрано
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {office.addressTo} · {office.schedule} · {estimatedTime}
                    </CardDescription>
                    <CardAction>
                      <span className="text-sm font-semibold whitespace-nowrap text-forest">
                        {formatRub(computedPrice)}
                      </span>
                    </CardAction>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
