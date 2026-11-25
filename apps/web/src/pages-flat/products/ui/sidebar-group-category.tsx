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
import { useProductsCatalog } from "../model/useProductsStore";

export function SidebarGroupCategory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createHref = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const category = [
    { label: "Комнатные", key: "indoor" },
    { label: "Садовые", key: "outdoor" },
  ] as const;

  const indoorCategory = [{ label: "Англаонема", key: "aglaonema" }] as const;
  const outdoorCategory = [{ label: "Гортензия", key: "gortenzia" }] as const;
  const { counts } = useProductsCatalog();
  const total = counts?.total ?? 0;
  const categories = counts?.categories ?? {};
  const subcategories = counts?.subcategories ?? {};

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
        {category.map(({ label, key }) => {
          const hrefCategory = `/products/${key}`;
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                active={pathname.includes(hrefCategory)}
                render={<Link href={createHref(hrefCategory)} />}
              >
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>{categories[key] ?? 0}</SidebarMenuBadge>

              {key === "indoor" && pathname.includes("indoor") && (
                <SidebarMenuSub>
                  {indoorCategory.map((sub) => {
                    const hrefSubcategory = `/products/indoor/${sub.key}`;
                    return (
                      <SidebarMenuSubItem key={sub.key}>
                        <SidebarMenuSubButton
                          render={<Link href={createHref(hrefSubcategory)} />}
                          active={pathname === hrefSubcategory}
                        >
                          {sub.label}
                        </SidebarMenuSubButton>
                        <SidebarMenuBadge>
                          {subcategories[sub.key] ?? 0}
                        </SidebarMenuBadge>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              )}
              {key === "outdoor" && pathname.includes("outdoor") && (
                <SidebarMenuSub>
                  {outdoorCategory.map((sub) => {
                    const hrefSubcategory = `/products/outdoor/${sub.key}`;
                    return (
                      <SidebarMenuSubItem key={sub.key}>
                        <SidebarMenuSubButton
                          render={<Link href={createHref(hrefSubcategory)} />}
                          active={pathname === hrefSubcategory}
                        >
                          {sub.label}
                        </SidebarMenuSubButton>
                        <SidebarMenuBadge>
                          {subcategories[sub.key] ?? 0}
                        </SidebarMenuBadge>
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
