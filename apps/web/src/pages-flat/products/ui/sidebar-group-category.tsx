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
  useSidebar,
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

function mergeKeysIgnoreCase(...lists: string[][]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const list of lists) {
    for (const raw of list) {
      const key = raw.trim();
      if (!key) continue;
      const lower = key.toLowerCase();
      if (seen.has(lower)) continue;
      seen.add(lower);
      result.push(key);
    }
  }
  return result;
}

function sumValueIgnoreCase(
  record: Record<string, number> | undefined,
  target?: string,
): number {
  if (!record || !target) return 0;
  const lower = target.toLowerCase();
  let sum = 0;
  for (const [key, value] of Object.entries(record)) {
    if (key.toLowerCase() === lower && typeof value === "number") {
      sum += value;
    }
  }
  return sum;
}

function mergeRecordMapIgnoreCase<T extends number | Record<string, number>>(
  record: Record<string, Record<string, T>> | undefined,
  target?: string,
): Record<string, T> {
  if (!record || !target) return {};
  const lower = target.toLowerCase();
  const merged: Record<string, T> = {};
  for (const [key, inner] of Object.entries(record)) {
    if (key.toLowerCase() !== lower || !inner) continue;
    for (const [innerKey, innerVal] of Object.entries(inner)) {
      const existingKey = Object.keys(merged).find(
        (k) => k.toLowerCase() === innerKey.toLowerCase(),
      );
      if (typeof innerVal === "number") {
        const destKey = existingKey ?? innerKey;
        merged[destKey] = (((merged[destKey] as number | undefined) ?? 0) +
          innerVal) as T;
      } else if (innerVal && typeof innerVal === "object") {
        const destKey = existingKey ?? innerKey;
        const prevObj = ((merged[destKey] as Record<string, number>) ?? {});
        const nextObj: Record<string, number> = { ...prevObj };
        for (const [leafKey, leafVal] of Object.entries(innerVal)) {
          const existingLeaf = Object.keys(nextObj).find(
            (k) => k.toLowerCase() === leafKey.toLowerCase(),
          );
          const leafDest = existingLeaf ?? leafKey;
          nextObj[leafDest] = (nextObj[leafDest] ?? 0) + leafVal;
        }
        merged[destKey] = nextObj as T;
      }
    }
  }
  return merged;
}

function sameSlug(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function SidebarGroupCategory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile, setOpenMobile } = useSidebar();

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const segments = normalizedPath.split("/").filter(Boolean);
  const activeCategory =
    segments[0] === "products" ? decodeRouteSegment(segments[1]) : undefined;
  const activeSubcategory =
    segments[0] === "products" ? decodeRouteSegment(segments[2]) : undefined;
  const activeType =
    segments[0] === "products" ? decodeRouteSegment(segments[3]) : undefined;

  const createHref = (path: string) => {
    const params = new URLSearchParams();
    for (const key of ["q", "size", "minPrice", "maxPrice", "sort"] as const) {
      const value = searchParams.get(key)?.trim();
      if (!value) continue;
      if (key === "sort" && value === "score") continue;
      params.set(key, value);
    }
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const { counts, labels } = useProductsCatalog();
  const total = counts?.total ?? 0;
  const categories = counts?.categories ?? {};
  const subcategories = counts?.subcategories ?? {};
  const byCategory = counts?.byCategory ?? {};
  const typesByCategory = counts?.typesByCategory ?? {};

  const rawCategoryKeys = mergeKeysIgnoreCase(
    Object.keys(labels?.categories ?? {}),
    Object.keys(categories),
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
    const countA = sumValueIgnoreCase(categories, a);
    const countB = sumValueIgnoreCase(categories, b);
    return (
      countB - countA ||
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
            active={!activeCategory && normalizedPath === "/products"}
            render={
              <Link href={createHref("/products")} onClick={handleNavigate} />
            }
          >
            <span>Все</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{total}</SidebarMenuBadge>
        </SidebarMenuItem>
        {categoryKeys.map((key) => {
          const hrefCategory = `/products/${encodeURIComponent(key)}`;
          const isCategoryActive = sameSlug(activeCategory, key);
          const label = getCategoryLabel(key, labels);
          const categoryCount = sumValueIgnoreCase(categories, key);

          const categorySubCounts = mergeRecordMapIgnoreCase(byCategory, key);
          const dbSubKeys = mergeKeysIgnoreCase(Object.keys(categorySubCounts));
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
            const subCountA = sumValueIgnoreCase(categorySubCounts, a);
            const subCountB = sumValueIgnoreCase(categorySubCounts, b);
            return (
              subCountB - subCountA ||
              getSubcategoryLabel(a, labels).localeCompare(
                getSubcategoryLabel(b, labels),
                "ru",
              )
            );
          });

          const categoryTypeMap = mergeRecordMapIgnoreCase(typesByCategory, key);

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                active={isCategoryActive}
                render={
                  <Link
                    href={createHref(hrefCategory)}
                    onClick={handleNavigate}
                  />
                }
              >
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>{categoryCount}</SidebarMenuBadge>

              {isCategoryActive && subKeys.length > 0 && (
                <SidebarMenuSub>
                  {subKeys.map((subKey) => {
                    const hrefSubcategory = `/products/${encodeURIComponent(key)}/${encodeURIComponent(subKey)}`;
                    const subLabel = getSubcategoryLabel(subKey, labels);
                    const subCount =
                      sumValueIgnoreCase(categorySubCounts, subKey) ||
                      sumValueIgnoreCase(subcategories, subKey);
                    const isSubActive = sameSlug(activeSubcategory, subKey);

                    const subTypeCounts =
                      mergeRecordMapIgnoreCase(categoryTypeMap, subKey);
                    const dbTypeKeys = mergeKeysIgnoreCase(
                      Object.keys(subTypeCounts),
                    );
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
                          const typeCountA =
                            sumValueIgnoreCase(subTypeCounts, a);
                          const typeCountB =
                            sumValueIgnoreCase(subTypeCounts, b);
                          return (
                            typeCountB - typeCountA ||
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
                          render={
                            <Link
                              href={createHref(hrefSubcategory)}
                              onClick={handleNavigate}
                            />
                          }
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
                              const typeCount = sumValueIgnoreCase(
                                subTypeCounts,
                                typeKey,
                              );

                              return (
                                <SidebarMenuSubItem key={typeKey}>
                                  <SidebarMenuSubButton
                                    render={
                                      <Link
                                        href={createHref(hrefType)}
                                        onClick={handleNavigate}
                                      />
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
