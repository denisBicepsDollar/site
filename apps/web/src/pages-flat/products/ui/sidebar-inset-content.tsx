"use client";

import { SidebarInset, SidebarTrigger } from "@/shared/ui/sidebar";
import { ProductSection } from "./product-section";
import { ProductsSortCombobox } from "./products-sort-combobox";
import { ProductsSearch } from "./products-search";

export function SidebarInsetContent({
  className,
}: {
  className?: string;
}) {
  return (
    <SidebarInset className={className}>
      <header className="flex flex-col shrink-0 items-start mt-2 gap-2 px-4">
        <ProductsSearch />
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="lg:hidden" />
          <ProductsSortCombobox />
        </div>
      </header>
      <div className="p-4 text-sm text-[var(--sp-rw-fg-tertiary)]">
        <ProductSection />
      </div>
    </SidebarInset>
  );
}
