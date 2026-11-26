"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MapPin, Package, Search, Truck } from "lucide-react";
import { Button } from "@/shared/ui/button";

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
      <div
        data-testid="russian-post-stub"
        className="mt-3 rounded-xl border border-forest/15 bg-parchment/40 p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-forest">
            <Truck className="size-4 text-clay" aria-hidden="true" />
            Курьер Почты России (предварительный расчёт)
          </div>
          <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-forest/80 border border-forest/15">
            Демо-режим
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasAddress
            ? `Доставка до двери по адресу: ${addressHint}.`
            : "Введите адрес в поле выше или используйте расчёт по умолчанию."}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3 border border-forest/10">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              {formatRub(courierPrice)} · 2–5 рабочих дней
            </p>
            <p className="text-xs text-muted-foreground">
              Предварительный тариф курьерской службы Почты России
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={courierApplied ? "outline" : "accent"}
            onClick={() => {
              setCourierApplied(true);
              callbackRef.current?.({
                indexTo: postalCodeHint || (!hasAddress ? "101000" : undefined),
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
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="russian-post-stub"
      className="mt-3 rounded-xl border border-forest/15 bg-parchment/40 p-4 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-forest">
          <Package className="size-4 text-clay" aria-hidden="true" />
          Выбор отделения Почты России
        </div>
        <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-forest/80 border border-forest/15">
          Демо-виджет
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Выберите отделение из списка ниже — индекс, адрес и предварительная
        стоимость подставятся в заказ автоматически.
      </p>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Поиск отделения Почты России"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder="Поиск по городу, индексу или улице..."
          className="h-10 w-full rounded-lg border border-forest/15 bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-forest focus:outline-none"
        />
      </div>

      {filteredOffices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-forest/20 bg-white/70 p-4 text-center text-xs text-muted-foreground">
          Отделения по запросу «{searchQuery}» не найдены. Очистите поиск или
          введите адрес вручную в поле выше.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
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
              <button
                key={`${office.indexTo}-${office.cityTo}`}
                type="button"
                onClick={() => handleSelectOffice(office)}
                aria-pressed={isSelected}
                className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-forest bg-white shadow-sm ring-1 ring-forest"
                    : "border-forest/12 bg-white/85 hover:border-forest/35 hover:bg-white"
                }`}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                      <MapPin className="size-3.5 text-clay" aria-hidden="true" />
                      ОПС {office.indexTo}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {office.cityTo}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 text-[10px] font-semibold text-cream">
                        <Check className="size-3" aria-hidden="true" />
                        Выбрано
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/85">{office.addressTo}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {office.schedule} · {estimatedTime}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold text-forest">
                    {formatRub(computedPrice)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
