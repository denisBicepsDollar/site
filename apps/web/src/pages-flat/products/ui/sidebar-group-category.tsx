"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/ui/sidebar";
import {
  CATEGORY_LABELS,
  DEFAULT_SUBCATEGORIES_BY_CATEGORY,
  SUBCATEGORY_LABELS,
} from "../config/catalog-labels";
import { useProductsCatalog } from "../model/use-products-store";

export function SidebarGroupCategory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split("/").filter(Boolean);
  const activeCategory = segments[0] === "products" ? segments[1] : undefined;
  const activeSubcategory =
    segments[0] === "products" ? segments[2] : undefined;

  const createHref = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const { counts } = useProductsCatalog();
  const total = counts?.total ?? 0;
  const categories = counts?.categories ?? {};
  const subcategories = counts?.subcategories ?? {};
  const byCategory = counts?.byCategory ?? {};

  const categoryKeys = Array.from(
    new Set(["indoor", "outdoor", ...Object.keys(categories)]),
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Категория</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="all">
          <SidebarMenuButton
            active={pathname === "/products"}
            render={<Link href={createHref("/products")} />}
          >
            <span>Все</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{total}</SidebarMenuBadge>
        </SidebarMenuItem>
        {categoryKeys.map((key) => {
          const hrefCategory = `/products/${key}`;
          const isCategoryActive = activeCategory === key;
          const label = CATEGORY_LABELS[key] ?? key;

          const subKeys = Array.from(
            new Set([
              ...(DEFAULT_SUBCATEGORIES_BY_CATEGORY[key] ?? []),
              ...Object.keys(byCategory[key] ?? {}),
            ]),
          );

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                active={isCategoryActive && !activeSubcategory}
                render={<Link href={createHref(hrefCategory)} />}
              >
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>{categories[key] ?? 0}</SidebarMenuBadge>

              {isCategoryActive && subKeys.length > 0 && (
                <SidebarMenuSub>
                  {subKeys.map((subKey) => {
                    const hrefSubcategory = `/products/${key}/${subKey}`;
                    const subLabel = SUBCATEGORY_LABELS[subKey] ?? subKey;
                    const subCount =
                      byCategory[key]?.[subKey] ?? subcategories[subKey] ?? 0;

                    return (
                      <SidebarMenuSubItem key={subKey}>
                        <SidebarMenuSubButton
                          render={<Link href={createHref(hrefSubcategory)} />}
                          active={activeSubcategory === subKey}
                        >
                          {subLabel}
                        </SidebarMenuSubButton>
                        <SidebarMenuBadge>{subCount}</SidebarMenuBadge>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
