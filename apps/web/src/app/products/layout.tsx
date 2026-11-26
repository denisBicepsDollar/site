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
import {
  ProductsHeader,
  SidebarGroupCategory,
  SidebarGroupPrice,
  SidebarGroupSize,
} from "@/pages-flat/products";

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
          <Sidebar
            className="lg:sticky! lg:top-24! lg:bottom-auto! lg:h-[calc(100svh-7rem)]! lg:max-h-[calc(100svh-7rem)]! group-data-[state=collapsed]:lg:h-fit!"
            collapsible="icon"
          >
            <SidebarHeader className="shrink-0 flex-row items-center gap-1">
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
