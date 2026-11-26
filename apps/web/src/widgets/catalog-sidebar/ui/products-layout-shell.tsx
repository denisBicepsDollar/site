"use client";

import { Suspense, type ReactNode } from "react";
import {
  Sidebar,
  SidebarBrand,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import {
  CatalogLabelsProvider,
  type CatalogLabels,
  type ProductsMeta,
} from "@/entities/product";
import {
  SidebarGroupCategory,
  SidebarGroupPrice,
  SidebarGroupSize,
} from "@/features/catalog-filters";
import { ProductsHeader } from "./products-header";

export function ProductsLayoutShell({
  initialLabels,
  initialMeta,
  children,
}: {
  initialLabels?: CatalogLabels;
  initialMeta?: ProductsMeta;
  children?: ReactNode;
}) {
  return (
    <CatalogLabelsProvider
      initialLabels={initialLabels}
      initialMeta={initialMeta}
    >
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
    </CatalogLabelsProvider>
  );
}
