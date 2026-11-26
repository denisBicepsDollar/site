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

function parseUrlPrice(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

function sanitizePriceInput(raw: string): string {
  const cleaned = raw.replace(",", ".").replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex === -1) return cleaned;
  return (
    cleaned.slice(0, dotIndex + 1) +
    cleaned.slice(dotIndex + 1).replace(/\./g, "")
  );
}

export function SidebarGroupPrice() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { prices } = useProductsCatalog();

  const metaMin = prices?.minPrice ?? 0;
  const metaMax = prices?.maxPrice ?? 0;

  const rawUrlMin = searchParams.get("minPrice");
  const rawUrlMax = searchParams.get("maxPrice");
  const searchString = searchParams.toString();

  const parsedUrlMin = parseUrlPrice(rawUrlMin);
  const parsedUrlMax = parseUrlPrice(rawUrlMax);

  const [minVal, setMinVal] = useState<string>(
    parsedUrlMin !== null ? String(parsedUrlMin) : "",
  );
  const [maxVal, setMaxVal] = useState<string>(
    parsedUrlMax !== null ? String(parsedUrlMax) : "",
  );

  useEffect(() => {
    const hasInvalidMin = rawUrlMin !== null && parsedUrlMin === null;
    const hasInvalidMax = rawUrlMax !== null && parsedUrlMax === null;
    const hasInvertedRange =
      parsedUrlMin !== null &&
      parsedUrlMax !== null &&
      parsedUrlMin > parsedUrlMax;

    if (hasInvalidMin || hasInvalidMax || hasInvertedRange) {
      const params = new URLSearchParams(searchString);
      params.delete("page");

      let nextMin = parsedUrlMin;
      let nextMax = parsedUrlMax;
      if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
        [nextMin, nextMax] = [nextMax, nextMin];
      }

      if (nextMin !== null) {
        params.set("minPrice", String(nextMin));
      } else {
        params.delete("minPrice");
      }

      if (nextMax !== null) {
        params.set("maxPrice", String(nextMax));
      } else {
        params.delete("maxPrice");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
      return;
    }

    setMinVal(parsedUrlMin !== null ? String(parsedUrlMin) : "");
    setMaxVal(parsedUrlMax !== null ? String(parsedUrlMax) : "");
  }, [
    rawUrlMin,
    rawUrlMax,
    parsedUrlMin,
    parsedUrlMax,
    pathname,
    router,
    searchString,
  ]);

  const updateUrlPrices = (nextMin: number | null, nextMax: number | null) => {
    if (nextMin === parsedUrlMin && nextMax === parsedUrlMax) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (nextMin !== null && Number.isFinite(nextMin) && nextMin >= 0) {
      params.set("minPrice", String(nextMin));
    } else {
      params.delete("minPrice");
    }

    if (nextMax !== null && Number.isFinite(nextMax) && nextMax >= 0) {
      params.set("maxPrice", String(nextMax));
    } else {
      params.delete("maxPrice");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const getActiveRadio = () => {
    const noMin = parsedUrlMin === null || parsedUrlMin === 0;
    if (noMin && parsedUrlMax === null) return "all";
    if (noMin && parsedUrlMax === 500) return "under-500";
    if (noMin && parsedUrlMax === 1000) return "under-1000";
    if (parsedUrlMin === 1000 && parsedUrlMax === null) return "over-1000";
    return "";
  };

  const applyPriceBounds = (rawMin: string, rawMax: string) => {
    const trimmedMin = rawMin.trim();
    const trimmedMax = rawMax.trim();

    let nextMin =
      trimmedMin !== "" && Number.isFinite(Number(trimmedMin))
        ? Math.max(0, Number(trimmedMin))
        : null;
    let nextMax =
      trimmedMax !== "" && Number.isFinite(Number(trimmedMax))
        ? Math.max(0, Number(trimmedMax))
        : null;

    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      [nextMin, nextMax] = [nextMax, nextMin];
    }

    setMinVal(nextMin !== null ? String(nextMin) : "");
    setMaxVal(nextMax !== null ? String(nextMax) : "");
    updateUrlPrices(nextMin, nextMax);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (
      related?.closest('a[href], [role="radio"], [role="checkbox"], button')
    ) {
      return;
    }
    applyPriceBounds(minVal, maxVal);
  };

  const handleRadioChange = (value: string) => {
    switch (value) {
      case "under-500":
        updateUrlPrices(null, 500);
        break;
      case "under-1000":
        updateUrlPrices(null, 1000);
        break;
      case "over-1000":
        updateUrlPrices(1000, null);
        break;
      case "all":
        updateUrlPrices(null, null);
        break;
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Цена</SidebarGroupLabel>
      <SidebarMenu>
        <Fieldset>
          <Field className="flex flex-row gap-2">
            <Input
              aria-label="Цена от"
              placeholder={metaMin > 0 ? `от ${metaMin}` : "От"}
              value={minVal}
              onValueChange={(val) => setMinVal(sanitizePriceInput(val))}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyPriceBounds(minVal, maxVal);
                }
              }}
            />
            <Input
              aria-label="Цена до"
              placeholder={metaMax > 0 ? `до ${metaMax}` : "До"}
              value={maxVal}
              onValueChange={(val) => setMaxVal(sanitizePriceInput(val))}
              onBlur={handleBlur}
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
