"use client";
import { Field } from "@/shared/ui/field";
import { Fieldset } from "@/shared/ui/fieldset";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/shared/ui/sidebar";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { CheckboxGroup } from "@/shared/ui/checkbox-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/shared/ui/badge";
import { useEffect, useMemo } from "react";
import { useProductsCatalog } from "../model/use-products-store";

export function SidebarGroupSize() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sizes } = useProductsCatalog();

  const sortedSizes = useMemo(
    () => [...sizes].sort((a, b) => b.stock - a.stock),
    [sizes],
  );
  const sizeParam = searchParams.get("size") ?? "";
  const selectedSizes = useMemo(
    () => sizeParam.split(",").filter(Boolean),
    [sizeParam],
  );

  useEffect(() => {
    if (!sizes.length || !selectedSizes.length) return;

    const available = sizes.map((s) => s.size);
    const validSizes = selectedSizes.filter((s) => available.includes(s));

    if (validSizes.length !== selectedSizes.length) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      validSizes.length
        ? params.set("size", validSizes.join(","))
        : params.delete("size");

      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    }
  }, [sizes, selectedSizes, pathname, router, searchParams]);

  const handleSizeChange = (newValues: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (newValues.length > 0) {
      params.set("size", newValues.join(","));
    } else {
      params.delete("size");
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
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
  );
}
