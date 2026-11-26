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
  decodeRouteSegment,
  getCategoryLabel,
  getLabelSortOrder,
  getSubcategoryLabel,
  getTypeLabel,
} from "../config/catalog-labels";
import { useProductsCatalog } from "../model/use-products-store";

function containsIgnoreCase(keys: string[], target?: string): boolean {
  if (!target) return false;
  const lower = target.toLowerCase();
  return keys.some((item) => item.toLowerCase() === lower);
}

function sameSlug(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function SidebarGroupCategory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split("/").filter(Boolean);
  const activeCategory =
    segments[0] === "products" ? decodeRouteSegment(segments[1]) : undefined;
  const activeSubcategory =
    segments[0] === "products" ? decodeRouteSegment(segments[2]) : undefined;
  const activeType =
    segments[0] === "products" ? decodeRouteSegment(segments[3]) : undefined;

  const createHref = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("type");
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const { counts, labels } = useProductsCatalog();
  const total = counts?.total ?? 0;
  const categories = counts?.categories ?? {};
  const subcategories = counts?.subcategories ?? {};
  const byCategory = counts?.byCategory ?? {};
  const typesByCategory = counts?.typesByCategory ?? {};

  const rawCategoryKeys = Array.from(
    new Set([
      ...Object.keys(labels?.categories ?? {}),
      ...Object.keys(categories),
    ]),
  );
  const categoryKeys = (
    activeCategory && !containsIgnoreCase(rawCategoryKeys, activeCategory)
      ? [...rawCategoryKeys, activeCategory]
      : rawCategoryKeys
  ).sort((a, b) => {
    const orderA = getLabelSortOrder("category", a, labels);
    const orderB = getLabelSortOrder("category", b, labels);
    if (orderA !== undefined && orderB !== undefined && orderA !== orderB) {
      return orderA - orderB;
    }
    if (orderA !== undefined && orderB === undefined) return -1;
    if (orderA === undefined && orderB !== undefined) return 1;
    return (
      (categories[b] ?? 0) - (categories[a] ?? 0) ||
      getCategoryLabel(a, labels).localeCompare(
        getCategoryLabel(b, labels),
        "ru",
      )
    );
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Категория</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="all">
          <SidebarMenuButton
            active={!activeCategory && pathname === "/products"}
            render={<Link href={createHref("/products")} />}
          >
            <span>Все</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{total}</SidebarMenuBadge>
        </SidebarMenuItem>
        {categoryKeys.map((key) => {
          const hrefCategory = `/products/${encodeURIComponent(key)}`;
          const isCategoryActive = sameSlug(activeCategory, key);
          const label = getCategoryLabel(key, labels);

          const categorySubCounts = byCategory[key] ?? {};
          const dbSubKeys = Object.keys(categorySubCounts);
          const subKeys = (
            isCategoryActive &&
            activeSubcategory &&
            !containsIgnoreCase(dbSubKeys, activeSubcategory)
              ? [...dbSubKeys, activeSubcategory]
              : dbSubKeys
          ).sort((a, b) => {
            const orderA = getLabelSortOrder("subcategory", a, labels);
            const orderB = getLabelSortOrder("subcategory", b, labels);
            if (
              orderA !== undefined &&
              orderB !== undefined &&
              orderA !== orderB
            ) {
              return orderA - orderB;
            }
            if (orderA !== undefined && orderB === undefined) return -1;
            if (orderA === undefined && orderB !== undefined) return 1;
            return (
              (categorySubCounts[b] ?? 0) - (categorySubCounts[a] ?? 0) ||
              getSubcategoryLabel(a, labels).localeCompare(
                getSubcategoryLabel(b, labels),
                "ru",
              )
            );
          });

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                active={isCategoryActive}
                render={<Link href={createHref(hrefCategory)} />}
              >
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>{categories[key] ?? 0}</SidebarMenuBadge>

              {isCategoryActive && subKeys.length > 0 && (
                <SidebarMenuSub>
                  {subKeys.map((subKey) => {
                    const hrefSubcategory = `/products/${encodeURIComponent(key)}/${encodeURIComponent(subKey)}`;
                    const subLabel = getSubcategoryLabel(subKey, labels);
                    const subCount =
                      categorySubCounts[subKey] ?? subcategories[subKey] ?? 0;
                    const isSubActive = sameSlug(activeSubcategory, subKey);

                    const subTypeCounts =
                      typesByCategory[key]?.[subKey] ?? {};
                    const dbTypeKeys = Object.keys(subTypeCounts);
                    const typeKeys = isSubActive
                      ? (activeType && !containsIgnoreCase(dbTypeKeys, activeType)
                          ? [...dbTypeKeys, activeType]
                          : dbTypeKeys
                        ).sort((a, b) => {
                          const orderA = getLabelSortOrder("type", a, labels);
                          const orderB = getLabelSortOrder("type", b, labels);
                          if (
                            orderA !== undefined &&
                            orderB !== undefined &&
                            orderA !== orderB
                          ) {
                            return orderA - orderB;
                          }
                          if (orderA !== undefined && orderB === undefined)
                            return -1;
                          if (orderA === undefined && orderB !== undefined)
                            return 1;
                          return (
                            (subTypeCounts[b] ?? 0) - (subTypeCounts[a] ?? 0) ||
                            getTypeLabel(a, labels).localeCompare(
                              getTypeLabel(b, labels),
                              "ru",
                            )
                          );
                        })
                      : [];

                    return (
                      <SidebarMenuSubItem key={subKey}>
                        <SidebarMenuSubButton
                          render={<Link href={createHref(hrefSubcategory)} />}
                          active={isSubActive}
                        >
                          {subLabel}
                        </SidebarMenuSubButton>
                        <SidebarMenuBadge>{subCount}</SidebarMenuBadge>

                        {isSubActive && typeKeys.length > 0 && (
                          <SidebarMenuSub className="me-0 pe-0">
                            {typeKeys.map((typeKey) => {
                              const hrefType = `/products/${encodeURIComponent(key)}/${encodeURIComponent(subKey)}/${encodeURIComponent(typeKey)}`;
                              const typeLabel = getTypeLabel(typeKey, labels);
                              const typeCount = subTypeCounts[typeKey] ?? 0;

                              return (
                                <SidebarMenuSubItem key={typeKey}>
                                  <SidebarMenuSubButton
                                    render={
                                      <Link href={createHref(hrefType)} />
                                    }
                                    active={sameSlug(activeType, typeKey)}
                                  >
                                    {typeLabel}
                                  </SidebarMenuSubButton>
                                  <SidebarMenuBadge>
                                    {typeCount}
                                  </SidebarMenuBadge>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
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
