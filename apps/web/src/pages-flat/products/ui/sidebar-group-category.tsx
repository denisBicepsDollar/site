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
  DEFAULT_SUBCATEGORIES_BY_CATEGORY,
  decodeRouteSegment,
  getCategoryLabel,
  getSubcategoryLabel,
  getTypeLabel,
} from "../config/catalog-labels";
import { useProductsCatalog } from "../model/use-products-store";

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

  const hasActiveFacetFilter = Boolean(
    searchParams.get("q")?.trim() ||
      searchParams.get("size") ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice"),
  );

  const { counts } = useProductsCatalog();
  const total = counts?.total ?? 0;
  const categories = counts?.categories ?? {};
  const subcategories = counts?.subcategories ?? {};
  const byCategory = counts?.byCategory ?? {};
  const typesByCategory = counts?.typesByCategory ?? {};

  const categoryKeys = Array.from(
    new Set([
      "indoor",
      "outdoor",
      ...Object.keys(categories),
      ...(activeCategory ? [activeCategory] : []),
    ]),
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
          const hrefCategory = `/products/${encodeURIComponent(key)}`;
          const isCategoryActive = activeCategory === key;
          const label = getCategoryLabel(key);

          const categorySubCounts = byCategory[key] ?? {};
          const dbSubKeys = Object.keys(categorySubCounts);
          const baseSubKeys =
            dbSubKeys.length > 0
              ? dbSubKeys
              : hasActiveFacetFilter
                ? []
                : (DEFAULT_SUBCATEGORIES_BY_CATEGORY[key] ?? []);

          const subKeys = Array.from(
            new Set([
              ...baseSubKeys,
              ...(isCategoryActive && activeSubcategory
                ? [activeSubcategory]
                : []),
            ]),
          ).sort(
            (a, b) =>
              (categorySubCounts[b] ?? 0) - (categorySubCounts[a] ?? 0) ||
              getSubcategoryLabel(a).localeCompare(
                getSubcategoryLabel(b),
                "ru",
              ),
          );

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                active={isCategoryActive && !activeSubcategory && !activeType}
                render={<Link href={createHref(hrefCategory)} />}
              >
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>{categories[key] ?? 0}</SidebarMenuBadge>

              {isCategoryActive && subKeys.length > 0 && (
                <SidebarMenuSub>
                  {subKeys.map((subKey) => {
                    const hrefSubcategory = `/products/${encodeURIComponent(key)}/${encodeURIComponent(subKey)}`;
                    const subLabel = getSubcategoryLabel(subKey);
                    const subCount =
                      categorySubCounts[subKey] ?? subcategories[subKey] ?? 0;
                    const isSubActive = activeSubcategory === subKey;

                    const subTypeCounts =
                      typesByCategory[key]?.[subKey] ?? {};
                    const typeKeys = isSubActive
                      ? Array.from(
                          new Set([
                            ...Object.keys(subTypeCounts),
                            ...(activeType ? [activeType] : []),
                          ]),
                        ).sort(
                          (a, b) =>
                            (subTypeCounts[b] ?? 0) - (subTypeCounts[a] ?? 0) ||
                            getTypeLabel(a).localeCompare(
                              getTypeLabel(b),
                              "ru",
                            ),
                        )
                      : [];

                    return (
                      <SidebarMenuSubItem key={subKey}>
                        <SidebarMenuSubButton
                          render={<Link href={createHref(hrefSubcategory)} />}
                          active={isSubActive && !activeType}
                        >
                          {subLabel}
                        </SidebarMenuSubButton>
                        <SidebarMenuBadge>{subCount}</SidebarMenuBadge>

                        {isSubActive && typeKeys.length > 0 && (
                          <SidebarMenuSub className="me-0 pe-0">
                            {typeKeys.map((typeKey) => {
                              const hrefType = `/products/${encodeURIComponent(key)}/${encodeURIComponent(subKey)}/${encodeURIComponent(typeKey)}`;
                              const typeLabel = getTypeLabel(typeKey);
                              const typeCount = subTypeCounts[typeKey] ?? 0;

                              return (
                                <SidebarMenuSubItem key={typeKey}>
                                  <SidebarMenuSubButton
                                    render={
                                      <Link href={createHref(hrefType)} />
                                    }
                                    active={activeType === typeKey}
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
