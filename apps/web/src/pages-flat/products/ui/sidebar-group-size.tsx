"use client";
import { Field, FieldItem, FieldLabel } from "@/shared/ui/field";
import { Fieldset } from "@/shared/ui/fieldset";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
} from "@/shared/ui/sidebar";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { CheckboxGroup } from "@/shared/ui/checkbox-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/shared/ui/badge";
import { useEffect } from "react";
import { useProductsCatalog } from "../model/useProductsStore";

export function SidebarGroupSize() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sizes } = useProductsCatalog();
  console.log("sizes", sizes);

  const sortedSizes = [...sizes].sort((a, b) => b.stock - a.stock);
  const selectedSizes =
    searchParams.get("size")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    if (!sizes.length || !selectedSizes.length) return;

    const available = sizes.map((s) => s.size);
    const validSizes = selectedSizes.filter((s) => available.includes(s));

    if (validSizes.length !== selectedSizes.length) {
      const params = new URLSearchParams(searchParams.toString());

      validSizes.length
        ? params.set("size", validSizes.join(","))
        : params.delete("size");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [sizes]);

  const handleSizeChange = (newValues: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValues.length > 0) {
      params.set("size", newValues.join(","));
    } else {
      params.delete("size");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Размер</SidebarGroupLabel>
        <SidebarMenu>
          <Fieldset>
            <Field>
              <CheckboxGroup
                className="w-full"
                value={selectedSizes}
                onValueChange={handleSizeChange}
              >
                {sortedSizes.map(({ size, stock }) => {
                  return (
                    <Label className="w-full" key={size}>
                      <Checkbox value={size} disabled={stock <= 0} />
                      {size}
                      <Badge size="sm" variant="secondary" className="ml-auto">
                        {stock}
                      </Badge>
                    </Label>
                  );
                })}
              </CheckboxGroup>
            </Field>
          </Fieldset>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
