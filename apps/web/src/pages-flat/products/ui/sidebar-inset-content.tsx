import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/shared/ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { SidebarInset } from "@/shared/ui/sidebar";
import { Search } from "lucide-react";
import { ProductSection } from "./product-section";
import { SelectButton } from "@/shared/ui/select";
import { ProductsSortCombobox } from "./products-sort-combobox";
import { ProductsSearch } from "./products-search";

export function SidebarInsetContent({ searchParams }) {
  return (
    <>
      <SidebarInset className="">
        <header className="flex flex-col shrink-0 items-start mt-2 gap-2 px-4">
          <ProductsSearch />
          <ProductsSortCombobox />
        </header>
        <div className="p-4 h- text-sm text-[var(--sp-rw-fg-tertiary)] ">
          <ProductSection />
        </div>
      </SidebarInset>
    </>
  );
}
