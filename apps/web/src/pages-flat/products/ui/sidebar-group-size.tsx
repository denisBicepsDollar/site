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
import { useMemo } from "react";
import { useProductsCatalog } from "../model/use-products-store";

export function SidebarGroupSize() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sizes } = useProductsCatalog();

  const sizeParam = searchParams.get("size") ?? "";
  const selectedSizes = useMemo(
    () =>
      Array.from(
        new Set(
          sizeParam
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ),
    [sizeParam],
  );

  const sortedSizes = useMemo(() => {
    const base = [...sizes].filter((s) => Boolean(s?.size?.trim()));
    const knownNames = new Set(base.map((s) => s.size));
    for (const selected of selectedSizes) {
      if (!knownNames.has(selected)) {
        base.push({ size: selected, stock: 0 });
      }
    }
    return base.sort(
      (a, b) => b.stock - a.stock || a.size.localeCompare(b.size, "ru"),
    );
  }, [sizes, selectedSizes]);

  const handleSizeChange = (newValues: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    const cleaned = Array.from(
      new Set(newValues.map((s) => s.trim()).filter(Boolean)),
    );

    if (cleaned.length > 0) {
      params.set("size", cleaned.join(","));
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
            {sortedSizes.length === 0 ? (
              <p className="px-2 py-1 text-xs text-muted-foreground">
                Нет доступных размеров
              </p>
            ) : (
              <CheckboxGroup
                className="w-full"
                value={selectedSizes}
                onValueChange={handleSizeChange}
              >
                {sortedSizes.map(({ size, stock }) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <Label className="w-full" key={size}>
                      <Checkbox
                        value={size}
                        disabled={stock <= 0 && !isSelected}
                      />
                      {size}
                      <Badge
                        size="sm"
                        variant="secondary"
                        className="ml-auto"
                      >
                        {stock}
                      </Badge>
                    </Label>
                  );
                })}
              </CheckboxGroup>
            )}
          </Field>
        </Fieldset>
      </SidebarMenu>
    </SidebarGroup>
  );
}
