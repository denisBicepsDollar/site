"use client";
import { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/features/product-grid-skeleton/product-grid-skeleton";
import {
  ProductFilters,
  ProductFiltersMobile,
} from "@/shared/ui/sections/product-filters";
import { getFilterFacets } from "@/shared/lib/facets";
import { SortLinks, SortSelect } from "./products-sort-select";
import { sortOptions } from "@/pages-flat/products/config/sortOptions";
import { ProductSection } from "@/pages-flat/products/ui/product-section";
import {
  FilterBar,
  FilterBarControls,
  FilterBarTabs,
} from "@/shared/ui/filter-bar";
import { TabsTab } from "@/shared/ui/tabs";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxHeader,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/shared/ui/combobox";
import { Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SelectButton } from "@/shared/ui/select";
import { Card } from "@/shared/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  SidebarBrand,
} from "@/shared/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Field, FieldItem, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Fieldset } from "@/shared/ui/fieldset";
import { Radio, RadioGroup } from "@/shared/ui/radio-group";
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
      <ProductsHeader />

      <div>
        {/* Mobile/tablet toolbar: Filters button + compact Sort dropdown (sidebar is hidden below lg). */}
        <div className="mb-8 flex items-center justify-between gap-3 lg:hidden"></div>

        {/* Desktop toolbar: inline sort links (filters live in the sidebar). */}
        <div className="mb-8 w-full hidden flex-wrap items-center gap-3 lg:flex">
          <SidebarProvider className="bg-cream" layout="inset">
            <Sidebar className="sticky top-20 h-fit" collapsible="icon">
              <SidebarHeader className="flex-row items-center gap-1">
                <SidebarBrand className="group-data-[state=collapsed]:hidden">
                  Фильтры
                </SidebarBrand>
                <SidebarTrigger
                  aria-label="Collapse sidebar"
                  className="ml-auto items"
                  size="icon-xs"
                />
              </SidebarHeader>
              <SidebarContent className="group-data-[state=collapsed]:hidden">
                <SidebarGroupCategory />
                <SidebarGroupPrice />
                <SidebarGroupSize />
              </SidebarContent>
              <SidebarRail />
            </Sidebar>
            {children}
          </SidebarProvider>
        </div>
      </div>
    </div>
  );
}
