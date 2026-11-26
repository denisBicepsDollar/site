"use client";

import { useEffect, useState } from "react";
import { Field, FieldItem, FieldLabel } from "@/shared/ui/field";
import { Fieldset } from "@/shared/ui/fieldset";
import { Input } from "@/shared/ui/input";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/shared/ui/sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProductsCatalog } from "../model/use-products-store";

export function SidebarGroupPrice() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { prices } = useProductsCatalog();
  // Базовые границы цен из бэкенда (meta)
  const metaMin = prices?.minPrice ?? 0;
  const metaMax = prices?.maxPrice ?? 0;

  const urlMin = searchParams.get("minPrice");
  const urlMax = searchParams.get("maxPrice");

  // Локальный стейт для инпутов: если в URL ничего нет, подставляем значения из meta
  const [minVal, setMinVal] = useState<string>(urlMin ?? String(metaMin || ""));
  const [maxVal, setMaxVal] = useState<string>(urlMax ?? String(metaMax || ""));

  // Когда meta загрузилась с бэка или изменился URL — обновляем значения в инпутах
  useEffect(() => {
    setMinVal(urlMin ?? (metaMin ? String(metaMin) : ""));
    setMaxVal(urlMax ?? (metaMax ? String(metaMax) : ""));
  }, [urlMin, urlMax, metaMin, metaMax]);

  // Запись в URL (если число совпадает с границей из meta, не засоряем URL лишним параметром)
  const updateUrlPrices = (newMin: string, newMax: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    const numMin = Number(newMin);
    const numMax = Number(newMax);

    if (newMin !== "" && numMin !== metaMin) {
      params.set("minPrice", String(numMin));
    } else {
      params.delete("minPrice");
    }

    if (newMax !== "" && numMax !== metaMax) {
      params.set("maxPrice", String(numMax));
    } else {
      params.delete("maxPrice");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // Умное определение активной радиокнопки по текущим значениям в инпутах
  const getActiveRadio = () => {
    const currentMin = Number(minVal);
    const currentMax = Number(maxVal);

    // Пока мета не загрузилась
    if (!minVal && !maxVal) return "all";

    // "до 500" — нижняя граница базовая (из meta), а верхняя ровно 500
    if (currentMin <= metaMin && currentMax === 500) return "under-500";

    // "до 1000" — нижняя граница базовая (из meta), а верхняя ровно 1000
    if (currentMin <= metaMin && currentMax === 1000) return "under-1000";

    // "1000 и дороже" — нижняя граница ровно 1000, а верхняя базовая (из meta)
    if (currentMin >= 1000) return "over-1000";

    if (currentMin <= metaMin && currentMax >= metaMax) return "all";

    // Если ввели свой нестандартный диапазон (например, от 300 до 800) — ни одна радио не горит
    return "";
  };
  const applyPriceBounds = (rawMin: string, rawMax: string) => {
    // Парсим числа; если поле пустое или ввели не число — берем границы из meta
    let numMin =
      rawMin.trim() === "" || isNaN(Number(rawMin)) ? metaMin : Number(rawMin);
    let numMax =
      rawMax.trim() === "" || isNaN(Number(rawMax)) ? metaMax : Number(rawMax);

    // 1. Не даем выйти за пределы [metaMin, metaMax]
    numMin = Math.max(metaMin, Math.min(numMin, metaMax));
    numMax = Math.min(metaMax, Math.max(numMax, metaMin));

    // 2. Если пользователь ввел "от" больше чем "до" — выравниваем
    if (numMin > numMax) {
      numMin = numMax;
    }

    const safeMin = String(numMin);
    const safeMax = String(numMax);

    setMinVal(safeMin);
    setMaxVal(safeMax);
    updateUrlPrices(safeMin, safeMax);
  };

  // При клике на радио ставим в URL и инпуты комбинацию из meta и выбранного порога
  const handleRadioChange = (value: string) => {
    switch (value) {
      case "under-500":
        updateUrlPrices(String(metaMin), "500");
        break;
      case "under-1000":
        updateUrlPrices(String(metaMin), "1000");
        break;
      case "over-1000":
        updateUrlPrices("1000", String(metaMax));
        break;
      case "all":
        updateUrlPrices(String(metaMin), String(metaMax));
        break;
    }
  };

  // Внутри SidebarGroupPrice.tsx
  useEffect(() => {
    if (!metaMin && !metaMax) return;

    let nextMin = urlMin !== null ? Number(urlMin) : metaMin;
    let nextMax = urlMax !== null ? Number(urlMax) : metaMax;

    // Защита от NaN, если в URL вбили ?minPrice=abc
    if (!Number.isFinite(nextMin)) nextMin = metaMin;
    if (!Number.isFinite(nextMax)) nextMax = metaMax;

    // Зажимаем в реальные границы категории
    const clampedMin = Math.max(metaMin, Math.min(nextMin, metaMax));
    const clampedMax = Math.min(metaMax, Math.max(nextMax, metaMin));

    setMinVal(String(clampedMin));
    setMaxVal(String(clampedMax));

    // Проверяем, отличается ли URL от валидных границ
    const expectedUrlMin = clampedMin > metaMin ? String(clampedMin) : null;
    const expectedUrlMax = clampedMax < metaMax ? String(clampedMax) : null;

    if (urlMin !== expectedUrlMin || urlMax !== expectedUrlMax) {
      const params = new URLSearchParams(searchParams.toString());

      expectedUrlMin
        ? params.set("minPrice", expectedUrlMin)
        : params.delete("minPrice");

      expectedUrlMax
        ? params.set("maxPrice", expectedUrlMax)
        : params.delete("maxPrice");

      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    }
  }, [urlMin, urlMax, metaMin, metaMax, pathname, router, searchParams]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Цена</SidebarGroupLabel>
      <SidebarMenu>
        <Fieldset>
          <Field className="flex flex-row gap-2">
            <Input
              value={minVal}
              onValueChange={(val) => setMinVal(val.replace(/\D/g, ""))}
              onBlur={() => {
                applyPriceBounds(minVal, maxVal);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyPriceBounds(minVal, maxVal);
                }
              }}
            />
            <Input
              value={maxVal}
              onValueChange={(val) => setMaxVal(val.replace(/\D/g, ""))}
              onBlur={() => {
                applyPriceBounds(minVal, maxVal);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyPriceBounds(minVal, maxVal);
                }
              }}
            />
          </Field>

          <Field>
            <RadioGroup
              value={getActiveRadio()}
              onValueChange={handleRadioChange}
            >
              <FieldItem>
                <FieldLabel>
                  <Radio value="under-500" />
                  до 500
                </FieldLabel>
              </FieldItem>
              <FieldItem>
                <FieldLabel>
                  <Radio value="under-1000" />
                  до 1000
                </FieldLabel>
              </FieldItem>
              <FieldItem>
                <FieldLabel>
                  <Radio value="over-1000" />
                  1000 и дороже
                </FieldLabel>
              </FieldItem>
              <FieldItem>
                <FieldLabel>
                  <Radio value="all" />
                  Неважно
                </FieldLabel>
              </FieldItem>
            </RadioGroup>
          </Field>
        </Fieldset>
      </SidebarMenu>
    </SidebarGroup>
  );
}
