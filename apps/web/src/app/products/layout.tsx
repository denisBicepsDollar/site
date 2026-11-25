"use client";

import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarBrand,
} from "@/shared/ui/sidebar";
import { SidebarGroupCategory } from "@/pages-flat/products/ui/sidebar-group-category";
import { SidebarGroupPrice } from "@/pages-flat/products/ui/sidebar-group-price";
import { SidebarGroupSize } from "@/pages-flat/products/ui/sidebar-group-size";
import { ProductsHeader } from "@/pages-flat/products/ui/products-header";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense
        fallback={
          <div aria-hidden="true">
            <div className="h-10" />
            <p className="mt-2 text-muted-foreground">
              Посмотрите нашу коллекцию товаров
            </p>
          </div>
        }
      >
        <ProductsHeader />
      </Suspense>

      <div className="mb-8 w-full flex flex-wrap items-center gap-3">
        <SidebarProvider
          className="bg-cream"
          layout="inset"
          mobileBreakpoint="lg"
        >
          <Sidebar className="sticky top-20 h-fit" collapsible="icon">
            <SidebarHeader className="flex-row items-center gap-1">
              <SidebarBrand className="group-data-[state=collapsed]:hidden">
                Фильтры
              </SidebarBrand>
              <SidebarTrigger
                aria-label="Collapse sidebar"
                className="ml-auto"
                size="icon-xs"
              />
            </SidebarHeader>
            <SidebarContent className="group-data-[state=collapsed]:hidden">
              <Suspense fallback={null}>
                <SidebarGroupCategory />
                <SidebarGroupPrice />
                <SidebarGroupSize />
              </Suspense>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          {children}
        </SidebarProvider>
      </div>
    </div>
  );
}
