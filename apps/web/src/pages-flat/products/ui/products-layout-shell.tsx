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
import type { CatalogLabels } from "../config/catalog-labels";
import { CatalogLabelsProvider } from "../model/use-products-store";
import { ProductsHeader } from "./products-header";
import { SidebarGroupCategory } from "./sidebar-group-category";
import { SidebarGroupPrice } from "./sidebar-group-price";
import { SidebarGroupSize } from "./sidebar-group-size";

export function ProductsLayoutShell({
  initialLabels,
  children,
}: {
  initialLabels?: CatalogLabels;
  children?: ReactNode;
}) {
  return (
    <CatalogLabelsProvider initialLabels={initialLabels}>
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
